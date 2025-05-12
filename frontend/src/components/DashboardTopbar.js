// Dashboard Topbar Component
export default class DashboardTopbar {
  constructor(toggleSidebarMobileCallback, currentSection) {
    this.element = null;
    this.toggleSidebarMobileCallback = toggleSidebarMobileCallback;
    this.currentSection = currentSection || 'Visão Geral';
  }

  render() {
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
            <div class="user-avatar">JS</div>
            <div class="user-info">
              <div class="user-name">João Silva</div>
              <div class="user-role">Administrador</div>
            </div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="dropdown-menu" id="user-dropdown-menu">
            <div class="dropdown-header">João Silva</div>
            <a href="#" class="dropdown-item">
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
      mobileMenuToggle.addEventListener('click', () => {
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

    // Logout Button
    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new Event('popstate'));
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

    const logoutBtn = this.element.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.replaceWith(logoutBtn.cloneNode(true));
    }
    
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}