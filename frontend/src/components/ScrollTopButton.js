// Scroll Top Button Component
export default class ScrollTopButton {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('button');
    this.element.className = 'scroll-top';
    this.element.id = 'scroll-top';
    this.element.innerHTML = `<i class="fas fa-arrow-up"></i>`;

    this.addEventListeners();
    return this.element;
  }

  addEventListeners() {
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        this.element.classList.add('visible');
      } else {
        this.element.classList.remove('visible');
      }
    });

    // Scroll to top on click
    this.element.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  unmount() {
    window.removeEventListener('scroll', () => {});
    
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}