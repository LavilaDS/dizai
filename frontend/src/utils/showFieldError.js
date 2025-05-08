export function showFieldError(fieldId, msg) {
  let input = document.getElementById(fieldId);
  if (!input) return;
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains('input-error')) {
    error = document.createElement('span');
    error.className = 'input-error';
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  error.textContent = msg;
  error.style.display = 'block';
  input.classList.add('input-error-border');
}