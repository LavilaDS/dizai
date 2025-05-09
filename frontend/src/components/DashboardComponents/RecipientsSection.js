// Recipients Section Component
export default class RecipientsSection {
  constructor() {
    this.element = null;
  }

  render() {
    this.element = document.createElement('section');
    this.element.id = 'recipients-section';
    this.element.className = 'dashboard-section active';

    this.element.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Listas de Destinatários</h2>
          <div class="card-actions">
            <button class="btn btn-secondary" id="import-csv-btn">
              <i class="fas fa-upload"></i> Importar CSV
            </button>
            <button class="btn btn-primary" id="add-contact-btn">
              <i class="fas fa-plus"></i> Adicionar Contato
            </button>
          </div>
        </div>
        <div class="card-content">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Departamento</th>
                  <th>Adicionado em</th>
                  <th>Campanhas Enviadas</th>
                  <th>Taxa de Resposta</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Ana Silva</td>
                  <td>ana.silva@exemplo.com</td>
                  <td>Marketing</td>
                  <td>10/01/2025</td>
                  <td>5</td>
                  <td>80%</td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Carlos Oliveira</td>
                  <td>carlos.oliveira@exemplo.com</td>
                  <td>Financeiro</td>
                  <td>12/01/2025</td>
                  <td>4</td>
                  <td>75%</td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Maria Santos</td>
                  <td>maria.santos@exemplo.com</td>
                  <td>RH</td>
                  <td>15/01/2025</td>
                  <td>5</td>
                  <td>100%</td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>João Pereira</td>
                  <td>joao.pereira@exemplo.com</td>
                  <td>TI</td>
                  <td>18/01/2025</td>
                  <td>5</td>
                  <td>60%</td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Fernanda Lima</td>
                  <td>fernanda.lima@exemplo.com</td>
                  <td>Comercial</td>
                  <td>20/01/2025</td>
                  <td>3</td>
                  <td>67%</td>
                  <td>
                    <button class="icon-btn">
                      <i class="fas fa-ellipsis-v"></i>
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
    const importCsvBtn = this.element.querySelector('#import-csv-btn');
    const addContactBtn = this.element.querySelector('#add-contact-btn');
    
    if (importCsvBtn) {
      importCsvBtn.addEventListener('click', () => {
        alert('Funcionalidade de importar CSV em desenvolvimento');
      });
    }
    
    if (addContactBtn) {
      addContactBtn.addEventListener('click', () => {
        alert('Funcionalidade de adicionar contato em desenvolvimento');
      });
    }
  }

  unmount() {
    // Remove event listeners to prevent memory leaks
    const btns = this.element.querySelectorAll('button');
    btns.forEach(btn => {
      btn.replaceWith(btn.cloneNode(true));
    });
    
    // Remove the element from DOM if it exists
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}