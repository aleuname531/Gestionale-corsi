# Gestione Formazione Django

Applicazione web sviluppata con Django per la gestione di corsi aziendali, dipendenti, assegnazioni e scadenze formative.

## Descrizione del progetto

Questo progetto è un esempio personale di sistema di gestione della formazione interna. L'applicazione permette di:

- gestire corsi e vendor/fornitori
- registrare dipendenti e reparti aziendali
- assegnare corsi a persone specifiche
- monitorare lo stato dei corsi (`da_iniziare`, `in_corso`, `completato`, `scaduto`)
- caricare certificati e materiali didattici
- esportare dati in Excel
- gestire accessi distinti tra admin e dipendenti

Il progetto è pensato come portfolio/demo personale e non contiene dati reali di persone o aziende.

## Funzionalità

### Admin / staff

- dashboard con riepilogo generale
- creazione, modifica ed eliminazione di corsi
- gestione vendor e catalogo corsi
- gestione dipendenti
- assegnazione corsi ai dipendenti
- controllo di date di inizio, scadenza e completamento
- upload di certificati e materiali
- filtraggio e consultazione delle liste principali
- export in Excel

### Dipendenti

- accesso al proprio profilo
- visualizzazione dei corsi assegnati
- controllo dello stato del corso
- verifica delle scadenze
- caricamento del certificato richiesto
- accesso solo ai propri dati

## Tecnologie utilizzate

- Python 3
- Django 6
- SQLite per sviluppo locale
- Django templates
- openpyxl per export Excel
- django-ratelimit per protezione del login
- python-dateutil per gestione date e scadenze

## Struttura del progetto

```text
gestionalevero/
├── README.md
├── requirements.txt
├── manage.py
├── db.sqlite3
├── .gitignore
├── .env.example
├── corsi/
│   ├── settings.py
│   ├── urls.py
│   └── ...
├── gestionale/
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   ├── management/
│   ├── templates/
│   └── static/
└── media/
```

## Requisiti

- Python 3.12+
- pip
- virtual environment (consigliato)

## Installazione

1. Clona il repository.
2. Crea un ambiente virtuale:

```bash
python -m venv .venv
```

3. Attiva l'ambiente virtuale:

- Windows:

```powershell
.venv\Scripts\Activate.ps1
```

- Linux/macOS:

```bash
source .venv/bin/activate
```

4. Installa le dipendenze:

```bash
pip install -r requirements.txt
```

5. Crea un file `.env` partendo da `.env.example`:

```bash
copy .env.example .env
```

oppure su Linux/macOS:

```bash
cp .env.example .env
```

6. Esegui le migrazioni:

```bash
python manage.py migrate
```

7. Popola il database con dati demo:

```bash
python manage.py seed_demo
```

8. Avvia il server:

```bash
python manage.py runserver
```

9. Apri il progetto nel browser:

```text
http://127.0.0.1:8000/
```

## Credenziali demo

Il comando `seed_demo` crea utenti di esempio.

### Admin

- email: `admin@demo.local`
- password: `admin123`

### Dipendenti

Sono presenti utenti demo con email fittizie e password generate automaticamente durante il seed. Le credenziali vengono mostrate nella console del terminale.

## Screenshot dell'app

Di seguito sono previsti screenshot della dashboard, della lista corsi e della pagina di login. Aggiungerli in questa sezione prima del publish finale del repository.

- Login page: da aggiungere
- Dashboard: da aggiungere
- Gestione corsi: da aggiungere
- Dettaglio dipendente: da aggiungere

## Modelli principali

### Corso

- titolo
- descrizione
- vendor
- tipologia
- durata in ore
- validità in mesi
- obbligatorietà
- link esterno

### Dipendente

- nome e cognome
- email
- reparto
- stato attivo
- stipendio (se presente)

### AssegnazioneCorso

- data assegnazione
- data inizio pianificata
- data fine pianificata
- data completamento
- data scadenza
- stato
- eventuale certificato allegato

## Export e API

Il progetto include:

- export Excel dei dati
- endpoint API per la creazione di corsi e assegnazioni
- upload certificato tramite API
- login API

## Note importanti

- Il database di default è SQLite (`db.sqlite3`), adatto allo sviluppo locale.
- Prima del publish su GitHub, non includere file `.env` né dati reali.
- Le immagini e i file caricati vengono salvati sotto `media/`.
- Il progetto è da intendersi come demo/progetto personale e non come applicazione ufficiale di un'azienda o di un cliente.

## Avviso su proprietà e pubblicazione

Prima di rendere pubblico il repository, verificare che il codice non sia stato sviluppato per un cliente, una azienda o un corso con restrizioni di proprietà/intellectual property. Se il progetto è stato creato in autonomia, può essere pubblicato come portfolio personale.

## Possibili sviluppi futuri

- notifica email per scadenze corsi
- dashboard analytics avanzata
- integrazione con sistemi HR/SSO
- miglioramento della reportistica
- migrazione su database PostgreSQL in produzione

## Contesto

Questo progetto è una demo personale dedicata alla gestione della formazione interna, con focus su corsi, certificazioni e monitoraggio delle scadenze formative.
