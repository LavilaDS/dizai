// Dashboard component - refactored to load sections on demand
import DashboardSidebar from '../components/DashboardSidebar.js';
import DashboardTopbar from '../components/DashboardTopbar.js';
import ScrollTopButton from '../components/ScrollTopButton.js';

// Import section components
import OverviewSection from '../components/DashboardComponents/OverviewSection.js';
import QuestionnairesSection from '../components/DashboardComponents/QuestionnairesSection.js';
import ReportsSection from '../components/DashboardComponents/ReportsSection.js';

class Dashboard {
  constructor() {
    this.element = document.querySelector('main');
    this.sidebarCollapsed = false;
    
    // Define seção inicial com base na URL
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    
    if (pathSegments.length >= 1 && pathSegments[0] === 'dashboard') {
      // Se for apenas /dashboard/ ou /dashboard, define como overview
      if (pathSegments.length === 1) {
        this.initialSection = 'overview';
        // Atualiza URL para incluir a seção
        window.history.replaceState({}, '', '/dashboard/overview');
      } else {
        // Se já tem uma seção especificada (/dashboard/alguma-secao)
        this.initialSection = pathSegments[1] || 'overview';
      }
    } else {
      this.initialSection = 'overview';
    }
    
    this.currentSection = this.initialSection;
    this.sectionTitles = {
      'overview': 'Visão Geral',
      'questionnaires': 'Questionários',
      'reports': 'Relatórios'
    };
    
    // Component references
    this.sidebar = null;
    this.topbar = null;
    this.scrollTopButton = null;
    this.activeSection = null;
    
    // Track created section components to avoid recreating them
    this.sectionComponents = {};
  }

  async render() {
    this.currentSection = this.initialSection || 'overview';
    // Create dashboard structure
    this.element.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- Sidebar will be injected here -->
        
        <!-- Topbar will be injected here -->
          
        <!-- Main Content -->
        <main class="main-content" id="dashboard-main-content">
          <!-- Active section will be injected here -->
        </main>
      </div>
      
      <!-- Scroll to top button will be injected here -->
    `;

    // Render components
    this.renderComponents();
    this.activateSection(this.currentSection, false); // false para não dar pushState na inicialização
  }

  renderComponents() {
    const dashboardWrapper = this.element.querySelector('.dashboard-wrapper');
    
    // Sidebar
    this.sidebar = new DashboardSidebar(
      () => this.toggleSidebar(),
      (section) => this.activateSection(section)
    );
    dashboardWrapper.insertBefore(this.sidebar.render(), dashboardWrapper.firstChild);
    
    // Topbar
    this.topbar = new DashboardTopbar(
      () => this.toggleSidebarMobile(),
      this.sectionTitles[this.currentSection]
    );
    dashboardWrapper.insertBefore(this.topbar.render(), dashboardWrapper.querySelector('.main-content'));
    
    // Scroll to top button
    this.scrollTopButton = new ScrollTopButton();
    this.element.appendChild(this.scrollTopButton.render());
  }

  getComponentForSection(section) {
    // Return cached component if it exists
    if (this.sectionComponents[section]) {
      return this.sectionComponents[section];
    }
    // console.log(`Creating new component for section: ${section}`);
    // Create a new component based on section
    let component;
    switch (section) {
      case 'overview':
        component = new OverviewSection();
        break;
      case 'questionnaires':
        component = new QuestionnairesSection();
        break;
      case 'reports':
        component = new ReportsSection();
        break;
      default:
        component = new OverviewSection();
    }
    
    // Cache the component
    this.sectionComponents[section] = component;
    return component;
  }

  async activateSection(section, shouldPushState = true) {
    const mainContent = document.getElementById('dashboard-main-content');
    
    // Update current section
    this.currentSection = section;
    
    // Update sidebar active item
    this.sidebar.setActiveSection(section);
    
    // Update topbar title
    this.topbar.setTitle(this.sectionTitles[section]);
    
    // Verificar se já temos um elemento renderizado para este componente
    const component = this.getComponentForSection(section);
    
    // Remover a seção ativa atual apenas se for diferente da nova
    if (this.activeSection && this.activeSection !== component) {
        if (this.activeSection.element) {
            this.activeSection.element.remove();
        }
    }
    
    // Se o componente já tiver um elemento e ele não estiver no DOM, anexá-lo
    if (component.element) {
        if (!component.element.isConnected) {
            mainContent.appendChild(component.element);
        }
    } else {
        // Renderizar o componente pela primeira vez
        mainContent.appendChild(await component.render());
    }
    
    this.activeSection = component;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (shouldPushState) {
        window.history.pushState({}, '', `/dashboard/${section}`);
    }
  }
  toggleSidebar() {
    this.sidebar.toggleCollapse();
    document.querySelector('.main-content').style.marginLeft = 
      this.sidebar.element.classList.contains('collapsed') ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
    document.querySelector('.topbar').style.left = 
      this.sidebar.element.classList.contains('collapsed') ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
  }

  toggleSidebarMobile() {
    this.sidebar.toggleMobileOpen();
  }

  unmount() {
    // Unmount all components
    if (this.sidebar) this.sidebar.unmount();
    if (this.topbar) this.topbar.unmount();
    if (this.activeSection) this.activeSection.unmount();
    if (this.scrollTopButton) this.scrollTopButton.unmount();
    
    // Clean up section components
    Object.values(this.sectionComponents).forEach(component => {
      if (component && component.unmount) {
        component.unmount();
      }
    });
  }
}

export default Dashboard;

