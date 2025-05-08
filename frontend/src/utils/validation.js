// Validation utility functions
export function validateName(name) {
    const strName = String(name).trim()
    const re = /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/
    return re.test(strName)
}

export function validateEmail(email) {
  // Regex simples para validar email
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return re.test(email);
}

export function validatePassword(password) {
  // Pelo menos 6 caracteres, incluindo número e caractere especial
  const lengthCheck = password.length >= 6;
  const numberCheck = /\d/.test(password);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return lengthCheck && numberCheck && specialCheck;
}

export function validateCnpj(cnpj) {
    const digits = String(cnpj).replace(/\D/g, '')
    if (digits.length !== 14) return false

    const nums = digits.split('').map(Number)
    const base = nums.slice(0, 12)

    // Primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum1 = base.reduce((acc, n, i) => acc + n * weights1[i], 0)
    const rem1 = sum1 % 11
    const dig1 = rem1 < 2 ? 0 : 11 - rem1

    // Segundo dígito verificador
    const base2 = base.concat(dig1)
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const sum2 = base2.reduce((acc, n, i) => acc + n * weights2[i], 0)
    const rem2 = sum2 % 11
    const dig2 = rem2 < 2 ? 0 : 11 - rem2

    return dig1 === nums[12] && dig2 === nums[13]
}