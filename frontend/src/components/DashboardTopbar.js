import { logout } from '../api/authApi.js';
import { showNotification } from '../utils/notification.js';
import ProfileManager from './common/ProfileManager.js';
import { getInitialName } from '../utils/getInitialName.js';
export default class DashboardTopbar {
  constructor(toggleSidebarMobileCallback, currentSection) {
    this.element = null;
    this.toggleSidebarMobileCallback = toggleSidebarMobileCallback;
    this.currentSection = currentSection || 'Visão Geral';
    this.profileManager = new ProfileManager();
  }
  

  render() {
    const user = localStorage.getItem("user");
    const initialName = getInitialName(user);
    this.element = document.createElement('header');
    this.element.className = 'topbar';
    this.element.innerHTML = `
      <button class="mobile-menu-toggle" id="mobile-menu-toggle">
        <i class="fas fa-bars"></i>
      </button>
      <h1 class="topbar-title">${this.currentSection}</h1>
      <div class="topbar-actions">
        <button class="icon-btn" id="notification-btn">
          <i class="fas fa-bell"></i>
          <span class="notification-badge">3</span>
        </button>
        <div class="dropdown" id="user-dropdown">
          <div class="user-profile" id="user-profile-btn">
            <div class="user-avatar">${initialName}</div>
            <div class="user-info">
              <div class="user-name">${localStorage.getItem("user")}</div>
              <div class="user-role">Gestor</div>
            </div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown-menu" id="user-dropdown-menu">
            <div class="dropdown-header">${localStorage.getItem("user") || "Usuário"}</div>
            <a href="#" class="dropdown-item" id="profile-btn">
              <i class="fas fa-user"></i> Meu Perfil
            </a>
            <div class="dropdown-divider"></div>
            <a href="/login" class="dropdown-item" id="logout-btn">
              <i class="fas fa-sign-out-alt"></i> Sair
            </a>
          </div>
        </div>
      </div>
    `;
  
    this.addEventListeners();
    return this.element;
  }

  setTitle(title) {
    const topbarTitle = this.element.querySelector('.topbar-title');
    if (topbarTitle) {
      topbarTitle.textContent = title;
    }
  }

  addEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = this.element.querySelector('#mobile-menu-toggle');
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSidebarMobileCallback();
      });
    }

    // User dropdown
    const userProfileBtn = this.element.querySelector('#user-profile-btn');
    const userDropdownMenu = this.element.querySelector('#user-dropdown-menu');
    
    if (userProfileBtn && userDropdownMenu) {
      userProfileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('show');
      });
      
      document.addEventListener('click', (e) => {
        if (!userProfileBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
          userDropdownMenu.classList.remove('show');
        }
      });
    }

    // Profile Button
    const profileBtn = this.element.querySelector('#profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        // Close dropdown
        userDropdownMenu.classList.remove('show');
        // Open profile modal
        this.profileManager.openProfileModal();
      });
    }

    // Logout Button
    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async(e) => {
        e.preventDefault();
        const sucess = await logout();
        if(sucess) {
          window.history.pushState({}, '', '/login');
          window.dispatchEvent(new Event('popstate'));
          showNotification("Logout realizado com sucesso!", "success");
        } else {
          showNotification("Erro ao realizar logout. Tente novamente.", "error");
        }
      });
    }
  }

  unmount() {
    // Remove event listeners
    const btns = this.element.querySelectorAll('button');
    btns.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });

    const userProfileBtn = this.element.querySelector('#user-profile-btn');
    if (userProfileBtn) {
      userProfileBtn.replaceWith(userProfileBtn.cloneNode(true));
    }
    
    const profileBtn = this.element.querySelector('#profile-btn');
    if (profileBtn) {
      profileBtn.replaceWith(profileBtn.cloneNode(true));
    }

    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    }
    
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}