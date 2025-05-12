// frontend/src/components/LayoutManager.js
import Header from './Header.js';
import Footer from './Footer.js';

export default class LayoutManager {
  constructor() {
    this.header = new Header();
    this.footer = new Footer();
    this.contentContainer = null;
    
    // Routes that should use the dashboard layout
    this.dashboardRoutes = ['/dashboard'];
  }

  initialize() {
    // Create main content container if it doesn't exist
    if (!document.querySelector('main')) {
      this.contentContainer = document.createElement('main');
      document.body.appendChild(this.contentContainer);
    } else {
      this.contentContainer = document.querySelector('main');
    }
    
    this.updateLayout();
  }

  updateLayout() {
    const currentPath = window.location.pathname;
    const isDashboardRoute = this.dashboardRoutes.some(route => 
      currentPath === route || currentPath.startsWith(`${route}/`)
    );
    
    const existingHeader = document.querySelector('header.header');
    if (!isDashboardRoute) {
      if (!existingHeader) {
        document.body.insertBefore(this.header.render(), document.body.firstChild);
      }
    } else if (existingHeader) {
      existingHeader.remove();
    }
    
    // Handle footer
    const existingFooter = document.querySelector('footer.footer');
    if (!isDashboardRoute) {
      if (!existingFooter) {
        document.body.appendChild(this.footer.render());
      }
    } else if (existingFooter) {
      existingFooter.remove();
    }
  }
}