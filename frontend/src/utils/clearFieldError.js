export function clearFieldError(fieldId) {
  let input = document.getElementById(fieldId);
  if (!input) return;
  let error = input.nextElementSibling;
  if (error && error.classList.contains('input-error')) {
    error.style.display = 'none';
  }
  input.classList.remove('input-error-border');
}