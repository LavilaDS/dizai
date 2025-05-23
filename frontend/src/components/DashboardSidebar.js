// Dashboard Sidebar Component
export default class DashboardSidebar {
  constructor(toggleSidebarCallback, activateSectionCallback) {
    this.element = null;
    this.toggleSidebarCallback = toggleSidebarCallback;
    this.activateSectionCallback = activateSectionCallback;
    this.collapsed = false;
  }

  render() {
    this.element = document.createElement('aside');
    this.element.className = 'sidebar';
    this.element.id = 'sidebar';

    this.element.innerHTML = `
      <div class="sidebar-logo">
        <div class="logo-icon">
          <i class="fas fa-poll"></i>
        </div>
        <div class="logo-text">DizAí</div>
        <button class="sidebar-toggle" id="sidebar-toggle">
          <i class="fas fa-chevron-left"></i>
        </button>
      </div>

      <nav class="sidebar-menu">
        <a href="/dashboard/overview" class="sidebar-menu-item" data-section="overview">
          <i class="fas fa-home"></i>
          <span class="menu-text">Visão Geral</span>
        </a>
        <a href="/dashboard/questionnaires" class="sidebar-menu-item" data-section="questionnaires">
          <i class="fas fa-file-alt"></i>
          <span class="menu-text">Questionários</span>
        </a>
        <a href="/dashboard/campaigns" class="sidebar-menu-item" data-section="campaigns">
          <i class="fas fa-paper-plane"></i>
          <span class="menu-text">Campanhas</span>
        </a>
        <div class="sidebar-divider"></div>
        <a href="/dashboard/reports" class="sidebar-menu-item" data-section="reports">
          <i class="fas fa-chart-bar"></i>
          <span class="menu-text">Relatórios</span>
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <span class="menu-text">DizAí &copy; ${new Date().getFullYear()}</span>
      </div>
    `;

    this.addEventListeners();
    return this.element;
  }

  addEventListeners() {
    // Toggle sidebar
    const sidebarToggle = this.element.querySelector('#sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', () => {
        this.collapsed = !this.collapsed;
        this.toggleSidebarCallback();
      });
    }

    // Section navigation
    const menuItems = this.element.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = item.getAttribute('data-section');
        e.preventDefault(); // Adicione esta linha para impedir a navegação padrão
        e.stopPropagation()
        // Update active menu item
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Notify parent component
        this.activateSectionCallback(section);
        
        // On mobile, close sidebar after selection
        if (window.innerWidth <= 768) {
          this.element.classList.remove('mobile-open');
          // Also hide overlay when closing menu by item selection
          const overlay = document.querySelector('.mobile-overlay');
          if (overlay) {
            overlay.classList.remove('active');
          }
        }
      });
    });
  }

  toggleCollapse() {
    this.element.classList.toggle('collapsed');
  }

  toggleMobileOpen() {
    this.element.classList.toggle('mobile-open');
    
    // Create or remove overlay for mobile
    if (this.element.classList.contains('mobile-open')) {
      // Create overlay if it doesn't exist
      if (!document.querySelector('.mobile-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';
        document.body.appendChild(overlay);
        
        // Add click event to close sidebar when clicking outside
        overlay.addEventListener('click', () => {
          this.element.classList.remove('mobile-open');
          overlay.classList.remove('active');
        });
      }
      
      // Show overlay
      const overlay = document.querySelector('.mobile-overlay');
      overlay.classList.add('active');
    } else {
      // Hide overlay
      const overlay = document.querySelector('.mobile-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
    }
  }

  setActiveSection(section) {
    const menuItems = this.element.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => {
      if (item.getAttribute('data-section') === section) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  unmount() {
    // Remove event listeners
    const sidebarToggle = this.element.querySelector('#sidebar-toggle');
    if (sidebarToggle) {
      sidebarToggle.replaceWith(sidebarToggle.cloneNode(true));
    }
    
    const menuItems = this.element.querySelectorAll('.sidebar-menu-item');
    menuItems.forEach(item => {
      item.replaceWith(item.cloneNode(true));
    });
    
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}