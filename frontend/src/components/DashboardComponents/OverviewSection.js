// Overview Section Component
export default class OverviewSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'overview-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="quick-actions">
        <button class="quick-action-btn" id="create-campaign-btn">
          <div class="quick-action-icon primary">
            <i class="fas fa-paper-plane"></i>
          </div>
          <div class="quick-action-content">
            <div class="quick-action-title">Nova Campanha</div>
            <div class="quick-action-description">Selecionar questionário</div>
          </div>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-3">
        <div class="card">
          <div class="stat-card">
            <div class="stat-icon primary">
              <i class="fas fa-paper-plane"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">8</div>
              <div class="stat-label">Campanhas Ativas</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i> 25% este mês
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="stat-card">
            <div class="stat-icon secondary">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">256</div>
              <div class="stat-label">Destinatários</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i> 12% este mês
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="stat-card">
            <div class="stat-icon accent">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-value">142</div>
              <div class="stat-label">Respostas Recebidas</div>
              <div class="stat-change positive">
                <i class="fas fa-arrow-up"></i> 18% este mês
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Response Rate Chart -->
      <div class="grid grid-2">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Taxa de Resposta</h2>
            <div class="card-actions">
              <button class="icon-btn">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="chart-container">
              <div class="mock-chart"></div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color legend-primary"></div>
                  <span>Enviados</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color legend-accent"></div>
                  <span>Respondidos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Atividades Recentes</h2>
            <div class="card-actions">
              <button class="icon-btn">
                <i class="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-paper-plane"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">Campanha <strong>Avaliação de Desempenho</strong> foi iniciada</div>
                  <div class="activity-time">há 2 horas</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-user-plus"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">15 novos destinatários foram adicionados</div>
                  <div class="activity-time">há 5 horas</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">Campanha <strong>Clima Organizacional</strong> foi concluída</div>
                  <div class="activity-time">há 1 dia</div>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-text">Novo questionário <strong>Feedback de Clientes</strong> foi criado</div>
                  <div class="activity-time">há 2 dias</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();

    return this.element;
  }

  addEventListeners() {
    const createCampaignBtn = this.element.querySelector('#create-campaign-btn');
    if (createCampaignBtn) {
      createCampaignBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/dashboard/questionnaires');
        window.dispatchEvent(new Event('popstate'));
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const createCampaignBtn = this.element.querySelector('#create-campaign-btn');
    if (createCampaignBtn) {
      createCampaignBtn.replaceWith(createCampaignBtn.cloneNode(true));
    }
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}