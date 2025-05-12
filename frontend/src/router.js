import LayoutManager from "./components/LayoutManager.js";
import Dashboard from "./pages/Dashboard.js";

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
      let ComponentToRender;
      let initialSection = null;
  
      if (path.startsWith("/dashboard")) {
        ComponentToRender = this.routes["/dashboard"];
        const parts = path.split("/");
        if (parts.length > 2 && parts[2] !== "") {
          initialSection = parts.slice(2).join("-");
        } else {
          initialSection = "overview";
        }
      } else {
        ComponentToRender = this.routes[path] || this.routes["/"];
      }
  
      if (this.currentComponent && this.currentComponent.unmount) {
        this.currentComponent.unmount();
      }
  
      const componentInstance = new ComponentToRender();
      if (componentInstance instanceof Dashboard && initialSection) {
        componentInstance.initialSection = initialSection;
      }
  
      await componentInstance.render();
      this.layoutManager.initialize();
      this.currentComponent = componentInstance;
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