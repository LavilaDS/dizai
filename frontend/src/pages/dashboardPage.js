import {
  getLoggedInHeaderHTML,
  addLogoutButtonListener,
} from "../components/header.js";

export function renderDashboardPage() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  const headerHTML = getLoggedInHeaderHTML();
  const dashboardContentHTML = `
        <div class="dashboard-content">
            <h1>Dashboard do Gestor</h1>
            <p>Status das campanhas e resultados aparecerão aqui.</p>
        </div>
    `;

  appContainer.innerHTML = headerHTML + dashboardContentHTML;
  addLogoutButtonListener();
}
