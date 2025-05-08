export function getCurrentStepFields(currentStep) {
  if (currentStep === 1) return ['signup-name','signup-email'];
  if (currentStep === 2) return ['signup-password','signup-confirm-password'];
  if (currentStep === 3) return ['signup-company-name','signup-cnpj'];
  return [];
}