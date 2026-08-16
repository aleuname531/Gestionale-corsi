import json

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.models import User
from django.test import Client, TestCase

from .models import AssegnazioneCorso, Corso, Dipendente


class ApiSecurityValidationTests(TestCase):
    def setUp(self):
        self.client = Client(enforce_csrf_checks=True)
        self.client.get('/login/')  # renderizza {% csrf_token %}, imposta il cookie
        self.csrf = self.client.cookies['csrftoken'].value
        self.admin = User.objects.create_user(
            username='admin@demo.local',
            email='admin@demo.local',
            password='secret',
            is_staff=True,
        )
        self.employee = User.objects.create_user(
            username='mario.rossi@example.com',
            email='mario.rossi@example.com',
            password='secret',
        )
        self.client.force_login(self.admin)
        self.csrf_headers = {'X-CSRFToken': self.csrf}

    def post_json(self, url, data, headers=None):
        return self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            headers=headers or self.csrf_headers,
        )

    def test_post_requires_csrf_token(self):
        response = self.client.post(
            '/api/corsi/',
            data=json.dumps({'titolo': 'Corso Sicuro'}),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)

    def test_course_payload_is_validated_server_side(self):
        response = self.post_json('/api/corsi/', {'titolo': '', 'link_corso': 'non-url'})

        self.assertEqual(response.status_code, 400)
        self.assertIn('titolo', response.json()['errors'])
        self.assertIn('link_corso', response.json()['errors'])

    def test_employee_cannot_create_course(self):
        self.client.force_login(self.employee)
        response = self.post_json('/api/corsi/', {'titolo': 'Python'})

        self.assertEqual(response.status_code, 403)

    def test_assignment_rejects_end_date_before_start_date(self):
        corso = Corso.objects.create(titolo='Python')
        dipendente = Dipendente.objects.create(
            nome='Mario',
            cognome='Rossi',
            email='mario.rossi@example.com',
        )
        response = self.post_json('/api/assegnazioni/', {
            'dipendente_id': dipendente.pk,
            'corso_id': corso.pk,
            'data_inizio_pianificata': '2026-06-10',
            'data_fine_pianificata': '2026-06-01',
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('data_fine_pianificata', response.json()['errors'])

    def test_assignment_duplicate_is_rejected(self):
        corso = Corso.objects.create(titolo='Python')
        dipendente = Dipendente.objects.create(
            nome='Mario',
            cognome='Rossi',
            email='mario.rossi@example.com',
        )
        AssegnazioneCorso.objects.create(dipendente=dipendente, corso=corso)

        response = self.post_json('/api/assegnazioni/', {
            'dipendente_id': dipendente.pk,
            'corso_id': corso.pk,
        })

        self.assertEqual(response.status_code, 409)

    def test_certificate_accepts_only_pdf_or_docx(self):
        corso = Corso.objects.create(titolo='Python')
        dipendente = Dipendente.objects.create(
            nome='Mario',
            cognome='Rossi',
            email='mario.rossi@example.com',
        )
        assegnazione = AssegnazioneCorso.objects.create(dipendente=dipendente, corso=corso)
        file = SimpleUploadedFile('certificato.png', b'fake', content_type='image/png')

        response = self.client.post(
            f'/api/assegnazioni/{assegnazione.pk}/certificato/',
            {'certificato': file},
            headers=self.csrf_headers,
        )

        self.assertEqual(response.status_code, 400)

    def test_login_uses_django_session_auth(self):
        self.client.logout()
        self.client.get('/login/')  # renderizza {% csrf_token %}, imposta il cookie
        self.csrf = self.client.cookies['csrftoken'].value
        self.csrf_headers = {'X-CSRFToken': self.csrf}
        response = self.post_json('/api/auth/login/', {
            'email': 'admin@demo.local',
            'password': 'secret',
        })

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['user']['role'], 'admin')
