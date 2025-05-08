import { validateName, validateEmail, validatePassword, validateCnpj } from '../utils/validation.js';
import { showNotification } from '../utils/notification.js';
import { showFieldError } from '../utils/showFieldError.js';
import { clearFieldError } from '../utils/clearFieldError.js';
import { clearAllErrors } from '../utils/clearAllErrors.js';
import { getCurrentStepFields } from '../utils/getCurrentStepFields.js';
import { registerManager } from '../api/managerApi.js';

class Signup {
  constructor() {
    this.element = document.querySelector('main');
    this.currentStep = 1;
    this.load = false;
    this.formData = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      cnpj: ''
    };
  }

  async render() {
    this.element.innerHTML = this.getStepTemplate();
    this.addEventListeners();
    if(!this.load) {
      this.load = true;
      this.initializeAnimations();
    }
  }

  getStepTemplate() {
    return `
      <section class="signup-section">
        <div class="container">
          <h1 class="signup-title">Cadastro</h1>
          ${this.getStepContent()}
        </div>
      </section>
    `;
  }

  getStepContent() {
    if (this.currentStep === 1) {
      return `
        <div>
          <h2 class="signup-header">Dados Pessoais</h2>
          <form id="signup-form">
            <div class="form-group">
              <label for="signup-name">Nome</label>
              <input type="text" id="signup-name" value="${this.formData.name}">
            </div>
            <div class="form-group">
              <label for="signup-email">Email</label>
              <input type="email" id="signup-email" value="${this.formData.email}">
            </div>
            <button type="button" class="btn btn-primary" id="next-step">Próximo</button>
          </form>
          <p class="signup-login-link">Já possui cadastro? <a href="/login">Faça login</a></p>
        </div>
      `;
    } else if (this.currentStep === 2) {
      return `
        <div>
          <h2 class="signup-header">Segurança</h2>
          <form id="signup-form">
            <div class="form-group">
              <label for="signup-password">Senha</label>
              <input type="password" id="signup-password" value="${this.formData.password}">
            </div>
            <div class="form-group">
              <label for="signup-confirm-password">Confirmar Senha</label>
              <input type="password" id="signup-confirm-password" value="${this.formData.confirmPassword}">
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="prev-step">Voltar</button>
              <button type="button" class="btn btn-primary" id="next-step">Próximo</button>
            </div>
          </form>
          <p class="signup-login-link">Já possui cadastro? <a href="/login">Faça login</a></p>
        </div>
      `;
    } else if (this.currentStep === 3) {
      return `
        <div>
          <h2 class="signup-header">Dados da Empresa</h2>
          <form id="signup-form">
            <div class="form-group">
              <label for="signup-company-name">Nome da Empresa</label>
              <input type="text" id="signup-company-name" value="${this.formData.companyName}">
            </div>
            <div class="form-group">
              <label for="signup-cnpj">CNPJ</label>
              <input type="text" id="signup-cnpj" value="${this.formData.cnpj}">
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" id="prev-step">Voltar</button>
              <button type="submit" class="btn btn-primary">Cadastrar</button>
            </div>
          </form>
          <p class="signup-login-link">Já possui cadastro? <a href="/login">Faça login</a></p>
        </div>
      `;
    }
  }

  addEventListeners() {
    const form = document.getElementById('signup-form');
    const clearAll = () => clearAllErrors(this.currentStep);

    if (this.currentStep === 1) {
      const nextStepButton = document.getElementById('next-step');
      nextStepButton.addEventListener('click', () => {
        clearAll();
        this.formData.name = document.getElementById('signup-name').value.trim();
        this.formData.email = document.getElementById('signup-email').value.trim();
        let hasError = false;
        if (!validateName(this.formData.name)) {
          showFieldError('signup-name','Nome inválido.');
          hasError = true;
        }
        if (!validateEmail(this.formData.email)) {
          showFieldError('signup-email','Email inválido.');
          hasError = true;
        }
        if (hasError) return;
        this.currentStep = 2;
        this.render();
      });
      document.getElementById('signup-name').addEventListener('input', () => clearFieldError('signup-name'));
      document.getElementById('signup-email').addEventListener('input', () => clearFieldError('signup-email'));
    } else if (this.currentStep === 2) {
      const nextStepButton = document.getElementById('next-step');
      const prevStepButton = document.getElementById('prev-step');
      nextStepButton.addEventListener('click', () => {
        clearAll();
        this.formData.password = document.getElementById('signup-password').value;
        this.formData.confirmPassword = document.getElementById('signup-confirm-password').value;
        let hasError = false;
        if (!validatePassword(this.formData.password)) {
          showFieldError('signup-password','Senha inválida.');  
          hasError = true;
        }
        if (!this.formData.confirmPassword) {
          showFieldError('signup-confirm-password', 'Confirme a senha.');
          hasError = true;
        } else if (this.formData.password !== this.formData.confirmPassword) {
          showFieldError('signup-confirm-password', 'As senhas não coincidem.');
          hasError = true;
        }
        if (hasError) return;
        this.currentStep = 3;
        this.render();
      });
      document.getElementById('signup-password').addEventListener('input', () => clearFieldError('signup-password'));
      document.getElementById('signup-confirm-password').addEventListener('input', () => clearFieldError('signup-confirm-password'));
      prevStepButton.addEventListener('click', () => {
        this.currentStep = 1;
        this.render();
      });
    } else if (this.currentStep === 3) {
      const prevStepButton = document.getElementById('prev-step');
      prevStepButton.addEventListener('click', () => {
        this.currentStep = 2;
        this.render();
      });
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAll();
        this.formData.companyName = document.getElementById('signup-company-name').value.trim();
        this.formData.cnpj = document.getElementById('signup-cnpj').value.trim();
        let hasError = false;
        if (!this.formData.companyName) {
          showFieldError('signup-company-name', 'Preencha o nome da empresa.');
          hasError = true;
        }
        if (!validateCnpj(this.formData.cnpj)) {
          showFieldError('signup-cnpj','CNPJ inválido.');
          hasError = true;
        }
        if (hasError) return;
        try {
          const { ok, data } = await registerManager(this.formData);
          if (ok) {
            showNotification('Cadastro realizado com sucesso!', 'success');
            window.history.pushState({}, '', '/login');
            window.dispatchEvent(new Event('popstate'));
          } else {
            if (data.error && data.error.toLowerCase().includes('e-mail')) {
              this.currentStep = 1;
              this.render();
              showFieldError('signup-email', data.error);
            } else if (data.error && data.error.toLowerCase().includes('cnpj')) {
              showFieldError('signup-cnpj', data.error);
            } else if (data.error && data.error.toLowerCase().includes('senha')) {
              this.currentStep = 2;
              this.render();
              showFieldError('signup-password', data.error);
              this.formData.confirmPassword = '';
            } else {
              showNotification(data.error || data.message || 'Erro ao cadastrar.', 'error');
            }
          }
        } catch (err) {
          showNotification('Erro de conexão com o servidor.', 'error');
        }
      });
      document.getElementById('signup-company-name').addEventListener('input', () => clearFieldError('signup-company-name'));
      document.getElementById('signup-cnpj').addEventListener('input', () => clearFieldError('signup-cnpj'));
    }
  }

  initializeAnimations() {
    const section = this.element.querySelector('.signup-section');
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 100);
  }

  unmount() {
    // Clean up if needed
  }
}

export default Signup;