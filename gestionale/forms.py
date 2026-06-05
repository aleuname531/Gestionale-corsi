from django import forms

from .models import AssegnazioneCorso, Corso, Dipendente, Vendor


class StyledFormMixin:
    """Aggiunge automaticamente class='form-control' a tutti i widget."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            if not isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.setdefault('class', 'form-control')


class VendorForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Vendor
        fields = ['nome', 'sito_web', 'contatto_email', 'note']
        widgets = {
            'note': forms.Textarea(attrs={'rows': 3}),
        }


class CorsoForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Corso
        fields = [
            'titolo', 'descrizione', 'vendor', 'tipologia',
            'durata_ore', 'validita_mesi', 'obbligatorio', 'link_corso',
        ]
        widgets = {
            'descrizione': forms.Textarea(attrs={'rows': 3}),
        }


class DipendenteForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = Dipendente
        fields = ['nome', 'cognome', 'email', 'reparto', 'attivo']


class AssegnazioneCorsoForm(StyledFormMixin, forms.ModelForm):
    class Meta:
        model = AssegnazioneCorso
        fields = [
            'dipendente', 'corso', 'stato',
            'data_assegnazione', 'data_inizio_pianificata',
            'data_fine_pianificata', 'data_completamento',
        ]
        widgets = {
            'data_assegnazione': forms.DateInput(attrs={'type': 'date'}),
            'data_inizio_pianificata': forms.DateInput(attrs={'type': 'date'}),
            'data_fine_pianificata': forms.DateInput(attrs={'type': 'date'}),
            'data_completamento': forms.DateInput(attrs={'type': 'date'}),
        }

    def clean(self):
        cleaned = super().clean()
        inizio = cleaned.get('data_inizio_pianificata')
        fine = cleaned.get('data_fine_pianificata')
        if inizio and fine and fine < inizio:
            raise forms.ValidationError('La data di fine pianificata non può essere precedente a quella di inizio.')
        return cleaned


class CertificatoForm(forms.Form):
    certificato = forms.FileField(
        label='Certificato (PDF o DOCX, max 10 MB)',
        help_text='Formati accettati: .pdf, .docx',
    )

    def clean_certificato(self):
        f = self.cleaned_data['certificato']
        allowed = ('.pdf', '.docx')
        if not f.name.lower().endswith(allowed):
            raise forms.ValidationError('Formato non supportato. Carica un file PDF o DOCX.')
        if f.size > 10 * 1024 * 1024:
            raise forms.ValidationError('Il file supera il limite di 10 MB.')
        return f
