// Reports Section Component
export default class ReportsSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'reports-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Relatórios</h2>
        </div>
        <div class="card-content">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-chart-bar"></i>
            </div>
            <h3 class="empty-state-title">Nenhum relatório disponível</h3>
            <p class="empty-state-description">
              Os relatórios estarão disponíveis após a conclusão de campanhas com dados suficientes para análise.
            </p>
            <button class="btn btn-primary" id="start-campaign-btn">
              <i class="fas fa-paper-plane"></i> Iniciar uma Campanha
            </button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();

    return this.element;
  }

  addEventListeners() {
    const startCampaignBtn = this.element.querySelector('#start-campaign-btn');
    if (startCampaignBtn) {
      startCampaignBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/create-campaign');
        window.dispatchEvent(new Event('popstate'));
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const startCampaignBtn = this.element.querySelector('#start-campaign-btn');
    if (startCampaignBtn) {
      startCampaignBtn.replaceWith(startCampaignBtn.cloneNode(true));
    }
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}