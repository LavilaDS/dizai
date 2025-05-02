// frontend/src/components/header.js
import { navigateTo } from "../router.js";

function handleLogout() {
  localStorage.removeItem("authToken");
  navigateTo("/login");
}

export function addLogoutButtonListener() {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", handleLogout);
  }
}

export function getLoggedInHeaderHTML() {
  return `
        <header class="main-header">
            <span>Dizaí</span>
            <nav>
               <!-- Links de navegação podem ir aqui, ex: -->
               <a href="#/dashboard">Dashboard</a> |
               <a href="#/create-campaign">Nova Campanha</a>
            </nav>
            <button id="logout-button">Sair</button>
        </header>
    `;
}
