import LayoutManager from "./components/LayoutManager.js";

class Router {
    constructor(routes) {
      this.routes = routes;
      this.currentComponent = null;
      this.layoutManager = new LayoutManager();
      this.layoutManager.initialize();
    

      window.addEventListener('popstate', () => this.handleRoute());
      this.handleRoute();
      
  
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href.startsWith(window.location.origin)) {
          e.preventDefault();
          this.navigate(link.href);
        }
      });
    }
  
    async handleRoute() {
      window.scrollTo(0, 0);
      const path = window.location.pathname;
      const route = this.routes[path] || this.routes['/'];
  
      if (this.currentComponent && this.currentComponent.unmount) {
        this.currentComponent.unmount();
      }
      this.layoutManager.updateLayout();
      const component = new route();
      await component.render();

      this.currentComponent = component;
    }
  
    navigate(url) {
      window.history.pushState({}, '', url);
      this.handleRoute();
    }
}
  
export default Router;
export const navigateTo = (url) => {
  window.history.pushState({}, '', url);
  window.dispatchEvent(new Event('popstate'));
};