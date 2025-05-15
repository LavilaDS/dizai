export async function login({ email, password }) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    return { ok: response.ok, data };
  } catch (err) {
    return { ok: false, data: { error: 'Erro de conexão com o servidor.' } };
  }
}

export async function checkSession() {
  try {
    const res = await fetch('/api/auth/validate-session', {
      method: 'GET',
      credentials: 'include'
    });
    return res.ok;
  } catch(err) {
    return false;
  }
}