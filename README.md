# 📚 Courses — Portale Gestione Formazione Aziendale

> **Beta80 Group** · Gestione corsi e certificazioni del personale

---

## Panoramica del Progetto

**Courses** è un portale web interno per la gestione della formazione aziendale di Beta80 Group.  
Permette all'azienda di monitorare le certificazioni, i corsi assegnati e i progressi formativi di ogni dipendente, con un'interfaccia dedicata sia per gli amministratori che per i singoli dipendenti.

---

## Struttura del Repository

```
Courses/
├── README.md                  ← Questo file
├── manage.py                  ← Comandi Django
├── corsi/                     ← Configurazione progetto Django
├── gestionale/                ← App principale: models, views, urls, admin, static, templates
├── db.sqlite3                 ← Database locale SQLite
└── requirements.txt           ← Dipendenze Python
```

---

## Funzionalità Principali

### Ruolo Admin
- Visualizza tutti i dipendenti e i loro corsi assegnati
- Crea, modifica ed elimina corsi
- Assegna corsi ai dipendenti
- Monitora lo stato di ogni corso (Da iniziare / In corso / Completato)
- Vede i corsi in scadenza e quelli con validità scaduta
- Gestisce i materiali PDF allegati a ogni corso
- Esporta reportistica

### Ruolo Dipendente
- Accede alla propria area personale
- Visualizza i corsi assegnati, in corso e completati
- Scarica i materiali didattici (PDF, link)
- Vede le scadenze dei propri corsi
- Riceve suggerimenti sui corsi consigliati

---

## Accesso al Sistema

| Ruolo      | Credenziali di default                         |
|------------|------------------------------------------------|
| Admin      | Utente Django con `is_staff=True`              |
| Dipendente | Utente Django attivo con email aziendale       |

> ⚠️ Creare gli utenti da Django Admin o da shell prima dell'accesso. Il backend Django è la fonte principale dei dati; `localStorage` viene usato solo come cache del browser.

---

## Struttura Dati — Colonne Registro Corsi (Excel)

Il file Excel di riferimento segue questo schema colonnare:

| Colonna              | Tipo      | Descrizione                                                  |
|----------------------|-----------|--------------------------------------------------------------|
| **Cognome**          | Testo     | Cognome del dipendente                                       |
| **Nome**             | Testo     | Nome del dipendente                                          |
| **Area RPA**         | Numero    | Numero identificativo area / team RPA                        |
| **Vendor**           | Testo     | Fornitore del corso (es. UiPath, Microsoft, Coursera…)       |
| **Corso**            | Testo     | Nome completo del corso o certificazione                     |
| **Tipologia corso**  | Testo     | Categoria (es. Tecnico, Soft Skills, Compliance, Sicurezza…) |
| **STATO**            | Enum      | `completato` · `in corso` · `da iniziare`                    |
| **Validità**         | Testo     | Stato di validità del certificato (es. `valido`, `scaduto`)  |
| **Anno conseguimento** | Anno    | Anno in cui il corso è stato completato/certificato          |
| **ck**               | Flag/Note | Colonna di check o annotazioni manuali                       |

---

## Tecnologie Utilizzate

| Layer     | Tecnologia              |
|-----------|-------------------------|
| Frontend  | HTML5, CSS3, JavaScript (ES6+) |
| Backend   | Django + SQLite |
| Cache     | `localStorage` (browser) |
| UI Design | CSS Variables, Flexbox, Grid |
| File      | Upload certificati PDF/DOCX tramite Django `request.FILES` |

---

## Come Avviare il Portale

1. Creare/attivare un virtualenv e installare le dipendenze: `pip install -r requirements.txt`
2. Applicare le migrazioni: `python manage.py migrate`
3. Creare dati demo: `python manage.py seed_demo`
4. Avviare il server: `python manage.py runserver`
5. Aprire `http://127.0.0.1:8000/` e fare login con un utente Django

I dati vengono salvati tramite API Django; il browser mantiene solo una cache temporanea in `localStorage`.

> 💡 Per un ambiente multi-utente reale si consiglia di completare l'autenticazione server-side e migrare il database su PostgreSQL.

---

## Gestione degli Stati Corso

```
Da iniziare  →  In corso  →  Completato
     │               │             │
  Assegnato      Frequenza      Certificato
  non avviato    attiva         ottenuto
```

- **Da iniziare**: corso assegnato ma non ancora avviato
- **In corso**: frequenza attiva, materiali in uso
- **Completato**: esame/certificato ottenuto, anno registrato

---

## Roadmap Futura

- [x] Integrazione backend (API REST)
- [ ] Database persistente (PostgreSQL / SQLite)
- [ ] Notifiche email automatiche per scadenze
- [ ] Dashboard analytics con grafici
- [ ] Import/export da/verso Excel
- [ ] Autenticazione SSO aziendale (Azure AD)
- [ ] App mobile (Progressive Web App)

---

## Contatti

**Beta80 Group** — Team IT / HR  
📧 Emanuela.Gjinaj@beta80group.it

---

*Ultimo aggiornamento: Maggio 2026*
