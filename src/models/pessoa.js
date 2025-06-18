// src/models/pessoa.js

import {
  helpers,
  required,
  minLength,
  maxLength,
  numeric,
} from '@vuelidate/validators'
import { Address, AddressValidation } from './address'
import { UserRegistration, UserRegistrationValidation } from './user'
import { isValidCpf, isValidCnpj } from '../utils/validators'

// --- Pessoa Física ---
class PessoaFisicaRegistration {
  constructor() {
    this.cpfCnpj = '' // Nome da variável permanece cpfCnpj
    this.fullName = '' // Nome completo para PF
    this.telefone = ''
    this.telefoneSecundario = ''
    this.ie = '' // IE é obrigatória para PF neste cenário

    this.address = new Address()
    this.user = new UserRegistration() // Usuário para login
  }

  toRequest() {
    return {
      type: 'PF',
      cpf: this.cpfCnpj, // Mapeia para 'cpf' no backend
      fullName: this.fullName,
      phone: this.telefone,
      secondaryPhone: this.telefoneSecundario,
      ie: this.ie,
      address: this.address.toRequest(),
      user: this.user.toRequest(),
    }
  }

  reset() {
    this.cpfCnpj = ''
    this.fullName = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.ie = ''
    this.address.reset()
    this.user.reset()
  }
}

const PessoaFisicaValidation = {
  cpfCnpj: {
    // Mantém o nome para validação
    required: helpers.withMessage('É necessário informar seu CPF', required),
    numeric: helpers.withMessage('CPF deve conter apenas números', numeric),
    minLength: helpers.withMessage(
      'CPF deve conter 11 caracteres',
      minLength(11)
    ),
    maxLength: helpers.withMessage(
      'CPF deve conter 11 caracteres',
      maxLength(11)
    ),
    validCpf: helpers.withMessage('CPF inválido', isValidCpf),
  },
  fullName: {
    required: helpers.withMessage(
      'É necessário informar seu Nome Completo',
      required
    ),
    minLength: helpers.withMessage(
      'Nome Completo deve ter no mínimo 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Nome Completo pode conter até 115 caracteres',
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
    required: helpers.withMessage('Inscrição Estadual é obrigatória', required), // AGORA OBRIGATÓRIA
    numeric: helpers.withMessage('IE deve conter apenas números', numeric),
    maxLength: helpers.withMessage(
      'IE deve conter até 15 caracteres',
      maxLength(15)
    ),
  },
  user: {
    ...UserRegistrationValidation,
  },
  address: {
    ...AddressValidation,
  },
}

// --- Pessoa Jurídica (Genérica) ---
class PessoaJuridicaRegistration {
  constructor() {
    this.cpfCnpj = '' // Nome da variável permanece cpfCnpj
    this.razaoSocial = ''
    this.fantasia = ''
    this.telefone = ''
    this.telefoneSecundario = ''
    this.situacaoReceita = ''

    this.cnaeId = ''
    this.cnaeDescricao = ''
    this.cnaes = []

    this.ie = '' // IE não é obrigatória, pode ser vazia

    this.address = new Address()
    this.user = new UserRegistration()
  }

  parseFromReceitaWS(data) {
    this.cpfCnpj = data.cnpj || '' // Preenche cpfCnpj com CNPJ
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
    // this.ie = data.ie || '' // Se tiver IE na ReceitaWS
    this.address.parseFromReceitaWS(data)
  }

  toRequest() {
    return {
      type: 'PJ',
      cnpj: this.cpfCnpj, // Mapeia para 'cnpj' no backend
      razaoSocial: this.razaoSocial,
      fantasia: this.fantasia,
      phone: this.telefone,
      secondaryPhone: this.telefoneSecundario,
      situacaoReceita: this.situacaoReceita,
      cnaeId: this.cnaeId,
      cnaeDescricao: this.cnaeDescricao,
      cnaes: this.cnaes,
      ie: this.ie, // Envia mesmo se vazio
      address: this.address.toRequest(),
      user: this.user.toRequest(),
    }
  }

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
    this.ie = ''
    this.address.reset()
    this.user.reset()
  }
}

const PessoaJuridicaValidation = {
  cpfCnpj: {
    // Mantém o nome para validação
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
    // IE NÃO É OBRIGATÓRIA PARA PJ GENÉRICA
    numeric: helpers.withMessage('IE deve conter apenas números', numeric),
    maxLength: helpers.withMessage(
      'IE deve conter até 15 caracteres',
      maxLength(15)
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

export {
  PessoaFisicaRegistration,
  PessoaFisicaValidation,
  PessoaJuridicaRegistration,
  PessoaJuridicaValidation,
}
