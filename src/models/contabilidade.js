// src/models/contabilidade.js
// Classe para o cadastro de "Contabilidade" (pode ser PF ou PJ)

import { helpers, required, numeric } from '@vuelidate/validators'
import {
  PessoaFisicaRegistration,
  PessoaFisicaValidation,
  PessoaJuridicaRegistration,
  PessoaJuridicaValidation,
} from './pessoa' // Importa PF e PJ como subjacentes
import { isValidCpf, isValidCnpj } from '../utils/validators'

class ContabilidadeRegistration {
  constructor() {
    this.subType = null // 'PF' ou 'PJ' - para definir se a contabilidade é um indivíduo ou empresa
    this.data = null // Irá conter uma instância de PessoaFisicaRegistration ou PessoaJuridicaRegistration
    // A variável cpfCnpj estará dentro de this.data
  }

  setSubType(type) {
    this.subType = type
    if (type === 'PF') {
      this.data = new PessoaFisicaRegistration()
      this.data.ie = ''
    } else if (type === 'PJ') {
      this.data = new PessoaJuridicaRegistration()
    } else {
      this.data = null
    }
  }

  // Passa a chamada para o método toRequest do tipo de dados subjacente
  toRequest() {
    if (!this.data) {
      throw new Error('Tipo de contabilidade não definido.')
    }
    const payload = this.data.toRequest()
    // Sobrescreve o 'type' para indicar que é uma Contabilidade
    payload.type = 'Contabilidade'
    // Adiciona o subType para o backend saber se é PF ou PJ
    payload.subType = this.subType
    return payload
  }

  // Passa a chamada para o método parseFromReceitaWS do tipo de dados subjacente
  parseFromReceitaWS(data) {
    if (
      this.subType === 'PJ' &&
      this.data instanceof PessoaJuridicaRegistration
    ) {
      this.data.parseFromReceitaWS(data)
    }
  }

  reset() {
    this.subType = null
    if (this.data) {
      this.data.reset()
    }
    this.data = null
  }
}

// As validações da Contabilidade serão dinâmicas baseadas no subType
const ContabilidadeValidation = {
  // A validação para 'subType' é para garantir que um sub-tipo foi selecionado
  subType: {
    required: helpers.withMessage(
      'Por favor, selecione se a Contabilidade é Pessoa Física ou Jurídica',
      required
    ),
  },
  // Validação aninhada para 'data' (PessoaFisicaRegistration ou PessoaJuridicaRegistration)
  data: {
    // Isso será preenchido dinamicamente na store
    $autoDirty: true, // Garante que a validação aninhada seja ativada
    // As regras para data.cpfCnpj, data.fullName/razaoSocial, etc.
    // serão aplicadas diretamente do sub-modelo selecionado.
    // Aqui usamos uma função para retornar as regras do subtipo
    $each: helpers.forEach((value, index, parent) => {
      if (parent.subType === 'PF') {
        return PessoaFisicaValidation
      } else if (parent.subType === 'PJ') {
        return PessoaJuridicaValidation
      }
      return {} // No subType, sem validações para data
    }),
    cpfCnpj: {
      // Duplicar aqui para a raiz da validação de Contabilidade, pois o campo será direto
      required: helpers.withMessage(
        'É necessário informar o CPF/CNPJ',
        required
      ),
      numeric: helpers.withMessage('Deve conter apenas números', numeric),
      minLength: helpers.withMessage(
        'CPF deve ter 11 ou CNPJ 14 caracteres',
        (value) => {
          const cleaned = value?.replace(/\D/g, '') || ''
          return cleaned.length === 11 || cleaned.length === 14
        }
      ),
      maxLength: helpers.withMessage(
        'CPF deve ter 11 ou CNPJ 14 caracteres',
        (value) => {
          const cleaned = value?.replace(/\D/g, '') || ''
          return cleaned.length === 11 || cleaned.length === 14
        }
      ),
      validDoc: helpers.withMessage('CPF/CNPJ inválido', (value) => {
        const cleaned = value?.replace(/\D/g, '') || ''
        if (cleaned.length === 11) {
          return isValidCpf(value)
        } else if (cleaned.length === 14) {
          return isValidCnpj(value)
        }
        return true // Deixa o min/max length e numeric cuidar se não tiver 11 ou 14
      }),
    },
  },
}

export { ContabilidadeRegistration, ContabilidadeValidation }
