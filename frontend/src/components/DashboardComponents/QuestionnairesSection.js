// frontend/src/components/DashboardComponents/QuestionnairesSection.js
import { showNotification } from '../../utils/notification.js'; // Importar a função de notificação
import { navigateTo } from '../../router.js';
import { createCampaign } from '../../api/campaignsApi.js';
import { fetchQuestionnaires, fetchQuestionnaireDetails } from '../../api/questionnairesApi.js';

export default class QuestionnairesSection {
  constructor() {
    this.element = null;
    this.questionnaires = [];
    this.loading = false;
    this.error = null;
    this.selectedQuestionnaire = null;
    this.selectedQuestionnaireData = null; // Para perguntas do questionário selecionado

    // Para o modal de campanha
    this.campaignModalElement = null;
    this.csvFile = null;
    // Removido this.validContacts e this.invalidContacts, pois usaremos allProcessedContacts
    this.allProcessedContacts = []; // Array único para todos os contatos processados
    this.campaignModalStep = 1; // 1: Upload, 2: Results/Edit

    // Para o modal de edição de contato
    this.editContactModalElement = null;
    this.contactBeingEdited = null;


    this.campaignFormData = {
      name: '',
      endDate: new Date().toISOString().split("T")[0]
    };

    this.questionTypes = {
      MULTIPLE_CHOICE_SINGLE: "Múltipla Escolha (Única)",
      MULTIPLE_CHOICE_MULTIPLE: "Múltipla Escolha (Múltipla)",
      LIKERT_SCALE: "Escala Likert",
      BINARY: "Sim/Não",
      NUMERIC_SCALE: "Escala Numérica",
      FREE_TEXT: "Texto Livre"
    };
    
    this.colorPalette = [
      "#4649FF", "#8A4FFF", "#FF6B4A", "#3AC0A0", "#FF4A8D",
      "#407BFF", "#9656EB", "#FF7E2E", "#2ADBBD", "#FF5C7F"
    ];
  }

  _getRandomColor() {
    return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
  }

  generateSimpleUniqueId() {
    const timestampPart = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2);
    return timestampPart + randomPart;
  }
  
  // Função auxiliar para validar um único contato (reutilizável)
  _validateContactData(contactData) {
    contactData.invalidReason = []; 
    if (!this._validateCsvName(contactData.name)) contactData.invalidReason.push("Nome inválido");
    if (!this._validateCsvEmail(contactData.email)) contactData.invalidReason.push("Email inválido");
    if (!this._validateCsvPhoneNumber(contactData.phone)) contactData.invalidReason.push("Telefone inválido");
    contactData.isValid = contactData.invalidReason.length === 0;
    return contactData.isValid; 
  }

  async render() {
    this.element = document.createElement("section");
    this.element.id = "questionnaires-section";
    this.element.className = "dashboard-section active";
  
    this.element.innerHTML = `
      <div class="container">
        <header class="content-header">
          <h2 class="content-title">Biblioteca de Questionários</h2>
          <p class="page-description">Selecione um questionário para visualizar suas perguntas e opções de resposta.</p>
        </header>
        <div class="questionnaire-list" id="questionnaireList">
        </div>
      </div>
    `;
    this._createQuestionnaireViewModalIfNeeded();
    this._createCampaignModalIfNeeded(); 
    this._createEditContactModalIfNeeded(); 
  
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
  
    return this.element;
  }

  async _renderContent() {
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

  _createQuestionnaireViewModalIfNeeded() {
    if (!document.getElementById("questionnaireViewModal")) {
      const modalOverlay = document.createElement("div");
      modalOverlay.id = "questionnaireViewModal";
      modalOverlay.className = "modal-overlay";
      modalOverlay.innerHTML = `
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title" id="questionnaireViewModalTitle">Título do Questionário</h2>
            <button class="modal-close" id="questionnaireViewModalCloseBtn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="modal-info">
              <div class="modal-date">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon card-date-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span id="questionnaireViewModalDateText"></span>
              </div>
              <p class="modal-description" id="questionnaireViewModalDescription"></p>
              <div class="modal-tags" id="questionnaireViewModalTags"></div>
            </div>
            <h3 class="modal-section-title">Perguntas</h3>
            <div class="modal-questions" id="questionnaireViewModalQuestions"></div>
          </div>
          <div class="modal-footer">
            <button class="modal-button modal-button-secondary" id="questionnaireViewModalCloseBtn2">Fechar</button>
            <button class="modal-button modal-button-primary" id="questionnaireViewModalCreateCampaignBtn">Aplicar Questionário</button>
          </div>
        </div>`; // Corrigido aqui
      document.body.appendChild(modalOverlay);
  
      modalOverlay.querySelector("#questionnaireViewModalCloseBtn").addEventListener("click", () => this._closeQuestionnaireViewModal());
      modalOverlay.querySelector("#questionnaireViewModalCloseBtn2").addEventListener("click", () => this._closeQuestionnaireViewModal());
      modalOverlay.querySelector("#questionnaireViewModalCreateCampaignBtn").addEventListener("click", () => this._handleOpenCampaignModal());
      
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) this._closeQuestionnaireViewModal();
      });
    }
  }

  async _fetchQuestionnaires() {
    try {
      const { data } = await fetchQuestionnaires();
      this.questionnaires = data.map(q => ({ ...q, color: q.color || this._getRandomColor() }));
    } catch (error) {
      this.error = error.message || "Erro ao carregar questionários";
      showNotification("Erro ao carregar questionários.", "error");
    }
  }

  _renderList() {
    if (this.questionnaires.length === 0) return `<div class="empty-state"><p>Nenhum questionário encontrado.</p></div>`;
    return this.questionnaires.map(q => `
      <div class="questionnaire-card" data-id="${q.id}">
        <div class="questionnaire-color-bar" style="background-color: ${q.color};"></div>
        <div class="card-header">
          <div class="card-content">
            <h3 class="card-title">${q.title}</h3>
            <p class="card-description">${q.description || 'Sem descrição'}</p>
            <div class="card-tags">${(q.tags || []).map(tag => `<span class="card-tag">${tag.name}</span>`).join("")}</div>
          </div>
        </div>
      </div>`).join("");
  }
  
  _addEventListeners() {
    const retryBtn = this.element.querySelector("#retry-fetch-btn");
    if (retryBtn) {
      retryBtn.addEventListener("click", async () => {
        this.loading = true; this.error = null; this._renderContent();
        try { await this._fetchQuestionnaires(); }
        catch (error) { this.error = error.message || "Erro"; }
        finally { this.loading = false; this._renderContent(); }
      });
    }
    this.element.querySelectorAll(".questionnaire-card").forEach(card => {
      card.addEventListener("click", async () => await this._handleQuestionnaireCardClick(card.dataset.id));
    });
  }

  async _handleQuestionnaireCardClick(questionnaireId) {
    this.selectedQuestionnaire = this.questionnaires.find(q => q.id == questionnaireId);
    if (!this.selectedQuestionnaire) return;
    
    this._showQuestionnaireViewModalLoading();
    try {
      await this._fetchQuestionnaireDetails(questionnaireId);
      this._updateQuestionnaireViewModalContent();
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      this._showQuestionnaireViewModalError();
    }
  }

  _showQuestionnaireViewModalLoading() {
    const modal = document.getElementById("questionnaireViewModal");
    modal.querySelector("#questionnaireViewModalTitle").textContent = this.selectedQuestionnaire.title || "Questionário";
    const createdDate = this.selectedQuestionnaire.createdAt ? new Date(this.selectedQuestionnaire.createdAt) : new Date();
    modal.querySelector("#questionnaireViewModalDateText").textContent = `Criado em ${createdDate.toLocaleDateString('pt-BR')}`;
    modal.querySelector("#questionnaireViewModalDescription").textContent = this.selectedQuestionnaire.description || "Sem descrição.";
    modal.querySelector("#questionnaireViewModalTags").innerHTML = (this.selectedQuestionnaire.tags || [])
      .map(tag => `<span class="modal-tag">${tag.name}</span>`).join("");
    modal.querySelector("#questionnaireViewModalQuestions").innerHTML = this._getLoadingTemplate("Carregando perguntas...");
    

    const applyButton = modal.querySelector("#questionnaireViewModalCreateCampaignBtn");
    applyButton.disabled = true;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  async _fetchQuestionnaireDetails(questionnaireId) {
    const delay = new Promise(resolve => setTimeout(resolve, 700));
    const fetch = fetchQuestionnaireDetails(questionnaireId)
      .then(async data => {
        this.selectedQuestionnaireData = data;
      });
    await Promise.all([delay, fetch]);
  }

  _updateQuestionnaireViewModalContent() {
    const modalQuestions = document.getElementById("questionnaireViewModalQuestions");
    const applyButton = document.getElementById("questionnaireViewModalCreateCampaignBtn");    
    if (this.selectedQuestionnaireData && this.selectedQuestionnaireData.length > 0) {
      modalQuestions.innerHTML = this.selectedQuestionnaireData
        .sort((a,b) => a.order_number - b.order_number)
        .map((q, i) => this._renderQuestionTemplate(q, i)).join("");
      applyButton.disabled = false;
    } else {
      applyButton.disabled = true;
      modalQuestions.innerHTML = `<p>Este questionário não possui perguntas.</p>`;
    }
  }

  _renderQuestionTemplate(question, index) {
    const { statement, question_type, options, required } = question;
    const requiredIcon = required ? `<span class="required-icon" title="Obrigatória"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="red"><circle cx="12" cy="12" r="10" /></svg></span>` : "";
    const headerHtml = `<div class="modal-question-header"><span class="modal-question-text"><span class="modal-question-number">${index + 1}.</span>${statement} ${requiredIcon}</span><span class="modal-question-type">${this.questionTypes[question_type] || question_type}</span></div>`;
    let optionsHtml = "";
    switch (question_type) {
      case "NUMERIC_SCALE": optionsHtml = this._renderNumericScale(options); break;
      case "FREE_TEXT": optionsHtml = `<div class="modal-text-input-placeholder">Campo para entrada de texto</div>`; break;
      case "BINARY": optionsHtml = this._renderBinaryOptions(options); break;
      case "LIKERT_SCALE": optionsHtml = this._renderLikertScale(options); break;
      case "MULTIPLE_CHOICE_SINGLE": optionsHtml = this._renderMultipleChoiceSingle(options); break;
      case "MULTIPLE_CHOICE_MULTIPLE": optionsHtml = this._renderMultipleChoiceMultiple(options); break;
      default: optionsHtml = `<ul class="modal-options-list">${(options || []).map(opt => `<li class="modal-option-item">${opt.text}</li>`).join("")}</ul>`;
    }
    return `<div class="modal-question">${headerHtml}${optionsHtml}</div>`;
  }

  _renderLikertScale(options) { return `<div class="likert-scale-container">${(options || []).map(o => `<div class="likert-scale-item"><div class="likert-scale-bubble"></div><span class="likert-scale-label">${o.text}</span></div>`).join('')}</div>`; }
  _renderNumericScale(options) { return `<div class="numeric-scale-container">${(options || []).map(o => `<div class="numeric-scale-item"><span class="numeric-scale-number">${o.text}</span><div class="numeric-scale-bubble"></div></div>`).join('')}</div>`; }
  _renderBinaryOptions(options) { return `<div class="binary-options-container">${(options || []).map(o => `<div class="binary-option"><div class="radio-button"></div><span class="binary-option-text">${o.text}</span></div>`).join('')}</div>`; }
  _renderMultipleChoiceSingle(options) { return `<div class="multiple-choice-container">${(options || []).map(o => `<div class="multiple-choice-single-item"><div class="radio-button"></div><span class="multiple-choice-text">${o.text}</span></div>`).join('')}</div>`; }
  _renderMultipleChoiceMultiple(options) { return `<div class="multiple-choice-container">${(options || []).map(o => `<div class="multiple-choice-multiple-item"><div class="checkbox"></div><span class="multiple-choice-text">${o.text}</span></div>`).join('')}</div>`; }

  _showQuestionnaireViewModalError() {
    document.getElementById("questionnaireViewModalQuestions").innerHTML = `<div class="error-template"><p>Erro ao buscar perguntas.</p></div>`;
  }

  _closeQuestionnaireViewModal() {
    const modal = document.getElementById("questionnaireViewModal");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  _getLoadingTemplate(message = "Carregando...") {
    return `<div class="loading-template"><i class="fas fa-spinner fa-spin"></i><p>${message}</p></div>`;
  }
  _getErrorTemplate() {
    return `<div class="error-template"><p>${this.error}</p><button id="retry-fetch-btn" class="btn-primary">Tentar Novamente</button></div>`;
  }

  unmount() {
    if (this.element && this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
    }
    const qViewModal = document.getElementById("questionnaireViewModal");
    if (qViewModal) qViewModal.remove();
    const cModal = document.getElementById("campaignModal");
    if (cModal) cModal.remove();
    const eModal = document.getElementById("editContactModal");
    if (eModal) eModal.remove();

    this.element = null;
    this.campaignModalElement = null;
    this.editContactModalElement = null;
  }

  // --- Métodos para o Modal de Criação de Campanha ---

  _createCampaignModalIfNeeded() {
    if (!document.getElementById("campaignModal")) {
      const modalOverlay = document.createElement("div");
      modalOverlay.id = "campaignModal";
      modalOverlay.className = "modal-overlay campaign-modal-overlay"; 
      modalOverlay.innerHTML = `
        <div class="modal campaign-creation-modal">
          <div class="modal-header">
            <h2 class="modal-title" id="campaignModalTitle">Criar Campanha</h2>
            <button class="modal-close" id="campaignModalCloseBtn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body" id="campaignModalBodyContent"></div>
          <div class="modal-footer" id="campaignModalFooterContent"></div>
        </div>`; // Corrigido aqui
      document.body.appendChild(modalOverlay);
      this.campaignModalElement = modalOverlay;

      this.campaignModalElement.querySelector("#campaignModalCloseBtn").addEventListener("click", () => this._closeCampaignModal(true));
      this.campaignModalElement.addEventListener("click", (e) => {
        if (e.target === this.campaignModalElement) this._closeCampaignModal(true);
      });
    }
  }

  _closeCampaignModal(force = false) {
    if (!this.campaignModalElement) return;
  
    // Se estamos no passo 2 (resultados) e não for fechamento forçado, volta ao passo 1
    if (!force && this.campaignModalStep === 2) {
      this.campaignModalStep = 1;
      this.csvFile = null;
      this.allProcessedContacts = [];
      this._renderCampaignModalStep1();
      return;
    }
  
    // Fecha de fato o modal
    this.campaignModalElement.classList.remove("active");
    document.body.style.overflow = "";
  
    // Opcional: reset total do estado para garantir que, ao reabrir, tudo comece do zero
    this.campaignModalStep = 1;
    this.csvFile = null;
    this.allProcessedContacts = [];
    this.campaignFormData = {
      name: '',
      endDate: ''
    };
  }
  _handleOpenCampaignModal() {
    if (!this.selectedQuestionnaire) return;
    this._closeQuestionnaireViewModal(); 
    this.campaignModalStep = 1;
    this.allProcessedContacts = []; 
    this.csvFile = null; 
    this._renderCampaignModalStep1();
    if(this.campaignModalElement) this.campaignModalElement.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  _renderCampaignModalStep1() {
    const bodyContent = this.campaignModalElement.querySelector("#campaignModalBodyContent");
    const footerContent = this.campaignModalElement.querySelector("#campaignModalFooterContent");
  
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" });
  
    const formattedEndDate = this.campaignFormData.endDate
      ? new Date(this.campaignFormData.endDate + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : "DD/MM/AAAA";
  
    bodyContent.innerHTML = `
      <div class="campaign-form-section">
        <div class="campaign-form-group">
          <label for="campaignName" class="form-label">
            <i class="fas fa-tag"></i> Nome da Campanha
          </label>
          <input type="text" id="campaignName" class="form-input" 
                 value="${this.campaignFormData.name}"                  
                 placeholder="Exemplo: Digite o nome da campanha" required>
          <span class="form-error" id="campaignNameError"></span>
        </div>
        
        <div class="campaign-form-group">
          <label for="campaignEndDate" class="form-label">
            <i class="fas fa-calendar-alt"></i> Data de Encerramento
          </label>
          <input type="date" id="campaignEndDate" class="form-input" 
                 value="${this.campaignFormData.endDate}" 
                 min="${today}" required>
          <span class="form-error" id="campaignEndDateError"></span>
          <small class="form-helper" id="campaignEndDateHelper">
            O questionário estará aberto até ${formattedEndDate} às 23h59. Após esse horário, será encerrado.
          </small>
        </div>
      </div>
  
      <div class="campaign-questionnaire-preview">
        <h4>Questionário Selecionado:</h4>
        <div class="questionnaire-card mini">
          <div class="questionnaire-color-bar" style="background-color: ${this.selectedQuestionnaire.color};"></div>
          <div class="card-header"><div class="card-content"><h3 class="card-title">${this.selectedQuestionnaire.title}</h3></div></div>
        </div>
      </div>
      <div class="file-upload-area">
        <label for="csvFileInput" class="file-upload-label">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>Selecione ou arraste o arquivo CSV</span>
          <small>Colunas esperadas: nome, email, telefone</small>
        </label>
        <input type="file" id="csvFileInput" accept=".csv" class="file-input" />
        <span id="csvFileName" class="csv-file-name">Nenhum arquivo selecionado</span>
      </div>
    `;
  
    footerContent.innerHTML = `
      <button class="modal-button modal-button-secondary" id="campaignModalBackToViewBtn">Voltar à Biblioteca</button>
      <button class="modal-button modal-button-primary" id="campaignModalVerifyCsvBtn">Verificar CSV</button>
    `;
  
    // Adicionar ouvinte de eventos para atualizar o texto dinamicamente
    const campaignEndDateInput = this.campaignModalElement.querySelector("#campaignEndDate");
    const campaignEndDateHelper = this.campaignModalElement.querySelector("#campaignEndDateHelper");
  
    campaignEndDateInput.addEventListener("change", (e) => {
      const selectedDate = e.target.value;
      if (selectedDate) {
        const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        campaignEndDateHelper.textContent = `O questionário estará aberto até ${formattedDate} às 23h59. Após esse horário, será encerrado.`;
      } else {
        campaignEndDateHelper.textContent = "Selecione uma data válida.";
      }
    });
  
    const csvInput = this.campaignModalElement.querySelector("#csvFileInput");
    if (csvInput) csvInput.value = ""; 
  
    csvInput.addEventListener("change", (e) => {
      this.csvFile = e.target.files[0];
      document.getElementById("csvFileName").textContent = this.csvFile ? this.csvFile.name : "Nenhum arquivo selecionado";
    });
    this.campaignModalElement.querySelector("#campaignModalBackToViewBtn").addEventListener("click", () => this._closeCampaignModal(true));
    this.campaignModalElement.querySelector("#campaignModalVerifyCsvBtn").addEventListener("click", () => this._validateAndProceedWithCsv());
  }
  // Função para validar o formulário da campanha
  _validateCampaignForm() {
    let isValid = true;
    const campaignName = this.campaignModalElement.querySelector("#campaignName");
    const campaignEndDate = this.campaignModalElement.querySelector("#campaignEndDate");
    const nameError = this.campaignModalElement.querySelector("#campaignNameError");
    const dateError = this.campaignModalElement.querySelector("#campaignEndDateError");
    
    // Resetar estados de erro
    nameError.textContent = "";
    dateError.textContent = "";
    campaignName.classList.remove("input-error");
    campaignEndDate.classList.remove("input-error");
    
    // Validar nome da campanha
    if (!campaignName.value.trim()) {
      nameError.textContent = "Nome da campanha é obrigatório";
      campaignName.classList.add("input-error");
      isValid = false;
    } else if(campaignName.value.trim().length > 50) {
      nameError.textContent = "Nome deve ter no máximo 50 caracteres";
      campaignName.classList.add("input-error");
      isValid = false;
    }
    else if (campaignName.value.trim().length < 3) {
      nameError.textContent = "Nome deve ter pelo menos 3 caracteres";
      campaignName.classList.add("input-error");
      isValid = false;
    }
    
    // Validar data de encerramento
    if (!campaignEndDate.value) {
      dateError.textContent = "Data de encerramento é obrigatória";
      campaignEndDate.classList.add("input-error");
      isValid = false;
    } else {
      const selectedDate = new Date(campaignEndDate.value + "T23:59:59");
      const today = new Date();
      const diffHours = (selectedDate - today) / (1000 * 60 * 60);
      if (selectedDate < today) {
        dateError.textContent = "A data deve ser hoje ou futura";
        campaignEndDate.classList.add("input-error");
        isValid = false;
      }

      if(diffHours < 1) {
        dateError.textContent = "⛔ Não é possível criar um questionário com menos de 1 hora de duração. " +
        "Por favor, agende para o dia seguinte.";
        campaignEndDate.classList.add("input-error");
        isValid = false;
      }
    }
    
    return isValid;
  }

  _validateAndProceedWithCsv() {
    if (!this._validateCampaignForm()) {
      showNotification("Por favor, corrija os campos do formulário.", "error");
      return;
    }
    
    if (!this.csvFile) {
      showNotification("Por favor, selecione um arquivo CSV.", "error");
      return;
    }
    
    this.campaignData = {
      name: this.campaignModalElement.querySelector("#campaignName").value.trim(),
      endDate: this.campaignModalElement.querySelector("#campaignEndDate").value
    };

    this.campaignFormData = {...this.campaignData}
    
    // Procede com a leitura do CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target.result;
      this._processCsv(csvText); 
      this.campaignModalStep = 2;
      this._renderCampaignResultsView(); 
    };
    reader.onerror = () => showNotification("Erro ao ler o arquivo.", "error");
    reader.readAsText(this.csvFile);
  }
  
  _validateCsvName(name) {
    if (!name || typeof name !== 'string') return false;
    const trimmedName = name.trim();
    return trimmedName.length >= 2 && /^[a-zA-ZÀ-ÿ\s'-]+$/.test(trimmedName);
  }

  _validateCsvEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  _validateCsvPhoneNumber(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const normalized = phone.replace(/[\s\-().]/g, '');
    const e164 = /^\+?[1-9]\d{1,14}$/;
    return e164.test(normalized);
  }
  _processCsv(csvText) {
    this.allProcessedContacts = []; 
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length < 2) {
      showNotification("CSV vazio ou sem dados.", "error"); return;
    }
    const headerLine = lines[0].toLowerCase().trim();
    const headers = headerLine.split(',').map(h => h.trim());
    const nameIndex = headers.indexOf("nome");
    const emailIndex = headers.indexOf("email");
    const phoneIndex = headers.indexOf("telefone");

    if (nameIndex === -1 || emailIndex === -1 || phoneIndex === -1) {
      showNotification("Cabeçalho do CSV inválido. Esperado: nome, email, telefone.", "error");
      this.campaignModalStep = 1; this._renderCampaignModalStep1(); return;
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values = line.split(',');
      const contactData = {
        id: this.generateSimpleUniqueId(), 
        name: values[nameIndex] ? values[nameIndex].trim() : '',
        email: values[emailIndex] ? values[emailIndex].trim() : '',
        phone: values[phoneIndex] ? values[phoneIndex].trim() : '',
      };
      this._validateContactData(contactData);
      this.allProcessedContacts.push(contactData);
    }
  }

  _renderCampaignResultsView() {
    const bodyContent = this.campaignModalElement.querySelector("#campaignModalBodyContent");
    const footerContent = this.campaignModalElement.querySelector("#campaignModalFooterContent");

    const validContacts = this.allProcessedContacts.filter(c => c.isValid);
    const invalidContacts = this.allProcessedContacts.filter(c => !c.isValid);

    bodyContent.innerHTML = `
      <div class="csv-results-summary">
        <h4>Resultados da Verificação:</h4>
        <div class="summary-item valid">
          <i class="fas fa-check-circle"></i><span class="count">${validContacts.length}</span><span>Contatos Válidos</span>
        </div>
        <div class="summary-item invalid">
          <i class="fas fa-times-circle"></i><span class="count">${invalidContacts.length}</span><span>Contatos Inválidos</span>
        </div>
      </div>
      <div class="contacts-list-container">
        ${this._renderContactListSection("Contatos Válidos", validContacts, true)}
        ${this._renderContactListSection("Contatos Inválidos", invalidContacts, false)}
      </div>
    `;

    footerContent.innerHTML = `
      <button class="modal-button modal-button-secondary" id="campaignModalBackToUploadBtn">Voltar ao Upload</button>
      ${validContacts.length > 0 ? `
      <button class="modal-button modal-button-download-valid" id="download-valid-csv-btn" style="background:rgba(46,204,113,0.15);color:#27ae60;border:1px solid #27ae60;margin-left:8px;">
        Baixar CSV Válidos
      </button>
      ` : ''}
      ${invalidContacts.length > 0 ? `
      <button class="modal-button modal-button-download-invalid" id="download-invalid-csv-btn" style="background:rgba(231,76,60,0.15);color:#e74c3c;border:1px solid #e74c3c;margin-left:8px;">
        Baixar CSV Inválidos
      </button>
      ` : ''}
      <button class="modal-button modal-button-primary" id="campaignModalCreateFinalBtn" ${validContacts.length === 0 ? 'disabled' : ''} style="margin-left:8px;">Criar Campanha</button>
    `;

    this._addResultsViewEventListeners();
  }

  _handleDeleteContact(contactId) {
    // Remove o contato da lista
    this.allProcessedContacts = this.allProcessedContacts.filter(c => c.id !== contactId);
    // Atualiza a visualização
    this._renderCampaignResultsView();
    showNotification("Contato removido com sucesso!", "success");
  }

  _renderContactListSection(title, contacts, isValidList) {
    if (contacts.length === 0 && isValidList) return `<section class="contact-list-section"><h5 class="contact-list-title">${title} (0)</h5><p class="no-contacts-message">Nenhum contato válido.</p></section>`;
    if (contacts.length === 0 && !isValidList) return '';

    return `
      <section class="contact-list-section">
        <div class="contact-list-title-container">
          <h5 class="contact-list-title">${title} (${contacts.length})</h5>

        </div>
        <div class="contact-items-wrapper">
          ${contacts.map(contact => `
            <div class="contact-item" data-contact-id="${contact.id}">
              <div class="contact-info">
                <span class="contact-name">${contact.name || '(Sem nome)'}</span>
                <span class="contact-detail">${contact.email || '(Sem email)'}</span>
                <span class="contact-detail">${contact.phone || '(Sem telefone)'}</span>
                ${!contact.isValid ? `<span class="contact-invalid-reason">Motivo: ${contact.invalidReason.join(', ')}</span>` : ''}
              </div>
              <div class="contact-actions">
                <button class="contact-action-btn edit-contact-btn" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#4649FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="contact-action-btn delete-contact-btn" title="Excluir">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  _addResultsViewEventListeners() {
    this.campaignModalElement.querySelector("#campaignModalBackToUploadBtn").addEventListener("click", () => {
      this.campaignModalStep = 1; 
      this.csvFile = null; 
      this.allProcessedContacts = [];
      this._renderCampaignModalStep1();
    });

    const downloadValidBtn = this.campaignModalElement.querySelector('#download-valid-csv-btn');
    if (downloadValidBtn) {
      downloadValidBtn.addEventListener('click', () => {
        const validContacts = this.allProcessedContacts.filter(c => c.isValid);
        this._downloadCsv(validContacts, 'contatos_validos.csv');
      });
    }
    const downloadInvalidBtn = this.campaignModalElement.querySelector('#download-invalid-csv-btn');
    if (downloadInvalidBtn) {
      downloadInvalidBtn.addEventListener('click', () => {
        const invalidContacts = this.allProcessedContacts.filter(c => !c.isValid);
        this._downloadCsv(invalidContacts, 'contatos_invalidos.csv');
      });
    }
    this.campaignModalElement.querySelector("#campaignModalCreateFinalBtn").addEventListener("click", () => this._handleCreateCampaignFinal());

    const contactsListContainer = this.campaignModalElement.querySelector('.contacts-list-container');
    if (contactsListContainer) {
        contactsListContainer.addEventListener('click', (e) => {
            const contactItem = e.target.closest('.contact-item');
            if (!contactItem) return;
            const contactId = contactItem.dataset.contactId;
            if (e.target.closest('.edit-contact-btn')) {
                this._handleEditContact(contactId);
            } else if (e.target.closest('.delete-contact-btn')) {
                this._handleDeleteContact(contactId);
            }
        });
    }
  }

  _downloadCsv(contacts, filename) {
    if (!contacts || contacts.length === 0) {
      showNotification("Nenhum contato para baixar.", "info");
      return;
    }
    const headers = ["nome", "email", "telefone"];
    if (!contacts[0].isValid) headers.push("motivo_invalidez");
    let csvContent = headers.join(",") + "\n";
    contacts.forEach(contact => {
      const row = [
        contact.name || '',
        contact.email || '',
        contact.phone || ''
      ];
      if (!contact.isValid) {
        row.push(contact.invalidReason ? contact.invalidReason.join('; ') : '');
      }
      csvContent += row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",") + "\n";
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showNotification("Seu navegador não suporta downloads diretos. Tente em outro navegador.", "error");
    }
  }

async _handleCreateCampaignFinal() {
  try {
    const validContactsPayload = this.allProcessedContacts
      .filter(c => c.isValid)
      .map(({ name, email, phone }) => ({ 
        name, 
        email, 
        phone
      }));

    if (validContactsPayload.length === 0) {
      showNotification("É necessário ter pelo menos um contato válido.", "error");
      return;
    }
    
    const payload = {
      questionnaireId: this.selectedQuestionnaire.id,
      campaignName: this.campaignData.name,
      endDate: this.campaignData.endDate,
      contacts: validContactsPayload
    };

    const createBtn = this.campaignModalElement.querySelector("#campaignModalCreateFinalBtn");
    const originalBtnText = createBtn.textContent;
    createBtn.disabled = true;
    createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    const { data } = await createCampaign(payload);

    createBtn.disabled = false;
    createBtn.textContent = originalBtnText;

    navigateTo("/dashboard/campaigns");
    showNotification(`Campanha criada com ${validContactsPayload.length} contatos.`, "success");
    this._closeCampaignModal();

    return data;
  } catch (error) {
    showNotification(
      `Erro ao criar campanha: ${error.message || "Tente novamente mais tarde."}`,
      "error"
    );
  }
}

  // --- Métodos para o Modal de Edição de Contato ---
  _createEditContactModalIfNeeded() {
    if (!document.getElementById("editContactModal")) {
        const modalOverlay = document.createElement("div");
        modalOverlay.id = "editContactModal";
        modalOverlay.className = "modal-overlay edit-contact-modal-overlay"; 
        modalOverlay.innerHTML = `
            <div class="modal edit-contact-modal">
                <div class="modal-header">
                    <h2 class="modal-title">Editar Contato</h2>
                    <button class="modal-close" id="editContactModalCloseBtn">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="editContactName">Nome</label>
                        <input type="text" id="editContactName">
                        <span class="input-error-msg" id="editContactNameError"></span>
                    </div>
                    <div class="form-group">
                        <label for="editContactEmail">Email</label>
                        <input type="email" id="editContactEmail">
                        <span class="input-error-msg" id="editContactEmailError"></span>
                    </div>
                    <div class="form-group">
                        <label for="editContactPhone">Telefone</label>
                        <input type="tel" id="editContactPhone">
                        <span class="input-error-msg" id="editContactPhoneError"></span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-button modal-button-secondary" id="editContactModalCancelBtn">Cancelar</button>
                    <button class="modal-button modal-button-primary" id="editContactModalSaveBtn">Salvar</button>
                </div>
            </div>`; // Corrigido aqui
        document.body.appendChild(modalOverlay);
        this.editContactModalElement = modalOverlay;

        modalOverlay.querySelector("#editContactModalCloseBtn").addEventListener("click", () => this._closeEditContactModal());
        modalOverlay.querySelector("#editContactModalCancelBtn").addEventListener("click", () => this._closeEditContactModal());
        modalOverlay.querySelector("#editContactModalSaveBtn").addEventListener("click", () => this._handleSaveEditedContact());
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) this._closeEditContactModal();
        });
    }
  }

  _handleEditContact(contactId) {
    this.contactBeingEdited = this.allProcessedContacts.find(c => c.id === contactId);
    if (!this.contactBeingEdited) return;

    this.editContactModalElement.querySelector("#editContactName").value = this.contactBeingEdited.name;
    this.editContactModalElement.querySelector("#editContactEmail").value = this.contactBeingEdited.email;
    this.editContactModalElement.querySelector("#editContactPhone").value = this.contactBeingEdited.phone;

    this.editContactModalElement.querySelectorAll('.input-error-msg').forEach(el => el.textContent = '');
    this.editContactModalElement.querySelectorAll('input').forEach(el => el.classList.remove('input-error-border'));

    if(this.editContactModalElement) this.editContactModalElement.classList.add("active");
  }

  _closeEditContactModal() {
    if (this.editContactModalElement) {
        this.editContactModalElement.classList.remove("active");
    }
    this.contactBeingEdited = null;
  }

  _handleSaveEditedContact() {
    if (!this.contactBeingEdited) return;

    const nameInput = this.editContactModalElement.querySelector("#editContactName");
    const emailInput = this.editContactModalElement.querySelector("#editContactEmail");
    const phoneInput = this.editContactModalElement.querySelector("#editContactPhone");

    const nameErrorSpan = this.editContactModalElement.querySelector("#editContactNameError");
    const emailErrorSpan = this.editContactModalElement.querySelector("#editContactEmailError");
    const phoneErrorSpan = this.editContactModalElement.querySelector("#editContactPhoneError");

    [nameInput, emailInput, phoneInput].forEach(el => el.classList.remove('input-error-border'));
    [nameErrorSpan, emailErrorSpan, phoneErrorSpan].forEach(el => el.textContent = '');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    
    const dataToValidate = { name, email, phone }; 
    
    this._validateContactData(dataToValidate);

    if (!dataToValidate.isValid) {
        dataToValidate.invalidReason.forEach(reason => {
            if (reason.toLowerCase().includes("nome")) {
                nameInput.classList.add('input-error-border');
                nameErrorSpan.textContent = reason;
            } else if (reason.toLowerCase().includes("email")) {
                emailInput.classList.add('input-error-border');
                emailErrorSpan.textContent = reason;
            } else if (reason.toLowerCase().includes("telefone")) {
                phoneInput.classList.add('input-error-border');
                phoneErrorSpan.textContent = reason;
            }
        });
        showNotification("Dados inválidos! Verifique os campos e tente novamente.", "error");
        return; 
    }
    
    const contactIndex = this.allProcessedContacts.findIndex(c => c.id === this.contactBeingEdited.id);
    if (contactIndex > -1) {
        this.allProcessedContacts[contactIndex].name = name; 
        this.allProcessedContacts[contactIndex].email = email;
        this.allProcessedContacts[contactIndex].phone = phone;
        this.allProcessedContacts[contactIndex].isValid = true; 
        this.allProcessedContacts[contactIndex].invalidReason = []; 
    }
    
    this._closeEditContactModal();
    this._renderCampaignResultsView(); 
    showNotification("Contato atualizado com sucesso!", "success");
  }
}