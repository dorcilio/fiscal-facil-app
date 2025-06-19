import {
  helpers,
  required,
  minLength,
  maxLength,
  numeric,
} from '@vuelidate/validators'
import { Address, AddressValidation } from './address'
import { UserRegistration, UserRegistrationValidation } from './user'

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
  if (!value) return true // Deixa o 'required' lidar com a obrigatoriedade
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length !== 14 || /^(.)\1{13}$/.test(cleaned)) return false
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

// Classe base para Pessoa Jurídica
class BasePartnerRegistration {
  constructor() {
    this.cpfCnpj = ''
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = '' // Pode ser relevante para qualquer PJ

    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = [] // CNAEs secundários

    this.ie = '' // Inscrição Estadual

    this.address = new Address()
    this.user = new UserRegistration() // Usuário responsável pela empresa
  }

  parseFromReceitaWS(data) {
    this.cnpj = data.cnpj || ''
    this.razaoSocial = data.razao_social || ''
    this.fantasia = data.nome_fantasia || ''
    this.telefone = data.ddd_telefone_1 || ''
    this.telefoneSecundario = data.ddd_telefone_2 || ''
    this.situacaoReceita = data.situacao || ''

    this.cnaeId = data.cnae_fiscal || ''
    this.cnaeDescricao = data.cnae_fiscal_descricao || ''
    this.cnaes = (data.cnaes_secundarios || [])
      .filter((cnae) => cnae.codigo && cnae.codigo.length === 7)
      .map((cnae) => ({
        cnaeId: cnae.codigo,
        descricao: cnae.descricao,
      }))

    // ReceitaWS não retorna IE diretamente de forma padronizada, pode vir em campo "estabelecimento"
    // this.ie = data.ie || ''; // Se tiver um campo IE na sua integração ReceitaWS

    this.address.parseFromReceitaWS(data)
  }

  // toRequest e reset serão implementados nas classes filhas
}

// Regras de validação base para qualquer Pessoa Jurídica
const BasePartnerValidation = {
  cpfCnpj: {
    required: helpers.withMessage('É necessário informar o CNPJ', required),
    numeric: helpers.withMessage('CNPJ deve conter apenas números', numeric),
    minLength: helpers.withMessage(
      'CNPJ deve conter 14 caracteres',
      minLength(14)
    ),
    maxLength: helpers.withMessage(
      'CNPJ deve conter 14 caracteres',
      maxLength(14)
    ),
    validCnpj: helpers.withMessage('CNPJ inválido', isValidCnpj),
  },
  razaoSocial: {
    required: helpers.withMessage(
      'É necessário informar a Razão Social',
      required
    ),
    minLength: helpers.withMessage(
      'Razão Social deve ter no mínimo 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Razão Social pode conter até 115 caracteres',
      maxLength(115)
    ),
  },
  fantasia: {
    minLength: helpers.withMessage(
      'Nome Fantasia deve ter no mínimo 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Nome Fantasia pode conter até 115 caracteres',
      maxLength(115)
    ),
  },
  telefone: {
    required: helpers.withMessage(
      'É necessário informar um Telefone principal',
      required
    ),
    minLength: helpers.withMessage(
      'Telefone principal deve ter no mínimo 10 dígitos (com DDD)',
      minLength(10)
    ),
    maxLength: helpers.withMessage(
      'Telefone principal pode ter até 11 dígitos (com DDD)',
      maxLength(11)
    ),
  },
  telefoneSecundario: {
    minLength: helpers.withMessage(
      'Telefone secundário deve ter no mínimo 11 dígitos (com DDD)',
      minLength(11)
    ),
    maxLength: helpers.withMessage(
      'Telefone secundário pode ter até 11 dígitos (com DDD)',
      maxLength(11)
    ),
  },
  ie: {
    numeric: helpers.withMessage('IE deve conter apenas números', numeric),
    maxLength: helpers.withMessage(
      'IE deve conter até 15 caracteres',
      maxLength(15)
    ),
  },
  cnaeId: {
    // CNAE Principal - opcional se não for uma empresa ativa
    numeric: helpers.withMessage('CNAE deve conter apenas números', numeric),
    minLength: helpers.withMessage('CNAE deve ter 7 dígitos', minLength(7)),
    maxLength: helpers.withMessage('CNAE deve ter 7 dígitos', maxLength(7)),
  },
  user: {
    ...UserRegistrationValidation,
  },
  address: {
    ...AddressValidation,
  },
}

export { BasePartnerRegistration, BasePartnerValidation }
