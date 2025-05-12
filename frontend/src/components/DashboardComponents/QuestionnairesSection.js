// QuestionnairesSection.js - Componente principal para visualização e gerenciamento de questionários

export default class QuestionnairesSection {
  constructor() {
    this.element = null;
    this.questionnaires = [];
    this.loading = false;
    this.error = null;
    this.isCreatingCampaign = false;
    this.selectedQuestionnaire = null;
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
    
    this.defaultQuestionnaires = [
      {
        id: 1,
        titulo: "Avaliação de Desempenho Anual",
        descricao: "Questionário completo para avaliação de desempenho anual dos colaboradores, incluindo metas, competências e plano de desenvolvimento.",
        date: "14/01/2023",
        tags: [{ nome: "Desempenho" }, { nome: "RH" }, { nome: "Anual" }],
        color: "#4649FF",
        questions: [
          { 
            enunciado: "Como você avalia seu desempenho geral no último ano?", 
            tipo_pergunta: "LIKERT_SCALE", 
            opcoes: ["Muito Abaixo do Esperado", "Abaixo do Esperado", "Atende às Expectativas", "Acima do Esperado", "Excepcional"] 
          },
          { 
            enunciado: "Quais foram suas principais conquistas?", 
            tipo_pergunta: "FREE_TEXT", 
            opcoes: [] 
          },
          { 
            enunciado: "Você se sente engajado com os objetivos da empresa?", 
            tipo_pergunta: "BINARY", 
            opcoes: ["Sim", "Não"] 
          },
          {
            enunciado: "Quais áreas você deseja desenvolver no próximo ano?",
            tipo_pergunta: "MULTIPLE_CHOICE_MULTIPLE",
            opcoes: ["Habilidades Técnicas", "Gestão de Equipe", "Comunicação", "Liderança", "Conhecimento do Negócio"]
          },
          {
            enunciado: "Qual fator mais contribuiu para seu desempenho?",
            tipo_pergunta: "MULTIPLE_CHOICE_SINGLE",
            opcoes: ["Treinamentos", "Mentoria", "Ambiente de trabalho", "Ferramentas adequadas", "Equipe de apoio"]
          }
        ]
      },
      {
        id: 2,
        titulo: "Clima Organizacional",
        descricao: "Pesquisa para avaliar o clima organizacional da empresa, incluindo satisfação, engajamento e cultura.",
        date: "09/02/2023",
        tags: [{ nome: "Clima" }, { nome: "Cultura" }, { nome: "Engajamento" }],
        color: "#8A4FFF",
        questions: [
          { 
            enunciado: "Em uma escala de 0 a 10, o quanto você recomendaria esta empresa como um bom lugar para trabalhar?", 
            tipo_pergunta: "NUMERIC_SCALE", 
            opcoes: ["0","1","2","3","4","5","6","7","8","9","10"],
            min: 0,
            max: 10
          },
          { 
            enunciado: "Você tem alguma sugestão para melhorar o clima organizacional?", 
            tipo_pergunta: "FREE_TEXT", 
            opcoes: [] 
          },
          {
            enunciado: "O que você mais valoriza na cultura da empresa?",
            tipo_pergunta: "MULTIPLE_CHOICE_SINGLE",
            opcoes: ["Flexibilidade", "Transparência", "Oportunidades de crescimento", "Ambiente colaborativo", "Reconhecimento"]
          },
          {
            enunciado: "Assinale os valores da empresa com os quais você mais se identifica:",
            tipo_pergunta: "MULTIPLE_CHOICE_MULTIPLE",
            opcoes: ["Inovação", "Integridade", "Colaboração", "Excelência", "Diversidade"]
          }
        ]
      },
      {
        id: 3,
        titulo: "Feedback de Produto",
        descricao: "Colete opiniões sobre a usabilidade e funcionalidades dos produtos da empresa.",
        date: "22/03/2023",
        tags: [{ nome: "Produto" }, { nome: "Feedback" }, { nome: "UX" }],
        color: "#FF6B4A",
        questions: [
          { 
            enunciado: "Qual sua satisfação geral com o produto?", 
            tipo_pergunta: "LIKERT_SCALE", 
            opcoes: ["Muito Insatisfeito", "Insatisfeito", "Neutro", "Satisfeito", "Muito Satisfeito"] 
          },
          {
            enunciado: "Quais funcionalidades você mais utiliza? (Selecione todas aplicáveis)",
            tipo_pergunta: "MULTIPLE_CHOICE_MULTIPLE",
            opcoes: ["Dashboard", "Relatórios", "Configurações", "Usuários", "Integração com outros sistemas"]
          },
          {
            enunciado: "Em uma escala de 0 a 10, qual a probabilidade de você recomendar nosso produto?",
            tipo_pergunta: "NUMERIC_SCALE",
            opcoes: ["0","1","2","3","4","5","6","7","8","9","10"],
            min: 0,
            max: 10
          },
          {
            enunciado: "O produto atende suas expectativas?",
            tipo_pergunta: "BINARY",
            opcoes: ["Sim", "Não"]
          }
        ]
      }
    ]
  }

  // Gera uma cor aleatória da paleta
  _getRandomColor() {
    return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
  }

  async render() {
    this.element = document.createElement("section");
    this.element.id = "questionnaires-section";
    this.element.className = "dashboard-section active";
  
    // Se estiver criando uma campanha, renderize o formulário
    if (this.isCreatingCampaign) {
      this._renderCampaignForm();
      return this.element;
    }
  
    this.element.innerHTML = `
      <div class="container">
        <header class="content-header">
          <h2 class="content-title">Biblioteca de Questionários</h2>
          <p class="page-description">Selecione um questionário para visualizar suas perguntas e opções de resposta.</p>
        </header>
        <div class="questionnaire-list" id="questionnaireList"></div>
      </div>
    `;
  
    // Cria o modal se ele não existir no DOM
    this._createModalIfNeeded();
  
    try {
      this.loading = true;
      await this._fetchQuestionnaires();
    } catch (error) {
      this.error = error.message || "Erro ao carregar questionários";
    } finally {
      this.loading = false;
      this._renderContent();
    }
  
    return this.element;
  }

  // Criação do modal no DOM se ele não existir
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
            <button class="modal-button modal-button-secondary" id="modalCancel">Fechar</button>
            <button class="modal-button modal-button-primary" id="modalUse">Usar Questionário</button>
          </div>
        </div>
      `;
      document.body.appendChild(modalOverlay);

      // Adicionar event listeners do modal
      document.getElementById("modalClose").addEventListener("click", () => this._closeModal());
      document.getElementById("modalCancel").addEventListener("click", () => this._closeModal());
      document.getElementById("modalUse").addEventListener("click", () => {
        this.selectedQuestionnaire = document.querySelector(".modal").dataset.questionnaireId;
        this._closeModal();
        this.isCreatingCampaign = true;
        this.render().then(element => {
          // Substituir o elemento atual pelo novo renderizado
          if (this.element.parentNode) {
            this.element.parentNode.replaceChild(element, this.element);
            this.element = element;
          }
        });
      });

      // Fechar o modal ao clicar fora dele
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
          this._closeModal();
        }
      });
    }
  }

  async _fetchQuestionnaires() {
    try {
      const response = await fetch("/api/questionarios", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar questionários: ${response.status}`);
      }

      const data = await response.json();
      
      // Certifique-se de que cada questionário tem uma cor
      this.questionnaires = data.map(q => {
        if (!q.color) q.color = this._getRandomColor();
        return q;
      });
    } catch (error) {
      console.error("Erro ao carregar questionários:", error);
      // Aplicar cores aleatórias aos questionários padrão
      this.questionnaires = this.defaultQuestionnaires.map(q => {
        if (!q.color) q.color = this._getRandomColor();
        return q;
      });
    }
  }

  _renderContent() {
    const questionnaireList = this.element.querySelector("#questionnaireList");
    questionnaireList.innerHTML = this.loading
      ? this._getLoadingTemplate()
      : this.error
      ? this._getErrorTemplate()
      : this._renderList();

    this.addEventListeners();
  }

  _renderCampaignForm() {
    const q = this.questionnaires.find(q => q.id == this.selectedQuestionnaire);
    this.element.innerHTML = `
      <div class="create-campaign-card">
        <h2>Criar Campanha: ${q ? q.titulo : ''}</h2>
        <form id="create-campaign-form">
          <div class="form-group">
            <label for="campaign-name">Nome da Campanha:</label>
            <input type="text" id="campaign-name" required />
          </div>
          <div class="form-group">
            <label for="campaign-file">Upload CSV (apenas emails):</label>
            <input type="file" id="campaign-file" accept=".csv" required />
          </div>
          <button type="submit" class="btn-primary">Iniciar Campanha</button>
          <button type="button" id="cancel-campaign-btn" class="btn-secondary">Cancelar</button>
        </form>
      </div>
    `;
    this._addCampaignFormListeners();
  }

  _addCampaignFormListeners() {
    const form = this.element.querySelector('#create-campaign-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      // Simula chamada ao backend
      alert('Campanha iniciada para questionário ' + this.selectedQuestionnaire);
      // Volta para a lista de questionários
      this.isCreatingCampaign = false;
      this.selectedQuestionnaire = null;
      this.render().then(element => {
        if (this.element.parentNode) {
          this.element.parentNode.replaceChild(element, this.element);
          this.element = element;
        }
      });
    });
    
    const cancelBtn = this.element.querySelector('#cancel-campaign-btn');
    cancelBtn.addEventListener('click', () => {
      this.isCreatingCampaign = false;
      this.selectedQuestionnaire = null;
      this.render().then(element => {
        if (this.element.parentNode) {
          this.element.parentNode.replaceChild(element, this.element);
          this.element = element;
        }
      });
    });
  }

  _renderList() {
    return this.questionnaires.map(q => {
      const tagsHtml = (q.tags || []).map(tag => 
        `<span class="card-tag">${tag.nome || tag}</span>`
      ).join("");
      
      return `
        <div class="questionnaire-card" data-id="${q.id}">
          <!-- Barra de cor movida para fora do header e renomeada -->
          <div class="questionnaire-color-bar" style="background-color: ${q.color || this._getRandomColor()};"></div>
          <div class="card-header">
            <div class="card-content">
              <h3 class="card-title">${q.titulo}</h3>
              <div class="card-date">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon card-date-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                ${q.date || '01/01/2023'}
              </div>
              <p class="card-description">${q.descricao}</p>
              <div class="card-tags">${tagsHtml}</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }
  
  addEventListeners() {
    // Botão de tentar novamente (em caso de erro)
    const retryBtn = this.element.querySelector("#retry-fetch-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", async () => {
        this.error = null;
        this.loading = true;
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

    // Adicionar event listeners para os cards
    const cards = this.element.querySelectorAll(".questionnaire-card");
    cards.forEach(card => {
      card.addEventListener("click", (e) => {
        // Ignorar clique nos botões de ação
        if (!e.target.closest('.card-action')) {
          const id = card.dataset.id;
          const questionnaire = this.questionnaires.find(q => q.id == id);
          if (questionnaire) this._openModal(questionnaire);
        }
      });
    });
  }

  _openModal(questionnaire) {
    const modal = document.getElementById("questionnaireModal");
    const modalContent = modal.querySelector(".modal");
    
    modalContent.dataset.questionnaireId = questionnaire.id;
    document.getElementById("modalTitle").textContent = questionnaire.titulo;
    document.getElementById("modalDateText").textContent = questionnaire.date || '';
    document.getElementById("modalDescription").textContent = questionnaire.descricao;

    const modalTags = document.getElementById("modalTags");
    modalTags.innerHTML = (questionnaire.tags || [])
      .map(tag => `<span class="modal-tag">${tag.nome || tag}</span>`)
      .join("");

    const modalQuestions = document.getElementById("modalQuestions");
    modalQuestions.innerHTML = (questionnaire.questions || [])
      .map((q, index) => {
        // Renderiza a questão baseada no seu tipo
        return this._renderQuestionByType(q, index);
      })
      .join("");

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Método para renderizar diferentes tipos de perguntas
  _renderQuestionByType(question, index) {
    const { enunciado, tipo_pergunta, opcoes } = question;
    
    // Elementos comuns do cabeçalho da pergunta
    const headerHtml = `
      <div class="modal-question-header">
        <span class="modal-question-number">${index + 1}.</span>
        <span class="modal-question-text">${enunciado}</span>
        <span class="modal-question-type">${this._getQuestionTypeLabel(tipo_pergunta)}</span>
      </div>
    `;
    
    let optionsHtml = '';
    
    // Renderiza diferentes tipos de opções baseadas no tipo da pergunta
    switch (tipo_pergunta) {
      case "NUMERIC_SCALE":
        // Exibe escala numérica horizontalmente
        optionsHtml = this._renderNumericScale(opcoes);
        break;
        
      case "FREE_TEXT":
        // Campo para texto livre
        optionsHtml = `<div class="modal-text-input-placeholder">Campo para entrada de texto</div>`;
        break;
        
      case "BINARY":
        // Opções Sim/Não
        optionsHtml = this._renderBinaryOptions(opcoes);
        break;
        
      case "LIKERT_SCALE":
        // Escala Likert
        optionsHtml = this._renderLikertScale(opcoes);
        break;
        
      case "MULTIPLE_CHOICE_SINGLE":
        // Múltipla escolha com opção única (radio buttons)
        optionsHtml = this._renderMultipleChoiceSingle(opcoes);
        break;
        
      case "MULTIPLE_CHOICE_MULTIPLE":
        // Múltipla escolha com seleção múltipla (checkboxes)
        optionsHtml = this._renderMultipleChoiceMultiple(opcoes);
        break;
        
      default:
        // Fallback para lista simples
        optionsHtml = `
          <ul class="modal-options-list">
            ${opcoes.map(option => `<li class="modal-option-item">${option}</li>`).join('')}
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

  // Retorna o rótulo amigável para o tipo da pergunta
  _getQuestionTypeLabel(tipo) {
    return this.questionTypes[tipo] || tipo;
  }

  // Renderiza opções para escala numérica horizontalmente
  _renderNumericScale(options) {
    return `
      <div class="numeric-scale-container">
        ${options.map(option => `
          <div class="numeric-scale-item">
            <span class="numeric-scale-number">${option}</span>
            <div class="numeric-scale-bubble"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderiza opções para perguntas binárias (Sim/Não)
  _renderBinaryOptions(options) {
    return `
      <div class="binary-options-container">
        ${options.map(option => `
          <div class="binary-option">
            <div class="radio-button"></div>
            <span class="binary-option-text">${option}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderiza opções para escala Likert
  _renderLikertScale(options) {
    return `
      <div class="likert-scale-container">
        ${options.map((option, i) => `
          <div class="likert-scale-item">
            <div class="likert-scale-bubble"></div>
            <span class="likert-scale-label">${option}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderiza opções para múltipla escolha com resposta única
  _renderMultipleChoiceSingle(options) {
    return `
      <div class="multiple-choice-container">
        ${options.map((option, i) => `
          <div class="multiple-choice-single-item">
            <div class="radio-button"></div>
            <span class="multiple-choice-text">${option}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Renderiza opções para múltipla escolha com seleção múltipla
  _renderMultipleChoiceMultiple(options) {
    return `
      <div class="multiple-choice-container">
        ${options.map((option, i) => `
          <div class="multiple-choice-multiple-item">
            <div class="checkbox"></div>
            <span class="multiple-choice-text">${option}</span>
          </div>
        `).join('')}
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

  handleEditQuestionnaire(questionnaireId) {
    const questionnaire = this.questionnaires.find((q) => q.id == questionnaireId);
    if (questionnaire) {
      alert(`Editar questionário: ${questionnaire.titulo}`);
      // Você pode implementar a lógica de edição aqui
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
        <p>${this.error || 'Erro desconhecido.'}</p>
        <button id="retry-fetch-btn" class="btn-primary">Tentar Novamente</button>
      </div>
    `;
  }

  unmount() {
    // Remover eficientemente todos os listeners clonando e substituindo o elemento
    if (this.element && this.element.parentNode) {
      const clone = this.element.cloneNode(true);
      this.element.parentNode.replaceChild(clone, this.element);
      this.element = null;
    }
  }
}