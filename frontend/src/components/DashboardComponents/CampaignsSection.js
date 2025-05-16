// CampaignsSection Component
export default class CampaignsSection {
  constructor() {
    this.element = null;
    this.campaignsData = [
      {
        id: 1,
        name: 'Avaliação Anual',
        questionnaire: 'Desempenho 2025',
        responses: 23,
        total: 45,
        rate: 51,
        deadline: '2025-06-13',
        status: 'Ativa'
      },
      {
        id: 2,
        name: 'Feedback Interno',
        questionnaire: 'Clima Organizacional',
        responses: 65,
        total: 78,
        rate: 83,
        deadline: '2025-05-31',
        status: 'Concluída'
      },
      {
        id: 3,
        name: 'Onboarding Novos Colaboradores',
        questionnaire: 'Integração Q2 2025',
        responses: 3,
        total: 12,
        rate: 25,
        deadline: '2025-07-14',
        status: 'Rascunho'
      }
    ];
  }

  async render() {
    this.element = document.createElement('section');
    this.element.id = 'campaigns-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="section-header">
        <div class="section-header-title">
          <i class="fas fa-paper-plane"></i>
          <h2>Campanhas</h2>
        </div>
        <p class="section-description">Gerencie suas campanhas de feedback e avaliações</p>
      </div>
      
      <div class="campaigns-container">
        ${this.renderCampaignsTable()}
        ${this.renderCampaignCards()}
      </div>
    `;

    // Add event listeners
    this.addEventListeners();
    this.handleResponsiveness();

    return this.element;
  }

  renderCampaignsTable() {
    return `
      <table class="campaigns-table">
        <thead>
          <tr>
            <th>CAMPANHA</th>
            <th>ENVIOS/RESPOSTAS</th>
            <th>PRAZO</th>
            <th>STATUS</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          ${this.campaignsData.map(campaign => `
            <tr data-campaign-id="${campaign.id}">
              <td>${campaign.name}</td>
              <td>${campaign.responses} de ${campaign.total}</td>
              <td>${this.formatDate(campaign.deadline)}</td>
              <td>
                <div class="campaign-status status-${this.getStatusClass(campaign.status)}">
                  <span class="status-dot"></span>
                  <span class="status-text">${campaign.status}</span>
                </div>
              </td>
              <td>
                <div class="campaign-actions">
                  <button class="action-button chart-button" title="Ver gráficos">
                    <i class="fas fa-chart-bar"></i>
                  </button>
                  <button class="action-button info-button" title="Mais informações">
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <button class="action-button edit-button" title="Editar prazo">
                    <i class="fas fa-clock"></i>
                  </button>
                  ${campaign.status === 'Ativa' ? `
                    <button class="action-button stop-button" title="Encerrar campanha">
                      <i class="fas fa-stop-circle"></i>
                    </button>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  renderCampaignCards() {
    return `
      <div class="campaign-cards">
        ${this.campaignsData.map(campaign => `
          <div class="campaign-card" data-campaign-id="${campaign.id}">
            <div class="campaign-card-header">
              <h3 class="campaign-name">${campaign.name}</h3>
            </div>
            
            <div class="campaign-response">
              <span class="response-text">${campaign.responses} de ${campaign.total}</span>
            </div>
            
            <div class="progress-container">
              <div class="progress-bar ${this.getProgressBarClass((campaign.responses / campaign.total) * 100)}" style="width: ${(campaign.responses / campaign.total) * 100}%"></div>
            </div>
            
            <div class="campaign-meta">
              <div class="campaign-date">
                <i class="far fa-calendar"></i>
                <span>${this.formatDate(campaign.deadline)}</span>
              </div>
              
              <div class="campaign-status status-${this.getStatusClass(campaign.status)}">
                <span class="status-dot"></span>
                <span class="status-text">${campaign.status}</span>
              </div>
            </div>
            
            <div class="campaign-actions">
              <button class="action-button chart-button" title="Ver gráficos">
                <i class="fas fa-chart-bar"></i>
              </button>
              <button class="action-button info-button" title="Mais informações">
                <i class="fas fa-info-circle"></i>
              </button>
              <button class="action-button edit-button" title="Editar prazo">
                <i class="fas fa-clock"></i>
              </button>
              ${campaign.status === 'Ativa' ? `
                <button class="action-button stop-button" title="Encerrar campanha">
                  <i class="fas fa-stop-circle"></i>
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  addEventListeners() {
    // Chart buttons
    this.element.querySelectorAll('.chart-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const campaignId = e.target.closest('[data-campaign-id]').dataset.campaignId;
        console.log('View charts for campaign:', campaignId);
        // Implementar visualização de gráficos
      });
    });
    
    // Info buttons
    this.element.querySelectorAll('.info-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const campaignId = e.target.closest('[data-campaign-id]').dataset.campaignId;
        console.log('More info for campaign:', campaignId);
        // Implementar visualização de informações detalhadas
      });
    });
    
    // Edit buttons
    this.element.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const campaignId = e.target.closest('[data-campaign-id]').dataset.campaignId;
        console.log('Edit campaign deadline:', campaignId);
        // Implementar edição de prazo
      });
    });

    // Stop buttons
    this.element.querySelectorAll('.stop-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const campaignId = e.target.closest('[data-campaign-id]').dataset.campaignId;
        if (confirm('Tem certeza que deseja encerrar esta campanha? Esta ação não pode ser desfeita.')) {
          console.log('Stop campaign:', campaignId);
          // Implementar lógica para encerrar campanha
        }
      });
    });
    
    // Make entire card clickable on mobile
    this.element.querySelectorAll('.campaign-card').forEach(card => {
      card.addEventListener('click', () => {
        const campaignId = card.dataset.campaignId;
        console.log('View campaign details:', campaignId);
        // Implementar visualização detalhada de campanha
      });
    });

    // Window resize listener
    window.addEventListener('resize', this.handleResponsiveness.bind(this));
  }

  handleResponsiveness() {
    const isMobile = window.innerWidth < 768;
    const tableView = this.element.querySelector('.campaigns-table');
    const cardsView = this.element.querySelector('.campaign-cards');
    
    if (tableView && cardsView) {
      if (isMobile) {
        tableView.style.display = 'none';
        cardsView.style.display = 'grid';
      } else {
        tableView.style.display = 'table';
        cardsView.style.display = 'none';
      }
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusClass(status) {
    const statusMap = {
      'Ativa': 'active',
      'Concluída': 'concluded',
      'Rascunho': 'draft'
    };
    
    return statusMap[status] || 'default';
  }

  getProgressBarClass(rate) {
    if (rate >= 70) return 'high';
    if (rate >= 40) return 'medium';
    return 'low';
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    if (this.element) {
      this.element.querySelectorAll('.action-button').forEach(button => {
        button.removeEventListener('click', () => {});
      });
      
      this.element.querySelectorAll('.campaign-card').forEach(card => {
        card.removeEventListener('click', () => {});
      });
      
      window.removeEventListener('resize', this.handleResponsiveness);
    }
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}