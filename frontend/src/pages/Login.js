import { showNotification } from '../utils/notification.js';
import { login as loginApi } from '../api/authApi.js';

class Login {
  constructor() {
    this.element = document.querySelector("main");
    this.load = false;
  }

  async render() {
    this.element.innerHTML = `
      <section class="login-section">
        <div class="container">
          <h2>Login</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" required>
            </div>
            <div class="form-group">
              <label for="login-password">Senha</label>
              <input type="password" id="login-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Entrar</button>
            <p>Não possui uma conta? <a href="/signup" class="link-signup">Cadastre-se</a></p>
            <p id="login-feedback" style="color: red; display: none; margin-top: var(--space-md);">Credenciais inválidas. Tente novamente.</p>
          </form>
        </div>
      </section>
    `;

    this.addEventListeners();
    if (!this.load) {
      this.load = true;
      this.initializeAnimations();
    }
  }

  addEventListeners() {
    const form = document.getElementById("login-form");
    const feedback = document.getElementById("login-feedback");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      feedback.style.display = "none";
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;
      try {
        const { ok, data } = await loginApi({ email, password });
        if (ok) {
          showNotification("Login realizado com sucesso!", "success");
          localStorage.setItem("user", data.manager.name);
          window.history.pushState({}, '', '/dashboard');
          window.dispatchEvent(new Event('popstate'));
        } else {
          showNotification(data.error, "error");
        }
      } catch (err) {
        showNotification("Erro ao conectar com o servidor. Tente novamente.", "error");
      }
    });
  }

  initializeAnimations() {
    const section = this.element.querySelector(".login-section");
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    setTimeout(() => {
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }, 100);
  }

unmount() {
  // Remove event listeners
  const form = document.getElementById("login-form");
  if (form) {
    // Remover todos os event listeners adicionados ao formulário
    // usando o método cloneNode para substituir o elemento
    const newForm = form.cloneNode(true);
    if (form.parentNode) {
      form.parentNode.replaceChild(newForm, form);
    }
  }
  
  // Remover referências a elementos DOM
  this.element.innerHTML = '';
  
  // Resetar estado do componente
  this.load = false;
}
}

export default Login;
