// QuestionnairesSection.js - Componente principal para visualização e gerenciamento de questionários

export default class QuestionnairesSection {
  constructor() {
    this.element = null;
    this.questionnaires = [];
    this.loading = false;
    this.error = null;
    this.selectedQuestionnaire = null;
    this.selectedQuestionnaireData = null;
    this.modalElement = null;
    
    // Tipos de perguntas padronizados
    this.questionTypes = {
      MULTIPLE_CHOICE_SINGLE: "Múltipla Escolha (Única)",
      MULTIPLE_CHOICE_MULTIPLE: "Múltipla Escolha (Múltipla)",
      LIKERT_SCALE: "Escala Likert",
      BINARY: "Sim/Não",
      NUMERIC_SCALE: "Escala Numérica",
      FREE_TEXT: "Texto Livre"
    };
    
    // Paleta de cores para os questionários
    this.colorPalette = [
      "#4649FF", // Azul primário
      "#8A4FFF", // Roxo
      "#FF6B4A", // Laranja
      "#3AC0A0", // Verde azulado
      "#FF4A8D", // Rosa
      "#407BFF", // Azul mais claro
      "#9656EB", // Roxo médio
      "#FF7E2E", // Laranja mais claro
      "#2ADBBD", // Verde água
      "#FF5C7F"  // Rosa mais claro
    ];
  }

  // Gera uma cor aleatória da paleta
  _getRandomColor() {
    return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
  }

  async render() {
    // Criar o elemento principal
    this.element = document.createElement("section");
    this.element.id = "questionnaires-section";
    this.element.className = "dashboard-section active";
  
    // Estrutura HTML básica com mensagem de carregamento inicial
    this.element.innerHTML = `
      <div class="container">
        <header class="content-header">
          <h2 class="content-title">Biblioteca de Questionários</h2>
          <p class="page-description">Selecione um questionário para visualizar suas perguntas e opções de resposta.</p>
        </header>
        <div class="questionnaire-list" id="questionnaireList">
          <div class="loading-template">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando questionários, por favor aguarde...</p>
          </div>
        </div>
      </div>
    `;
  
    // Criar o modal (se ainda não existir)
    this._createModalIfNeeded();
  
    // Iniciar carregamento dos questionários
    this.loading = true;
  
    try {
      await this._fetchQuestionnaires();
    } catch (error) {
      this.error = error.message || "Erro ao carregar questionários";
      console.error("Erro ao carregar questionários:", error);
    } finally {
      this.loading = false;
      this._renderContent();
    }
  
    return this.element;
  }

  _renderContent() {
    const questionnaireList = this.element.querySelector("#questionnaireList");
    
    if (this.loading) {
      questionnaireList.innerHTML = this._getLoadingTemplate();
    } else if (this.error) {
      questionnaireList.innerHTML = this._getErrorTemplate();
    } else {
      questionnaireList.innerHTML = this._renderList();
    }

    this._addEventListeners();
  }

  // Criação do modal se ele não existir no DOM
  _createModalIfNeeded() {
    if (!document.getElementById("questionnaireModal")) {
      const modalOverlay = document.createElement("div");
      modalOverlay.id = "questionnaireModal";
      modalOverlay.className = "modal-overlay";
      modalOverlay.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title" id="modalTitle">Título do Questionário</h2>
            <button class="modal-close" id="modalClose">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-info">
              <div class="modal-date">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon card-date-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span id="modalDateText"></span>
              </div>
              <p class="modal-description" id="modalDescription"></p>
              <div class="modal-tags" id="modalTags"></div>
            </div>
            <h3 class="modal-section-title">Perguntas</h3>
            <div class="modal-questions" id="modalQuestions"></div>
          </div>
          <div class="modal-footer">
            <button class="modal-button modal-button-secondary" id="modalClose2">Fechar</button>
            <button class="modal-button modal-button-primary" id="createCampaignBtn">Criar Campanha</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);
  
      // Adicionar event listeners do modal
      document.getElementById("modalClose").addEventListener("click", () => this._closeModal());
      document.getElementById("modalClose2").addEventListener("click", () => this._closeModal());
  
      // Fechar o modal ao clicar fora dele
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          this._closeModal();
        }
      });
  
      // Adicionar evento para o botão "Criar Campanha"
      const createCampaignBtn = document.getElementById("createCampaignBtn");
      createCampaignBtn.addEventListener("click", () => this._handleCreateCampaign());
    }
  }

  async _fetchQuestionnaires() {
    const response = await fetch("/api/questionnaires", {
      credentials: "include",
    });
  
    if (!response.ok) {
      throw new Error(`Erro ao carregar questionários: ${response.status}`);
    }
  
    const data = await response.json();
    // Atribuir cores aleatórias para os questionários
    this.questionnaires = data.map(q => {
      if (!q.color) q.color = this._getRandomColor();
      return q;
    });
  }

  _renderList() {
    if (this.questionnaires.length === 0) {
      return `
        <div class="empty-state">
          <p>Nenhum questionário encontrado.</p>
        </div>
      `;
    }

    return this.questionnaires.map(q => {
      const tagsHtml = (q.tags || []).map(tag => 
        `<span class="card-tag">${tag.name}</span>`
      ).join("");

      return `
        <div class="questionnaire-card" data-id="${q.id}">
          <div class="questionnaire-color-bar" style="background-color: ${q.color || this._getRandomColor()};"></div>
          <div class="card-header">
            <div class="card-content">
              <h3 class="card-title">${q.title}</h3>
              <p class="card-description">${q.description || 'Sem descrição disponível'}</p>
              <div class="card-tags">${tagsHtml}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
  
  _addEventListeners() {
    // Adicionar listener para o botão retry
    const retryBtn = this.element.querySelector("#retry-fetch-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", async () => {
        this.loading = true;
        this.error = null;
        this._renderContent();

        try {
          await this._fetchQuestionnaires();
        } catch (error) {
          this.error = error.message || "Erro ao carregar questionários";
        } finally {
          this.loading = false;
          this._renderContent();
        }
      });
    }

    // Adicionar listeners para os cards de questionário
    const cards = this.element.querySelectorAll(".questionnaire-card");
    cards.forEach(card => {
      card.addEventListener("click", async () => {
        const id = card.dataset.id;
        await this._handleQuestionnaireClick(id);
      });
    });
  }

  async _handleQuestionnaireClick(questionnaireId) {
    // Encontrar o questionário pelo ID
    const questionnaire = this.questionnaires.find(q => q.id == questionnaireId);
    
    if (!questionnaire) return;
    
    this.selectedQuestionnaire = questionnaire;
    
    // Mostrar modal com loading
    this._showModalLoading();
    
    try {
      // Buscar perguntas do questionário
      await this._fetchQuestionnaireDetails(questionnaireId);
      // Atualizar o conteúdo do modal com os detalhes
      this._updateModalContent();
    } catch (error) {
      console.error("Erro ao carregar detalhes do questionário:", error);
      // Mostrar mensagem de erro no modal
      this._showModalError();
    }
  }

  _showModalLoading() {
    const modal = document.getElementById("questionnaireModal");
    const modalQuestions = document.getElementById("modalQuestions");
    const modalTitle = document.getElementById("modalTitle");
    
    // Definir título do questionário
    modalTitle.textContent = this.selectedQuestionnaire.titulo || "Questionário";
    
    // Mostrar loading nas perguntas
    modalQuestions.innerHTML = `
      <div class="loading-template">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando perguntas...</p>
      </div>
    `;
    
    // Exibir o modal
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  async _fetchQuestionnaireDetails(questionnaireId) {
    const delay = new Promise(resolve => setTimeout(resolve, 2000)); // Garante 2 segundos de atraso
  
    const fetchData = fetch(`/api/questionnaires/${questionnaireId}/questions`, {
      credentials: "include",
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`Erro ao carregar perguntas: ${response.status}`);
      }
      const data = await response.json();
      this.selectedQuestionnaireData = data;
    });
  
    // Aguarda tanto o fetch quanto o delay
    await Promise.all([delay, fetchData]);
  }

  _updateModalContent() {
    if (!this.selectedQuestionnaire) return;
    
    const modalTitle = document.getElementById("modalTitle");
    const modalDateText = document.getElementById("modalDateText");
    const modalDescription = document.getElementById("modalDescription");
    const modalTags = document.getElementById("modalTags");
    const modalQuestions = document.getElementById("modalQuestions");
    
    modalTitle.textContent = this.selectedQuestionnaire.title;
    modalDescription.textContent = this.selectedQuestionnaire.description || '';
    
    // Renderizar tags
    modalTags.innerHTML = (this.selectedQuestionnaire.tags || [])
      .map(tag => `<span class="modal-tag">${tag.name}</span>`)
      .join("");
    
    // Renderizar perguntas
    if (this.selectedQuestionnaireData && this.selectedQuestionnaireData.length > 0) {
      modalQuestions.innerHTML = this.selectedQuestionnaireData
        .map((question, index) => this._renderQuestionTemplate(question, index))
        .join("");
    } else {
      modalQuestions.innerHTML = `<p>Este questionário não possui perguntas.</p>`;
    }
  }

  _renderQuestionTemplate(question, index) {
    const { statement, question_type, options, required } = question;
  
    // Ícone para questões obrigatórias
    const requiredIcon = required
    ? `<span class="required-icon" title="Esta pergunta é obrigatória">
         <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="red">
           <circle cx="12" cy="12" r="10" />
         </svg>
       </span>`
    : "";
  
    // Renderizar cabeçalho da pergunta
    const headerHtml = `
      <div class="modal-question-header">
        <span class="modal-question-number">${index + 1}.</span>
        <span class="modal-question-text">${statement} ${requiredIcon}</span>
        <span class="modal-question-type">${this.questionTypes[question_type] || question_type}</span>
      </div>
    `;
  
    // Renderizar opções baseadas no tipo
    let optionsHtml = "";
  
    switch (question_type) {
      case "NUMERIC_SCALE":
        optionsHtml = this._renderNumericScale(options);
        break;
      case "FREE_TEXT":
        optionsHtml = `<div class="modal-text-input-placeholder">Campo para entrada de texto</div>`;
        break;
      case "BINARY":
        optionsHtml = this._renderBinaryOptions(options);
        break;
      case "LIKERT_SCALE":
        optionsHtml = this._renderLikertScale(options);
        break;
      case "MULTIPLE_CHOICE_SINGLE":
        optionsHtml = this._renderMultipleChoiceSingle(options);
        break;
      case "MULTIPLE_CHOICE_MULTIPLE":
        optionsHtml = this._renderMultipleChoiceMultiple(options);
        break;
      default:
        optionsHtml = `
          <ul class="modal-options-list">
            ${options.map(option => `<li class="modal-option-item">${option.text}</li>`).join("")}
          </ul>
        `;
    }
  
    return `
      <div class="modal-question">
        ${headerHtml}
        ${optionsHtml}
      </div>
    `;
  }

  _renderLikertScale(options) {
    return `
      <div class="likert-scale-container">
        ${options.map(option => `
          <div class="likert-scale-item">
            <div class="likert-scale-bubble"></div>
            <span class="likert-scale-label">${option.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderNumericScale(options) {
    return `
      <div class="numeric-scale-container">
        ${options.map(option => `
          <div class="numeric-scale-item">
            <span class="numeric-scale-number">${option.text}</span>
            <div class="numeric-scale-bubble"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderBinaryOptions(options) {
    return `
      <div class="binary-options-container">
        ${options.map(option => `
          <div class="binary-option">
            <div class="radio-button"></div>
            <span class="binary-option-text">${option.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderMultipleChoiceSingle(options) {
    return `
      <div class="multiple-choice-container">
        ${options.map(option => `
          <div class="multiple-choice-single-item">
            <div class="radio-button"></div>
            <span class="multiple-choice-text">${option.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _renderMultipleChoiceMultiple(options) {
    return `
      <div class="multiple-choice-container">
        ${options.map(option => `
          <div class="multiple-choice-multiple-item">
            <div class="checkbox"></div>
            <span class="multiple-choice-text">${option.text}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _showModalError() {
    const modalQuestions = document.getElementById("modalQuestions");
    modalQuestions.innerHTML = `
      <div class="error-template">
        <p>Ocorreu um erro ao buscar as perguntas. Tente novamente mais tarde.</p>
      </div>
    `;
  }

  _closeModal() {
    const modal = document.getElementById("questionnaireModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  _getLoadingTemplate() {
    return `
      <div class="loading-template">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Carregando questionários...</p>
      </div>
    `;
  }

  _getErrorTemplate() {
    return `
      <div class="error-template">
        <p>Não foi possível carregar a lista de questionários.</p>
        <button id="retry-fetch-btn" class="btn-primary">Tentar Novamente</button>
      </div>
    `;
  }

  unmount() {
    // Remover event listeners e elementos do DOM quando o componente for desmontado
    if (this.element) {
      // Clonar e substituir para remover todos os listeners
      if (this.element.parentNode) {
        const clone = this.element.cloneNode(true);
        this.element.parentNode.replaceChild(clone, this.element);
      }
      this.element = null;
    }
  }
}