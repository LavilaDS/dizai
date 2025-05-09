// Dashboard component - refactored to load sections on demand
import DashboardSidebar from '../components/DashboardSidebar.js';
import DashboardTopbar from '../components/DashboardTopbar.js';
import ScrollTopButton from '../components/ScrollTopButton.js';

// Import section components
import OverviewSection from '../components/DashboardComponents/OverviewSection.js';
import QuestionnairesSection from '../components/DashboardComponents/QuestionnairesSection.js';
import CampaignsSection from '../components/DashboardComponents/CampaignsSection.js';
import RecipientsSection from '../components/DashboardComponents/RecipientsSection.js';
import ReportsSection from '../components/DashboardComponents/ReportsSection.js';
import SettingsSection from '../components/DashboardComponents/SettingsSection.js';

class Dashboard {
  constructor() {
    this.element = document.querySelector('main');
    this.sidebarCollapsed = false;
    this.currentSection = 'overview';
    this.sectionTitles = {
      'overview': 'Visão Geral',
      'questionnaires': 'Questionários',
      'campaigns': 'Campanhas',
      'recipients': 'Destinatários',
      'reports': 'Relatórios',
      'settings': 'Configurações'
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
    this.activateSection(this.currentSection);
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
    
    // Create a new component based on section
    let component;
    switch (section) {
      case 'overview':
        component = new OverviewSection();
        break;
      case 'questionnaires':
        component = new QuestionnairesSection();
        break;
      case 'campaigns':
        component = new CampaignsSection();
        break;
      case 'recipients':
        component = new RecipientsSection();
        break;
      case 'reports':
        component = new ReportsSection();
        break;
      case 'settings':
        component = new SettingsSection();
        break;
      default:
        component = new OverviewSection();
    }
    
    // Cache the component
    this.sectionComponents[section] = component;
    return component;
  }

  activateSection(section) {
    const mainContent = document.getElementById('dashboard-main-content');
    
    // Update current section
    this.currentSection = section;
    
    // Update sidebar active item
    this.sidebar.setActiveSection(section);
    
    // Update topbar title
    this.topbar.setTitle(this.sectionTitles[section]);
    
    // Remove current active section if exists
    if (this.activeSection) {
      this.activeSection.element.remove();
    }
    
    // Get component for the section
    const component = this.getComponentForSection(section);
    
    // Render the component
    this.activeSection = component;
    mainContent.appendChild(component.render());
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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