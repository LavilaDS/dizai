// frontend/src/components/Footer.js
export default class Footer {
    constructor() {
      this.element = null;
    }
  
    render() {
      this.element = document.createElement('footer');
      this.element.className = 'footer';
      this.element.innerHTML = `
        <div class="container">
          <div class="footer-content">
            <div class="footer-about">
              <div class="footer-logo">
                <a href="/"><span>Diz</span>Aí</a>
              </div>
              <p class="footer-description">Transforme feedback em decisões estratégicas com nossa plataforma completa para aplicação e gestão de questionários corporativos.</p>
              <div class="footer-social">
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            
            <div class="footer-links">
              <h4>Links Rápidos</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">Saiba Mais</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/signup">Cadastre-se</a></li>
              </ul>
            </div>
            
            <div class="footer-links">
              <h4>Recursos</h4>
              <ul>
                <li><a href="/about#benefits">Benefícios</a></li>
                <li><a href="/about#how-it-works">Como Funciona</a></li>
                <li><a href="/about#faq">FAQ</a></li>
              </ul>
            </div>
            
            <div class="footer-contact">
              <h4>Contato</h4>
              <ul>
                <li><i class="fas fa-envelope"></i> contato@dizai.com.br</li>
                <li><i class="fas fa-phone"></i> (11) 9999-9999</li>
                <li><i class="fas fa-map-marker-alt"></i> São Paulo, SP</li>
              </ul>
            </div>
          </div>
          
          <div class="footer-bottom">
            <p>&copy; <span id="current-year">2025</span> DizAí. Todos os direitos reservados.</p>
            <div class="footer-legal">
              <a href="#">Termos de Uso</a>
              <a href="#">Política de Privacidade</a>
            </div>
          </div>
        </div>
      `;
  
      // Set current year
      const yearElement = this.element.querySelector('#current-year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
  
      return this.element;
    }
  
    unmount() {
      if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
  }