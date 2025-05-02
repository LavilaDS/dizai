// frontend/src/pages/loginPage.js
import { navigateTo } from "../router.js";

export function renderLoginPage() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  appContainer.innerHTML = `
        <div class="login-container">
            <h2>Acessar Plataforma Dizaí</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="email">E-mail:</label>
                    <input type="email" id="email" name="email" required value="gestor@empresa.com"> <!-- Valor padrão para teste -->
                </div>
                <div class="form-group">
                    <label for="password">Senha:</label>
                    <input type="password" id="password" name="password" required value="senha123"> <!-- Valor padrão para teste -->
                </div>
                <button type="submit">Entrar</button>
                <p id="login-error" class="error-message" style="display: none;"></p>
            </form>
        </div>
    `;

  addLoginEventListener();
}

function addLoginEventListener() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("login-error");
  errorElement.style.display = "none";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Login OK, token salvo.");
        navigateTo("/dashboard");
      } else {
        console.error("Token não encontrado na resposta.");
        errorElement.textContent = "Erro inesperado ao fazer login.";
        errorElement.style.display = "block";
      }
    } else {
      errorElement.textContent = data.message || `Erro ${response.status}`;
      errorElement.style.display = "block";
    }
  } catch (error) {
    console.error("Falha na requisição de login:", error);
    errorElement.textContent = "Não foi possível conectar ao servidor.";
    errorElement.style.display = "block";
  }
}
