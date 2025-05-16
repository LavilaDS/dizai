export default class ModalManager {
  constructor() {
    this.modalElement = null;
    this.currentConfig = null;
    this.eventHandlers = {};
    this._createModalElement();
  }

  _createModalElement() {
    const existingModal = document.getElementById("app-modal");
    if (existingModal) {
      this.modalElement = existingModal;
      this.modalElement.querySelector("#modalCloseBtn").addEventListener("click", () => this.close());
      this.modalElement.addEventListener("click", (e) => {
        if (e.target === this.modalElement) this.close();
      });
      return;
    }
    
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "app-modal";
    modalOverlay.className = "modal-overlay";
    modalOverlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title" id="modalTitle"></h2>
          <button class="modal-close" id="modalCloseBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body" id="modalBodyContent"></div>
        <div class="modal-footer" id="modalFooterContent"></div>
      </div>`;
    document.body.appendChild(modalOverlay);
    this.modalElement = modalOverlay;
    this.modalElement.querySelector("#modalCloseBtn").addEventListener("click", () => this.close());
    this.modalElement.addEventListener("click", (e) => {
      if (e.target === this.modalElement) this.close();
    });
  }

  open(config) {
    // Ensure modal element exists before attempting to use it
    if (!this.modalElement) {
      this._createModalElement();
      if (!this.modalElement) {
        console.error("Failed to create modal element");
        return; // Exit if modal creation failed
      }
    }
    
    this.currentConfig = config;
    this.modalElement.querySelector("#modalTitle").textContent = config.title || "Modal";
    const modalContainer = this.modalElement.querySelector(".modal");
    modalContainer.className = "modal";
    if (config.size) modalContainer.classList.add(`modal-${config.size}`);
    if (config.customClass) modalContainer.classList.add(config.customClass);
    this.modalElement.querySelector("#modalBodyContent").innerHTML =
      typeof config.bodyContent === "function"
        ? config.bodyContent()
        : config.bodyContent || "";
    this.modalElement.querySelector("#modalFooterContent").innerHTML =
      typeof config.footerContent === "function"
        ? config.footerContent()
        : config.footerContent || "";
    this._setupEventListeners(config.events || {});
    this.modalElement.classList.add("active");
    document.body.style.overflow = "hidden";
    if (config.onOpen && typeof config.onOpen === "function") {
      config.onOpen(this);
    }
  }

  close() {
    if (this.currentConfig && this.currentConfig.confirmBeforeClose) {
      if (!confirm("Tem certeza que deseja fechar?")) {
        return;
      }
    }
    if (this.currentConfig && this.currentConfig.onClose &&
        typeof this.currentConfig.onClose === "function") {
      this.currentConfig.onClose();
    }
    this._removeEventListeners();
    
    if (this.modalElement) {
      this.modalElement.classList.remove("active");
    }
    
    document.body.style.overflow = "";
    this.currentConfig = null;
  }

  _setupEventListeners(events) {
    this.eventHandlers = {};
    Object.keys(events).forEach(selector => {
      const handlers = events[selector];
      Object.keys(handlers).forEach(eventType => {
        const elements = this.modalElement.querySelectorAll(selector);
        const handler = handlers[eventType];
        if (elements.length && typeof handler === "function") {
          elements.forEach(element => {
            element.addEventListener(eventType, handler);
            if (!this.eventHandlers[selector]) {
              this.eventHandlers[selector] = {};
            }
            if (!this.eventHandlers[selector][eventType]) {
              this.eventHandlers[selector][eventType] = [];
            }
            this.eventHandlers[selector][eventType].push({
              element,
              handler
            });
          });
        }
      });
    });
  }

  _removeEventListeners() {
    Object.keys(this.eventHandlers).forEach(selector => {
      const events = this.eventHandlers[selector];
      Object.keys(events).forEach(eventType => {
        events[eventType].forEach(({ element, handler }) => {
          element.removeEventListener(eventType, handler);
        });
      });
    });
    this.eventHandlers = {};
  }

  updateContent(bodyContent) {
    if (!this.modalElement) return;
    const body = this.modalElement.querySelector("#modalBodyContent");
    body.innerHTML = typeof bodyContent === "function" ? bodyContent() : bodyContent;
  }
  
  updateFooter(footerContent) {
    if (!this.modalElement) return;
    const footer = this.modalElement.querySelector("#modalFooterContent");
    footer.innerHTML = typeof footerContent === "function" ? footerContent() : footerContent;
    if (this.currentConfig && this.currentConfig.events) {
      this._removeEventListeners();
      this._setupEventListeners(this.currentConfig.events);
    }
  }
}
