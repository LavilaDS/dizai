import ModalManager from './ModalManager.js';
import { getManagerProfile, updateManagerProfile, changeManagerPassword } from '../../api/managerApi.js';
import { showNotification } from '../../utils/notification.js';
import { validateName, validateEmail, validatePassword } from '../../utils/validation.js';

export default class ProfileManager {
  constructor() {
    this.modalManager = new ModalManager();
    this.profile = null;
    this.isPasswordForm = false;
  }

  async openProfileModal() {
    try {
      this.profile = await getManagerProfile();
      
      const initials = this._getInitials(this.profile.name);
      
      this.modalManager.open({
        title: "Editar Perfil",
        customClass: "profile-edit-modal",
        bodyContent: () => `
          <div class="profile-avatar-section">
            <div class="profile-avatar">${initials}</div>
            <h3 class="profile-name">${this.profile.name}</h3>
            <p class="profile-role">Gestor</p>
          </div>
          
          <div class="modal-body-light">
            <div id="profile-form" class="${this.isPasswordForm ? 'hidden' : ''}">
              <div class="profile-form-group">
                <label for="profileName">Nome Completo</label>
                <input type="text" id="profileName" class="profile-input" value="${this.profile.name}" placeholder="Seu nome completo">
                <span class="input-error-msg" id="profileNameError"></span>
              </div>
              
              <div class="profile-form-group">
                <label for="profileEmail">E-mail</label>
                <input type="email" id="profileEmail" class="profile-input" value="${this.profile.email}" placeholder="seu@email.com">
                <span class="input-error-msg" id="profileEmailError"></span>
                <span class="input-info">Este email será usado para login e comunicações.</span>
              </div>
              
              <div class="profile-separator"></div>
              
              <button id="changePasswordBtn" class="profile-button profile-button-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Alterar Senha
              </button>
            </div>
            
            <div id="password-form" class="${!this.isPasswordForm ? 'hidden' : ''}">
              <div class="profile-form-group">
                <label for="currentPassword">Senha Atual</label>
                <input type="password" id="currentPassword" class="profile-input" placeholder="Sua senha atual">
                <span class="input-error-msg" id="currentPasswordError"></span>
              </div>
              
              <div class="profile-form-group">
                <label for="newPassword">Nova Senha</label>
                <input type="password" id="newPassword" class="profile-input" placeholder="Nova senha">
                <span class="input-error-msg" id="newPasswordError"></span>
                <span class="input-info">Use pelo menos 8 caracteres com letras e números.</span>
              </div>
              
              <div class="profile-form-group">
                <label for="confirmPassword">Confirme a Nova Senha</label>
                <input type="password" id="confirmPassword" class="profile-input" placeholder="Confirme a nova senha">
                <span class="input-error-msg" id="confirmPasswordError"></span>
              </div>
              
              <div class="profile-separator"></div>
              
              <button id="backToProfileBtn" class="profile-button profile-button-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Voltar ao Perfil
              </button>
            </div>
          </div>
        `,
        footerContent: () => `
          <button id="cancelBtn" class="profile-button profile-button-secondary">Cancelar</button>
          <button id="saveBtn" class="profile-button profile-button-primary">
            ${this.isPasswordForm ? 'Salvar Nova Senha' : 'Salvar Alterações'}
          </button>
        `,
        events: {
          '#cancelBtn': {
            click: () => this.modalManager.close()
          },
          '#saveBtn': {
            click: () => this._handleSave()
          },
          '#changePasswordBtn': {
            click: () => this._showPasswordForm()
          },
          '#backToProfileBtn': {
            click: () => this._showProfileForm()
          }
        }
      });
    } catch (error) {
      showNotification('Erro ao carregar dados do perfil', 'error');
      console.error('Error fetching profile data:', error);
    }
  }
  
  _getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .filter((_, index, array) => index === 0 || index === array.length - 1)
      .join('')
      .toUpperCase();
  }
  
  _showPasswordForm() {
    this.isPasswordForm = true;
    document.getElementById('profile-form').classList.add('hidden');
    document.getElementById('password-form').classList.remove('hidden');
    this.modalManager.updateFooter(`
      <button id="cancelBtn" class="profile-button profile-button-secondary">Cancelar</button>
      <button id="saveBtn" class="profile-button profile-button-primary">Salvar Nova Senha</button>
    `);
    
    // Reattach event listeners
    this.modalManager._removeEventListeners();
    this.modalManager._setupEventListeners({
      '#cancelBtn': {
        click: () => this.modalManager.close()
      },
      '#saveBtn': {
        click: () => this._handleSavePassword()
      },
      '#backToProfileBtn': {
        click: () => this._showProfileForm()
      }
    });
  }
  
  _showProfileForm() {
    this.isPasswordForm = false;
    document.getElementById('password-form').classList.add('hidden');
    document.getElementById('profile-form').classList.remove('hidden');
    this.modalManager.updateFooter(`
      <button id="cancelBtn" class="profile-button profile-button-secondary">Cancelar</button>
      <button id="saveBtn" class="profile-button profile-button-primary">Salvar Alterações</button>
    `);
    
    // Reattach event listeners
    this.modalManager._removeEventListeners();
    this.modalManager._setupEventListeners({
      '#cancelBtn': {
        click: () => this.modalManager.close()
      },
      '#saveBtn': {
        click: () => this._handleSave()
      },
      '#changePasswordBtn': {
        click: () => this._showPasswordForm()
      }
    });
  }
  
  async _handleSave() {
    // Clear previous errors
    document.getElementById('profileNameError').textContent = '';
    document.getElementById('profileEmailError').textContent = '';
    
    // Get form data
    const name = document.getElementById('profileName').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    
    // Validate form data
    let isValid = true;
    
    if (!validateName(name)) {
      document.getElementById('profileNameError').textContent = 'Nome inválido';
      document.getElementById('profileName').classList.add('error');
      isValid = false;
    }
    
    if (!validateEmail(email)) {
      document.getElementById('profileEmailError').textContent = 'Email inválido';
      document.getElementById('profileEmail').classList.add('error');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Submit the form data
    try {
      const updatedProfile = await updateManagerProfile({ name, email });
      // Update the UI
      this.profile = updatedProfile;
      const initials = this._getInitials(this.profile.name);
      document.querySelector('.profile-avatar').textContent = initials;
      document.querySelector('.profile-name').textContent = this.profile.name;
      
      // Update username and avatar in dropdown-header and user-avatar
      const dropdownHeader = document.querySelector('.dropdown-header');
      if (dropdownHeader) {
        dropdownHeader.textContent = this.profile.name;
      }

      const userAvatar = document.querySelector('.user-avatar');
      if (userAvatar) {
        userAvatar.textContent = initials;
      }

      // Update username in localStorage and topbar
      localStorage.setItem('user', this.profile.name);
      if (document.querySelector('.user-name')) {
        document.querySelector('.user-name').textContent = this.profile.name;
      }
      
      showNotification('Perfil atualizado com sucesso!', 'success');
      this.modalManager.close();
    } catch (error) {
      showNotification(error.message || 'Erro ao atualizar perfil', 'error');
    }
  }
  
  async _handleSavePassword() {
    // Clear previous errors
    document.getElementById('currentPasswordError').textContent = '';
    document.getElementById('newPasswordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    
    // Get form data
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    
    // Validate form data
    let isValid = true;
    
    if (!currentPassword) {
      document.getElementById('currentPasswordError').textContent = 'Senha atual é obrigatória';
      document.getElementById('currentPassword').classList.add('error');
      isValid = false;
    }
    
    if (!validatePassword(newPassword)) {
      document.getElementById('newPasswordError').textContent = 'Senha inválida. Use pelo menos 8 caracteres com letras e números.';
      document.getElementById('newPassword').classList.add('error');
      isValid = false;
    }
    
    if (newPassword !== confirmPassword) {
      document.getElementById('confirmPasswordError').textContent = 'Senhas não conferem';
      document.getElementById('confirmPassword').classList.add('error');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Submit the form data
    try {
      await changeManagerPassword({ 
        currentPassword, 
        newPassword 
      });
      
      showNotification('Senha alterada com sucesso!', 'success');
      this._showProfileForm();
      
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } catch (error) {
      showNotification(error.message || 'Erro ao alterar senha', 'error');
    }
  }
  
  _isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}
