// Settings Section Component
export default class SettingsSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'settings-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Configurações da Conta</h2>
        </div>
        <div class="card-content">
          <form id="account-settings-form">
            <div class="grid grid-2">
              <div class="form-group">
                <label for="settings-name">Nome</label>
                <input type="text" id="settings-name" value="João Silva">
              </div>
              <div class="form-group">
                <label for="settings-email">Email</label>
                <input type="email" id="settings-email" value="joao.silva@exemplo.com">
              </div>
              <div class="form-group">
                <label for="settings-company">Empresa</label>
                <input type="text" id="settings-company" value="Empresa Exemplo LTDA">
              </div>
              <div class="form-group">
                <label for="settings-role">Cargo</label>
                <input type="text" id="settings-role" value="Administrador">
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Salvar Alterações</button>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Alterar Senha</h2>
        </div>
        <div class="card-content">
          <form id="change-password-form">
            <div class="grid grid-3">
              <div class="form-group">
                <label for="current-password">Senha Atual</label>
                <input type="password" id="current-password">
              </div>
              <div class="form-group">
                <label for="new-password">Nova Senha</label>
                <input type="password" id="new-password">
              </div>
              <div class="form-group">
                <label for="confirm-password">Confirmar Senha</label>
                <input type="password" id="confirm-password">
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" class="btn btn-primary">Alterar Senha</button>
            </div>
          </form>
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();

    return this.element;
  }

  addEventListeners() {
    const accountSettingsForm = this.element.querySelector('#account-settings-form');
    const changePasswordForm = this.element.querySelector('#change-password-form');
    
    if (accountSettingsForm) {
      accountSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Configurações da conta atualizadas com sucesso!');
      });
    }
    
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Senha alterada com sucesso!');
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const forms = this.element.querySelectorAll('form');
    forms.forEach(form => {
      form.replaceWith(form.cloneNode(true));
    });
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}