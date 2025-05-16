import { refreshApi } from "./refreshApi.js";

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

export async function getManagerProfile() {
  const response = await fetch('/api/managers/profile', {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (response.status === 401) {
    return await refreshApi(getManagerProfile);
  }
  try {
      const data = await response.json();
      return data;
  } catch (error) {
      return { ok: response.ok };
  }
}

export async function updateManagerProfile(profileData) {
  const response = await fetch('/api/managers/profile', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  
  if (response.status === 401) {
    return await refreshApi(updateManagerProfile, profileData);
  }
  try {
      const data = await response.json();
      return data;
  } catch (error) {
      return { ok: response.ok };
  }
}

export async function changeManagerPassword(passwordData) {
  const response = await fetch('/api/managers/password', {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(passwordData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha ao alterar senha');
  }
  
  return await response.json();
}