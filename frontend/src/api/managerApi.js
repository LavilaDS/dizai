export async function registerManager(formData) {
  const response = await fetch('/api/managers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      company_name: formData.companyName,
      company_cnpj: formData.cnpj
    })
  });
  const data = await response.json();
  return { ok: response.ok, data };
}