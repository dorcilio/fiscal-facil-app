/**
 * Validates a given CPF (Cadastro de Pessoa F sica) number.
 *
 * This function checks the format and validity of a CPF number by:
 * - Ignoring non-numeric characters.
 * - Verifying the length is exactly 11 digits.
 * - Checking for invalid repeated digit patterns.
 * - Calculating and validating the verification digits using a weighted sum.
 *
 * @param {string} value - The CPF number to validate.
 * @returns {boolean} - Returns true if the CPF is valid or if the value is empty; otherwise, false.
 */
const isValidCpf = (value) => {
  if (!value) return true
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) return false
  let sum = 0,
    remainder
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false
  sum = 0
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cleaned.substring(i - 1, i)) * (12 - i)
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false
  return true
}

/**
 * Validates a given CNPJ (Cadastro Nacional da Pessoa Jurídica) number.
 *
 * This function checks the format and validity of a CNPJ number by:
 * - Ignoring non-numeric characters.
 * - Verifying the length is exactly 14 digits.
 * - Checking for invalid repeated digit patterns.
 * - Calculating and validating the verification digits using a weighted sum.
 *
 * @param {string} value - The CNPJ number to validate.
 * @returns {boolean} - Returns true if the CNPJ is valid or if the value is empty; otherwise, false.
 */
const isValidCnpj = (value) => {
  if (!value) return true
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length !== 14 || /^(\d)\1{13}$/.test(cleaned)) return false
  let size = cleaned.length - 2
  let numbers = cleaned.substring(0, size)
  const digits = cleaned.substring(size)
  let sum = 0
  let pos = size - 7
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false
  size = size + 1
  numbers = cleaned.substring(0, size)
  sum = 0
  pos = size - 7
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false
  return true
}

/**
 * Checks if two arrays are equal.
 *
 * This function checks if two arrays are equal by verifying that they are both
 * arrays, have the same length, and contain the same elements in the same order.
 *
 * @param {Array} a - The first array to compare.
 * @param {Array} b - The second array to compare.
 * @returns {boolean} - Returns true if the two arrays are equal; otherwise, false.
 */
const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

export { isValidCpf, isValidCnpj, arrayEquals }
