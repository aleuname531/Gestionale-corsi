const DB = {
  get(k) {
    try {
      return JSON.parse(localStorage.getItem('b80_' + k)) || null;
    } catch {
      return null;
    }
  },
  set(k, v) {
    localStorage.setItem('b80_' + k, JSON.stringify(v));
  },
  init() {
    if (this.get('initialized')) return;
    this.set('users', DEMO_USERS);
    this.set('courses', DEMO_COURSES);
    this.set('enrollments', DEMO_ENROLLMENTS);
    this.set('initialized', true);
  }
};
