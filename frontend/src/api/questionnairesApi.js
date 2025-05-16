import { refreshApi } from "./refreshApi.js";


export async function fetchQuestionnaires() {

  const response = await fetch("/api/questionnaires", { credentials: "include" });
  if (response.status === 401) {
    return await refreshApi(createCampaign);
  }
  try {
    const data = await response.json();
    return { data, ok: response.ok };
  } catch (error) {
    return { ok: response.ok };
  }
}

export async function fetchQuestionnaireDetails(questionnaireId) {
  const response = await fetch(`/api/questionnaires/${questionnaireId}/questions`, { credentials: "include" });
  if (response.status === 401) {
    return await refreshApi(fetchQuestionnaireDetails, questionnaireId);
  }
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    return response.ok
  }
}