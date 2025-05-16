import { refreshApi } from "./refreshApi.js";

export async function createCampaign(payload) {
  const response = await fetch('/api/campaigns', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload),
    credentials: 'include'
  });

  if (response.status === 401) {
    return await refreshApi(createCampaign, payload);
  }
  try {
      const data = await response.json();
      return { data, ok: response.ok };
  } catch (error) {
      return { ok: response.ok };
  }
}