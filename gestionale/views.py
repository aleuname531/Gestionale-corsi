import json
from datetime import date, timedelta

from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView
from django.core.exceptions import PermissionDenied
from django.db.models import Count, Q
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.views import View
from django.views.generic import (
    CreateView, DeleteView, DetailView, ListView, TemplateView, UpdateView,
)
import openpyxl
from django_ratelimit.decorators import ratelimit
from django_ratelimit.exceptions import Ratelimited

from .forms import AssegnazioneCorsoForm, CertificatoForm, CorsoForm, DipendenteAdminForm, DipendenteForm, MaterialeCorsoForm
from .models import AssegnazioneCorso, Corso, Dipendente, MaterialeCorso, Vendor


class AdminRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return self.request.user.is_staff

    def handle_no_permission(self):
        if self.request.user.is_authenticated:
            raise PermissionDenied
        return super().handle_no_permission()


# Form ridotto per dipendenti non-staff (definito a livello modulo, non ricreato ad ogni richiesta)
class _UserAssegnazioneForm(AssegnazioneCorsoForm):
    class Meta(AssegnazioneCorsoForm.Meta):
        fields = ['stato', 'data_completamento']


# ── Auth ──────────────────────────────────────────────────────────────────────

class CustomLoginView(LoginView):
    template_name = 'gestionale/login.html'
    redirect_authenticated_user = True

    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except Ratelimited:
            return render(request, self.template_name, {
                'form': self.get_form_class()(),
                'ratelimited': True,
            })


# ── Dashboard ─────────────────────────────────────────────────────────────────

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'gestionale/dashboard.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        oggi = date.today()
        fra_30 = oggi + timedelta(days=30)

        if self.request.user.is_staff:
            ctx['totale_corsi'] = Corso.objects.count()
            ctx['totale_dipendenti'] = Dipendente.objects.filter(attivo=True).count()
            ctx['totale_assegnazioni'] = AssegnazioneCorso.objects.count()
            ctx['scadenze_imminenti'] = (
                AssegnazioneCorso.objects
                .filter(data_scadenza__range=(oggi, fra_30))
                .select_related('dipendente', 'corso')
                .order_by('data_scadenza')[:10]
            )
            ctx['per_stato'] = (
                AssegnazioneCorso.objects
                .values('stato')
                .annotate(n=Count('id'))
                .order_by('stato')
            )
            ctx['ultimi_corsi'] = Corso.objects.select_related('vendor').order_by('-id')[:5]
            ctx['dipendenti_assegnati'] = (
                Dipendente.objects.filter(attivo=True, assegnazioni__isnull=False).distinct().count()
            )
        else:
            dip = Dipendente.objects.filter(email=self.request.user.email).first()
            if dip:
                qs = AssegnazioneCorso.objects.filter(dipendente=dip).select_related('corso')
                ctx['dipendente'] = dip
                ctx['in_corso'] = qs.filter(stato='in_corso')
                ctx['da_iniziare'] = qs.filter(stato='da_iniziare')
                ctx['completati'] = qs.filter(stato='completato')
                ctx['scadenze'] = qs.filter(data_scadenza__range=(oggi, fra_30))
        return ctx


# ── Corsi ─────────────────────────────────────────────────────────────────────

class CorsoListView(LoginRequiredMixin, ListView):
    model = Corso
    template_name = 'gestionale/corsi/list.html'
    context_object_name = 'corsi'

    def get_queryset(self):
        qs = Corso.objects.select_related('vendor')
        q = self.request.GET.get('q')
        tipologia = self.request.GET.get('tipologia')
        vendor_id = self.request.GET.get('vendor')
        if q:
            qs = qs.filter(Q(titolo__icontains=q) | Q(descrizione__icontains=q))
        if tipologia:
            qs = qs.filter(tipologia=tipologia)
        if vendor_id and vendor_id.isdigit():
            qs = qs.filter(vendor_id=vendor_id)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['tipologie'] = Corso.TIPOLOGIA_CHOICES
        ctx['vendors'] = Vendor.objects.all()
        ctx['filtri'] = self.request.GET
        return ctx


class CorsoDetailView(LoginRequiredMixin, DetailView):
    model = Corso
    template_name = 'gestionale/corsi/detail.html'
    context_object_name = 'corso'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['assegnazioni'] = (
            self.object.assegnazioni
            .select_related('dipendente')
            .order_by('dipendente__cognome')
        )
        return ctx


class CorsoCreateView(AdminRequiredMixin, CreateView):
    model = Corso
    form_class = CorsoForm
    template_name = 'gestionale/corsi/form.html'
    success_url = reverse_lazy('gestionale:corso_list')

    def form_valid(self, form):
        messages.success(self.request, 'Corso creato con successo.')
        return super().form_valid(form)


class CorsoUpdateView(AdminRequiredMixin, UpdateView):
    model = Corso
    form_class = CorsoForm
    template_name = 'gestionale/corsi/form.html'

    def get_success_url(self):
        return reverse_lazy('gestionale:corso_detail', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        messages.success(self.request, 'Corso aggiornato.')
        return super().form_valid(form)


class CorsoDeleteView(AdminRequiredMixin, DeleteView):
    model = Corso
    template_name = 'gestionale/corsi/confirm_delete.html'
    success_url = reverse_lazy('gestionale:corso_list')

    def form_valid(self, form):
        messages.success(self.request, 'Corso eliminato.')
        return super().form_valid(form)


# ── Dipendenti ────────────────────────────────────────────────────────────────

class DipendenteListView(AdminRequiredMixin, ListView):
    model = Dipendente
    template_name = 'gestionale/dipendenti/list.html'
    context_object_name = 'dipendenti'

    def get_queryset(self):
        qs = Dipendente.objects.all()
        q = self.request.GET.get('q')
        reparto = self.request.GET.get('reparto')
        if q:
            qs = qs.filter(
                Q(nome__icontains=q) | Q(cognome__icontains=q) | Q(email__icontains=q)
            )
        if reparto:
            qs = qs.filter(reparto=reparto)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['reparti'] = Dipendente.REPARTO_CHOICES
        ctx['filtri'] = self.request.GET
        return ctx


class DipendenteDetailView(LoginRequiredMixin, DetailView):
    model = Dipendente
    template_name = 'gestionale/dipendenti/detail.html'
    context_object_name = 'dipendente'

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if not self.request.user.is_staff and obj.email != self.request.user.email:
            raise PermissionDenied
        return obj

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        assegnazioni = list(
            self.object.assegnazioni
            .select_related('corso', 'corso__vendor')
            .order_by('data_scadenza')
        )
        ctx['assegnazioni'] = assegnazioni
        ctx['totale'] = len(assegnazioni)
        ctx['completati'] = sum(1 for a in assegnazioni if a.stato == 'completato')
        ctx['in_corso'] = sum(1 for a in assegnazioni if a.stato == 'in_corso')
        ctx['ore_totali'] = sum(a.corso.durata_ore for a in assegnazioni if a.stato == 'completato')
        return ctx


class DipendenteCreateView(AdminRequiredMixin, CreateView):
    model = Dipendente
    form_class = DipendenteAdminForm
    template_name = 'gestionale/dipendenti/form.html'
    success_url = reverse_lazy('gestionale:dipendente_list')

    def form_valid(self, form):
        messages.success(self.request, 'Dipendente creato con successo.')
        return super().form_valid(form)


class DipendenteUpdateView(LoginRequiredMixin, UpdateView):
    model = Dipendente
    template_name = 'gestionale/dipendenti/form.html'

    def get_form_class(self):
        return DipendenteAdminForm if self.request.user.is_staff else DipendenteForm

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if not self.request.user.is_staff and obj.email != self.request.user.email:
            raise PermissionDenied
        return obj

    def get_success_url(self):
        return reverse_lazy('gestionale:dipendente_detail', kwargs={'pk': self.object.pk})

    def form_valid(self, form):
        messages.success(self.request, 'Dipendente aggiornato.')
        return super().form_valid(form)


# ── Assegnazioni ──────────────────────────────────────────────────────────────

class AssegnazioneListView(LoginRequiredMixin, ListView):
    model = AssegnazioneCorso
    template_name = 'gestionale/assegnazioni/list.html'
    context_object_name = 'assegnazioni'
    paginate_by = 50

    def get_queryset(self):
        qs = AssegnazioneCorso.objects.select_related('dipendente', 'corso', 'corso__vendor')
        if not self.request.user.is_staff:
            dip = Dipendente.objects.filter(email=self.request.user.email).first()
            qs = qs.filter(dipendente=dip) if dip else qs.none()

        stato = self.request.GET.get('stato')
        q = self.request.GET.get('q')
        scadenza = self.request.GET.get('scadenza')

        if stato:
            qs = qs.filter(stato=stato)
        if q:
            qs = qs.filter(
                Q(dipendente__cognome__icontains=q) |
                Q(dipendente__nome__icontains=q) |
                Q(corso__titolo__icontains=q)
            )
        if scadenza == 'imminente':
            oggi = date.today()
            qs = qs.filter(data_scadenza__range=(oggi, oggi + timedelta(days=30)))
        elif scadenza == 'scaduto':
            qs = qs.filter(data_scadenza__lt=date.today())

        return qs.order_by('data_scadenza')

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['stati'] = AssegnazioneCorso.STATO_CHOICES
        ctx['filtri'] = self.request.GET
        return ctx


class AssegnazioneCreateView(AdminRequiredMixin, CreateView):
    model = AssegnazioneCorso
    form_class = AssegnazioneCorsoForm
    template_name = 'gestionale/assegnazioni/form.html'
    success_url = reverse_lazy('gestionale:assegnazione_list')

    def form_valid(self, form):
        messages.success(self.request, 'Assegnazione creata.')
        return super().form_valid(form)


class AssegnazioneUpdateView(LoginRequiredMixin, UpdateView):
    model = AssegnazioneCorso
    template_name = 'gestionale/assegnazioni/form.html'
    success_url = reverse_lazy('gestionale:assegnazione_list')

    def get_object(self, queryset=None):
        obj = super().get_object(queryset)
        if not self.request.user.is_staff and obj.dipendente.email != self.request.user.email:
            raise PermissionDenied
        return obj

    def get_form_class(self):
        if not self.request.user.is_staff:
            return _UserAssegnazioneForm
        return AssegnazioneCorsoForm

    def form_valid(self, form):
        messages.success(self.request, 'Assegnazione aggiornata.')
        return super().form_valid(form)


class AssegnazioneDeleteView(AdminRequiredMixin, DeleteView):
    model = AssegnazioneCorso
    template_name = 'gestionale/assegnazioni/confirm_delete.html'
    success_url = reverse_lazy('gestionale:assegnazione_list')

    def form_valid(self, form):
        messages.success(self.request, 'Assegnazione eliminata.')
        return super().form_valid(form)


# ── Certificato ───────────────────────────────────────────────────────────────

class CertificatoUploadView(LoginRequiredMixin, View):
    template_name = 'gestionale/assegnazioni/certificato_form.html'

    def _check_access(self, request, assegnazione):
        return request.user.is_staff or assegnazione.dipendente.email == request.user.email

    def get(self, request, pk):
        assegnazione = get_object_or_404(
            AssegnazioneCorso.objects.select_related('dipendente', 'corso'), pk=pk
        )
        if not self._check_access(request, assegnazione):
            return HttpResponseForbidden()
        return render(request, self.template_name, {
            'form': CertificatoForm(),
            'assegnazione': assegnazione,
        })

    def post(self, request, pk):
        assegnazione = get_object_or_404(
            AssegnazioneCorso.objects.select_related('dipendente', 'corso'), pk=pk
        )
        if not self._check_access(request, assegnazione):
            return HttpResponseForbidden()
        form = CertificatoForm(request.POST, request.FILES)
        if form.is_valid():
            if assegnazione.certificato:
                assegnazione.certificato.delete(save=False)
            assegnazione.certificato = form.cleaned_data['certificato']
            assegnazione.save()
            messages.success(request, 'Certificato caricato.')
            return redirect('gestionale:assegnazione_list')
        return render(request, self.template_name, {
            'form': form,
            'assegnazione': assegnazione,
        })


class CertificatoDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        assegnazione = get_object_or_404(
            AssegnazioneCorso.objects.select_related('dipendente'), pk=pk
        )
        if not request.user.is_staff and assegnazione.dipendente.email != request.user.email:
            return HttpResponseForbidden()
        if assegnazione.certificato:
            assegnazione.certificato.delete(save=False)
            assegnazione.certificato = None
            assegnazione.save()
            messages.success(request, 'Certificato eliminato.')
        return redirect('gestionale:assegnazione_list')


# ── Materiali Corso ───────────────────────────────────────────────────────────

class MaterialeCorsoUploadView(AdminRequiredMixin, View):
    template_name = 'gestionale/corsi/materiale_form.html'

    def get(self, request, pk):
        corso = get_object_or_404(Corso, pk=pk)
        return render(request, self.template_name, {
            'form': MaterialeCorsoForm(),
            'corso': corso,
        })

    def post(self, request, pk):
        corso = get_object_or_404(Corso, pk=pk)
        form = MaterialeCorsoForm(request.POST, request.FILES)
        if form.is_valid():
            materiale = form.save(commit=False)
            materiale.corso = corso
            materiale.save()
            messages.success(request, 'Materiale caricato.')
            return redirect('gestionale:corso_detail', pk=pk)
        return render(request, self.template_name, {
            'form': form,
            'corso': corso,
        })


class MaterialeCorsoDeleteView(AdminRequiredMixin, View):
    def post(self, request, pk):
        materiale = get_object_or_404(MaterialeCorso, pk=pk)
        corso_pk = materiale.corso_id
        materiale.file.delete(save=False)
        materiale.delete()
        messages.success(request, 'Materiale eliminato.')
        return redirect('gestionale:corso_detail', pk=corso_pk)


# ── Excel Export ──────────────────────────────────────────────────────────────

class ExportExcelView(AdminRequiredMixin, View):
    def get(self, request):
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = 'Formazione'
        ws.append([
            'Cognome', 'Nome', 'Email', 'Reparto',
            'Vendor', 'Corso', 'Tipologia',
            'Stato', 'Data Assegnazione', 'Data Completamento', 'Data Scadenza',
        ])
        qs = (
            AssegnazioneCorso.objects
            .select_related('dipendente', 'corso', 'corso__vendor')
            .order_by('dipendente__cognome', 'corso__titolo')
        )
        for a in qs:
            ws.append([
                a.dipendente.cognome,
                a.dipendente.nome,
                a.dipendente.email,
                a.dipendente.reparto,
                a.corso.vendor.nome if a.corso.vendor else '',
                a.corso.titolo,
                a.corso.tipologia,
                a.get_stato_display(),
                a.data_assegnazione,
                a.data_completamento,
                a.data_scadenza,
            ])

        response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="formazione.xlsx"'
        wb.save(response)
        return response


# ── API JSON endpoints ─────────────────────────────────────────────────────────

def _form_errors_json(form):
    return json.loads(form.errors.as_json())


class _ApiAdminRequired:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return JsonResponse({'error': 'Accesso negato.'}, status=403)
        return super().dispatch(request, *args, **kwargs)


class ApiCorsoCreateView(_ApiAdminRequired, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'errors': {'__all__': [{'message': 'JSON non valido.', 'code': 'invalid'}]}}, status=400)
        form = CorsoForm(data)
        if form.is_valid():
            corso = form.save()
            return JsonResponse({'id': corso.pk}, status=201)
        return JsonResponse({'errors': _form_errors_json(form)}, status=400)


class ApiAssegnazioneCreateView(_ApiAdminRequired, View):
    def post(self, request):
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'errors': {'__all__': [{'message': 'JSON non valido.', 'code': 'invalid'}]}}, status=400)

        dipendente_id = data.get('dipendente_id')
        corso_id = data.get('corso_id')

        if dipendente_id and corso_id:
            if AssegnazioneCorso.objects.filter(dipendente_id=dipendente_id, corso_id=corso_id).exists():
                return JsonResponse({'error': 'Assegnazione già esistente per questo dipendente e corso.'}, status=409)

        form_data = {
            'dipendente': dipendente_id,
            'corso': corso_id,
            'data_inizio_pianificata': data.get('data_inizio_pianificata', ''),
            'data_fine_pianificata': data.get('data_fine_pianificata', ''),
            'stato': data.get('stato', 'da_iniziare'),
            'data_assegnazione': data.get('data_assegnazione') or date.today().isoformat(),
            'data_completamento': data.get('data_completamento', ''),
        }
        form = AssegnazioneCorsoForm(form_data)
        if form.is_valid():
            assegnazione = form.save()
            return JsonResponse({'id': assegnazione.pk}, status=201)
        return JsonResponse({'errors': _form_errors_json(form)}, status=400)


class ApiCertificatoUploadView(View):
    def post(self, request, pk):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Autenticazione richiesta.'}, status=401)
        assegnazione = get_object_or_404(
            AssegnazioneCorso.objects.select_related('dipendente', 'corso'), pk=pk
        )
        if not request.user.is_staff and assegnazione.dipendente.email != request.user.email:
            return JsonResponse({'error': 'Accesso negato.'}, status=403)
        form = CertificatoForm(request.POST, request.FILES)
        if form.is_valid():
            if assegnazione.certificato:
                assegnazione.certificato.delete(save=False)
            assegnazione.certificato = form.cleaned_data['certificato']
            assegnazione.save()
            return JsonResponse({'status': 'ok'})
        return JsonResponse({'errors': _form_errors_json(form)}, status=400)


class ApiLoginView(View):
    def dispatch(self, request, *args, **kwargs):
        try:
            return super().dispatch(request, *args, **kwargs)
        except Ratelimited:
            return JsonResponse({'error': 'Troppi tentativi. Riprova tra un minuto.'}, status=429)

    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request):
        try:
            data = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            return JsonResponse({'error': 'JSON non valido.'}, status=400)
        email = data.get('email', '')
        password = data.get('password', '')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            auth_login(request, user)
            return JsonResponse({'user': {'role': 'admin' if user.is_staff else 'employee'}})
        return JsonResponse({'error': 'Credenziali non valide.'}, status=400)
