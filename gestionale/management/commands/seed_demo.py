"""
Popola il database con utenti e dati di esempio.
Uso: python manage.py seed_demo
     python manage.py seed_demo --reset   (cancella tutto e riricrea)
"""

import secrets

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.db import transaction

from gestionale.models import AssegnazioneCorso, Corso, Dipendente, Vendor


DEMO_USERS = [
    {'username': 'admin',                    'email': 'admin@demo.local',               'password': 'admin123',  'first_name': 'Admin',      'last_name': 'Demo',   'is_staff': True,  'is_superuser': True},
    {'username': 'rossi.mario',              'email': 'rossi.mario@demo.local',          'first_name': 'Mario',      'last_name': 'Rossi',    'area': 'RPA'},
    {'username': 'cangini.elisabetta',       'email': 'cangini.elisabetta@demo.local',   'first_name': 'Elisabetta', 'last_name': 'Cangini',  'area': 'RPA'},
    {'username': 'ferrari.giulia',           'email': 'ferrari.giulia@demo.local',       'first_name': 'Giulia',     'last_name': 'Ferrari',  'area': 'RPA'},
    {'username': 'bianchi.luca',             'email': 'bianchi.luca@demo.local',         'first_name': 'Luca',       'last_name': 'Bianchi',  'area': 'PM'},
    {'username': 'moretti.sara',             'email': 'moretti.sara@demo.local',         'first_name': 'Sara',       'last_name': 'Moretti',  'area': 'RPA'},
]

DEMO_CORSI = [
    {'titolo': 'RPA Developer Foundation (v2021.10)',  'vendor': 'UiPath',    'tipologia': 'Tecnico',    'link_corso': 'https://www.uipath.com/learning/rpa-courses',                         'validita_mesi': 36, 'durata_ore': 16},
    {'titolo': 'Advanced RPA Developer Certification', 'vendor': 'UiPath',    'tipologia': 'Tecnico',    'link_corso': 'https://www.uipath.com/learning/certification',                        'validita_mesi': 36, 'durata_ore': 24},
    {'titolo': 'Project Management Professional (PMP)','vendor': 'PMI',       'tipologia': 'Management', 'link_corso': 'https://www.pmi.org/certifications/project-management-pmp',           'validita_mesi': 36, 'durata_ore': 40},
    {'titolo': 'Microsoft Azure Fundamentals (AZ-900)','vendor': 'Microsoft', 'tipologia': 'Cloud',      'link_corso': 'https://learn.microsoft.com/it-it/certifications/azure-fundamentals/', 'validita_mesi': 0,  'durata_ore': 8},
    {'titolo': 'Sicurezza Informatica — Base',         'vendor': 'Interno',   'tipologia': 'Sicurezza',  'link_corso': '',                                                                     'validita_mesi': 12, 'obbligatorio': True, 'durata_ore': 4},
    {'titolo': 'Power BI Desktop Fundamentals',        'vendor': 'Microsoft', 'tipologia': 'Analytics',  'link_corso': 'https://learn.microsoft.com/it-it/power-bi/',                          'validita_mesi': 0,  'durata_ore': 12},
]

# (email_dipendente, titolo_corso, stato, data_inizio, data_fine)
DEMO_ASSEGNAZIONI = [
    ('cangini.elisabetta@demo.local', 'RPA Developer Foundation (v2021.10)',  'completato',  '2023-01-10', '2023-03-15'),
    ('cangini.elisabetta@demo.local', 'Advanced RPA Developer Certification', 'completato',  '2024-02-01', '2024-05-30'),
    ('rossi.mario@demo.local',        'RPA Developer Foundation (v2021.10)',  'completato',  '2023-03-01', '2023-06-01'),
    ('rossi.mario@demo.local',        'Microsoft Azure Fundamentals (AZ-900)','in_corso',    '2025-01-15', '2025-06-30'),
    ('ferrari.giulia@demo.local',     'RPA Developer Foundation (v2021.10)',  'completato',  '2024-01-10', '2024-04-20'),
    ('ferrari.giulia@demo.local',     'Sicurezza Informatica — Base',         'da_iniziare',  '2025-07-01', '2025-08-01'),
    ('bianchi.luca@demo.local',       'Project Management Professional (PMP)','in_corso',    '2025-03-01', '2025-09-01'),
    ('bianchi.luca@demo.local',       'Power BI Desktop Fundamentals',        'da_iniziare',  '2025-10-01', '2025-12-31'),
    ('moretti.sara@demo.local',       'RPA Developer Foundation (v2021.10)',  'completato',  '2023-01-01', '2023-04-01'),
    ('moretti.sara@demo.local',       'Sicurezza Informatica — Base',         'completato',  '2024-05-01', '2024-06-01'),
    ('rossi.mario@demo.local',        'Sicurezza Informatica — Base',         'completato',  '2024-04-15', '2024-06-01'),
]


class Command(BaseCommand):
    help = 'Popola il database con utenti e dati di esempio'

    def add_arguments(self, parser):
        parser.add_argument('--reset', action='store_true', help='Cancella tutti i dati esistenti prima di ri-creare')

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write('Cancellazione dati esistenti...')
            AssegnazioneCorso.objects.all().delete()
            Corso.objects.all().delete()
            Vendor.objects.all().delete()
            Dipendente.objects.all().delete()
            User.objects.filter(is_superuser=False).exclude(username='admin').delete()
            self.stdout.write(self.style.WARNING('Dati cancellati.'))

        with transaction.atomic():
            self._seed_users()
            self._seed_corsi()
            self._seed_assegnazioni()

        self.stdout.write(self.style.SUCCESS('\n✅ Seed completato con successo!\n'))
        self.stdout.write('Credenziali di accesso:')
        self.stdout.write('  👑 Admin:      admin@demo.local  /  admin123')
        self.stdout.write('  👤 Dipendente: le password generate sono stampate sopra per ogni utente')

    def _seed_users(self):
        self.stdout.write('\nCreazione utenti...')
        for u in DEMO_USERS:
            user, created = User.objects.get_or_create(
                username=u['username'],
                defaults={
                    'email': u['email'],
                    'first_name': u.get('first_name', ''),
                    'last_name': u.get('last_name', ''),
                    'is_staff': u.get('is_staff', False),
                    'is_superuser': u.get('is_superuser', False),
                }
            )
            if created:
                stato = 'creato'
                password = u.get('password') or secrets.token_urlsafe(12)
                user.set_password(password)
                self.stdout.write(f'  password generata → {password}')
            else:
                stato = 'già esistente'
            user.email = u['email']
            user.save()
            self.stdout.write(f'  {u["username"]:35} {stato}')

            # Crea Dipendente collegato (non per l'admin)
            if not u.get('is_staff'):
                Dipendente.objects.get_or_create(
                    email=u['email'],
                    defaults={
                        'nome': u.get('first_name', ''),
                        'cognome': u.get('last_name', ''),
                        'reparto': u.get('area', ''),
                        'attivo': True,
                    }
                )

    def _seed_corsi(self):
        self.stdout.write('\nCreazione corsi...')
        for c in DEMO_CORSI:
            vendor, _ = Vendor.objects.get_or_create(nome=c['vendor'])
            corso, created = Corso.objects.get_or_create(
                titolo=c['titolo'],
                defaults={
                    'vendor': vendor,
                    'tipologia': c.get('tipologia', 'Altro'),
                    'link_corso': c.get('link_corso', ''),
                    'validita_mesi': c.get('validita_mesi', 0),
                    'durata_ore': c.get('durata_ore', 0),
                    'obbligatorio': c.get('obbligatorio', False),
                }
            )
            stato = 'creato' if created else 'già esistente'
            self.stdout.write(f'  {c["titolo"][:50]:52} {stato}')

    def _seed_assegnazioni(self):
        self.stdout.write('\nCreazione assegnazioni...')
        for email, titolo, stato, data_inizio, data_fine in DEMO_ASSEGNAZIONI:
            try:
                dip = Dipendente.objects.get(email=email)
                corso = Corso.objects.get(titolo=titolo)
            except (Dipendente.DoesNotExist, Corso.DoesNotExist):
                self.stdout.write(self.style.WARNING(f'  ⚠ Saltato: {email} / {titolo}'))
                continue

            _, created = AssegnazioneCorso.objects.get_or_create(
                dipendente=dip,
                corso=corso,
                defaults={
                    'stato': stato,
                    'data_inizio_pianificata': data_inizio,
                    'data_fine_pianificata': data_fine,
                }
            )
            stato_label = 'creata' if created else 'già esistente'
            self.stdout.write(f'  {dip.cognome:12} → {titolo[:40]:42} {stato_label}')
