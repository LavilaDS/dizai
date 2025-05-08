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
              <input type="text" id="signup-name" value="${this.formData.name}" required>
            </div>
            <div class="form-group">
              <label for="signup-email">Email</label>
              <input type="email" id="signup-email" value="${this.formData.email}" required>
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
              <input type="password" id="signup-password" value="${this.formData.password}" required>
            </div>
            <div class="form-group">
              <label for="signup-confirm-password">Confirmar Senha</label>
              <input type="password" id="signup-confirm-password" value="${this.formData.confirmPassword}" required>
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
              <input type="text" id="signup-company-name" value="${this.formData.companyName}" required>
            </div>
            <div class="form-group">
              <label for="signup-cnpj">CNPJ</label>
              <input type="text" id="signup-cnpj" value="${this.formData.cnpj}" required>
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

    if (this.currentStep === 1) {
      const nextStepButton = document.getElementById('next-step');
      nextStepButton.addEventListener('click', () => {
        this.formData.name = document.getElementById('signup-name').value;
        this.formData.email = document.getElementById('signup-email').value;
        this.currentStep = 2;
        this.render();
      });
    } else if (this.currentStep === 2) {
      const nextStepButton = document.getElementById('next-step');
      const prevStepButton = document.getElementById('prev-step');

      nextStepButton.addEventListener('click', () => {
        this.formData.password = document.getElementById('signup-password').value;
        this.formData.confirmPassword = document.getElementById('signup-confirm-password').value;
        this.currentStep = 3;
        this.render();
      });

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

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.formData.companyName = document.getElementById('signup-company-name').value;
        this.formData.cnpj = document.getElementById('signup-cnpj').value;
        console.log('Signup attempt:', this.formData);
        // Add your signup logic here
      });
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