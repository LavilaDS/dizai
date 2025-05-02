import {
  getLoggedInHeaderHTML,
  addLogoutButtonListener,
} from "../components/header.js";
import { navigateTo } from "../router.js";

let selectedQuantity = null;

export function renderCreateCampaignPage() {
  const appContainer = document.getElementById("app");
  if (!appContainer) return;

  const headerHTML = getLoggedInHeaderHTML();
  const createCampaignContentHTML = `
        <div class="create-campaign-content">
            <h1>Criar Nova Campanha</h1>
            <form id="create-campaign-form">
                <!-- Outros campos da campanha (Nome, Selecionar Questionário - virão de outras tasks) -->
                <div class="form-group">
                    <label for="campaign-name">Nome da Campanha:</label>
                    <input type="text" id="campaign-name" required>
                </div>

                <!-- SEÇÃO DE QUANTIDADE (Tarefa H6) -->
                <div class="quantity-selection form-group">
                    <h3>Selecione a Quantidade de Envios:</h3>
                    <label>
                        <input type="radio" name="quantity-package" value="50" required> Pacote 50
                    </label>
                    <label>
                        <input type="radio" name="quantity-package" value="200"> Pacote 200
                    </label>
                    <label>
                        <input type="radio" name="quantity-package" value="custom"> Outra:
                        <input type="number" id="custom-quantity" min="1" style="display: none; width: 60px;">
                    </label>
                    <p id="quantity-error" class="error-message" style="display:none;"></p>
                </div>
                <!-- Fim da Seção de Quantidade -->

                <!-- Botão para próximo passo ou submeter -->
                 <button type="submit">Próximo Passo (Upload Lista)</button>
            </form>
        </div>
    `;

  appContainer.innerHTML = headerHTML + createCampaignContentHTML;

  addLogoutButtonListener();

  addQuantitySelectionListeners();

  addCampaignFormListener();
}

function addQuantitySelectionListeners() {
  const radios = document.querySelectorAll('input[name="quantity-package"]');
  const customInput = document.getElementById("custom-quantity");
  const errorElement = document.getElementById("quantity-error");

  radios.forEach((radio) => {
    radio.addEventListener("change", (event) => {
      errorElement.style.display = "none";
      const value = event.target.value;
      if (value === "custom") {
        customInput.style.display = "inline-block";
        customInput.required = true;
        selectedQuantity = parseInt(customInput.value) || null;
      } else {
        customInput.style.display = "none";
        customInput.required = false;
        selectedQuantity = parseInt(value);
      }
      console.log("Quantidade selecionada:", selectedQuantity);
    });
  });

  if (customInput) {
    customInput.addEventListener("input", (event) => {
      if (
        document.querySelector(
          'input[name="quantity-package"][value="custom"]:checked'
        )
      ) {
        selectedQuantity = parseInt(event.target.value) || null;
        console.log("Quantidade customizada:", selectedQuantity);
      }
    });
  }
}

function validateQuantitySelection() {
  const errorElement = document.getElementById("quantity-error");
  const customSelected = document.querySelector(
    'input[name="quantity-package"][value="custom"]:checked'
  );

  if (
    selectedQuantity === null ||
    selectedQuantity <= 0 ||
    (customSelected && !selectedQuantity)
  ) {
    errorElement.textContent =
      "Por favor, selecione ou informe uma quantidade válida.";
    errorElement.style.display = "block";
    return false;
  }
  errorElement.style.display = "none";
  return true;
}

function addCampaignFormListener() {
  const form = document.getElementById("create-campaign-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("Tentando submeter form de campanha");

      const isQuantityValid = validateQuantitySelection();
      const campaignName = document.getElementById("campaign-name").value;

      if (isQuantityValid && campaignName) {
        console.log("Validações OK!");
        console.log("Nome Campanha:", campaignName);
        console.log("Quantidade Final:", selectedQuantity);
        alert(
          `Campanha "${campaignName}" pronta para próximo passo com quantidade ${selectedQuantity}.`
        );
      } else {
        console.log("Falha nas validações.");
      }
    });
  }
}
