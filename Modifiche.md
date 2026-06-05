# Modifiche.md — Audit Tecnico Progetto Corsi (Beta80)

> Documento di revisione professionale generato il 2026-05-29.  
> Prospettiva: Django Expert + UI/UX Expert + Sviluppo Full-Stack.  
> Scopo: registro permanente di cosa funziona, cosa va reso dinamico, e cosa va corretto.

---

## Indice

1. [Cosa funziona bene — Accepted & Systematized](#1-cosa-funziona-bene)
2. [Cosa rendere Dinamico](#2-cosa-rendere-dinamico)
3. [Bug, Errori e Incoerenze](#3-bug-errori-e-incoerenze)
4. [Roadmap delle Modifiche](#4-roadmap-delle-modifiche)

---

## 1. Cosa funziona bene

Questi elementi sono corretti, idiomatici e **non vanno toccati** senza motivo.

### Backend / Django

| Elemento | File | Dettaglio |
|---------|------|-----------|
| CSRF decoratori | [gestionale/views.py](gestionale/views.py) | `@ensure_csrf_cookie` correttamente su `dashboard` (r. 17) e `api_init` (r. 235) |
| Transazioni atomiche | [gestionale/views.py](gestionale/views.py) | Tutte le write wrapped con `with transaction.atomic()` (rr. 276, 317, 355, 457, 503, 555) |
| Validazione server-side | [gestionale/views.py](gestionale/views.py) | `_validate_corso_payload()` (r. 113), `_validate_dipendente_payload()` (r. 139), `_validate_assegnazione_dates()` (r. 160) — coprono tutti i casi |
| Query ottimizzate Corso | [gestionale/views.py](gestionale/views.py) | `select_related('vendor')` su ogni queryset di Corso (rr. 241, 264, 296) — nessun N+1 base |
| Constraint unicità assegnazione | [gestionale/models.py](gestionale/models.py) | `unique_together = ('dipendente', 'corso')` (r. 84) — previene duplicati a livello DB |
| Gestione IntegrityError | [gestionale/views.py](gestionale/views.py) | Status 409 su email duplicata (r. 364) e assegnazione duplicata (r. 454) |
| Validazione upload certificato | [gestionale/views.py](gestionale/views.py) | Whitelist estensioni + content-type (rr. 546–552); nessuna esecuzione di file arbitrari |
| Cleanup vecchio certificato | [gestionale/views.py](gestionale/views.py) | `ass.certificato.delete(save=False)` prima di sovrascrivere (r. 556) |
| Auto-calcolo data_scadenza | [gestionale/models.py](gestionale/models.py) | `save()` di AssegnazioneCorso calcola scadenza da completamento + validità mesi (rr. 90–94) |
| Migrazioni sequenziali coerenti | [gestionale/migrations/](gestionale/migrations/) | 3 migrazioni (0001→0003) allineate con lo schema finale; 0002 ha forward+backward |
| Admin configurato | [gestionale/admin.py](gestionale/admin.py) | `autocomplete_fields`, `list_filter`, `search_fields` su tutti i modelli registrati |
| Helper functions modulari | [gestionale/views.py](gestionale/views.py) | `_error()`, `_require_authenticated()`, `_is_admin()`, `_require_admin()`, `_json_body()` — riusabili e DRY |
| URLValidator su link corso | [gestionale/views.py](gestionale/views.py) | `URLValidator()` importato da Django e usato su `link_corso` (r. 131) |
| Email validation | [gestionale/views.py](gestionale/views.py) | `validate_email()` da Django usato su tutti gli input email (r. 152) |
| Seed command | [gestionale/management/commands/seed_demo.py](gestionale/management/commands/seed_demo.py) | Management command per inizializzare dati di test — buon pattern |

### Frontend / JavaScript

| Elemento | File | Dettaglio |
|---------|------|-----------|
| CSRF token dal cookie | [gestionale/static/gestionale/js/api.js](gestionale/static/gestionale/js/api.js) | Estrazione da `document.cookie` (rr. 2–14) — metodo preferito rispetto alla meta tag |
| Protezione sovrascrittura dati locali | [gestionale/static/gestionale/js/api.js](gestionale/static/gestionale/js/api.js) | Check anti-overwrite se server restituisce lista vuota (rr. 142–144) |
| Validazione cross-field date | [gestionale/static/gestionale/js/dashboard.js](gestionale/static/gestionale/js/dashboard.js) | Controllo `data_fine >= data_inizio` nel frontend |
| Accept attribute upload | [gestionale/templates/gestionale/dashboard.html](gestionale/templates/gestionale/dashboard.html) | `accept=".pdf,.docx"` come prima difesa client-side |
| Enter key su password | [gestionale/static/gestionale/js/auth.js](gestionale/static/gestionale/js/auth.js) | Listener su keydown per submit con Invio (rr. 58–60) — buona UX |
| Storage con try/catch | [gestionale/static/gestionale/js/storage.js](gestionale/static/gestionale/js/storage.js) | `JSON.parse` wrappato in try/catch (rr. 3–7) — previene crash su dati corrotti |

---

## 2. Cosa rendere Dinamico

Elementi **hardcoded** che devono diventare configurabili o caricati dinamicamente.

| # | Elemento hardcoded | File | Linea | Come renderlo dinamico |
|---|-------------------|------|-------|----------------------|
| **D1** | `DEMO_USERS`, `DEMO_COURSES`, `DEMO_ENROLLMENTS` in JS | [gestionale/static/gestionale/js/dashboard.js](gestionale/static/gestionale/js/dashboard.js) | 1–61 | Rimuovere dal JS; caricare tutto da `api/init/` che già esiste. I dati demo restano in `seed_demo.py` |
| **D2** | Credenziali demo nell'HTML | [gestionale/templates/gestionale/dashboard.html](gestionale/templates/gestionale/dashboard.html) | 32–34 | Wrappare con `{% if debug %}...{% endif %}` passando `debug` come context var dalla view |
| **D3** | Email placeholder `nome@beta80group.it` | [gestionale/templates/gestionale/dashboard.html](gestionale/templates/gestionale/dashboard.html) | 24 | Passare come variabile dal context (`{{ email_domain }}`) impostata in settings o context processor |
| **D4** | `SECRET_KEY` hardcoded | [corsi/settings.py](corsi/settings.py) | 23 | `SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-solo-dev')` |
| **D5** | `DEBUG = True` | [corsi/settings.py](corsi/settings.py) | 26 | `DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'` |
| **D6** | `ALLOWED_HOSTS = ["*"]` | [corsi/settings.py](corsi/settings.py) | 28 | `ALLOWED_HOSTS = os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')` |
| **D7** | `LANGUAGE_CODE = 'en-us'` | [corsi/settings.py](corsi/settings.py) | 106 | Cambiare a `'it-it'` — UI è in italiano, messaggi di errore Django devono esserlo |
| **D8** | `TIME_ZONE = 'UTC'` | [corsi/settings.py](corsi/settings.py) | 108 | Cambiare a `'Europe/Rome'` — date locali corrette per business italiano |
| **D9** | `reparto` come testo libero in Dipendente | [gestionale/models.py](gestionale/models.py) | 52 | Aggiungere `REPARTO_CHOICES` (es. IT, HR, PM, RPA, Finance, Sales) e `choices=REPARTO_CHOICES` al field + migrazione |
| **D10** | Titolo pagina e brand "Beta80" | [gestionale/templates/gestionale/dashboard.html](gestionale/templates/gestionale/dashboard.html) | 8, 16–18 | Creare context processor `corsi.context_processors.site_config` che passa `SITE_NAME` da settings |
| **D11** | Import `dateutil` dentro metodo `save()` | [gestionale/models.py](gestionale/models.py) | 92 | Spostare `from dateutil.relativedelta import relativedelta` in cima al file (riga 3) — import-time, non runtime |

---

## 3. Bug, Errori e Incoerenze

### 🔴 Critici — Blocco produzione

| # | Problema | File | Linea | Impatto | Fix |
|---|---------|------|-------|---------|-----|
| **C1** | **Dipendenza mancante `python-dateutil`** | [requirements.txt](requirements.txt) + [gestionale/models.py](gestionale/models.py) | r. 92 | `ImportError` alla prima migrazione/save su un server pulito — **il progetto non parte** | Aggiungere `python-dateutil>=2.8.2` a requirements.txt |
| **C2** | **`SECRET_KEY` esposta nel repository** | [corsi/settings.py](corsi/settings.py) | r. 23 | Chiave di sessione e CSRF compromessa → chiunque abbia accesso al repo può forgiare cookie di sessione | Spostare in variabile d'ambiente; mai committare |
| **C3** | **`DEBUG=True` in produzione** | [corsi/settings.py](corsi/settings.py) | r. 26 | Stack trace completo con settings esposto a ogni errore 500 — rivela struttura DB, path, config | Variabile d'ambiente; False in prod |
| **C4** | **`ALLOWED_HOSTS=["*"]`** | [corsi/settings.py](corsi/settings.py) | r. 28 | Attacchi HTTP Host Header injection possibili; Django non filtra il dominio della richiesta | Specificare solo domini reali |
| **C5** | **Dashboard HTML senza autenticazione** | [gestionale/views.py](gestionale/views.py) | r. 17–19 | La SPA HTML è accessibile senza login — un utente non autenticato vede la shell dell'applicazione | Aggiungere `if not request.user.is_authenticated: return redirect('login')` nella view `dashboard` |

### 🟠 Alti — Sicurezza e stabilità

| # | Problema | File | Linea | Impatto | Fix |
|---|---------|------|-------|---------|-----|
| **A1** | **XSS via `innerHTML` nel modal** | [gestionale/static/gestionale/js/dashboard.js](gestionale/static/gestionale/js/dashboard.js) | r. 197 | `modal-body.innerHTML = body` dove `body` contiene titolo/descrizione inseriti dall'utente → HTML injection eseguibile | Creare helper `escapeHtml(s)` e usare `textContent` oppure passare solo HTML hardcoded al modal |
| **A2** | **HTML injection nei form inline** | [gestionale/static/gestionale/js/dashboard.js](gestionale/static/gestionale/js/dashboard.js) | r. 850, 878 | Template literal `value="${c.titolo}"` e `<textarea>${c.descrizione}</textarea>` non escapate → un titolo con `"` o `</textarea>` rompe il DOM o inietta script | Aggiungere `escapeHtml()` su tutti i valori interpolati in HTML |
| **A3** | **Credenziali demo nel sorgente HTML** | [gestionale/templates/gestionale/dashboard.html](gestionale/templates/gestionale/dashboard.html) | r. 32–34 | `admin123` e `pass123` visibili nel sorgente → chiunque apra DevTools le vede | Rimuovere; se necessarie per demo, mostrare solo con `{% if debug %}` |
| **A4** | **Nessun rate limiting sul login** | [gestionale/views.py](gestionale/views.py) | r. 203–224 | Brute force illimitato su `POST /api/auth/login/` | Aggiungere `django-ratelimit`: `@ratelimit(key='ip', rate='10/m', method='POST', block=True)` |
| **A5** | **Nessun limite di dimensione per upload** | [gestionale/views.py](gestionale/views.py) | r. 542–563 | Un file da 1GB causa crash per esaurimento memoria/disco | Aggiungere `if f.size > 10 * 1024 * 1024: return _error(...)` (10MB max) |
| **A6** | **Header HTTPS security assenti** | [corsi/settings.py](corsi/settings.py) | — | Nessun HSTS, cookie inviati su HTTP, nessun redirect HTTPS | Aggiungere in settings per produzione: `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS=31536000`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True` |
| **A7** | **`api_auth_login` senza `@ensure_csrf_cookie`** | [gestionale/views.py](gestionale/views.py) | r. 203 | Il login è la prima chiamata POST; se il cookie CSRF non è ancora impostato, Django rifiuta la richiesta con 403 — bug intermittente in sessioni fresh | Aggiungere `@ensure_csrf_cookie` a `api_auth_login` oppure documentare che il frontend deve prima chiamare `api/init/` |

### 🟡 Medi — Qualità e coerenza

| # | Problema | File | Linea | Impatto | Fix |
|---|---------|------|-------|---------|-----|
| **M1** | **N+1 latente in `api_init` per assegnazioni** | [gestionale/views.py](gestionale/views.py) | r. 251 | `_assegnazione_to_dict` chiama `request.build_absolute_uri(ass.certificato.url)` per ogni record → se ci sono 500 assegnazioni, 500 chiamate a `build_absolute_uri` in loop | Pre-calcolare `base_url = request.build_absolute_uri('/')[:-1]` fuori dal loop |
| **M2** | **Import `dateutil` dentro il metodo `save()`** | [gestionale/models.py](gestionale/models.py) | r. 92 | Python esegue l'import ad ogni chiamata a `save()` — non convenzionale e inutilmente lento | Spostare `from dateutil.relativedelta import relativedelta` in cima al file |
| **M3** | **`data_scadenza` non ricalcolata su update** | [gestionale/models.py](gestionale/models.py) | r. 90–94 | Se un admin aggiorna `data_completamento` dopo la creazione, `data_scadenza` rimane quella vecchia | Il `save()` attuale già ricalcola — verificare che l'endpoint PUT chiami `ass.save()` e non `update()` diretto; aggiungere commento esplicativo |
| **M4** | **`data_completamento` non validata nel futuro** | [gestionale/views.py](gestionale/views.py) | r. 160–172 | Si può inserire una data di completamento nel futuro (es. 2030-01-01) | Aggiungere in `_validate_assegnazione_dates()`: se `data_completamento > date.today()` → errore |
| **M5** | **`Vendor.nome` non unique** | [gestionale/models.py](gestionale/models.py) | r. 5 | `_get_or_create_vendor()` fa lookup su nome ma un admin può creare duplicati dall'admin panel | Aggiungere `unique=True` a `Vendor.nome` + migrazione |
| **M6** | **Nessun `db_index` su FK e stato in AssegnazioneCorso** | [gestionale/models.py](gestionale/models.py) | r. 71–76 | `dipendente`, `corso`, `stato` filtrati frequentemente ma senza index → table scan su ogni query list | Aggiungere `db_index=True` a `dipendente`, `corso`, `stato` + migrazione |
| **M7** | **`Dipendente.reparto` senza index** | [gestionale/models.py](gestionale/models.py) | r. 52 | `reparto` usato in `list_filter` dell'admin — senza index, filter lento su tabelle grandi | Aggiungere `db_index=True` a `reparto` |
| **M8** | **Nessuna paginazione sulle list API** | [gestionale/views.py](gestionale/views.py) | r. 241, 264, 334 | `api_corsi`, `api_dipendenti`, `api_assegnazioni` e `api_init` restituiscono tutti i record → latenza e memoria proporzionali ai dati | Aggiungere `limit = int(request.GET.get('limit', 200))` + `offset` con slice queryset |
| **M9** | **`LANGUAGE_CODE='en-us'` e `TIME_ZONE='UTC'`** | [corsi/settings.py](corsi/settings.py) | r. 106–108 | Messaggi di errore di validazione Django in inglese (es. "This field is required") invece che in italiano; date/ore UTC invece di Rome | Cambiare a `'it-it'` e `'Europe/Rome'` |
| **M10** | **`Dipendente` non collegato a `User` con FK** | [gestionale/models.py](gestionale/models.py) | r. 47–60 | Il link tra User Django e Dipendente è basato su email string matching (fragile) — se cambia l'email utente, il dipendente diventa "orfano" | Aggiungere `user = models.OneToOneField(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)` + migrazione |
| **M11** | **`import os` inutilizzato in models.py** | [gestionale/models.py](gestionale/models.py) | r. 1 | Import non usato — lint warning, codice inutile | Rimuovere la riga |
| **M12** | **Race condition in `syncEnrollment()`** | [gestionale/static/gestionale/js/api.js](gestionale/static/gestionale/js/api.js) | r. 111–135 | Se `await syncDipendente(user)` fallisce (HTTP error), il codice continua e chiama `syncCourseLink()` con un `user._dbId` null | Aggiungere `if (!result) return null;` dopo ogni await di sync |
| **M13** | **`verbose_name` mancante in `GestionaleConfig`** | [gestionale/apps.py](gestionale/apps.py) | — | L'admin Django mostra "Gestionale" grezzo come nome dell'app nel breadcrumb | Aggiungere `verbose_name = 'Gestione Formazione'` |
| **M14** | **`data_completamento` assente in `list_display` admin** | [gestionale/admin.py](gestionale/admin.py) | r. 26–31 | Campo informativo non visibile nella lista assegnazioni dell'admin | Aggiungere `'data_completamento'` a `AssegnazioneCorsoAdmin.list_display` |
| **M15** | **Nessun namespace URL per app gestionale** | [gestionale/urls.py](gestionale/urls.py) | — | URL reverse (`reverse('dashboard')`) può collidere se si aggiunge un'altra app | Aggiungere `app_name = 'gestionale'` all'inizio del file |
| **M16** | **Dati utente in `localStorage` in chiaro** | [gestionale/static/gestionale/js/storage.js](gestionale/static/gestionale/js/storage.js) | r. 1–8 | Nome, email, reparto, ruolo salvati in plaintext — leggibili da qualsiasi altro script della pagina (XSS amplificato) | Rimuovere i campi sensibili dal localStorage; tenere solo l'ID sessione e il ruolo |
| **M17** | **Excel import senza validazione** | [gestionale/static/gestionale/js/dashboard.js](gestionale/static/gestionale/js/dashboard.js) | r. 1409–1507 | Import crea utenti con email auto-generate (es. `cognome.nome@beta80group.it`) senza verificare se esistono già; nessuna validazione del formato email | Aggiungere `validateEmail()` prima di creare utenti; skipare righe duplicate per email/titolo |

---

## 4. Roadmap delle Modifiche

Le modifiche sono ordinate per impatto e dipendenze. Ogni step è indipendente salvo dove indicato.

---

### FASE 0 — Fix Critici Immediati ⏱ ~2 ore

```
[ ] 0.1  requirements.txt: aggiungere "python-dateutil>=2.8.2"             → risolve C1
[ ] 0.2  models.py r.1–3: spostare import dateutil in cima al file          → risolve M2
[ ] 0.3  settings.py rr.23,26,28: spostare SECRET_KEY, DEBUG, ALLOWED_HOSTS
         in variabili d'ambiente con os.environ.get()                       → risolve C2,C3,C4,D4,D5,D6
[ ] 0.4  settings.py rr.106,108: cambiare LANGUAGE_CODE='it-it',
         TIME_ZONE='Europe/Rome'                                             → risolve M9,D7,D8
[ ] 0.5  views.py r.17-19: aggiungere redirect a login se utente non
         autenticato nella view dashboard                                    → risolve C5
[ ] 0.6  dashboard.html rr.32-34: wrappare credenziali demo con
         {% if debug %}...{% endif %} passando debug dalla view              → risolve A3,D2
```

---

### FASE 1 — Fix Sicurezza Alta ⏱ ~1 giorno

```
[ ] 1.1  dashboard.js: creare helper escapeHtml(s) e applicarlo su tutti
         i valori interpolati in HTML (rr. 197, 850, 878)                   → risolve A1,A2
[ ] 1.2  requirements.txt: aggiungere "django-ratelimit>=4.1"
         views.py r.203: decorare api_auth_login con @ratelimit             → risolve A4
[ ] 1.3  views.py r.542: aggiungere controllo f.size > 10*1024*1024
         con _error('file troppo grande', status=400)                       → risolve A5
[ ] 1.4  settings.py: aggiungere blocco sicurezza HTTPS condizionale
         (SECURE_SSL_REDIRECT, SECURE_HSTS_SECONDS, SESSION_COOKIE_SECURE,
         CSRF_COOKIE_SECURE) attivo solo se not DEBUG                       → risolve A6
[ ] 1.5  dashboard.js rr.1-61: rimuovere DEMO_USERS/COURSES/ENROLLMENTS
         dal JS — tutto già gestito da seed_demo.py e api/init/             → risolve D1
[ ] 1.6  views.py r.203: verificare/aggiungere @ensure_csrf_cookie
         su api_auth_login                                                  → risolve A7
```

---

### FASE 2 — Fix Qualità e Coerenza ⏱ ~2–3 giorni

```
[ ] 2.1  models.py: aggiungere db_index=True a
         AssegnazioneCorso.dipendente, .corso, .stato
         + python manage.py makemigrations && migrate                       → risolve M6
[ ] 2.2  models.py r.5: aggiungere unique=True a Vendor.nome
         + migrazione                                                       → risolve M5
[ ] 2.3  models.py r.52: aggiungere REPARTO_CHOICES (IT, HR, PM, RPA,
         Finance, Sales, Operations) e choices= al field reparto
         + db_index=True + migrazione                                       → risolve M7,D9
[ ] 2.4  models.py r.1: rimuovere "import os" inutilizzato                 → risolve M11
[ ] 2.5  views.py r.160-172: aggiungere validazione
         data_completamento <= date.today() in _validate_assegnazione_dates → risolve M4
[ ] 2.6  views.py rr.241,264,334: aggiungere paginazione limit/offset
         ai list endpoint (default limit=200)                               → risolve M8
[ ] 2.7  admin.py r.31: aggiungere 'data_completamento' a list_display
         di AssegnazioneCorsoAdmin                                          → risolve M14
[ ] 2.8  apps.py: aggiungere verbose_name='Gestione Formazione'             → risolve M13
[ ] 2.9  urls.py (gestionale): aggiungere app_name='gestionale'             → risolve M15
[ ] 2.10 api.js rr.111-135: aggiungere early return su errore
         in syncEnrollment dopo ogni await                                  → risolve M12
[ ] 2.11 dashboard.js rr.1409-1507: aggiungere validazione email e
         deduplicazione su titolo/email prima di creare record da Excel     → risolve M17
[ ] 2.12 views.py r.251: pre-calcolare base_url fuori dal loop
         per _assegnazione_to_dict                                          → risolve M1
```

---

### FASE 3 — Miglioramenti Dinamici ⏱ ~3–5 giorni

```
[ ] 3.1  models.py Dipendente: aggiungere
         user = OneToOneField(settings.AUTH_USER_MODEL, null=True,
         blank=True, on_delete=SET_NULL) + migrazione
         Aggiornare views.py per usare FK invece di email matching         → risolve M10
[ ] 3.2  Creare corsi/context_processors.py con site_config()
         che espone SITE_NAME, EMAIL_DOMAIN da settings
         Aggiungere a TEMPLATES context_processors in settings.py
         Aggiornare dashboard.html per usare {{ site_name }}, {{ email_domain }} → risolve D10,D3
[ ] 3.3  storage.js: ridurre i dati salvati in localStorage —
         rimuovere nome/cognome/reparto, tenere solo id, ruolo, email       → risolve M16
[ ] 3.4  settings.py: aggiungere STATIC_ROOT = BASE_DIR / 'staticfiles'
         per `python manage.py collectstatic` in produzione
[ ] 3.5  admin.py: aggiungere action personalizzata "Segna come completato"
         su AssegnazioneCorsoAdmin
[ ] 3.6  admin.py: aggiungere action "Esporta CSV" su
         DipendenteAdmin e AssegnazioneCorsoAdmin
```

---

## Verifica Post-Modifiche

Eseguire in ordine dopo ogni fase:

```bash
# Verifica configurazione Django per produzione
python manage.py check --deploy

# Applica migrazioni
python manage.py migrate

# Esegui test suite
python manage.py test gestionale

# Seed dati demo
python manage.py seed_demo

# Avvia server e verifica manuale
python manage.py runserver
```

**Checklist manuale:**
- [ ] Login con admin e con utente normale funziona
- [ ] CRUD corsi (crea, modifica, elimina) — solo admin
- [ ] Upload certificato PDF e DOCX — verifica reject di altri formati
- [ ] Export Excel — verifica contenuto colonne
- [ ] Import Excel — verifica gestione email duplicata e malformata
- [ ] Django admin: lista assegnazioni mostra `data_completamento`
- [ ] `data_scadenza` si aggiorna correttamente modificando `data_completamento`
- [ ] Accesso a `/` senza login → redirect a login (non mostra la SPA)
- [ ] `python manage.py check --deploy` → zero warning

---

## Note Architetturali

| Contesto | Stato attuale | Raccomandazione |
|---------|--------------|-----------------|
| **Database** | SQLite — adeguato per <30 utenti concorrenti | Migrare a PostgreSQL per produzione multi-utente (`psycopg2-binary`) |
| **Server** | `runserver` Django — solo sviluppo | Usare `gunicorn` + Nginx in produzione |
| **Frontend JS** | Vanilla JS SPA — funzionale ma non type-safe | Per evoluzioni future: HTMX + Alpine.js (leggero) o Vue.js |
| **Autenticazione** | Session-based Django — corretto | Adeguato per uso interno; per API esterna valutare JWT (djangorestframework-simplejwt) |
| **File certificati** | Serviti da Django in dev | In produzione servire da Nginx o object storage (S3/Azure Blob) |
| **Deployment readiness** | ⚠️ Solo interno post Fase 0 | Internet-facing solo dopo Fase 0 + Fase 1 complete |
