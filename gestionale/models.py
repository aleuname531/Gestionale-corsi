from dateutil.relativedelta import relativedelta

from django.db import models
from django.utils import timezone


class Vendor(models.Model):
    nome = models.CharField(max_length=200, unique=True)
    sito_web = models.URLField(blank=True)
    contatto_email = models.EmailField(blank=True)
    note = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = 'Vendor'
        ordering = ['nome']

    def __str__(self):
        return self.nome


class Corso(models.Model):
    TIPOLOGIA_CHOICES = [
        ('Tecnico', 'Tecnico'),
        ('Management', 'Management'),
        ('Cloud', 'Cloud'),
        ('Analytics', 'Analytics'),
        ('Compliance', 'Compliance'),
        ('Soft Skills', 'Soft Skills'),
        ('Sicurezza', 'Sicurezza'),
        ('Altro', 'Altro'),
    ]

    titolo = models.CharField(max_length=300)
    descrizione = models.TextField(blank=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, blank=True, related_name='corsi')
    tipologia = models.CharField(max_length=50, choices=TIPOLOGIA_CHOICES, default='Altro')
    durata_ore = models.PositiveIntegerField(default=0)
    validita_mesi = models.PositiveIntegerField(default=0, help_text='0 = nessuna scadenza')
    obbligatorio = models.BooleanField(default=False)
    link_corso = models.URLField(blank=True)

    class Meta:
        verbose_name_plural = 'Corsi'
        ordering = ['titolo']

    def __str__(self):
        return self.titolo


class Dipendente(models.Model):
    REPARTO_CHOICES = [
        ('IT', 'IT'),
        ('HR', 'HR'),
        ('PM', 'PM'),
        ('RPA', 'RPA'),
        ('Finance', 'Finance'),
        ('Sales', 'Sales'),
        ('Operations', 'Operations'),
        ('Altro', 'Altro'),
    ]

    nome = models.CharField(max_length=100)
    cognome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    reparto = models.CharField(max_length=100, blank=True, choices=REPARTO_CHOICES, db_index=True)
    attivo = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = 'Dipendenti'
        ordering = ['cognome', 'nome']

    def __str__(self):
        return f'{self.cognome} {self.nome}'


class AssegnazioneCorso(models.Model):
    STATO_CHOICES = [
        ('da_iniziare', 'Da iniziare'),
        ('in_corso', 'In corso'),
        ('completato', 'Completato'),
        ('scaduto', 'Scaduto'),
    ]

    dipendente = models.ForeignKey(Dipendente, on_delete=models.CASCADE, related_name='assegnazioni', db_index=True)
    corso = models.ForeignKey(Corso, on_delete=models.CASCADE, related_name='assegnazioni', db_index=True)
    data_assegnazione = models.DateField(default=timezone.now)
    data_scadenza = models.DateField(null=True, blank=True)
    data_completamento = models.DateField(null=True, blank=True)
    stato = models.CharField(max_length=20, choices=STATO_CHOICES, default='da_iniziare', db_index=True)
    data_inizio_pianificata = models.DateField(null=True, blank=True)
    data_fine_pianificata = models.DateField(null=True, blank=True)
    certificato = models.FileField(upload_to='certificati/', null=True, blank=True)

    class Meta:
        verbose_name = 'Assegnazione Corso'
        verbose_name_plural = 'Assegnazioni Corsi'
        unique_together = ('dipendente', 'corso')
        ordering = ['data_scadenza']

    def __str__(self):
        return f'{self.dipendente} — {self.corso}'

    def save(self, *args, **kwargs):
        if self.data_completamento and self.corso.validita_mesi:
            self.data_scadenza = self.data_completamento + relativedelta(months=self.corso.validita_mesi)
        super().save(*args, **kwargs)
