function getCsrfToken() {
  const meta = document.querySelector('meta[name="csrf-token"]');
  if (meta && meta.content) return meta.content;

  const cookie = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith('csrftoken='));
  return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
}

function appContextHeaders() {
  return {};
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.error || 'Richiesta non riuscita';
    const error = new Error(message);
    error.response = data;
    error.status = response.status;
    throw error;
  }
  return data;
}

const API = {
  async login(email, password) {
    return this.post('/api/auth/login/', {email, password});
  },
  async logout() {
    return this.post('/api/auth/logout/', {});
  },
  async me() {
    return this.get('/api/auth/me/');
  },
  async get(url) {
    const response = await fetch(url, {credentials: 'same-origin', headers: appContextHeaders()});
    return parseResponse(response);
  },
  async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken(), ...appContextHeaders()},
      body: JSON.stringify(data)
    });
    return parseResponse(response);
  },
  async put(url, data) {
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json', 'X-CSRFToken': getCsrfToken(), ...appContextHeaders()},
      body: JSON.stringify(data)
    });
    return parseResponse(response);
  },
  async del(url) {
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {'X-CSRFToken': getCsrfToken(), ...appContextHeaders()}
    });
    return parseResponse(response);
  },
  async upload(url, form) {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'X-CSRFToken': getCsrfToken(), ...appContextHeaders()},
      body: form
    });
    return parseResponse(response);
  }
};

async function syncCourseLink(course) {
  if (!course) return null;
  const payload = {
    titolo: course.titolo,
    vendor: course.vendor,
    descrizione: course.descrizione || '',
    link_corso: course.linkCorso || '',
    durata_ore: 0,
    validita_mesi: 0,
    obbligatorio: false
  };
  const response = course._dbId
    ? await API.put('/api/corsi/' + course._dbId + '/', payload)
    : await API.post('/api/corsi/', payload);
  if (response && response.id) course._dbId = response.id;
  return response;
}

async function syncDipendente(user) {
  if (!user || user.role === 'admin') return null;
  const payload = {nome: user.nome, cognome: user.cognome, email: user.email, reparto: user.area || '', attivo: true};
  const response = user._dbId
    ? await API.put('/api/dipendenti/' + user._dbId + '/', payload)
    : await API.post('/api/dipendenti/', payload);
  if (response && response.id) user._dbId = response.id;
  return response;
}

async function syncEnrollment(enr) {
  if (!enr) return null;
  const corso = getCourse(enr.courseId);
  const user = getUser(enr.userId);
  if (!corso || !user) return null;
  if (!user._dbId) await syncDipendente(user);
  if (!corso._dbId) await syncCourseLink(corso);
  if (!user._dbId || !corso._dbId) return null;

  const payload = {
    dipendente_id: user._dbId,
    corso_id: corso._dbId,
    stato: enr.stato || 'da_iniziare',
    data_inizio_pianificata: enr.dataInizio || null,
    data_fine_pianificata: enr.dataFine || null,
    data_completamento: enr.stato === 'completato'
      ? (enr.dataCompletamento || new Date().toISOString().split('T')[0])
      : null
  };
  const response = enr._dbId
    ? await API.put('/api/assegnazioni/' + enr._dbId + '/', payload)
    : await API.post('/api/assegnazioni/', payload);
  if (response && response.id) enr._dbId = response.id;
  return response;
}

async function loadFromServer() {
  try {
    const data = await API.get('/api/init/');

    // Se il server non ha ancora dati, non svuotiamo il localStorage
    if (!data.corsi.length && !data.dipendenti.length && !data.assegnazioni.length) {
      return;
    }

    const oldCourses = DB.get('courses') || [];
    const oldUsers = DB.get('users') || [];
    const oldEnrs = DB.get('enrollments') || [];

    const courses = data.corsi.map((sc) => {
      const local = oldCourses.find((lc) => lc._dbId === sc.id || lc.titolo === sc.titolo) || {};
      return {
        ...local,
        id: local.id || 'db-course-' + sc.id,
        _dbId: sc.id,
        titolo: sc.titolo,
        vendor: sc.vendor || '',
        descrizione: sc.descrizione || '',
        linkCorso: sc.link_corso || '',
        tipologia: local.tipologia || 'Tecnico',
        colore: local.colore || 'blue',
        materiali: local.materiali || [],
        createdAt: local.createdAt || ''
      };
    });
    DB.set('courses', courses);

    const sessionId = DB.get('session');
    const current = oldUsers.find((u) => u.id === sessionId);
    const users = data.dipendenti.map((sd) => {
      const local = oldUsers.find((lu) => lu._dbId === sd.id || lu.email === sd.email) || {};
      return {
        ...local,
        id: local.id || 'db-user-' + sd.id,
        _dbId: sd.id,
        nome: sd.nome,
        cognome: sd.cognome,
        email: sd.email,
        role: local.role || 'dipendente',
        area: sd.reparto || ''
      };
    });
    // Mantieni l'utente corrente (es. admin) anche se non è tra i dipendenti
    if (current && !users.some((u) => u.id === current.id)) users.push(current);
    DB.set('users', users);

    const enrs = data.assegnazioni.map((sa) => {
      const dip = users.find((u) => u._dbId === sa.dipendente_id);
      const cors = courses.find((c) => c._dbId === sa.corso_id);
      if (!dip || !cors) return null;
      const local = oldEnrs.find((e) => e._dbId === sa.id || (e.userId === dip.id && e.courseId === cors.id)) || {};
      return {
        ...local,
        id: local.id || 'db-enrollment-' + sa.id,
        _dbId: sa.id,
        userId: dip.id,
        courseId: cors.id,
        stato: sa.stato,
        dataInizio: sa.data_inizio_pianificata || local.dataInizio || '',
        dataFine: sa.data_fine_pianificata || local.dataFine || '',
        dataScadenza: sa.data_scadenza || local.dataScadenza || '',
        certificato: sa.certificato_url
          ? {nome: sa.certificato_nome || 'certificato', data: '', url: sa.certificato_url, _server: true}
          : (local.certificato || null)
      };
    }).filter(Boolean);
    DB.set('enrollments', enrs);
  } catch (error) {
    console.warn('loadFromServer failed', error);
  }
}
