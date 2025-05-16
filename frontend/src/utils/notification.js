let lastToastTime = 0;
const TOAST_DELAY = 2500; // 1.2 segundos

// Toast de notificação reutilizável
function getToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.zIndex = '9999'; // Ensure it appears above other elements
    document.body.appendChild(container);
  }
  return container;
}

export function showNotification(message, type = 'success') {
  const now = Date.now();
  if (now - lastToastTime < TOAST_DELAY) return; // Bloqueia spam
  lastToastTime = now;

  const container = getToastContainer();
  let toast = document.createElement('div');
  toast.className = `custom-toast custom-toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  // Força reflow para ativar a animação
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3500);

  // Após renderizar, verifica se algum toast está fora da viewport e esconde
  setTimeout(() => {
    let totalHeight = 0;
    const toasts = Array.from(container.children);
    for (let i = 0; i < toasts.length; i++) {
      const el = toasts[i];
      el.style.display = '';
      totalHeight += el.offsetHeight + 12; // 12px gap
      if (window.innerHeight - 32 < totalHeight) {
        el.style.display = 'none';
      }
    }
  }, 50);
}
