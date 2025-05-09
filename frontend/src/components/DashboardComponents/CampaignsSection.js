// Campaigns Section Component
export default class CampaignsSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'campaigns-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Minhas Campanhas</h2>
          <div class="card-actions">
            <button class="btn btn-primary" id="create-campaign-btn-2">
              <i class="fas fa-plus"></i> Nova Campanha
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Nome da Campanha</th>
                  <th>Questionário</th>
                  <th>Data de Início</th>
                  <th>Data de Término</th>
                  <th>Envios</th>
                  <th>Respostas</th>
                  <th>Taxa</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Avaliação de Desempenho</td>
                  <td>Avaliação de Desempenho Anual</td>
                  <td>12/04/2025</td>
                  <td>30/04/2025</td>
                  <td>45</td>
                  <td>23</td>
                  <td>51%</td>
                  <td>
                    <div class="status active">
                      <span class="status-dot"></span>
                      Ativa
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Pesquisa de Satisfação</td>
                  <td>Satisfação no Trabalho</td>
                  <td>08/03/2025</td>
                  <td>15/04/2025</td>
                  <td>120</td>
                  <td>98</td>
                  <td>82%</td>
                  <td>
                    <div class="status active">
                      <span class="status-dot"></span>
                      Ativa
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Clima Organizacional</td>
                  <td>Clima Organizacional 2025</td>
                  <td>15/02/2025</td>
                  <td>28/02/2025</td>
                  <td>78</td>
                  <td>65</td>
                  <td>83%</td>
                  <td>
                    <div class="status completed">
                      <span class="status-dot"></span>
                      Concluída
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Feedback de Processos</td>
                  <td>Processos Internos</td>
                  <td>05/01/2025</td>
                  <td>20/01/2025</td>
                  <td>32</td>
                  <td>28</td>
                  <td>88%</td>
                  <td>
                    <div class="status completed">
                      <span class="status-dot"></span>
                      Concluída
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>NPS Colaboradores</td>
                  <td>NPS Interno</td>
                  <td>-</td>
                  <td>-</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0%</td>
                  <td>
                    <div class="status draft">
                      <span class="status-dot"></span>
                      Rascunho
                    </div>
                  </td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    // Add event listeners
    this.addEventListeners();

    return this.element;
  }

  addEventListeners() {
    const createCampaignBtn = this.element.querySelector('#create-campaign-btn-2');
    if (createCampaignBtn) {
      createCampaignBtn.addEventListener('click', () => {
        window.history.pushState({}, '', '/create-campaign');
        window.dispatchEvent(new Event('popstate'));
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const createCampaignBtn = this.element.querySelector('#create-campaign-btn-2');
    if (createCampaignBtn) {
      createCampaignBtn.replaceWith(createCampaignBtn.cloneNode(true));
    }
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}