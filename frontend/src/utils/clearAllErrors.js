import { getCurrentStepFields } from './getCurrentStepFields.js';
import { clearFieldError } from './clearFieldError.js';

export function clearAllErrors(currentStep) {
  getCurrentStepFields(currentStep).forEach(clearFieldError);
}