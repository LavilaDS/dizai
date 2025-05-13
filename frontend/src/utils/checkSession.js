export default async function checkSession() {
    try {
      console.log("Entrei");
      const res = await fetch('/api/auth/validate-session', {
        method: 'GET',
        credentials: 'include'
      });
      return res.ok;
    } catch {
      return false;
    }
  }