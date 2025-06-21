import {
  helpers,
  required,
  minLength,
  maxLength,
  numeric,
} from '@vuelidate/validators'

import { Address, AddressValidation } from './address'
import { UserRegistration, UserRegistrationValidation } from './user'

class BaseRegistration {
  constructor() {
    this.cpfCnpj = ''
    this.ie = ''
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = ''

    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = []
  }

  /**
   * Preenche o objeto de registro com dados obtidos da API.
   * @param {Object} data - Os dados da API da receita
   * @param {string} [data.cnpj] - O CNPJ da empresa
   * @param {string} [data.razao_social] - Nome fiscal da empresa
   * @param {string} [data.nome_fantasia] - Nome popular da empresa
   * @param {string} [data.ddd_telefone_1] - O número de telefone principal com DDD.
   * @param {string} [data.ddd_telefone_2] - O número de telefone secundário com DDD.
   * @param {string} [data.situacao] - A situação da empresa na Receita.
   * @param {string} [data.cnae_fiscal] - O código CNAE fiscal da empresa.
   * @param {string} [data.cnae_fiscal_descricao] - A descrição do CNAE fiscal.
   * @param {Array} [data.cnaes_secundarios] - Os CNAEs secundários da empresa.
   */
  parseFromReceitaWS(data) {
    this.cpfCnpj = data.cnpj || ''
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
  }

  /**
   * Redefine todos os campos do registro para seus valores padrão.
   */
  reset() {
    this.cpfCnpj = ''
    this.ie = ''
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = ''
    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = []
  }

  /**
   * Cria um objeto com os dados do parceiro no formato aceitável pela API.
   * @returns {Object} O objeto com os dados do parceiro.
   */
  toRequest() {
    return {
      cpfCnpj: this.cpfCnpj,
      razaoSocial: this.razaoSocial,
      fantasia: this.fantasia,
      phone: this.telefone,
      secondaryPhone: this.telefoneSecundario,
      situacaoReceita: this.situacaoReceita,
      cnaeId: this.cnaeId,
      cnaeDescricao: this.cnaeDescricao,
      cnaes: this.cnaes,
    }
  }
}

class ContabilidadeRegistration {
  constructor() {
    this.details = new BaseRegistration()

    this.address = new Address()
    this.user = new UserRegistration()
  }

  /**
   * Preenche o objeto de registro com dados obtidos da API.
   * @param {Object} data - Os dados da API da receita
   * @param {string} [data.cnpj] - O CNPJ da empresa
   * @param {string} [data.razao_social] - Nome fiscal da empresa
   * @param {string} [data.nome_fantasia] - Nome popular da empresa
   * @param {string} [data.ddd_telefone_1] - O número de telefone principal com DDD.
   * @param {string} [data.ddd_telefone_2] - O número de telefone secundário com DDD.
   * @param {string} [data.situacao] - A situação da empresa na Receita.
   * @param {string} [data.cnae_fiscal] - O código CNAE fiscal da empresa.
   * @param {string} [data.cnae_fiscal_descricao] - A descrição do CNAE fiscal.
   * @param {Array} [data.cnaes_secundarios] - Os CNAEs secundários da empresa.
   */
  parseFromReceitaWS(data) {
    this.details.parseFromReceitaWS(data)
    this.address.parseFromReceitaWS(data)
  }

  /**
   * Cria um objeto com os dados do parceiro no formato aceitável pela API.
   * @returns {Object} O objeto com os dados do parceiro.
   */
  toRequest() {
    return {
      ...this.details.toRequest(),
      type: 'Contabilidade',
      address: this.address.toRequest(),
      user: this.user.toRequest(),
    }
  }

  /**
   * Redefine todos os campos do registro para seus valores padrão.
   */
  reset() {
    this.details.reset()
    this.address.reset() // Chama o reset do endereço
    this.user.reset() // Chama o reset do usuário
  }
}

class PessoaFisicaRegistration extends ContabilidadeRegistration {
  constructor() {
    super()
  }

  /**
   * Cria um objeto com os dados do parceiro no formato aceitável pela API.
   * @returns {Object} O objeto com os dados do parceiro.
   */
  toRequest() {
    return {
      ...super.toRequest(),
      type: 'PF',
      ie: this.details.ie,
    }
  }

  /**
   * Redefine todos os campos do registro para seus valores padrão.
   */
  reset() {
    super.reset()
  }
}

class PessoaJuridicaRegistration extends PessoaFisicaRegistration {
  constructor() {
    super()
  }

  /**
   * Cria um objeto com os dados do parceiro no formato aceitável pela API.
   * @returns {Object} O objeto com os dados do parceiro.
   */
  toRequest() {
    return {
      ...super.toRequest(),
      type: 'PJ',
    }
  }
}

const cnaeIdValidation = {
  numeric: helpers.withMessage('CNAE deve conter apenas números', numeric),
  minLength: helpers.withMessage('CNAE deve ter 7 dígitos', minLength(7)),
  maxLength: helpers.withMessage('CNAE deve ter 7 dígitos', maxLength(7)),
}

const BaseRegistrationValidation = {
  cpfCnpj: {
    required: helpers.withMessage(
      'É necessário informar seu CPF|CNPJ',
      required
    ),
    numeric: helpers.withMessage(
      'CPF|CNPJ deve conter apenas números',
      numeric
    ),
    minLength: helpers.withMessage(
      'CPF|CNPJ deve conter no mínimo 11 caracteres',
      minLength(11)
    ),
    maxLength: helpers.withMessage(
      'CPF|CNPJ deve conter no máximo 14 caracteres',
      maxLength(14)
    ),
  },
  razaoSocial: {
    required: helpers.withMessage(
      'É necessário informar a Razão Social',
      required
    ),
    minLength: helpers.withMessage(
      'Razão Social deve conter 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Razão Social deve conter até 115 caracteres',
      maxLength(115)
    ),
  },
  fantasia: {
    minLength: helpers.withMessage(
      'Fantasia deve conter 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Fantasia deve conter até 115 caracteres',
      maxLength(115)
    ),
  },
  telefone: {
    required: helpers.withMessage(
      'É necessário informar um Telefone',
      required
    ),
    minLength: helpers.withMessage(
      'Telefone deve ser maior que 9 caracteres',
      minLength(10)
    ),
    maxLength: helpers.withMessage(
      'Telefone deve conter até 11 caracteres',
      maxLength(11)
    ),
  },
  telefoneSecundario: {
    minLength: helpers.withMessage(
      'Telefone deve ser maior que 9 caracteres',
      minLength(11)
    ),
    maxLength: helpers.withMessage(
      'Telefone deve conter até 11 caracteres',
      maxLength(11)
    ),
  },
  cnaeId: cnaeIdValidation,
  cnaes: {
    $each: {
      cnaeId: cnaeIdValidation,
    },
  },
}

const ContabilidadeValidation = {
  details: {
    ...BaseRegistrationValidation,
  },
  user: {
    ...UserRegistrationValidation,
  },
  address: {
    ...AddressValidation,
  },
}

const PessoaFisicaValidation = {
  details: {
    ...BaseRegistrationValidation,
    cpfCnpj: {
      required: helpers.withMessage('É necesario informar seu CPF', required),
      numeric: helpers.withMessage('CPF deve conter apenas números', numeric),
      minLength: helpers.withMessage(
        'CPF deve conter 11 caracteres',
        minLength(11)
      ),
      maxLength: helpers.withMessage(
        'CPF deve conter 11 caracteres',
        maxLength(11)
      ),
    },
    ie: {
      required: helpers.withMessage('É necesario informar sua IE', required),
      numeric: helpers.withMessage('IE deve conter apenas números', numeric),
      maxLength: helpers.withMessage(
        'IE deve conter até 15 caracteres',
        maxLength(15)
      ),
    },
  },
  user: {
    ...UserRegistrationValidation,
  },
  address: {
    ...AddressValidation,
  },
}

const PessoaJuridicaValidation = {
  details: {
    ...BaseRegistrationValidation,
    cpfCnpj: {
      required: helpers.withMessage('É necesario informar seu CNPJ', required),
      numeric: helpers.withMessage('CNPJ deve conter apenas números', numeric),
      minLength: helpers.withMessage(
        'CNPJ deve conter no mínimo 14 caracteres',
        minLength(14)
      ),
      maxLength: helpers.withMessage(
        'CNPJ deve conter no máximo 14 caracteres',
        maxLength(14)
      ),
    },
    ie: {
      required: false,
      numeric: helpers.withMessage('IE deve conter apenas números', numeric),
      maxLength: helpers.withMessage(
        'IE deve conter até 15 caracteres',
        maxLength(15)
      ),
    },
  },
  user: {
    ...UserRegistrationValidation,
  },
  address: {
    ...AddressValidation,
  },
}

export {
  BaseRegistration,
  ContabilidadeRegistration,
  PessoaFisicaRegistration,
  PessoaJuridicaRegistration,
  BaseRegistrationValidation,
  ContabilidadeValidation,
  PessoaFisicaValidation,
  PessoaJuridicaValidation,
}
