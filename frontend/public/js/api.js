const BASE = '';  // Same origin — backend serves frontend

const api = {
  async get(path) {
    const r = await fetch(BASE + path);
    return r.json();
  },
  async post(path, data) {
    const r = await fetch(BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async put(path, data) {
    const r = await fetch(BASE + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async delete(path) {
    const r = await fetch(BASE + path, { method: 'DELETE' });
    return r.json();
  }
};
