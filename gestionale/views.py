from datetime import date, timedelta

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.views import LoginView
from django.core.exceptions import PermissionDenied
from django.db.models import Count, Q
from django.http import HttpResponse, HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.views import View
from django.views.generic import (
    CreateView, DeleteView, DetailView, ListView, TemplateView, UpdateView,
)

from .forms import AssegnazioneCorsoForm, CertificatoForm, CorsoForm, DipendenteForm
from .models import AssegnazioneCorso, Corso, Dipendente, Vendor


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
        ctx['assegnazioni'] = (
            self.object.assegnazioni
            .select_related('corso')
            .order_by('data_scadenza')
        )
        return ctx


class DipendenteCreateView(AdminRequiredMixin, CreateView):
    model = Dipendente
    form_class = DipendenteForm
    template_name = 'gestionale/dipendenti/form.html'
    success_url = reverse_lazy('gestionale:dipendente_list')

    def form_valid(self, form):
        messages.success(self.request, 'Dipendente creato con successo.')
        return super().form_valid(form)


class DipendenteUpdateView(LoginRequiredMixin, UpdateView):
    model = Dipendente
    form_class = DipendenteForm
    template_name = 'gestionale/dipendenti/form.html'

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


# ── Excel Export ──────────────────────────────────────────────────────────────

class ExportExcelView(AdminRequiredMixin, View):
    def get(self, request):
        try:
            import openpyxl
        except ImportError:
            messages.error(request, 'openpyxl non installato. Esegui: pip install openpyxl')
            return redirect('gestionale:assegnazione_list')

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
