const DEMO_USERS = [
  {id:'u1',nome:'Admin',cognome:'Beta80',email:'admin@beta80group.it',role:'admin',area:'IT'},
  {id:'u2',nome:'Mario',cognome:'Rossi',email:'rossi.mario@beta80group.it',role:'dipendente',area:'RPA'},
  {id:'u3',nome:'Elisabetta',cognome:'Cangini',email:'cangini.elisabetta@beta80group.it',role:'dipendente',area:'RPA'},
  {id:'u4',nome:'Giulia',cognome:'Ferrari',email:'ferrari.giulia@beta80group.it',role:'dipendente',area:'RPA'},
  {id:'u5',nome:'Luca',cognome:'Bianchi',email:'bianchi.luca@beta80group.it',role:'dipendente',area:'PM'},
  {id:'u6',nome:'Sara',cognome:'Moretti',email:'moretti.sara@beta80group.it',role:'dipendente',area:'RPA'},
];

const DEMO_COURSES = [
  {id:'c1',titolo:'RPA Developer Foundation (v2021.10)',vendor:'UiPath',tipologia:'Tecnico',
   descrizione:'Corso base per sviluppatori RPA su piattaforma UiPath. Copre automazione processi, Studio, Orchestrator.',
   colore:'blue',linkCorso:'https://www.uipath.com/learning/rpa-courses',
   materiali:[{id:'m1',nome:'Guida UiPath Studio',tipo:'pdf',url:'#',data:'2024-01-10'},
   {id:'m2',nome:'Documentazione ufficiale',tipo:'link',url:'https://docs.uipath.com',data:'2024-01-10'}],
   createdAt:'2024-01-01'},
  {id:'c2',titolo:'Advanced RPA Developer Certification',vendor:'UiPath',tipologia:'Tecnico',
   descrizione:'Certificazione avanzata per sviluppatori RPA esperti. Automazioni complesse, ReFramework.',
   colore:'purple',linkCorso:'https://www.uipath.com/learning/certification',
   materiali:[{id:'m3',nome:'ReFramework Template',tipo:'pdf',url:'#',data:'2024-02-01'}],
   createdAt:'2024-01-15'},
  {id:'c3',titolo:'Project Management Professional (PMP)',vendor:'PMI',tipologia:'Management',
   descrizione:'Certificazione internazionale di project management. Copre metodologie agile e waterfall.',
   colore:'green',linkCorso:'https://www.pmi.org/certifications/project-management-pmp',
   materiali:[],createdAt:'2024-02-01'},
  {id:'c4',titolo:'Microsoft Azure Fundamentals (AZ-900)',vendor:'Microsoft',tipologia:'Cloud',
   descrizione:'Fondamentali di cloud computing e servizi Azure. Ideale come base per percorsi cloud.',
   colore:'blue',linkCorso:'https://learn.microsoft.com/it-it/certifications/azure-fundamentals/',
   materiali:[{id:'m4',nome:'Study Guide AZ-900',tipo:'pdf',url:'#',data:'2024-03-01'}],
   createdAt:'2024-02-15'},
  {id:'c5',titolo:'Sicurezza Informatica — Base',vendor:'Interno',tipologia:'Compliance',
   descrizione:'Corso obbligatorio su sicurezza IT, phishing, gestione password, GDPR.',
   colore:'red',linkCorso:'',materiali:[],createdAt:'2024-03-01'},
  {id:'c6',titolo:'Power BI Desktop Fundamentals',vendor:'Microsoft',tipologia:'Analytics',
   descrizione:'Creazione di report e dashboard interattivi con Power BI. Connessioni dati, DAX base.',
   colore:'yellow',linkCorso:'https://learn.microsoft.com/it-it/power-bi/',
   materiali:[{id:'m5',nome:'Dataset esercizi',tipo:'pdf',url:'#',data:'2024-04-01'}],
   createdAt:'2024-03-15'},
  {id:'c7',titolo:'Leadership e Management per Team Leader',vendor:'LinkedIn Learning',tipologia:'Soft Skills',
   descrizione:'Sviluppa le competenze di leadership, gestione del team e comunicazione efficace con i percorsi formativi di LinkedIn Learning.',
   colore:'blue',linkCorso:'https://www.linkedin.com/learning',
   materiali:[],createdAt:'2024-04-01'},
  {id:'c8',titolo:'Python Bootcamp: da Zero a Esperto',vendor:'Udemy',tipologia:'Tecnico',
   descrizione:'Corso completo di Python per principianti ed esperti. Copre sintassi base, OOP, automazione, API e progetti pratici.',
   colore:'purple',linkCorso:'https://www.udemy.com/',
   materiali:[],createdAt:'2024-04-15'},
];

const DEMO_ENROLLMENTS = [
  {id:'e1',userId:'u3',courseId:'c1',stato:'completato',annoConseguimento:2023,validita:'valido',ck:'',note:'',dataScadenza:'2026-01-01',dataInizio:'2023-01-10',dataFine:'2023-03-15',certificato:null},
  {id:'e2',userId:'u3',courseId:'c2',stato:'completato',annoConseguimento:2024,validita:'valido',ck:'',note:'',dataScadenza:'2027-01-01',dataInizio:'2024-02-01',dataFine:'2024-05-30',certificato:null},
  {id:'e3',userId:'u2',courseId:'c1',stato:'completato',annoConseguimento:2023,validita:'valido',ck:'✓',note:'',dataScadenza:'2026-01-01',dataInizio:'2023-03-01',dataFine:'2023-06-01',certificato:null},
  {id:'e4',userId:'u2',courseId:'c4',stato:'in_corso',annoConseguimento:null,validita:'',ck:'',note:'In preparazione esame',dataScadenza:'2025-06-30',dataInizio:'2025-01-15',dataFine:'2025-06-30',certificato:null},
  {id:'e5',userId:'u4',courseId:'c1',stato:'completato',annoConseguimento:2024,validita:'valido',ck:'',note:'',dataScadenza:'2027-01-01',dataInizio:'2024-01-10',dataFine:'2024-04-20',certificato:null},
  {id:'e6',userId:'u4',courseId:'c5',stato:'da_iniziare',annoConseguimento:null,validita:'',ck:'',note:'',dataScadenza:'2025-08-01',dataInizio:'2025-07-01',dataFine:'2025-08-01',certificato:null},
  {id:'e7',userId:'u5',courseId:'c3',stato:'in_corso',annoConseguimento:null,validita:'',ck:'',note:'Esame previsto Q3',dataScadenza:'2025-09-01',dataInizio:'2025-03-01',dataFine:'2025-09-01',certificato:null},
  {id:'e8',userId:'u5',courseId:'c6',stato:'da_iniziare',annoConseguimento:null,validita:'',ck:'',note:'',dataScadenza:'2025-12-31',dataInizio:'2025-10-01',dataFine:'2025-12-31',certificato:null},
  {id:'e9',userId:'u6',courseId:'c1',stato:'completato',annoConseguimento:2023,validita:'scaduto',ck:'',note:'Da rinnovare',dataScadenza:'2024-01-01',dataInizio:'2023-01-01',dataFine:'2023-04-01',certificato:null},
  {id:'e10',userId:'u6',courseId:'c5',stato:'completato',annoConseguimento:2024,validita:'valido',ck:'',note:'',dataScadenza:'2026-06-01',dataInizio:'2024-05-01',dataFine:'2024-06-01',certificato:null},
  {id:'e11',userId:'u2',courseId:'c5',stato:'completato',annoConseguimento:2024,validita:'valido',ck:'',note:'',dataScadenza:'2026-06-01',dataInizio:'2024-04-15',dataFine:'2024-06-01',certificato:null},
];

// ═══════════════════════════════════════════════════════════════
//  APP INIT
// ═══════════════════════════════════════════════════════════════
DB.init();

function startApp(){
  document.getElementById('login-page').style.display='none';
  document.getElementById('app').style.display='block';
  // Sidebar user info
  const isAdmin = currentUser.role==='admin';
  document.getElementById('sb-avatar').textContent = currentUser.nome[0]+currentUser.cognome[0];
  document.getElementById('sb-avatar').className = 'avatar avatar-'+(isAdmin?'admin':'dipendente');
  document.getElementById('sb-name').textContent = currentUser.nome+' '+currentUser.cognome;
  document.getElementById('sb-role').textContent = isAdmin ? '👑 Amministratore' : '👤 Dipendente';
  buildNav();
  navigate('dashboard');
}

(async()=>{
  if(await checkSession()){await loadFromServer();startApp();}
  else document.getElementById('login-page').style.display='flex';
})();

// ═══════════════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════════════
const ADMIN_MENU = [
  {section:'Principale'},
  {id:'dashboard',label:'Dashboard',icon:'🏠'},
  {id:'courses',label:'Catalogo Corsi',icon:'📚'},
  {section:'Gestione'},
  {id:'enrollments',label:'Iscrizioni',icon:'📋'},
  {id:'users',label:'Dipendenti',icon:'👥'},
  {section:'Report'},
  {id:'expiring',label:'Scadenze',icon:'⏰'},
];
const USER_MENU = [
  {section:'La mia Area'},
  {id:'dashboard',label:'Dashboard Personale',icon:'🏠'},
  {id:'my-courses',label:'I Miei Corsi',icon:'📚'},
  {section:'Esplora'},
  {id:'courses',label:'Catalogo Corsi',icon:'🔍'},
];

function buildNav(){
  const menu = currentUser.role==='admin' ? ADMIN_MENU : USER_MENU;
  const nav = document.getElementById('nav-menu');
  nav.innerHTML = menu.map(m=>{
    if(m.section) return `<div class="nav-section">${m.section}</div>`;
    return `<div class="nav-item" id="nav-${m.id}" onclick="navigate('${m.id}')">${m.icon} ${m.label}</div>`;
  }).join('');
}

function setActive(page){
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('nav-'+page);
  if(el) el.classList.add('active');
}

function navigate(page, params={}){
  setActive(page);
  const titles = {dashboard:'Dashboard',courses:'Catalogo Corsi','my-courses':'I Miei Corsi',
    enrollments:'Gestione Iscrizioni',users:'Dipendenti',expiring:'Corsi in Scadenza',
    'course-detail':'Dettaglio Corso'};
  document.getElementById('topbar-title').textContent = titles[page]||'Portale Formazione';
  document.getElementById('topbar-right').innerHTML='';
  const pages = {
    dashboard: currentUser.role==='admin' ? renderAdminDashboard : renderUserDashboard,
    courses: renderCourses,
    'my-courses': renderMyCourses,
    enrollments: renderEnrollments,
    users: renderUsers,
    expiring: renderExpiring,
    'course-detail': ()=>renderCourseDetail(params.id),
  };
  const fn = pages[page];
  if(fn) document.getElementById('page-content').innerHTML = fn();
  postRender(page, params);
}

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
function uid(){ return 'x'+Math.random().toString(36).substr(2,9); }

function statoBadge(s){
  const m={completato:'badge-success',in_corso:'badge-info',da_iniziare:'badge-warning'};
  const l={completato:'✅ Completato',in_corso:'🔵 In Corso',da_iniziare:'⏳ Da Iniziare'};
  return `<span class="badge ${m[s]||'badge-secondary'}">${l[s]||s}</span>`;
}
function validitaBadge(v){
  if(!v) return '';
  return v==='valido'
    ? `<span class="badge badge-success">✓ Valido</span>`
    : `<span class="badge badge-danger">✗ Scaduto</span>`;
}
function colori(){return ['blue','green','yellow','purple','red'];}
function getCourse(id){ return (DB.get('courses')||[]).find(c=>c.id===id); }
function getUser(id){ return (DB.get('users')||[]).find(u=>u.id===id); }
function getEnrollmentsByUser(uid){ return (DB.get('enrollments')||[]).filter(e=>e.userId===uid); }
function getEnrollmentsByCourse(cid){ return (DB.get('enrollments')||[]).filter(e=>e.courseId===cid); }
function getUserEnrollment(uid,cid){ return (DB.get('enrollments')||[]).find(e=>e.userId===uid&&e.courseId===cid); }

function isExpiringSoon(dateStr){
  if(!dateStr) return false;
  const d=new Date(dateStr), now=new Date();
  const diff=(d-now)/(1000*3600*24);
  return diff>0 && diff<=90;
}
function isExpired(dateStr){
  if(!dateStr) return false;
  return new Date(dateStr)<new Date();
}
function formatDate(d){ if(!d)return '—'; return new Date(d).toLocaleDateString('it-IT'); }

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
function toast(msg, type='info'){
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  const icons={success:'✅',error:'❌',info:'ℹ️'};
  t.innerHTML=`${icons[type]||'ℹ️'} ${msg}`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(()=>{ t.style.animation='fadeOut .3s ease forwards'; setTimeout(()=>t.remove(),300); },3000);
}

// ═══════════════════════════════════════════════════════════════
//  MODAL
// ═══════════════════════════════════════════════════════════════
function openModal(title, body, footer=''){
  document.getElementById('modal-title').textContent=title;
  document.getElementById('modal-body').innerHTML=body;
  document.getElementById('modal-footer').innerHTML=footer;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e){
  if(e && e.target!==document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
function renderAdminDashboard(){
  const courses = DB.get('courses')||[];
  const users = (DB.get('users')||[]).filter(u=>u.role==='dipendente');
  const enrollments = DB.get('enrollments')||[];
  const completati = enrollments.filter(e=>e.stato==='completato').length;
  const inCorso = enrollments.filter(e=>e.stato==='in_corso').length;
  const daIniziare = enrollments.filter(e=>e.stato==='da_iniziare').length;
  const scaduti = enrollments.filter(e=>e.validita==='scaduto').length;
  const scadenze = enrollments.filter(e=>isExpiringSoon(e.dataScadenza)).length;

  // Last enrollments
  const lastEnr = [...enrollments].reverse().slice(0,8);

  return `
  <div class="stats-grid">
    <div class="stat-card" onclick="navigate('courses')" style="cursor:pointer">
      <div class="stat-icon blue">📚</div>
      <div><div class="stat-num">${courses.length}</div><div class="stat-label">Corsi nel Catalogo</div></div>
    </div>
    <div class="stat-card" onclick="navigate('users')" style="cursor:pointer">
      <div class="stat-icon green">👥</div>
      <div><div class="stat-num">${users.length}</div><div class="stat-label">Dipendenti Attivi</div></div>
    </div>
    <div class="stat-card" onclick="navigate('enrollments')" style="cursor:pointer">
      <div class="stat-icon yellow">📋</div>
      <div><div class="stat-num">${enrollments.length}</div><div class="stat-label">Iscrizioni Totali</div></div>
    </div>
    <div class="stat-card" onclick="navigate('expiring')" style="cursor:pointer">
      <div class="stat-icon red">⏰</div>
      <div><div class="stat-num">${scadenze}</div><div class="stat-label">In Scadenza (90gg)</div></div>
    </div>
  </div>

  <div class="two-col" style="margin-bottom:20px">
    <div class="card">
      <div class="card-header"><div class="card-title">📊 Stato Iscrizioni</div></div>
      <div class="card-body">
        <div style="display:flex;gap:12px;margin-bottom:16px">
          <div style="flex:1;background:#f0fdf4;border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:var(--success)">${completati}</div>
            <div style="font-size:12px;color:var(--text-muted)">Completati</div>
          </div>
          <div style="flex:1;background:#e0f2fe;border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:var(--info)">${inCorso}</div>
            <div style="font-size:12px;color:var(--text-muted)">In Corso</div>
          </div>
          <div style="flex:1;background:#fffbeb;border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:var(--warning)">${daIniziare}</div>
            <div style="font-size:12px;color:var(--text-muted)">Da Iniziare</div>
          </div>
          <div style="flex:1;background:#fef2f2;border-radius:8px;padding:14px;text-align:center">
            <div style="font-size:24px;font-weight:800;color:var(--danger)">${scaduti}</div>
            <div style="font-size:12px;color:var(--text-muted)">Scaduti</div>
          </div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${enrollments.length?Math.round(completati/enrollments.length*100):0}%;background:var(--success)"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:6px">
          Tasso completamento: <strong>${enrollments.length?Math.round(completati/enrollments.length*100):0}%</strong>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🏆 Corsi Più Seguiti</div></div>
      <div class="card-body">
        ${courses.map(c=>{
          const cnt=enrollments.filter(e=>e.courseId===c.id).length;
          return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
            <div style="font-size:13px;flex:1;font-weight:500">${c.titolo.length>30?c.titolo.substring(0,30)+'…':c.titolo}</div>
            <div style="font-size:12px;color:var(--text-muted);width:20px;text-align:right">${cnt}</div>
            <div style="width:80px"><div class="progress-bar"><div class="progress-fill" style="width:${enrollments.length?cnt/users.length*100:0}%;background:var(--primary-light)"></div></div></div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title">📋 Ultime Iscrizioni / Attività</div>
      <button class="btn btn-outline btn-sm" onclick="navigate('enrollments')">Vedi tutte</button>
    </div>
    <table>
      <thead><tr><th>Dipendente</th><th>Corso</th><th>Stato</th><th>Anno</th><th>Validità</th></tr></thead>
      <tbody>
        ${lastEnr.map(e=>{
          const u=getUser(e.userId), c=getCourse(e.courseId);
          if(!u||!c) return '';
          return `<tr><td><strong>${u.cognome} ${u.nome}</strong><br><span style="font-size:11px;color:var(--text-muted)">${u.area}</span></td>
            <td style="max-width:200px">${c.titolo.length>40?c.titolo.substring(0,40)+'…':c.titolo}</td>
            <td>${statoBadge(e.stato)}</td>
            <td>${e.annoConseguimento||'—'}</td>
            <td>${validitaBadge(e.validita)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  USER DASHBOARD
// ═══════════════════════════════════════════════════════════════
function renderUserDashboard(){
  const enrs = getEnrollmentsByUser(currentUser.id);
  const courses = DB.get('courses')||[];
  const completati=enrs.filter(e=>e.stato==='completato');
  const inCorso=enrs.filter(e=>e.stato==='in_corso');
  const daIniziare=enrs.filter(e=>e.stato==='da_iniziare');
  const scadenze=enrs.filter(e=>isExpiringSoon(e.dataScadenza));

  return `
  <div style="margin-bottom:20px">
    <h2 style="font-size:20px;font-weight:800">Benvenuto/a, ${currentUser.nome}! 👋</h2>
    <p style="color:var(--text-muted);margin-top:4px">Ecco il riepilogo del tuo percorso formativo.</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card" onclick="navigate('my-courses')" style="cursor:pointer"><div class="stat-icon green">✅</div>
      <div><div class="stat-num">${completati.length}</div><div class="stat-label">Completati</div></div></div>
    <div class="stat-card" onclick="navigate('my-courses')" style="cursor:pointer"><div class="stat-icon blue">🔵</div>
      <div><div class="stat-num">${inCorso.length}</div><div class="stat-label">In Corso</div></div></div>
    <div class="stat-card" onclick="navigate('my-courses')" style="cursor:pointer"><div class="stat-icon yellow">⏳</div>
      <div><div class="stat-num">${daIniziare.length}</div><div class="stat-label">Da Iniziare</div></div></div>
    <div class="stat-card" onclick="navigate('my-courses')" style="cursor:pointer"><div class="stat-icon red">⏰</div>
      <div><div class="stat-num">${scadenze.length}</div><div class="stat-label">In Scadenza</div></div></div>
  </div>

  ${inCorso.length ? `
  <div class="card" style="margin-bottom:20px">
    <div class="card-header"><div class="card-title">🔵 Corsi In Corso</div></div>
    <div class="card-body" style="padding:0">
      ${inCorso.map(e=>{
        const c=getCourse(e.courseId); if(!c) return '';
        return `<div style="display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${c.titolo}</div>
            <div style="font-size:12px;color:var(--text-muted)">${c.vendor} · ${c.tipologia}</div>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">Scadenza: ${formatDate(e.dataScadenza)}</div>
          <button class="btn btn-outline btn-sm" onclick="navigate('course-detail',{id:'${c.id}'})">Vedi</button>
        </div>`;
      }).join('')}
    </div>
  </div>` : ''}

  ${scadenze.length ? `
  <div class="card" style="margin-bottom:20px;border:1.5px solid #fef08a">
    <div class="card-header" style="background:#fffbeb">
      <div class="card-title">⏰ Corsi in Scadenza (entro 90 giorni)</div>
    </div>
    <div class="card-body" style="padding:0">
      ${scadenze.map(e=>{
        const c=getCourse(e.courseId); if(!c) return '';
        const days=Math.ceil((new Date(e.dataScadenza)-new Date())/(1000*3600*24));
        return `<div style="display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid var(--border)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${c.titolo}</div>
            <div style="font-size:12px;color:var(--text-muted)">${c.vendor}</div>
          </div>
          <span class="badge badge-warning">⚠️ ${days} giorni</span>
        </div>`;
      }).join('')}
    </div>
  </div>` : ''}

  <div class="card">
    <div class="card-header">
      <div class="card-title">✅ Certificazioni Ottenute</div>
      <button class="btn btn-outline btn-sm" onclick="navigate('my-courses')">Vedi tutti</button>
    </div>
    <table>
      <thead><tr><th>Corso</th><th>Vendor</th><th>Anno</th><th>Validità</th></tr></thead>
      <tbody>
        ${completati.length ? completati.map(e=>{
          const c=getCourse(e.courseId); if(!c) return '';
          return `<tr onclick="navigate('course-detail',{id:'${c.id}'})" style="cursor:pointer">
            <td><strong>${c.titolo}</strong></td>
            <td>${c.vendor}</td>
            <td>${e.annoConseguimento||'—'}</td>
            <td>${validitaBadge(e.validita)||'—'}</td></tr>`;
        }).join('') : `<tr><td colspan="4" class="empty-state" style="padding:30px;text-align:center;color:var(--text-muted)">Nessuna certificazione completata</td></tr>`}
      </tbody>
    </table>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  CATALOGO CORSI
// ═══════════════════════════════════════════════════════════════
function renderCourses(){
  const courses = DB.get('courses')||[];
  const isAdmin = currentUser.role==='admin';
  const tipologie=[...new Set(courses.map(c=>c.tipologia))];
  const vendors=[...new Set(courses.map(c=>c.vendor))];

  setTimeout(()=>{ filterCourses(); }, 10);

  return `
  <div class="page-header">
    <div><h1>Catalogo Corsi</h1><p>${courses.length} corsi disponibili</p></div>
    ${isAdmin?`<button class="btn btn-primary" onclick="openCourseForm()">＋ Nuovo Corso</button>`:''}
  </div>
  <div class="filter-bar">
    <div class="search-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/></svg>
      <input class="search-input" id="search-input" placeholder="Cerca corso…" oninput="filterCourses()">
    </div>
    <select class="filter-select" id="filter-tipologia" onchange="filterCourses()">
      <option value="">Tutte le tipologie</option>
      ${tipologie.map(t=>`<option value="${t}">${t}</option>`).join('')}
    </select>
    <select class="filter-select" id="filter-vendor" onchange="filterCourses()">
      <option value="">Tutti i vendor</option>
      ${vendors.map(v=>`<option value="${v}">${v}</option>`).join('')}
    </select>
  </div>
  <div id="courses-grid" class="courses-grid"></div>`;
}

function filterCourses(){
  const q=(document.getElementById('search-input')||{}).value?.toLowerCase()||'';
  const tip=(document.getElementById('filter-tipologia')||{}).value||'';
  const vnd=(document.getElementById('filter-vendor')||{}).value||'';
  const courses=DB.get('courses')||[];
  const filtered=courses.filter(c=>{
    const inTitle=c.titolo.toLowerCase().includes(q)||c.vendor.toLowerCase().includes(q)||c.tipologia.toLowerCase().includes(q);
    const inTip=!tip||c.tipologia===tip;
    const inVnd=!vnd||c.vendor===vnd;
    return inTitle&&inTip&&inVnd;
  });
  const enrs=getEnrollmentsByUser(currentUser.id);
  const isAdmin=currentUser.role==='admin';
  const grid=document.getElementById('courses-grid');
  if(!grid) return;
  if(!filtered.length){
    grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>Nessun corso trovato</h3><p>Prova con altri filtri.</p></div>`;
    return;
  }
  grid.innerHTML=filtered.map(c=>{
    const enr=enrs.find(e=>e.courseId===c.id);
    const enrolled=!!enr;
    return `<div class="course-card" onclick="navigate('course-detail',{id:'${c.id}'})">
      <div class="course-card-top ${c.colore||'blue'}"></div>
      <div class="course-card-body">
        <div class="course-vendor">${c.vendor}</div>
        <div class="course-title">${c.titolo}</div>
        <div class="course-meta">
          <span class="badge badge-secondary">${c.tipologia}</span>
          ${enrolled?statoBadge(enr.stato):''}
        </div>
        <div style="font-size:12px;color:var(--text-muted);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${c.descrizione}</div>
      </div>
      <div class="course-footer">
        <span style="font-size:12px;color:var(--text-muted)">📎 ${c.materiali?.length||0} materiali</span>
        ${isAdmin
          ? `<div style="display:flex;gap:6px" onclick="event.stopPropagation()">
              <button class="btn btn-outline btn-sm" onclick="openCourseForm('${c.id}')">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCourse('${c.id}')">🗑️</button>
             </div>`
          : enrolled
            ? `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();navigate('course-detail',{id:'${c.id}'})">Dettaglio →</button>`
            : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();enrollInCourse('${c.id}')">+ Iscriviti</button>`
        }
      </div>
    </div>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  MY COURSES (DIPENDENTE)
// ═══════════════════════════════════════════════════════════════
function renderMyCourses(){
  const enrs=getEnrollmentsByUser(currentUser.id);
  const all=DB.get('courses')||[];

  const renderGroup=(title, list, icon)=>{
    if(!list.length) return '';
    return `<div style="margin-bottom:24px">
      <div class="section-title">${icon} ${title} <span class="tag">${list.length}</span></div>
      <table class="card"><thead><tr><th>Corso</th><th>Vendor</th><th>Tipologia</th><th>Anno</th><th>Validità</th><th>Scadenza</th><th></th></tr></thead>
      <tbody>${list.map(e=>{
        const c=getCourse(e.courseId); if(!c) return '';
        return `<tr>
          <td><strong>${c.titolo}</strong></td>
          <td>${c.vendor}</td>
          <td><span class="badge badge-secondary">${c.tipologia}</span></td>
          <td>${e.annoConseguimento||'—'}</td>
          <td>${validitaBadge(e.validita)||'—'}</td>
          <td>${isExpiringSoon(e.dataScadenza)?`<span style="color:var(--warning);font-weight:600">${formatDate(e.dataScadenza)}</span>`:formatDate(e.dataScadenza)}</td>
          <td><button class="btn btn-outline btn-sm" onclick="navigate('course-detail',{id:'${c.id}'})">→</button></td>
        </tr>`;
      }).join('')}</tbody></table></div>`;
  };

  const comp=enrs.filter(e=>e.stato==='completato');
  const inc=enrs.filter(e=>e.stato==='in_corso');
  const da=enrs.filter(e=>e.stato==='da_iniziare');

  if(!enrs.length) return `<div class="empty-state"><div class="icon">📚</div><h3>Nessun corso assegnato</h3><p>Visita il catalogo per iscriverti ai corsi disponibili.</p><br><button class="btn btn-primary" onclick="navigate('courses')">Sfoglia Catalogo</button></div>`;

  return `<div class="page-header"><div><h1>I Miei Corsi</h1><p>${enrs.length} corsi totali</p></div></div>
  ${renderGroup('In Corso',inc,'🔵')}
  ${renderGroup('Da Iniziare',da,'⏳')}
  ${renderGroup('Completati',comp,'✅')}`;
}

// ═══════════════════════════════════════════════════════════════
//  COURSE DETAIL
// ═══════════════════════════════════════════════════════════════
function renderCourseDetail(courseId){
  const c=getCourse(courseId);
  if(!c) return `<div class="empty-state"><h3>Corso non trovato</h3></div>`;
  const isAdmin=currentUser.role==='admin';
  const enr=getUserEnrollment(currentUser.id, courseId);
  const allEnrs=getEnrollmentsByCourse(courseId);
  const users=DB.get('users')||[];

  return `
  <div class="back-btn" onclick="navigate('courses')">← Torna al catalogo</div>
  <div class="detail-header">
    <div style="display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap">
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;color:var(--primary);text-transform:uppercase;margin-bottom:6px">${c.vendor}</div>
        <h1>${c.titolo}</h1>
        <div class="detail-meta" style="margin-top:10px">
          <span class="badge badge-secondary">${c.tipologia}</span>
          ${enr?statoBadge(enr.stato):'<span class="badge badge-secondary">Non iscritto</span>'}
          ${enr&&enr.validita?validitaBadge(enr.validita):''}
        </div>
        <p style="color:var(--text-muted);font-size:14px;line-height:1.6">${c.descrizione}</p>
        ${c.linkCorso?`<div style="margin-top:14px">
          <a href="${c.linkCorso}" target="_blank" class="btn btn-primary btn-sm">
            🔗 Vai al Corso &rarr;
          </a>
        </div>`:''}
      </div>
      ${isAdmin?`<div style="display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="openCourseForm('${c.id}')">✏️ Modifica</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCourse('${c.id}')">🗑️ Elimina</button>
      </div>`:''}
    </div>
  </div>

  <div class="detail-grid">
    <div>
      <!-- MATERIALI -->
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div class="card-title">📎 Materiali del Corso</div>
          ${isAdmin?`<button class="btn btn-outline btn-sm" onclick="openUploadMaterial('${c.id}')">＋ Aggiungi</button>`:''}
        </div>
        <div class="card-body">
          ${c.materiali&&c.materiali.length?`<ul class="materials-list">
            ${c.materiali.map(m=>`<li class="material-item">
              <div class="material-icon">${m.tipo==='pdf'?'📄':'🔗'}</div>
              <div style="flex:1">
                <div class="material-name">${m.nome}</div>
                <div class="material-type">${m.tipo.toUpperCase()} · ${formatDate(m.data)}</div>
              </div>
              ${m.tipo==='link'
                ? `<a href="${m.url}" target="_blank" class="btn btn-outline btn-sm">Apri →</a>`
                : `<button class="btn btn-outline btn-sm" onclick="downloadMaterial('${c.id}','${m.id}')">⬇️ Scarica</button>`
              }
              ${isAdmin?`<button class="btn btn-icon" onclick="deleteMaterial('${c.id}','${m.id}')" title="Rimuovi">✕</button>`:''}
            </li>`).join('')}
          </ul>`
          :`<div class="empty-state" style="padding:30px"><div class="icon">📭</div><p>Nessun materiale disponibile</p></div>`}
        </div>
      </div>

      <!-- ISCRIZIONE (dipendente) -->
      ${!isAdmin?`<div class="card">
        <div class="card-header"><div class="card-title">📋 La Mia Iscrizione</div></div>
        <div class="card-body">
          ${enr?`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div style="background:#f8fafc;border-radius:8px;padding:12px">
              <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Stato</div>
              <div style="margin-top:4px">${statoBadge(enr.stato)}</div>
            </div>
            <div style="background:#f8fafc;border-radius:8px;padding:12px">
              <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Anno conseguimento</div>
              <div style="font-size:16px;font-weight:700;margin-top:4px">${enr.annoConseguimento||'—'}</div>
            </div>
            <div style="background:#f8fafc;border-radius:8px;padding:12px">
              <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Validità</div>
              <div style="margin-top:4px">${validitaBadge(enr.validita)||'—'}</div>
            </div>
            <div style="background:#f8fafc;border-radius:8px;padding:12px">
              <div style="font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Scadenza</div>
              <div style="font-size:14px;font-weight:600;margin-top:4px">${formatDate(enr.dataScadenza)}</div>
            </div>
          </div>
          ${enr.dataInizio||enr.dataFine?`<div style="display:flex;gap:8px;margin-bottom:12px">
            ${enr.dataInizio?`<div style="flex:1;background:#f8fafc;border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Inizio pianificato</div><div style="font-size:13px;font-weight:600;margin-top:2px">${formatDate(enr.dataInizio)}</div></div>`:''}
            ${enr.dataFine?`<div style="flex:1;background:#f8fafc;border-radius:8px;padding:10px"><div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase">Fine pianificata</div><div style="font-size:13px;font-weight:600;margin-top:2px">${formatDate(enr.dataFine)}</div></div>`:''}
          </div>`:''}
          ${enr.note?`<div style="background:#fffbeb;border:1px solid #fef08a;border-radius:8px;padding:12px;font-size:13px;margin-bottom:12px"><strong>Note:</strong> ${enr.note}</div>`:''}
          <!-- CERTIFICATO -->
          <div style="border:1.5px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px">
            <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:8px">🏅 Certificato di Completamento</div>
            ${enr.certificato
              ?`<div style="display:flex;align-items:center;gap:10px">
                  <div style="background:#f0fdf4;border-radius:8px;padding:8px;font-size:20px">🏅</div>
                  <div style="flex:1"><div style="font-size:13px;font-weight:600">${enr.certificato.nome}</div><div style="font-size:11px;color:var(--text-muted)">Caricato il ${formatDate(enr.certificato.data)}</div></div>
                  <button class="btn btn-outline btn-sm" onclick="downloadCertificato('${c.id}')">⬇️ Scarica</button>
                  <button class="btn btn-icon" onclick="openUploadCertificato('${c.id}')" title="Sostituisci">🔄</button>
                </div>`
              :`<div style="text-align:center;padding:8px">
                  <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px">Nessun certificato caricato</p>
                  ${enr.stato==='completato'?`<button class="btn btn-success btn-sm" onclick="openUploadCertificato('${c.id}')">⬆️ Carica Certificato</button>`:'<span style="font-size:12px;color:var(--text-muted)">Completa il corso per caricare il certificato</span>'}
                </div>`
            }
          </div>
          <div style="display:flex;gap:8px">
            ${enr.stato!=='completato'?`<button class="btn btn-success btn-sm" onclick="updateMyStatus('${c.id}','completato')">✅ Segna Completato</button>`:''}
            ${enr.stato==='da_iniziare'?`<button class="btn btn-primary btn-sm" onclick="updateMyStatus('${c.id}','in_corso')">▶️ Avvia Corso</button>`:''}
          </div>`
          :`<p style="color:var(--text-muted);font-size:14px;margin-bottom:12px">Non sei ancora iscritto a questo corso.</p>
           <button class="btn btn-primary" onclick="enrollInCourse('${c.id}')">＋ Iscriviti ora</button>`}
        </div>
      </div>`:''}
    </div>

    <div>
      <!-- ISCRIZIONI (admin) -->
      ${isAdmin?`<div class="card">
        <div class="card-header">
          <div class="card-title">👥 Iscrizioni (${allEnrs.length})</div>
          <button class="btn btn-primary btn-sm" onclick="openEnrollUser('${c.id}')">＋ Assegna</button>
        </div>
        <div class="card-body" style="padding:0">
          ${allEnrs.length?allEnrs.map(e=>{
            const u=getUser(e.userId); if(!u) return '';
            return `<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border)">
              <div class="avatar avatar-dipendente" style="width:32px;height:32px;font-size:12px">${u.nome[0]}${u.cognome[0]}</div>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:600">${u.cognome} ${u.nome}</div>
                <div style="font-size:11px;color:var(--text-muted)">${u.area}</div>
              </div>
              ${statoBadge(e.stato)}
              <button class="btn btn-icon" onclick="openEditEnrollment('${e.id}')" title="Modifica">✏️</button>
            </div>`;
          }).join(''):`<div class="empty-state" style="padding:30px"><p>Nessun dipendente iscritto</p></div>`}
        </div>
      </div>`:''}

      <!-- INFO BOX -->
      <div class="card" style="margin-top:16px">
        <div class="card-header"><div class="card-title">ℹ️ Informazioni</div></div>
        <div class="card-body">
          <div style="font-size:13px;display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Vendor</span><strong>${c.vendor}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Tipologia</span><strong>${c.tipologia}</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Materiali</span><strong>${c.materiali?.length||0} file</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Iscritti totali</span><strong>${allEnrs.length} persone</strong></div>
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-muted)">Creato il</span><strong>${formatDate(c.createdAt)}</strong></div>
            ${c.linkCorso?`<div style="padding-top:8px;border-top:1px solid var(--border)"><a href="${c.linkCorso}" target="_blank" class="btn btn-primary btn-sm btn-block">🔗 Vai al Corso</a></div>`:''}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  ENROLLMENTS (ADMIN)
// ═══════════════════════════════════════════════════════════════
function renderEnrollments(){
  const enrs=DB.get('enrollments')||[];
  const q='';
  return `
  <div class="page-header">
    <div><h1>Iscrizioni ai Corsi</h1><p>${enrs.length} iscrizioni totali</p></div>
    <div style="display:flex;gap:8px">
      <label class="btn btn-outline btn-sm" style="cursor:pointer">
        📥 Importa Excel
        <input type="file" accept=".xlsx,.xls,.csv" style="display:none" onchange="importFromExcel(event)">
      </label>
      <button class="btn btn-success btn-sm" onclick="exportToExcel()">📤 Esporta Excel</button>
    </div>
  </div>
  <div class="filter-bar">
    <div class="search-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"/></svg>
      <input class="search-input" id="enr-search" placeholder="Cerca dipendente o corso…" oninput="filterEnrollments()">
    </div>
    <select class="filter-select" id="enr-stato" onchange="filterEnrollments()">
      <option value="">Tutti gli stati</option>
      <option value="completato">✅ Completato</option>
      <option value="in_corso">🔵 In Corso</option>
      <option value="da_iniziare">⏳ Da Iniziare</option>
    </select>
    <select class="filter-select" id="enr-validita" onchange="filterEnrollments()">
      <option value="">Tutte le validità</option>
      <option value="valido">✓ Valido</option>
      <option value="scaduto">✗ Scaduto</option>
    </select>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Dipendente</th><th>Area</th><th>Corso</th><th>Vendor</th><th>Stato</th><th>Inizio</th><th>Fine</th><th>Anno</th><th>Validità</th><th>Scadenza</th><th>CK</th><th></th></tr></thead>
      <tbody id="enr-tbody"></tbody>
    </table>
  </div>`;
}

function filterEnrollments(){
  const q=(document.getElementById('enr-search')||{}).value?.toLowerCase()||'';
  const stato=(document.getElementById('enr-stato')||{}).value||'';
  const validita=(document.getElementById('enr-validita')||{}).value||'';
  const enrs=DB.get('enrollments')||[];
  const filtered=enrs.filter(e=>{
    const u=getUser(e.userId), c=getCourse(e.courseId);
    if(!u||!c) return false;
    const inQ=!q||`${u.cognome} ${u.nome} ${c.titolo} ${c.vendor}`.toLowerCase().includes(q);
    const inS=!stato||e.stato===stato;
    const inV=!validita||e.validita===validita;
    return inQ&&inS&&inV;
  });
  const tbody=document.getElementById('enr-tbody');
  if(!tbody) return;
  if(!filtered.length){
    tbody.innerHTML=`<tr><td colspan="12"><div class="empty-state" style="padding:30px"><div class="icon">🔍</div><h3>Nessun risultato</h3></div></td></tr>`;
    return;
  }
  tbody.innerHTML=filtered.map(e=>{
    const u=getUser(e.userId), c=getCourse(e.courseId);
    if(!u||!c) return '';
    const expiring=isExpiringSoon(e.dataScadenza);
    const expired=isExpired(e.dataScadenza)&&e.dataScadenza;
    return `<tr>
      <td><strong>${u.cognome} ${u.nome}</strong></td>
      <td><span class="tag">${u.area}</span></td>
      <td style="max-width:180px;font-size:13px">${c.titolo.length>40?c.titolo.substring(0,40)+'…':c.titolo}</td>
      <td>${c.vendor}</td>
      <td>${statoBadge(e.stato)}</td>
      <td style="font-size:12px">${formatDate(e.dataInizio)}</td>
      <td style="font-size:12px">${formatDate(e.dataFine)}</td>
      <td>${e.annoConseguimento||'—'}</td>
      <td>${validitaBadge(e.validita)||'—'}</td>
      <td style="font-size:12px">${expiring?`<span style="color:var(--warning);font-weight:600">⚠️ ${formatDate(e.dataScadenza)}</span>`:expired?`<span style="color:var(--danger);font-weight:600">❌ ${formatDate(e.dataScadenza)}</span>`:formatDate(e.dataScadenza)}</td>
      <td style="font-size:13px">${e.ck||''}</td>
      <td><div class="td-actions">
        <button class="btn btn-icon" onclick="openEditEnrollment('${e.id}')" title="Modifica">✏️</button>
        <button class="btn btn-icon" onclick="deleteEnrollment('${e.id}')" title="Elimina" style="color:var(--danger)">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════
//  USERS (ADMIN)
// ═══════════════════════════════════════════════════════════════
function renderUsers(){
  const users=(DB.get('users')||[]).filter(u=>u.role==='dipendente');
  const enrs=DB.get('enrollments')||[];

  return `
  <div class="page-header">
    <div><h1>Dipendenti</h1><p>${users.length} dipendenti registrati</p></div>
    <button class="btn btn-primary" onclick="openUserForm()">＋ Nuovo Dipendente</button>
  </div>
  <div class="card">
    <table>
      <thead><tr><th>Dipendente</th><th>Email</th><th>Area</th><th>Completati</th><th>In Corso</th><th>Da Iniziare</th><th>Scaduti</th><th></th></tr></thead>
      <tbody>
        ${users.map(u=>{
          const ue=enrs.filter(e=>e.userId===u.id);
          const comp=ue.filter(e=>e.stato==='completato').length;
          const inc=ue.filter(e=>e.stato==='in_corso').length;
          const da=ue.filter(e=>e.stato==='da_iniziare').length;
          const sca=ue.filter(e=>e.validita==='scaduto').length;
          return `<tr>
            <td><div style="display:flex;align-items:center;gap:10px">
              <div class="avatar avatar-dipendente" style="width:32px;height:32px;font-size:12px">${u.nome[0]}${u.cognome[0]}</div>
              <div><div style="font-weight:600">${u.cognome} ${u.nome}</div></div>
            </div></td>
            <td style="font-size:12px;color:var(--text-muted)">${u.email}</td>
            <td><span class="tag">${u.area}</span></td>
            <td><span class="badge badge-success">${comp}</span></td>
            <td><span class="badge badge-info">${inc}</span></td>
            <td><span class="badge badge-warning">${da}</span></td>
            <td>${sca?`<span class="badge badge-danger">${sca}</span>`:'—'}</td>
            <td><div class="td-actions">
              <button class="btn btn-outline btn-sm" onclick="openUserCourses('${u.id}')">📋 Corsi</button>
              <button class="btn btn-icon" onclick="openUserForm('${u.id}')">✏️</button>
            </div></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>`;
}

// ═══════════════════════════════════════════════════════════════
//  EXPIRING COURSES (ADMIN)
// ═══════════════════════════════════════════════════════════════
function renderExpiring(){
  const enrs=DB.get('enrollments')||[];
  const scadenze=enrs.filter(e=>isExpiringSoon(e.dataScadenza)||isExpired(e.dataScadenza));
  scadenze.sort((a,b)=>new Date(a.dataScadenza)-new Date(b.dataScadenza));

  return `
  <div class="page-header">
    <div><h1>Scadenze Corsi</h1><p>Corsi in scadenza o già scaduti</p></div>
  </div>
  ${scadenze.length?`<div class="card">
    <table>
      <thead><tr><th>Dipendente</th><th>Corso</th><th>Scadenza</th><th>Stato</th><th>Validità</th><th></th></tr></thead>
      <tbody>
        ${scadenze.map(e=>{
          const u=getUser(e.userId), c=getCourse(e.courseId);
          if(!u||!c) return '';
          const expired=isExpired(e.dataScadenza);
          const days=Math.ceil((new Date(e.dataScadenza)-new Date())/(1000*3600*24));
          return `<tr>
            <td><strong>${u.cognome} ${u.nome}</strong><br><span style="font-size:11px;color:var(--text-muted)">${u.email}</span></td>
            <td>${c.titolo}</td>
            <td>${expired
              ?`<span style="color:var(--danger);font-weight:700">❌ Scaduto il ${formatDate(e.dataScadenza)}</span>`
              :`<span style="color:var(--warning);font-weight:700">⚠️ ${days} giorni — ${formatDate(e.dataScadenza)}</span>`}</td>
            <td>${statoBadge(e.stato)}</td>
            <td>${validitaBadge(e.validita)||'—'}</td>
            <td><button class="btn btn-outline btn-sm" onclick="openEditEnrollment('${e.id}')">Aggiorna</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>` : `<div class="empty-state"><div class="icon">🎉</div><h3>Nessuna scadenza imminente</h3><p>Tutti i corsi sono aggiornati.</p></div>`}`;
}

// ═══════════════════════════════════════════════════════════════
//  FORMS — COURSE
// ═══════════════════════════════════════════════════════════════
function openCourseForm(courseId=null){
  const c=courseId?getCourse(courseId):null;
  const title=c?'Modifica Corso':'Nuovo Corso';
  const body=`
    <div class="form-row">
      <div class="form-group"><label class="form-label">Titolo Corso *</label>
        <input class="form-control" id="cf-titolo" value="${c?c.titolo:''}" placeholder="Es. RPA Developer Foundation"></div>
      <div class="form-group"><label class="form-label">Vendor *</label>
        <input class="form-control" id="cf-vendor" list="vendor-list" value="${c?c.vendor:''}" placeholder="Es. UiPath">
        <datalist id="vendor-list">
          <option value="LinkedIn Learning">
          <option value="UiPath">
          <option value="Microsoft">
          <option value="PMI">
          <option value="Interno">
          <option value="Coursera">
          <option value="Udemy">
          <option value="Google">
          <option value="AWS">
        </datalist></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Tipologia</label>
        <select class="form-control" id="cf-tipologia">
          ${['Tecnico','Management','Cloud','Analytics','Compliance','Soft Skills','Altro'].map(t=>
            `<option value="${t}" ${c&&c.tipologia===t?'selected':''}>${t}</option>`).join('')}
        </select></div>
      <div class="form-group"><label class="form-label">Colore card</label>
        <select class="form-control" id="cf-colore">
          ${['blue','green','yellow','purple','red'].map(cl=>
            `<option value="${cl}" ${c&&c.colore===cl?'selected':''}>${cl}</option>`).join('')}
        </select></div>
    </div>
    <div class="form-group"><label class="form-label">Descrizione</label>
      <textarea class="form-control" id="cf-desc" rows="3">${c?c.descrizione:''}</textarea></div>
    <div class="form-group"><label class="form-label">🔗 Link del Corso (URL piattaforma)</label>
      <input class="form-control" id="cf-link" value="${c&&c.linkCorso?c.linkCorso:''}" placeholder="https://learn.microsoft.com/…"></div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-primary" onclick="saveCourse('${courseId||''}')">💾 Salva</button>`;
  openModal(title, body, footer);
}

async function saveCourse(courseId){
  const titolo=document.getElementById('cf-titolo').value.trim();
  const vendor=document.getElementById('cf-vendor').value.trim();
  if(!titolo||!vendor){ toast('Titolo e Vendor obbligatori','error'); return; }
  const courses=DB.get('courses')||[];
  let savedCourse;
  if(courseId){
    const idx=courses.findIndex(c=>c.id===courseId);
    if(idx!==-1){
      courses[idx]={...courses[idx],
        titolo,vendor,
        tipologia:document.getElementById('cf-tipologia').value,
        colore:document.getElementById('cf-colore').value,
        descrizione:document.getElementById('cf-desc').value.trim(),
        linkCorso:document.getElementById('cf-link').value.trim(),
      };
      savedCourse=courses[idx];
    }
  } else {
    savedCourse={id:uid(),titolo,vendor,
      tipologia:document.getElementById('cf-tipologia').value,
      colore:document.getElementById('cf-colore').value,
      descrizione:document.getElementById('cf-desc').value.trim(),
      linkCorso:document.getElementById('cf-link').value.trim(),
      materiali:[],createdAt:new Date().toISOString().split('T')[0]};
    courses.push(savedCourse);
  }
  try{
    await syncCourseLink(savedCourse);
    DB.set('courses',courses);
  }catch(e){
    console.error(e);
    toast(e.message||'Salvataggio corso non riuscito','error');
    return;
  }
  toast(courseId?'Corso aggiornato ✅':'Corso creato ✅','success');
  closeModal();
  navigate('courses');
}

async function deleteCourse(courseId){
  if(!confirm('Eliminare questo corso? Verranno rimosse anche tutte le iscrizioni.')) return;
  const c=getCourse(courseId);
  try{
    if(c&&c._dbId) await API.del('/api/corsi/'+c._dbId+'/');
  }catch(e){
    console.error(e);
    toast(e.message||'Eliminazione non riuscita','error');
    return;
  }
  DB.set('courses',(DB.get('courses')||[]).filter(c=>c.id!==courseId));
  DB.set('enrollments',(DB.get('enrollments')||[]).filter(e=>e.courseId!==courseId));
  toast('Corso eliminato','info');
  navigate('courses');
}

// ═══════════════════════════════════════════════════════════════
//  FORMS — ENROLLMENT
// ═══════════════════════════════════════════════════════════════
function enrollInCourse(courseId){
  const enr=getUserEnrollment(currentUser.id,courseId);
  if(enr){ toast('Sei già iscritto a questo corso','info'); return; }
  const enrs=DB.get('enrollments')||[];
  enrs.push({id:uid(),userId:currentUser.id,courseId,
    stato:'da_iniziare',annoConseguimento:null,validita:'',ck:'',note:'',
    dataScadenza:new Date(Date.now()+365*24*3600*1000).toISOString().split('T')[0]});
  DB.set('enrollments',enrs);
  toast('Iscrizione effettuata! ✅','success');
  navigate('course-detail',{id:courseId});
}

function updateMyStatus(courseId, newStato){
  const enrs=DB.get('enrollments')||[];
  const idx=enrs.findIndex(e=>e.userId===currentUser.id&&e.courseId===courseId);
  if(idx===-1) return;
  enrs[idx].stato=newStato;
  if(newStato==='completato'){
    enrs[idx].annoConseguimento=new Date().getFullYear();
    enrs[idx].validita='valido';
  }
  DB.set('enrollments',enrs);
  toast('Stato aggiornato ✅','success');
  navigate('course-detail',{id:courseId});
}

function openEnrollUser(courseId){
  const users=(DB.get('users')||[]).filter(u=>u.role==='dipendente');
  const existing=getEnrollmentsByCourse(courseId).map(e=>e.userId);
  const available=users.filter(u=>!existing.includes(u.id));
  if(!available.length){ toast('Tutti i dipendenti sono già iscritti','info'); return; }
  const body=`
    <div class="form-group"><label class="form-label">Dipendente *</label>
      <select class="form-control" id="eu-user">
        ${available.map(u=>`<option value="${u.id}">${u.cognome} ${u.nome} (${u.area})</option>`).join('')}
      </select></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Stato iniziale</label>
        <select class="form-control" id="eu-stato">
          <option value="da_iniziare">⏳ Da Iniziare</option>
          <option value="in_corso">🔵 In Corso</option>
          <option value="completato">✅ Completato</option>
        </select></div>
      <div class="form-group"><label class="form-label">Data Scadenza</label>
        <input type="date" class="form-control" id="eu-scad" value="${new Date(Date.now()+365*24*3600*1000).toISOString().split('T')[0]}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">📅 Data Inizio Pianificata</label>
        <input type="date" class="form-control" id="eu-inizio" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group"><label class="form-label">📅 Data Fine Pianificata</label>
        <input type="date" class="form-control" id="eu-fine" value="${new Date(Date.now()+90*24*3600*1000).toISOString().split('T')[0]}"></div>
    </div>
    <div class="form-group"><label class="form-label">Note</label>
      <input class="form-control" id="eu-note" placeholder="Note facoltative"></div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-primary" onclick="saveEnrollUser('${courseId}')">💾 Assegna Corso</button>`;
  openModal('Assegna Corso a Dipendente', body, footer);
}

async function saveEnrollUser(courseId){
  const userId=document.getElementById('eu-user').value;
  const stato=document.getElementById('eu-stato').value;
  const scad=document.getElementById('eu-scad').value;
  const note=document.getElementById('eu-note').value;
  const enrs=DB.get('enrollments')||[];
  const newE={id:uid(),userId,courseId,stato,annoConseguimento:stato==='completato'?new Date().getFullYear():null,
    validita:stato==='completato'?'valido':'',ck:'',note,dataScadenza:scad,
    dataInizio:document.getElementById('eu-inizio').value,
    dataFine:document.getElementById('eu-fine').value,
    certificato:null};
  try{
    await syncEnrollment(newE);
  }catch(e){
    console.error(e);
    toast(e.message||'Assegnazione non riuscita','error');
    return;
  }
  enrs.push(newE);
  DB.set('enrollments',enrs);
  toast('Corso assegnato ✅','success');
  closeModal();
  navigate('course-detail',{id:courseId});
}

function openEditEnrollment(enrId){
  const enrs=DB.get('enrollments')||[];
  const e=enrs.find(x=>x.id===enrId);
  if(!e) return;
  const u=getUser(e.userId), c=getCourse(e.courseId);
  const body=`
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">
      <strong>${u?u.cognome+' '+u.nome:''}</strong> → ${c?c.titolo:''}
    </p>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Stato</label>
        <select class="form-control" id="ee-stato">
          <option value="da_iniziare" ${e.stato==='da_iniziare'?'selected':''}>⏳ Da Iniziare</option>
          <option value="in_corso" ${e.stato==='in_corso'?'selected':''}>🔵 In Corso</option>
          <option value="completato" ${e.stato==='completato'?'selected':''}>✅ Completato</option>
        </select></div>
      <div class="form-group"><label class="form-label">Anno Conseguimento</label>
        <input type="number" class="form-control" id="ee-anno" value="${e.annoConseguimento||''}" min="2000" max="2099" placeholder="Es. 2024"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Validità</label>
        <select class="form-control" id="ee-validita">
          <option value="" ${!e.validita?'selected':''}>—</option>
          <option value="valido" ${e.validita==='valido'?'selected':''}>✓ Valido</option>
          <option value="scaduto" ${e.validita==='scaduto'?'selected':''}>✗ Scaduto</option>
        </select></div>
      <div class="form-group"><label class="form-label">Data Scadenza</label>
        <input type="date" class="form-control" id="ee-scad" value="${e.dataScadenza||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">📅 Data Inizio Pianificata</label>
        <input type="date" class="form-control" id="ee-inizio" value="${e.dataInizio||''}"></div>
      <div class="form-group"><label class="form-label">📅 Data Fine Pianificata</label>
        <input type="date" class="form-control" id="ee-fine" value="${e.dataFine||''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">CK (check)</label>
        <input class="form-control" id="ee-ck" value="${e.ck||''}" placeholder="✓ / flag / note"></div>
      <div class="form-group"><label class="form-label">Note</label>
        <input class="form-control" id="ee-note" value="${e.note||''}" placeholder="Note interne"></div>
    </div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-primary" onclick="saveEnrollment('${enrId}')">💾 Salva</button>`;
  openModal('Modifica Iscrizione', body, footer);
}

async function saveEnrollment(enrId){
  const enrs=DB.get('enrollments')||[];
  const idx=enrs.findIndex(e=>e.id===enrId);
  if(idx===-1) return;
  const updated={...enrs[idx],
    stato:document.getElementById('ee-stato').value,
    annoConseguimento:parseInt(document.getElementById('ee-anno').value)||null,
    validita:document.getElementById('ee-validita').value,
    dataScadenza:document.getElementById('ee-scad').value,
    dataInizio:document.getElementById('ee-inizio').value,
    dataFine:document.getElementById('ee-fine').value,
    ck:document.getElementById('ee-ck').value,
    note:document.getElementById('ee-note').value,
  };
  try{
    await syncEnrollment(updated);
  }catch(e){
    console.error(e);
    toast(e.message||'Aggiornamento iscrizione non riuscito','error');
    return;
  }
  enrs[idx]=updated;
  DB.set('enrollments',enrs);
  toast('Iscrizione aggiornata ✅','success');
  closeModal();
  // refresh current page
  const t=document.getElementById('topbar-title').textContent;
  if(t==='Gestione Iscrizioni') navigate('enrollments');
  else if(t==='Dettaglio Corso') navigate('course-detail',{id:enrs[idx].courseId});
  else if(t==='Scadenze Corsi') navigate('expiring');
}

async function deleteEnrollment(enrId){
  if(!confirm('Rimuovere questa iscrizione?')) return;
  const enr=(DB.get('enrollments')||[]).find(e=>e.id===enrId);
  try{
    if(enr&&enr._dbId) await API.del('/api/assegnazioni/'+enr._dbId+'/');
  }catch(e){
    console.error(e);
    toast(e.message||'Rimozione iscrizione non riuscita','error');
    return;
  }
  DB.set('enrollments',(DB.get('enrollments')||[]).filter(e=>e.id!==enrId));
  toast('Iscrizione rimossa','info');
  navigate('enrollments');
}

// ═══════════════════════════════════════════════════════════════
//  FORMS — USER
// ═══════════════════════════════════════════════════════════════
function openUserForm(userId=null){
  const u=userId?getUser(userId):null;
  const body=`
    <div class="form-row">
      <div class="form-group"><label class="form-label">Nome *</label>
        <input class="form-control" id="uf-nome" value="${u?u.nome:''}" placeholder="Mario"></div>
      <div class="form-group"><label class="form-label">Cognome *</label>
        <input class="form-control" id="uf-cognome" value="${u?u.cognome:''}" placeholder="Rossi"></div>
    </div>
    <div class="form-group"><label class="form-label">Email *</label>
      <input type="email" class="form-control" id="uf-email" value="${u?u.email:''}" placeholder="nome.cognome@beta80group.it"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Area / Team</label>
        <input class="form-control" id="uf-area" value="${u?u.area:''}" placeholder="Es. RPA, PM, Dev…"></div>
    </div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-primary" onclick="saveUser('${userId||''}')">💾 Salva</button>`;
  openModal(u?'Modifica Dipendente':'Nuovo Dipendente', body, footer);
}

async function saveUser(userId){
  const nome=document.getElementById('uf-nome').value.trim();
  const cognome=document.getElementById('uf-cognome').value.trim();
  const email=document.getElementById('uf-email').value.trim();
  const area=document.getElementById('uf-area').value.trim();
  if(!nome||!cognome||!email){ toast('Nome, Cognome ed Email obbligatori','error'); return; }
  const users=DB.get('users')||[];
  let savedUser;
  if(userId){
    const idx=users.findIndex(u=>u.id===userId);
    if(idx!==-1){
      users[idx]={...users[idx],nome,cognome,email,area};
      savedUser=users[idx];
    }
  } else {
    savedUser={id:uid(),nome,cognome,email,role:'dipendente',area};
    users.push(savedUser);
  }
  try{
    await syncDipendente(savedUser);
  }catch(e){
    console.error(e);
    toast(e.message||'Salvataggio dipendente non riuscito','error');
    return;
  }
  DB.set('users',users);
  toast(userId?'Dipendente aggiornato ✅':'Dipendente creato ✅','success');
  closeModal();
  navigate('users');
}

function openUserCourses(userId){
  const u=getUser(userId);
  const enrs=getEnrollmentsByUser(userId);
  const body=`
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px"><strong>${u.cognome} ${u.nome}</strong> — Area: ${u.area}</p>
    ${enrs.length?`<table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:#f8fafc"><th style="padding:8px;text-align:left;font-size:12px">Corso</th><th style="padding:8px;font-size:12px">Stato</th><th style="padding:8px;font-size:12px">Anno</th><th style="padding:8px;font-size:12px">Validità</th></tr></thead>
      <tbody>${enrs.map(e=>{const c=getCourse(e.courseId);if(!c)return '';
        return `<tr style="border-top:1px solid #e2e8f0"><td style="padding:8px;font-size:13px">${c.titolo}</td><td style="padding:8px">${statoBadge(e.stato)}</td><td style="padding:8px;font-size:13px">${e.annoConseguimento||'—'}</td><td style="padding:8px">${validitaBadge(e.validita)||'—'}</td></tr>`;
      }).join('')}</tbody>
    </table>`:`<div class="empty-state"><div class="icon">📚</div><p>Nessun corso assegnato</p></div>`}`;
  openModal(`Corsi di ${u.cognome} ${u.nome}`, body, `<button class="btn btn-outline" onclick="closeModal()">Chiudi</button>`);
}

// ═══════════════════════════════════════════════════════════════
//  MATERIALI
// ═══════════════════════════════════════════════════════════════
function openUploadMaterial(courseId){
  const body=`
    <div class="form-group"><label class="form-label">Nome del materiale *</label>
      <input class="form-control" id="mat-nome" placeholder="Es. Guida UiPath Studio"></div>
    <div class="form-group"><label class="form-label">Tipo</label>
      <select class="form-control" id="mat-tipo" onchange="toggleMatType()">
        <option value="pdf">📄 PDF / File</option>
        <option value="link">🔗 Link esterno</option>
      </select></div>
    <div id="mat-pdf-wrap" class="form-group">
      <label class="form-label">Carica file PDF</label>
      <div class="upload-area" onclick="document.getElementById('mat-file').click()" id="upload-area-mat">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.397 7.67"/></svg>
        <p><strong>Clicca per caricare</strong> o trascina qui</p>
        <p style="font-size:11px;margin-top:4px">PDF, max 10MB</p>
        <input type="file" id="mat-file" accept=".pdf" style="display:none" onchange="previewFile(event)">
      </div>
      <div id="mat-file-preview" class="file-list"></div>
    </div>
    <div id="mat-link-wrap" class="form-group" style="display:none">
      <label class="form-label">URL del link *</label>
      <input class="form-control" id="mat-url" placeholder="https://..."></div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-primary" onclick="saveMaterial('${courseId}')">💾 Salva Materiale</button>`;
  openModal('Aggiungi Materiale', body, footer);
}

function toggleMatType(){
  const tipo=document.getElementById('mat-tipo').value;
  document.getElementById('mat-pdf-wrap').style.display=tipo==='pdf'?'block':'none';
  document.getElementById('mat-link-wrap').style.display=tipo==='link'?'block':'none';
}

let pendingFileData=null;
function previewFile(event){
  const file=event.target.files[0];
  if(!file) return;
  pendingFileData={name:file.name, size:file.size};
  const reader=new FileReader();
  reader.onload=e=>{ pendingFileData.data=e.target.result; };
  reader.readAsDataURL(file);
  document.getElementById('mat-file-preview').innerHTML=
    `<div class="file-item">📄 ${file.name} <span style="color:var(--text-muted)">(${(file.size/1024).toFixed(0)} KB)</span></div>`;
}

function saveMaterial(courseId){
  const nome=document.getElementById('mat-nome').value.trim();
  const tipo=document.getElementById('mat-tipo').value;
  if(!nome){ toast('Nome obbligatorio','error'); return; }
  let url='#', fileData=null;
  if(tipo==='link'){
    url=document.getElementById('mat-url').value.trim();
    if(!url){ toast('URL obbligatorio','error'); return; }
  } else if(pendingFileData){
    fileData=pendingFileData;
    url=pendingFileData.data||'#';
  }
  const courses=DB.get('courses')||[];
  const idx=courses.findIndex(c=>c.id===courseId);
  if(idx===-1) return;
  courses[idx].materiali=courses[idx].materiali||[];
  courses[idx].materiali.push({id:uid(),nome,tipo,url,data:new Date().toISOString().split('T')[0]});
  DB.set('courses',courses);
  pendingFileData=null;
  toast('Materiale aggiunto ✅','success');
  closeModal();
  navigate('course-detail',{id:courseId});
}

function downloadMaterial(courseId, materialId){
  const c=getCourse(courseId);
  if(!c) return;
  const m=c.materiali.find(x=>x.id===materialId);
  if(!m) return;
  if(m.url&&m.url.startsWith('data:')){
    const a=document.createElement('a');
    a.href=m.url; a.download=m.nome;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  } else {
    toast('File non disponibile (demo)','info');
  }
}

function deleteMaterial(courseId, materialId){
  if(!confirm('Rimuovere questo materiale?')) return;
  const courses=DB.get('courses')||[];
  const idx=courses.findIndex(c=>c.id===courseId);
  if(idx===-1) return;
  courses[idx].materiali=courses[idx].materiali.filter(m=>m.id!==materialId);
  DB.set('courses',courses);
  toast('Materiale rimosso','info');
  navigate('course-detail',{id:courseId});
}

// ═══════════════════════════════════════════════════════════════
//  CERTIFICATO
// ═══════════════════════════════════════════════════════════════
function openUploadCertificato(courseId){
  const body=`
    <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px">Carica il certificato di completamento del corso.</p>
    <div class="upload-area" onclick="document.getElementById('cert-file').click()" id="cert-upload-area">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.397 7.67"/></svg>
      <p><strong>Clicca per selezionare</strong> il file certificato</p>
      <p style="font-size:11px;margin-top:4px">PDF, DOCX</p>
      <input type="file" id="cert-file" accept=".pdf,.docx" style="display:none" onchange="previewCertFile(event)">
    </div>
    <div id="cert-file-preview" class="file-list"></div>`;
  const footer=`
    <button class="btn btn-outline" onclick="closeModal()">Annulla</button>
    <button class="btn btn-success" onclick="saveCertificato('${courseId}')">⬆️ Carica Certificato</button>`;
  openModal('Carica Certificato', body, footer);
}

let pendingCertData=null;
function previewCertFile(event){
  const file=event.target.files[0]; if(!file) return;
  pendingCertData={nome:file.name,size:file.size,file:file};
  document.getElementById('cert-file-preview').innerHTML=
    `<div class="file-item">🏅 ${file.name} <span style="color:var(--text-muted)">(${(file.size/1024).toFixed(0)} KB)</span></div>`;
}

async function saveCertificato(courseId){
  if(!pendingCertData||!pendingCertData.file){ toast('Seleziona un file','error'); return; }
  const enrs=DB.get('enrollments')||[];
  const idx=enrs.findIndex(e=>e.userId===currentUser.id&&e.courseId===courseId);
  if(idx===-1){ toast('Iscrizione non trovata','error'); return; }
  const enr=enrs[idx];
  if(!enr._dbId) await syncEnrollment(enr);
  if(!enr._dbId){ toast('Sincronizzazione server non riuscita','error'); return; }
  const form=new FormData();
  form.append('certificato',pendingCertData.file,pendingCertData.nome);
  try{
    const r=await API.upload('/api/assegnazioni/'+enr._dbId+'/certificato/',form);
    if(r.certificato_url){
      enrs[idx].certificato={nome:r.certificato_nome||pendingCertData.nome,data:new Date().toISOString().split('T')[0],url:r.certificato_url,_server:true};
      DB.set('enrollments',enrs);
    } else { toast('Upload fallito','error'); return; }
  }catch(e){ toast('Errore upload','error'); console.error(e); return; }
  pendingCertData=null;
  toast('Certificato caricato ✅','success');
  closeModal();
  navigate('course-detail',{id:courseId});
}

function downloadCertificato(courseId){
  const enr=getUserEnrollment(currentUser.id,courseId);
  if(!enr||!enr.certificato||!enr.certificato.url){ toast('Nessun certificato disponibile','info'); return; }
  const a=document.createElement('a');
  a.href=enr.certificato.url; a.download=enr.certificato.nome;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ═══════════════════════════════════════════════════════════════
//  EXCEL EXPORT
// ═══════════════════════════════════════════════════════════════
function exportToExcel(){
  if(typeof XLSX==='undefined'){ toast('Libreria Excel non caricata, riprova','error'); return; }
  const enrs=DB.get('enrollments')||[];
  const rows=enrs.map(e=>{
    const u=getUser(e.userId)||{};
    const c=getCourse(e.courseId)||{};
    return {
      'Cognome': u.cognome||'',
      'Nome': u.nome||'',
      'Email': u.email||'',
      'Area RPA': u.area||'',
      'Vendor': c.vendor||'',
      'Corso': c.titolo||'',
      'Tipologia Corso': c.tipologia||'',
      'Link Corso': c.linkCorso||'',
      'STATO': e.stato==='completato'?'completato':e.stato==='in_corso'?'in corso':'da iniziare',
      'Data Inizio': e.dataInizio||'',
      'Data Fine': e.dataFine||'',
      'Validità': e.validita||'',
      'Anno Conseguimento': e.annoConseguimento||'',
      'Data Scadenza': e.dataScadenza||'',
      'CK': e.ck||'',
      'Note': e.note||'',
      'Certificato': e.certificato?'✓ Caricato':'',
    };
  });
  const ws=XLSX.utils.json_to_sheet(rows);
  // Column widths
  ws['!cols']=[{wch:14},{wch:14},{wch:28},{wch:10},{wch:14},{wch:40},{wch:14},{wch:40},
               {wch:12},{wch:12},{wch:12},{wch:10},{wch:8},{wch:12},{wch:6},{wch:30},{wch:12}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,'Formazione',ws);
  // Summary sheet
  const courses=DB.get('courses')||[];
  const sumRows=courses.map(c=>{
    const ce=enrs.filter(e=>e.courseId===c.id);
    return {
      'Corso':c.titolo,'Vendor':c.vendor,'Tipologia':c.tipologia,
      'Link':c.linkCorso||'',
      'Iscritti':ce.length,
      'Completati':ce.filter(e=>e.stato==='completato').length,
      'In Corso':ce.filter(e=>e.stato==='in_corso').length,
      'Da Iniziare':ce.filter(e=>e.stato==='da_iniziare').length,
    };
  });
  const ws2=XLSX.utils.json_to_sheet(sumRows);
  ws2['!cols']=[{wch:40},{wch:14},{wch:14},{wch:40},{wch:10},{wch:10},{wch:10},{wch:12}];
  XLSX.utils.book_append_sheet(wb,'Riepilogo Corsi',ws2);
  const date=new Date().toISOString().split('T')[0];
  XLSX.writeFile(wb,`Beta80_Formazione_${date}.xlsx`);
  toast('Export Excel completato ✅','success');
}

// ═══════════════════════════════════════════════════════════════
//  EXCEL IMPORT
// ═══════════════════════════════════════════════════════════════
function importFromExcel(event){
  if(typeof XLSX==='undefined'){ toast('Libreria Excel non caricata','error'); return; }
  const file=event.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const wb=XLSX.read(e.target.result,{type:'binary'});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws,{defval:''});
      if(!rows.length){ toast('File vuoto o formato non riconosciuto','error'); return; }

      // Column mapping (case-insensitive, flexible)
      const col=(row,names)=>{
        for(const n of names){
          const key=Object.keys(row).find(k=>k.toLowerCase().trim()===n.toLowerCase());
          if(key&&row[key]!==undefined&&row[key]!=='') return String(row[key]).trim();
        }
        return '';
      };

      let created=0, updated=0, skipped=0;
      const users=DB.get('users')||[];
      const courses=DB.get('courses')||[];
      const enrs=DB.get('enrollments')||[];

      rows.forEach(row=>{
        const cognome=col(row,['cognome','surname','last name']);
        const nome=col(row,['nome','name','first name']);
        const email=col(row,['email','e-mail','mail']);
        const area=col(row,['area rpa','area','team','settore']);
        const vendor=col(row,['vendor','fornitore','provider']);
        const corsoTitolo=col(row,['corso','course','titolo','title','nome corso']);
        const tipologia=col(row,['tipologia corso','tipologia','type','category']);
        const statoRaw=col(row,['stato','status','state']);
        const validita=col(row,['validità','validita','validity']);
        const anno=col(row,['anno conseguimento','anno','year']);
        const ck=col(row,['ck','check','flag']);
        const note=col(row,['note','notes','commenti']);
        const dataInizio=col(row,['data inizio','inizio','start date','start']);
        const dataFine=col(row,['data fine','fine','end date','end']);
        const dataScadenza=col(row,['data scadenza','scadenza','expiry','expiry date']);
        const linkCorso=col(row,['link corso','link','url','link del corso']);

        if(!cognome&&!nome&&!corsoTitolo){ skipped++; return; }

        // Map stato
        const statoMap={'completato':'completato','completed':'completato','in corso':'in_corso',
          'in_corso':'in_corso','in progress':'in_corso','da iniziare':'da_iniziare',
          'da_iniziare':'da_iniziare','not started':'da_iniziare','todo':'da_iniziare'};
        const stato=statoMap[statoRaw.toLowerCase()]||'da_iniziare';

        // Find or create user
        let user=users.find(u=>
          (email&&u.email.toLowerCase()===email.toLowerCase())||
          (cognome&&nome&&u.cognome.toLowerCase()===cognome.toLowerCase()&&u.nome.toLowerCase()===nome.toLowerCase())
        );
        if(!user&&(nome||cognome)){
          user={id:uid(),nome:nome||'',cognome:cognome||'',
            email:email||(cognome.toLowerCase()+'.'+nome.toLowerCase()+'@beta80group.it'),
            role:'dipendente',area:area||'RPA'};
          users.push(user);
        }
        if(!user){ skipped++; return; }

        // Find or create course
        let course=courses.find(c=>c.titolo.toLowerCase()===corsoTitolo.toLowerCase());
        if(!course&&corsoTitolo){
          course={id:uid(),titolo:corsoTitolo,vendor:vendor||'',
            tipologia:tipologia||'Altro',colore:'blue',
            linkCorso:linkCorso||'',descrizione:'',materiali:[],
            createdAt:new Date().toISOString().split('T')[0]};
          courses.push(course);
        }
        if(!course){ skipped++; return; }

        // Find or create enrollment
        const eIdx=enrs.findIndex(e=>e.userId===user.id&&e.courseId===course.id);
        const enrData={
          stato, validita:validita||'',
          annoConseguimento:anno?parseInt(anno)||null:null,
          ck:ck||'',note:note||'',
          dataInizio:dataInizio||'',dataFine:dataFine||'',
          dataScadenza:dataScadenza||new Date(Date.now()+365*24*3600*1000).toISOString().split('T')[0],
          certificato:null,
        };
        if(eIdx!==-1){ enrs[eIdx]={...enrs[eIdx],...enrData}; updated++; }
        else{ enrs.push({id:uid(),userId:user.id,courseId:course.id,...enrData}); created++; }
      });

      DB.set('users',users); DB.set('courses',courses); DB.set('enrollments',enrs);
      toast(`Import completato: ${created} nuove iscrizioni, ${updated} aggiornate, ${skipped} ignorate`,'success');
      event.target.value='';
      navigate('enrollments');
    } catch(err){
      console.error(err);
      toast('Errore durante la lettura del file Excel','error');
    }
  };
  reader.readAsBinaryString(file);
}

// ═══════════════════════════════════════════════════════════════
//  POST RENDER HOOKS
// ═══════════════════════════════════════════════════════════════
function postRender(page, params){
  if(page==='enrollments') setTimeout(filterEnrollments, 10);
  if(page==='course-detail') {
    document.getElementById('topbar-right').innerHTML=
      currentUser.role==='admin'
      ? `<button class="btn btn-outline btn-sm" onclick="navigate('enrollments')">📋 Tutte le iscrizioni</button>`
      : '';
  }
}
