let currentUser = null;

function mergeServerUser(user) {
  const users = DB.get('users') || [];
  const existing = users.find((u) => u.email === user.email);
  const merged = {...(existing || {}), ...user};
  delete merged.password;
  if (existing) Object.assign(existing, merged);
  else users.push(merged);
  DB.set('users', users);
  DB.set('session', merged.id);
  currentUser = merged;
  return merged;
}

async function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pwd = document.getElementById('login-pwd').value;
  let response;
  try {
    response = await API.login(email, pwd);
  } catch (e) {
    console.error(e);
    document.getElementById('login-error').style.display = 'block';
    return;
  }
  document.getElementById('login-error').style.display = 'none';
  mergeServerUser(response.user);
  await loadFromServer();
  startApp();
}

async function doLogout() {
  try {
    await API.logout();
  } catch (e) {
    console.warn(e);
  }
  currentUser = null;
  DB.set('session', null);
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-page').style.display = 'flex';
}

async function checkSession() {
  const sid = DB.get('session');
  if (!sid) return false;
  try {
    const response = await API.me();
    mergeServerUser(response.user);
    return true;
  } catch (e) {
    DB.set('session', null);
    return false;
  }
}

document.getElementById('login-pwd').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});
