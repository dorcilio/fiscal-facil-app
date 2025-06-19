import {
  helpers,
  required,
  minLength,
  maxLength,
  numeric,
} from '@vuelidate/validators'

import { Address, AddressValidation } from './address'
import { UserRegistration, UserRegistrationValidation } from './user'

class ContabilidadeRegistration {
  constructor() {
    this.cpfCnpj = ''
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = ''

    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = []

    this.address = new Address()
    this.user = new UserRegistration()
  }

  parseFromReceitaWS(data) {
    this.cpfCnpj = data.cnpj
    this.razaoSocial = data.razao_social
    this.fantasia = data.nome_fantasia
    this.telefone = data.ddd_telefone_1
    this.telefoneSecundario = data.ddd_telefone_2
    this.situacaoReceita = data.situacao

    this.cnaeId = data.cnae_fiscal
    this.cnaeDescricao = data.cnae_fiscal_descricao
    this.cnaes = data.cnaes_secundarios
      .filter((cnae) => cnae.codigo && cnae.codigo.length === 7)
      .map((cnae) => ({
        cnaeId: cnae.codigo,
        descricao: cnae.descricao,
      }))

    this.address.parseFromReceitaWS(data)
  }

  /**
   * MELHORIA: Método toRequest para formatar o payload final para a API.
   * Garante que os sub-objetos também sejam formatados corretamente.
   */
  toRequest() {
    return {
      cpfCnpj: this.cpfCnpj,
      razaoSocial: this.razaoSocial,
      fantasia: this.fantasia,
      telefone: this.telefone,
      telefoneSecundario: this.telefoneSecundario,
      cnaeId: this.cnaeId,
      cnaeDescricao: this.cnaeDescricao,
      cnaes: this.cnaes,
      address: this.address.toRequest(), // Chama o toRequest do endereço
      user: this.user.toRequest(), // Chama o toRequest do usuário
      // Adicione outros campos específicos se necessário (ex: ie)
    }
  }

  /**
   * MELHORIA: Método reset para limpar todos os dados do formulário,
   * incluindo os objetos aninhados.
   */
  reset() {
    this.cpfCnpj = ''
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = ''
    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = []

    this.address.reset() // Chama o reset do endereço
    this.user.reset() // Chama o reset do usuário
  }
}

class PessoaFisicaRegistration extends ContabilidadeRegistration {
  constructor() {
    super()
    this.ie = ''
  }

  toRequest() {
    return {
      ...super.toRequest(),
      ie: this.ie,
    }
  }

  reset() {
    super.reset()
    this.ie = ''
  }
}

class PessoaJuridicaRegistration extends ContabilidadeRegistration {
  constructor() {
    super()
    this.ie = ''
  }

  toRequest() {
    return {
      ...super.toRequest(),
      ie: this.ie,
    }
  }

  reset() {
    super.reset()
    this.ie = ''
  }
}

const ContabilidadeValidation = {
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
  cnaeId: {
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

const PessoaFisicaValidation = {
  ...ContabilidadeValidation,
  cpfCnpj: {
    required: helpers.withMessage('É necessário informar seu CPF', required),
    numeric: helpers.withMessage('CPF deve conter apenas números', numeric),
    minLength: helpers.withMessage(
      'CPF deve conter no mínimo 11 caracteres',
      minLength(11)
    ),
    maxLength: helpers.withMessage(
      'CPF deve conter no máximo 11 caracteres',
      maxLength(11)
    ),
  },
  ie: {
    required: helpers.withMessage('É necessário informar a IE', required),
    numeric: helpers.withMessage('IE deve conter apenas números', numeric),
    maxLength: helpers.withMessage(
      'IE deve conter até 15 caracteres',
      maxLength(15)
    ),
  },
}

const PessoaJuridicaValidation = {
  ...ContabilidadeValidation,
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
    numeric: helpers.withMessage('IE deve conter apenas números', numeric),
    maxLength: helpers.withMessage(
      'IE deve conter até 15 caracteres',
      maxLength(15)
    ),
  },
}

export {
  ContabilidadeRegistration,
  PessoaFisicaRegistration,
  PessoaJuridicaRegistration,
  ContabilidadeValidation,
  PessoaFisicaValidation,
  PessoaJuridicaValidation,
}
