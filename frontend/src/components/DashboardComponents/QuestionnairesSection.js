// Questionnaires Section Component
export default class QuestionnairesSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'questionnaires-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Biblioteca de Questionários</h2>
          <div class="card-actions">
            <button class="btn btn-primary" id="new-questionnaire-btn">
              <i class="fas fa-plus"></i> Novo Questionário
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="grid grid-2">
            <div class="questionnaire-card">
              <div class="questionnaire-color" style="background-color: var(--primary-color);"></div>
              <div class="questionnaire-content">
                <div class="questionnaire-header">
                  <h3 class="questionnaire-title">Avaliação de Desempenho Anual</h3>
                  <div class="questionnaire-actions">
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                <div class="questionnaire-meta">
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-list"></i> 15 perguntas
                  </div>
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-clock"></i> 5-10 minutos
                  </div>
                </div>
                <div class="questionnaire-description">
                  Questionário completo para avaliação de desempenho anual dos colaboradores, incluindo metas, competências e plano de desenvolvimento.
                </div>
                <div class="questionnaire-tags">
                  <span class="tag">Desempenho</span>
                  <span class="tag">RH</span>
                  <span class="tag">Anual</span>
                </div>
              </div>
            </div>

            <div class="questionnaire-card">
              <div class="questionnaire-color" style="background-color: var(--secondary-color);"></div>
              <div class="questionnaire-content">
                <div class="questionnaire-header">
                  <h3 class="questionnaire-title">Clima Organizacional</h3>
                  <div class="questionnaire-actions">
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                <div class="questionnaire-meta">
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-list"></i> 12 perguntas
                  </div>
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-clock"></i> 3-5 minutos
                  </div>
                </div>
                <div class="questionnaire-description">
                  Pesquisa para avaliar o clima organizacional da empresa, incluindo satisfação, engajamento e cultura.
                </div>
                <div class="questionnaire-tags">
                  <span class="tag">Clima</span>
                  <span class="tag">Cultura</span>
                  <span class="tag">Engajamento</span>
                </div>
              </div>
            </div>

            <div class="questionnaire-card">
              <div class="questionnaire-color" style="background-color: var(--accent-color);"></div>
              <div class="questionnaire-content">
                <div class="questionnaire-header">
                  <h3 class="questionnaire-title">NPS Interno</h3>
                  <div class="questionnaire-actions">
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                <div class="questionnaire-meta">
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-list"></i> 3 perguntas
                  </div>
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-clock"></i> 1-2 minutos
                  </div>
                </div>
                <div class="questionnaire-description">
                  Questionário curto para medir o Net Promoter Score interno, avaliando a recomendação da empresa pelos próprios colaboradores.
                </div>
                <div class="questionnaire-tags">
                  <span class="tag">NPS</span>
                  <span class="tag">Satisfação</span>
                  <span class="tag">Rápido</span>
                </div>
              </div>
            </div>

            <div class="questionnaire-card">
              <div class="questionnaire-color" style="background-color: #38b000;"></div>
              <div class="questionnaire-content">
                <div class="questionnaire-header">
                  <h3 class="questionnaire-title">Satisfação no Trabalho</h3>
                  <div class="questionnaire-actions">
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
                <div class="questionnaire-meta">
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-list"></i> 8 perguntas
                  </div>
                  <div class="questionnaire-meta-item">
                    <i class="fas fa-clock"></i> 2-3 minutos
                  </div>
                </div>
                <div class="questionnaire-description">
                  Avaliação da satisfação dos colaboradores com diversos aspectos do ambiente de trabalho, benefícios e cultura.
                </div>
                <div class="questionnaire-tags">
                  <span class="tag">Satisfação</span>
                  <span class="tag">Benefícios</span>
                  <span class="tag">Ambiente</span>
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
    const newQuestionnaireBtn = this.element.querySelector('#new-questionnaire-btn');
    if (newQuestionnaireBtn) {
      newQuestionnaireBtn.addEventListener('click', () => {
        alert('Funcionalidade de criar novo questionário em desenvolvimento');
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const newQuestionnaireBtn = this.element.querySelector('#new-questionnaire-btn');
    if (newQuestionnaireBtn) {
      newQuestionnaireBtn.replaceWith(newQuestionnaireBtn.cloneNode(true));
    }
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}