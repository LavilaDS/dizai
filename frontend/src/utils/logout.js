export default async function logout() {
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