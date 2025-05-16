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
      credentials: 'include',
    });

    if (res.status === 401) {
      const refreshed = await refreshToken();
      return refreshed;
    }

    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function refreshToken() {
  try {
    const res = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      credentials: 'include'
    });
    return res.ok;
  } catch(err) {
    return false;
  }
}

export async function logout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (res.ok) {
        return true;
      } else {
        window.location.href = '/login.html?mensagem=Erro ao sair da sessão';
        return false;
      }
    } catch (error) {
        return false;
    }
  }