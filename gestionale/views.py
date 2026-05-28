import json
import os

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import URLValidator, validate_email
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .models import AssegnazioneCorso, Corso, Dipendente, Vendor


@ensure_csrf_cookie
def dashboard(request):
    return render(request, 'gestionale/dashboard.html')


# ─── helpers ────────────────────────────────────────────────────────────────

def _corso_to_dict(c):
    return {
        'id': c.pk,
        'titolo': c.titolo,
        'descrizione': c.descrizione,
        'vendor': c.vendor.nome if c.vendor else '',
        'vendor_id': c.vendor_id,
        'tipologia': c.tipologia,
        'durata_ore': c.durata_ore,
        'validita_mesi': c.validita_mesi,
        'obbligatorio': c.obbligatorio,
        'link_corso': c.link_corso,
    }


def _dipendente_to_dict(d):
    return {
        'id': d.pk,
        'nome': d.nome,
        'cognome': d.cognome,
        'email': d.email,
        'reparto': d.reparto,
        'attivo': d.attivo,
    }


def _assegnazione_to_dict(a, request=None):
    cert_url = None
    if a.certificato:
        cert_url = request.build_absolute_uri(a.certificato.url) if request else a.certificato.url
    return {
        'id': a.pk,
        'dipendente_id': a.dipendente_id,
        'corso_id': a.corso_id,
        'stato': a.stato,
        'data_assegnazione': str(a.data_assegnazione) if a.data_assegnazione else None,
        'data_scadenza': str(a.data_scadenza) if a.data_scadenza else None,
        'data_completamento': str(a.data_completamento) if a.data_completamento else None,
        'data_inizio_pianificata': str(a.data_inizio_pianificata) if a.data_inizio_pianificata else None,
        'data_fine_pianificata': str(a.data_fine_pianificata) if a.data_fine_pianificata else None,
        'certificato_url': cert_url,
        'certificato_nome': os.path.basename(a.certificato.name) if a.certificato else None,
    }


def _get_or_create_vendor(nome):
    if not nome:
        return None
    v, _ = Vendor.objects.get_or_create(nome=nome.strip())
    return v


def _json_body(request):
    try:
        return json.loads(request.body or '{}')
    except json.JSONDecodeError:
        raise ValidationError('JSON non valido')


def _error(message, status=400, **extra):
    return JsonResponse({'error': message, **extra}, status=status)


def _require_authenticated(request):
    if not request.user.is_authenticated:
        return _error('autenticazione richiesta', status=401)
    return None


def _is_admin(request):
    return request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)


def _app_email(request):
    if not request.user.is_authenticated:
        return ''
    return (request.user.email or request.user.username or '').strip().lower()


def _is_own_dipendente(request, dipendente):
    return bool(dipendente.email and dipendente.email.lower() == _app_email(request))


def _require_admin(request):
    if not _is_admin(request):
        return _error('permesso negato', status=403)
    return None


def _validate_corso_payload(data, partial=False):
    errors = {}
    titolo = (data.get('titolo') or '').strip()
    if not partial or 'titolo' in data:
        if not titolo:
            errors['titolo'] = 'Il titolo è obbligatorio.'

    link = (data.get('link_corso') or '').strip()
    if link:
        try:
            URLValidator()(link)
        except ValidationError:
            errors['link_corso'] = 'Inserisci una URL valida.'

    for field in ('durata_ore', 'validita_mesi'):
        if field in data:
            try:
                if int(data.get(field) or 0) < 0:
                    errors[field] = 'Il valore non può essere negativo.'
            except (TypeError, ValueError):
                errors[field] = 'Inserisci un numero valido.'

    if errors:
        raise ValidationError(errors)


def _validate_dipendente_payload(data, partial=False):
    errors = {}
    for field in ('nome', 'cognome'):
        if not partial or field in data:
            if not (data.get(field) or '').strip():
                errors[field] = 'Campo obbligatorio.'

    if not partial or 'email' in data:
        email = (data.get('email') or '').strip()
        if not email:
            errors['email'] = 'Email obbligatoria.'
        else:
            try:
                validate_email(email)
            except ValidationError:
                errors['email'] = 'Email non valida.'

    if errors:
        raise ValidationError(errors)


def _validate_assegnazione_dates(data):
    data_inizio = _parse_date(data.get('data_inizio_pianificata'))
    data_fine = _parse_date(data.get('data_fine_pianificata'))
    data_completamento = _parse_date(data.get('data_completamento'))
    if data.get('data_inizio_pianificata') and data_inizio is None:
        raise ValidationError({'data_inizio_pianificata': 'Data non valida.'})
    if data.get('data_fine_pianificata') and data_fine is None:
        raise ValidationError({'data_fine_pianificata': 'Data non valida.'})
    if data.get('data_completamento') and data_completamento is None:
        raise ValidationError({'data_completamento': 'Data non valida.'})
    if data_inizio and data_fine and data_fine < data_inizio:
        raise ValidationError({'data_fine_pianificata': 'La data fine non può precedere la data inizio.'})
    return data_inizio, data_fine, data_completamento


def _validation_error_response(exc):
    return _error('validazione fallita', errors=exc.message_dict if hasattr(exc, 'message_dict') else exc.messages)


def _user_to_dict(user):
    dipendente = Dipendente.objects.filter(email__iexact=user.email).first()
    return {
        'id': str(user.pk),
        'nome': user.first_name or (dipendente.nome if dipendente else user.username),
        'cognome': user.last_name or (dipendente.cognome if dipendente else ''),
        'email': user.email,
        'role': 'admin' if user.is_staff or user.is_superuser else 'dipendente',
        'area': dipendente.reparto if dipendente else '',
        '_dbId': dipendente.pk if dipendente else None,
    }


# ─── auth ───────────────────────────────────────────────────────────────────

@require_http_methods(['GET'])
def api_auth_me(request):
    denied = _require_authenticated(request)
    if denied:
        return denied
    return JsonResponse({'user': _user_to_dict(request.user)})


@require_http_methods(['POST'])
def api_auth_login(request):
    try:
        data = _json_body(request)
    except ValidationError as exc:
        return _validation_error_response(exc)

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    username = email
    user_by_email = User.objects.filter(email__iexact=email).first()
    if user_by_email:
        username = user_by_email.username

    user = authenticate(request, username=username, password=password)
    if user is None:
        return _error('credenziali non valide', status=401)
    if not user.is_active:
        return _error('utente disattivato', status=403)

    login(request, user)
    return JsonResponse({'user': _user_to_dict(user)})


@require_http_methods(['POST'])
def api_auth_logout(request):
    logout(request)
    return JsonResponse({'ok': True})


# ─── init (full data load) ───────────────────────────────────────────────────

def api_init(request):
    denied = _require_authenticated(request)
    if denied:
        return denied

    corsi = [_corso_to_dict(c) for c in Corso.objects.select_related('vendor').all()]
    if _is_admin(request):
        dipendenti_qs = Dipendente.objects.all()
        assegnazioni_qs = AssegnazioneCorso.objects.all()
    else:
        email = _app_email(request)
        dipendenti_qs = Dipendente.objects.filter(email__iexact=email)
        assegnazioni_qs = AssegnazioneCorso.objects.filter(dipendente__email__iexact=email)

    dipendenti = [_dipendente_to_dict(d) for d in dipendenti_qs]
    assegnazioni = [_assegnazione_to_dict(a, request) for a in assegnazioni_qs]
    return JsonResponse({'corsi': corsi, 'dipendenti': dipendenti, 'assegnazioni': assegnazioni})


# ─── corsi ───────────────────────────────────────────────────────────────────

@require_http_methods(['GET', 'POST'])
def api_corsi(request):
    denied = _require_authenticated(request)
    if denied:
        return denied

    if request.method == 'GET':
        return JsonResponse({'corsi': [_corso_to_dict(c) for c in Corso.objects.select_related('vendor').all()]})

    denied = _require_admin(request)
    if denied:
        return denied

    try:
        data = _json_body(request)
        _validate_corso_payload(data)
    except ValidationError as exc:
        return _validation_error_response(exc)

    with transaction.atomic():
        corso = Corso.objects.create(
            titolo=data.get('titolo', '').strip(),
            descrizione=data.get('descrizione', ''),
            vendor=_get_or_create_vendor(data.get('vendor', '')),
            durata_ore=int(data.get('durata_ore') or 0),
            validita_mesi=int(data.get('validita_mesi') or 0),
            obbligatorio=bool(data.get('obbligatorio', False)),
            link_corso=data.get('link_corso', '').strip(),
        )
    return JsonResponse(_corso_to_dict(corso), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def api_corso_detail(request, pk):
    denied = _require_authenticated(request)
    if denied:
        return denied

    try:
        corso = Corso.objects.select_related('vendor').get(pk=pk)
    except Corso.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse(_corso_to_dict(corso))

    denied = _require_admin(request)
    if denied:
        return denied

    if request.method == 'DELETE':
        corso.delete()
        return JsonResponse({'ok': True})

    try:
        data = _json_body(request)
        _validate_corso_payload(data, partial=True)
    except ValidationError as exc:
        return _validation_error_response(exc)

    with transaction.atomic():
        corso.titolo = data.get('titolo', corso.titolo).strip()
        corso.descrizione = data.get('descrizione', corso.descrizione)
        if 'vendor' in data:
            corso.vendor = _get_or_create_vendor(data.get('vendor', ''))
        if 'durata_ore' in data:
            corso.durata_ore = int(data.get('durata_ore') or 0)
        if 'validita_mesi' in data:
            corso.validita_mesi = int(data.get('validita_mesi') or 0)
        corso.obbligatorio = bool(data.get('obbligatorio', corso.obbligatorio))
        corso.link_corso = data.get('link_corso', corso.link_corso).strip()
        corso.save()
    return JsonResponse(_corso_to_dict(corso))


# ─── dipendenti ──────────────────────────────────────────────────────────────

@require_http_methods(['GET', 'POST'])
def api_dipendenti(request):
    denied = _require_authenticated(request)
    if denied:
        return denied

    if request.method == 'GET':
        qs = Dipendente.objects.all() if _is_admin(request) else Dipendente.objects.filter(email__iexact=_app_email(request))
        return JsonResponse({'dipendenti': [_dipendente_to_dict(d) for d in qs]})

    try:
        data = _json_body(request)
        _validate_dipendente_payload(data)
    except ValidationError as exc:
        return _validation_error_response(exc)

    email = (data.get('email') or '').strip().lower()
    if not _is_admin(request) and email != _app_email(request):
        return _error('permesso negato', status=403)

    try:
        with transaction.atomic():
            dip = Dipendente.objects.create(
                nome=data.get('nome', '').strip(),
                cognome=data.get('cognome', '').strip(),
                email=email,
                reparto=data.get('reparto', ''),
                attivo=bool(data.get('attivo', True)),
            )
    except IntegrityError:
        return _error('dipendente già presente', status=409)
    return JsonResponse(_dipendente_to_dict(dip), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def api_dipendente_detail(request, pk):
    denied = _require_authenticated(request)
    if denied:
        return denied

    try:
        dip = Dipendente.objects.get(pk=pk)
    except Dipendente.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if request.method == 'GET':
        if not _is_admin(request) and not _is_own_dipendente(request, dip):
            return _error('permesso negato', status=403)
        return JsonResponse(_dipendente_to_dict(dip))

    if not _is_admin(request) and not _is_own_dipendente(request, dip):
        return _error('permesso negato', status=403)

    if request.method == 'DELETE':
        denied = _require_admin(request)
        if denied:
            return denied
        dip.delete()
        return JsonResponse({'ok': True})

    try:
        data = _json_body(request)
        _validate_dipendente_payload(data, partial=True)
    except ValidationError as exc:
        return _validation_error_response(exc)

    new_email = (data.get('email', dip.email) or '').strip().lower()
    if not _is_admin(request) and new_email != dip.email.lower():
        return _error('permesso negato', status=403)

    try:
        with transaction.atomic():
            dip.nome = data.get('nome', dip.nome).strip()
            dip.cognome = data.get('cognome', dip.cognome).strip()
            dip.email = new_email
            dip.reparto = data.get('reparto', dip.reparto)
            dip.attivo = bool(data.get('attivo', dip.attivo))
            dip.save()
    except IntegrityError:
        return _error('email già usata', status=409)
    return JsonResponse(_dipendente_to_dict(dip))


# ─── assegnazioni ────────────────────────────────────────────────────────────

def _parse_date(val):
    from datetime import date
    if not val:
        return None
    try:
        return date.fromisoformat(val)
    except (ValueError, TypeError):
        return None


@require_http_methods(['GET', 'POST'])
def api_assegnazioni(request):
    denied = _require_authenticated(request)
    if denied:
        return denied

    if request.method == 'GET':
        qs = AssegnazioneCorso.objects.all() if _is_admin(request) else AssegnazioneCorso.objects.filter(dipendente__email__iexact=_app_email(request))
        return JsonResponse({'assegnazioni': [_assegnazione_to_dict(a, request) for a in qs]})

    try:
        data = _json_body(request)
        data_inizio, data_fine, data_completamento = _validate_assegnazione_dates(data)
    except ValidationError as exc:
        return _validation_error_response(exc)

    try:
        dip = Dipendente.objects.get(pk=data['dipendente_id'])
        corso = Corso.objects.get(pk=data['corso_id'])
    except (Dipendente.DoesNotExist, Corso.DoesNotExist, KeyError):
        return JsonResponse({'error': 'dipendente o corso non trovato'}, status=400)

    if not _is_admin(request) and not _is_own_dipendente(request, dip):
        return _error('permesso negato', status=403)

    if AssegnazioneCorso.objects.filter(dipendente=dip, corso=corso).exists():
        return _error('il dipendente ha già questo corso', status=409)

    with transaction.atomic():
        assegnazione = AssegnazioneCorso.objects.create(
            dipendente=dip,
            corso=corso,
            stato=data.get('stato', 'da_iniziare'),
            data_inizio_pianificata=data_inizio,
            data_fine_pianificata=data_fine,
            data_completamento=data_completamento,
        )
    return JsonResponse(_assegnazione_to_dict(assegnazione, request), status=201)


@require_http_methods(['GET', 'PUT', 'DELETE'])
def api_assegnazione_detail(request, pk):
    denied = _require_authenticated(request)
    if denied:
        return denied

    try:
        ass = AssegnazioneCorso.objects.get(pk=pk)
    except AssegnazioneCorso.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if request.method == 'GET':
        if not _is_admin(request) and not _is_own_dipendente(request, ass.dipendente):
            return _error('permesso negato', status=403)
        return JsonResponse(_assegnazione_to_dict(ass, request))

    if not _is_admin(request) and not _is_own_dipendente(request, ass.dipendente):
        return _error('permesso negato', status=403)

    if request.method == 'DELETE':
        denied = _require_admin(request)
        if denied:
            return denied
        if ass.certificato:
            ass.certificato.delete(save=False)
        ass.delete()
        return JsonResponse({'ok': True})

    try:
        data = _json_body(request)
        data_inizio, data_fine, data_completamento = _validate_assegnazione_dates(data)
    except ValidationError as exc:
        return _validation_error_response(exc)

    with transaction.atomic():
        ass.stato = data.get('stato', ass.stato)
        if _is_admin(request):
            if 'data_inizio_pianificata' in data:
                ass.data_inizio_pianificata = data_inizio
            if 'data_fine_pianificata' in data:
                ass.data_fine_pianificata = data_fine
        if 'data_completamento' in data:
            ass.data_completamento = data_completamento
        ass.save()
    return JsonResponse(_assegnazione_to_dict(ass, request))


# ─── certificato upload/delete ───────────────────────────────────────────────

@require_http_methods(['POST', 'DELETE'])
def api_certificato(request, pk):
    denied = _require_authenticated(request)
    if denied:
        return denied

    try:
        ass = AssegnazioneCorso.objects.get(pk=pk)
    except AssegnazioneCorso.DoesNotExist:
        return JsonResponse({'error': 'not found'}, status=404)

    if not _is_admin(request) and not _is_own_dipendente(request, ass.dipendente):
        return _error('permesso negato', status=403)

    if request.method == 'DELETE':
        denied = None if _is_own_dipendente(request, ass.dipendente) else _require_admin(request)
        if denied:
            return denied
        if ass.certificato:
            ass.certificato.delete(save=False)
            ass.certificato = None
            ass.save()
        return JsonResponse({'ok': True})

    f = request.FILES.get('certificato')
    if not f:
        return JsonResponse({'error': 'nessun file'}, status=400)

    ext = os.path.splitext(f.name)[1].lower()
    allowed_extensions = {'.pdf', '.docx'}
    allowed_types = {
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }
    if ext not in allowed_extensions or f.content_type not in allowed_types:
        return _error('formato certificato non valido: usa PDF o DOCX', status=400)

    with transaction.atomic():
        if ass.certificato:
            ass.certificato.delete(save=False)
        ass.certificato = f
        ass.save()
    return JsonResponse({
        'certificato_url': request.build_absolute_uri(ass.certificato.url),
        'certificato_nome': os.path.basename(ass.certificato.name),
    })
