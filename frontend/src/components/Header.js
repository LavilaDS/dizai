// frontend/src/components/Header.js
export default class Header {
    constructor() {
      this.element = null;
    }
  
    render() {
      this.element = document.createElement('header');
      this.element.className = 'header';
      
        this.element.innerHTML = `
            <div class="container">
            <div class="logo">
                <a href="/home"><span>Diz</span>Aí</a>
            </div>

            <div class="header-buttons">
                <a href="/login" class="btn btn-login">Login</a>
                <a href="/signup" class="btn btn-signup">Cadastre-se</a>
            </div>
            </div>
        `;
      
      return this.element;
    }
  
    unmount() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
  }