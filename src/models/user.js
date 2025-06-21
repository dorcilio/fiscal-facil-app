import {
  helpers,
  required,
  maxLength,
  email,
  minLength,
  minValue,
} from '@vuelidate/validators'
import Address from './address'

/** Senha deve conter de 8 à 14 dígitos, contendo pelo menos 1 letra e 1 número */
const regexPassword = helpers.regex(
  /^(?=(.*[A-Za-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){0,})(?!.*\s).{8,14}$/
)

/** Validação de CPF */
// const regexCPF = helpers.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)

const EmailValidation = {
  required: helpers.withMessage('É necessário informar um e-mail', required),
  email: helpers.withMessage('Informe um e-mail válido', email),
  maxLength: helpers.withMessage(
    'E-mail deve conter no máximo 320 caracteres',
    maxLength(320)
  ),
}

const PasswordValidation = {
  required: helpers.withMessage('É necessário informar uma senha', required),
  rule: helpers.withMessage(
    'Senha deve conter de 8 à 14 dígitos, contendo pelo menos 1 letra e 1 número',
    regexPassword
  ),
}

class UserLogin {
  /**
   * Constructor for UserLogin
   * @param {string} [email=''] - The email of the user
   */
  constructor(email = '') {
    this.email = email
    this.password = ''
    this.rememberMe = false
    this.geoIP = {}
  }

  /**
   * Parses and assigns geographic IP information to the user.
   * @param {Object} geoIP - The geographic IP information.
   * @param {string} geoIP.ip - The IP address.
   * @param {string} geoIP.city - The city name.
   * @param {string} geoIP.region - The region name.
   * @param {string} geoIP.country - The country name.
   * @param {number|null} geoIP.latitude - The latitude coordinate.
   * @param {number|null} geoIP.longitude - The longitude coordinate.
   */
  parseFromGeoIP(geoIP) {
    this.geoIP = {
      ipAddress: geoIP.ip || '',
      city: geoIP.city || '',
      region: geoIP.region || '',
      country: geoIP.country || '',
      latitude: geoIP.latitude || null,
      longitude: geoIP.longitude || null,
    }
  }

  /**
   * Creates a request object for the user, containing the email, password and geoIP information.
   * @returns {Object} The request object.
   */
  toRequest() {
    return {
      email: this.email,
      password: this.password,
      geoIP: this.geoIP,
    }
  }

  /**
   * Resets the user's information back to an empty state.
   *
   * @chainable
   * @returns {UserLogin} The UserLogin instance.
   */
  reset() {
    this.email = ''
    this.password = ''
    this.geoIP = {}
  }
}

const UserLoginValidation = {
  email: EmailValidation,
  password: PasswordValidation,
}

class UserProfile {
  /**
   * Creates a new UserProfile with empty properties.
   *
   * @constructor
   */
  constructor() {
    // Dados pessoais básicos
    this.email = ''
    this.emailConfirmed = false
    this.fullName = ''
    this.genderId = null
    this.genderName = ''
    this.birthDate = ''
    this.avatar = ''
    this.cpf = ''
    this.phone = ''

    // Dados de autenticação
    this.root = false
    this.roleId = 1
    this.roleName = 'Usuário'

    // Endereço
    this.address = new Address()

    // Segurança
    this.changePassword = false

    // Informações adicionais
    this.creationDate = ''

    // Informações do parceiro
    this.cpfCnpj = ''
    this.ie = ''
  }

  /**
   * Converte o objeto em um formato aceitável para a API.
   *
   * @returns {Object} Objeto com as informações do perfil do usuário.
   */
  toRequest() {
    return {
      email: this.email?.trim().toLowerCase(),
      fullName: this.fullName,
      genderId: this.genderId,
      genderName: this.genderName,
      birthDate: this.birthDate,
      avatar: this.avatar,
      cpf: this.cpf,
      phone: this.phone,
      roleId: this.roleId,
      roleName: this.roleName,
      root: this.root,
      address: this.address.toRequest(),
      cpfCnpj: this.cpfCnpj,
      ie: this.ie,
    }
  }

  /**
   * Reinicializa o objeto com os valores padrão.
   *
   * @returns {void}
   */
  reset() {
    this.email = ''
    this.emailConfirmed = false
    this.fullName = ''
    this.genderId = null
    this.genderName = ''
    this.birthDate = ''
    this.avatar = ''
    this.cpf = ''
    this.phone = ''

    // Dados de autenticação
    this.root = false
    this.roleId = 1
    this.roleName = 'Usuário'

    // Endereço
    this.address = new Address()

    // Segurança
    this.changePassword = false

    // Informações do parceiro
    this.cpfCnpj = ''
    this.ie = ''
  }
}

class UserRegistration {
  /**
   * Construtor da classe UserRegistration.
   *
   * Inicializa um objeto da classe com os valores padrão.
   *
   * @constructor
   */
  constructor() {
    // Dados pessoais básicos
    this.email = ''
    this.fullName = ''
    this.genderId = null
    this.birthDate = ''
    this.phone = ''

    // Segurança
    this.password = ''
    this.confirmPassword = ''

    // Termos e preferências
    this.acceptTerms = false
  }

  /**
   * Cria um objeto que pode ser enviado na requisição para o backend.
   *
   * @returns {Object} Objeto com os dados do usuário para registro.
   */
  toRequest() {
    return {
      email: this.email?.trim().toLowerCase(),
      fullName: this.fullName,
      genderId: this.genderId,
      birthDate: this.birthDate,
      phone: this.phone,
      password: this.password,
      acceptTerms: this.acceptTerms,
    }
  }

  /**
   * Reinicializa o objeto com os valores padrão.
   *
   * @returns {void}
   */
  reset() {
    this.email = ''
    this.fullName = ''
    this.genderId = null
    this.birthDate = ''
    this.phone = ''
    this.password = ''
    this.confirmPassword = ''
    this.acceptTerms = false
  }
}

const UserRegistrationValidation = {
  email: EmailValidation,
  fullName: {
    required: helpers.withMessage(
      'É necessário informar nome completo',
      required
    ),
    minLength: helpers.withMessage(
      'Nome deve ser maior que 1 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Nome pode conter apenas 120 caracteres',
      maxLength(120)
    ),
  },
  genderId: {
    required: helpers.withMessage('É necessário escolher um gênero', required),
    minValue: helpers.withMessage('Selecione um gênero da lista', minValue(1)),
  },
  birthDate: {
    required: false,
    validAge: helpers.withMessage(
      'Você deve ter pelo menos 13 anos',
      (value) => {
        if (!value) return true
        const today = new Date()
        const birthDate = new Date(value)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--
        }

        return age >= 13
      }
    ),
  },
  phone: {
    required: false,
    validPhone: helpers.withMessage(
      'Telefone deve ter um formato válido',
      (value) => {
        if (!value) return true
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/
        return phoneRegex.test(value)
      }
    ),
  },
  password: PasswordValidation,
  confirmPassword: {
    required: helpers.withMessage('É necessário confirmar a senha', required),
    sameAs: helpers.withMessage(
      'As senhas não são idênticas',
      (value, { password }) => {
        return value === password
      }
    ),
  },
  acceptTerms: {
    required: helpers.withMessage(
      'Você deve aceitar os termos de uso',
      (value) => value === true
    ),
  },
}

const mockGenderOptions = [
  { genderId: 1, genderName: 'Feminino' },
  { genderId: 2, genderName: 'Masculino' },
  { genderId: 3, genderName: 'Não-binário' },
  { genderId: 4, genderName: 'Não informar' },
]

export default {
  UserProfile,
  UserLogin,
  UserLoginValidation,
  UserRegistration,
  UserRegistrationValidation,
}

export {
  EmailValidation,
  UserProfile,
  UserLogin,
  UserLoginValidation,
  UserRegistration,
  UserRegistrationValidation,
  mockGenderOptions,
}
