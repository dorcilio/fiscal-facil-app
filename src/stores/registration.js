// /stores/registration.js
import { defineStore } from 'pinia'
import {
  PessoaFisicaRegistration,
  PessoaFisicaValidation,
  PessoaJuridicaRegistration,
  PessoaJuridicaValidation,
} from '@/models/pessoa'
import {
  ContabilidadeRegistration,
  ContabilidadeValidation,
} from '@/models/contabilidade'

import { publicService } from '@/services/public-service'
import { notifyError, notifySuccess } from '@/plugins/notify'

// Importe seu serviço de API para submissão (ex: axios configurado)
// import api from '@/services/api' // Certifique-se de que este caminho está correto

export const useRegistrationStore = defineStore('registration', {
  // Renomeado para 'registration'
  state: () => ({
    registrationType: null, // 'PF', 'PJ', 'Contabilidade'
    contabilidadeSubType: null, // 'PF', 'PJ' se registrationType for 'Contabilidade'
    form: null, // Objeto de dados do formulário (PessoaFisicaRegistration, PessoaJuridicaRegistration, ContabilidadeRegistration)
    validationRules: {}, // Regras de validação associadas ao tipo de formulário
    currentStep: 1,
    totalSteps: 5,
    isLoading: false,
    error: null,
    isSubmitted: false,
  }),
  actions: {
    setRegistrationType(type) {
      this.registrationType = type
      // Reseta subtipo se não for contabilidade
      if (type !== 'Contabilidade') {
        this.contabilidadeSubType = null
      }
      this.initializeForm()
    },
    setContabilidadeSubType(subType) {
      this.contabilidadeSubType = subType
      this.initializeForm()
    },
    initializeForm() {
      // Cria a instância do modelo de dados com base no tipo e subtipo
      if (this.registrationType === 'PF') {
        this.form = new PessoaFisicaRegistration()
        this.validationRules = PessoaFisicaValidation
      } else if (this.registrationType === 'PJ') {
        this.form = new PessoaJuridicaRegistration()
        this.validationRules = PessoaJuridicaValidation
      } else if (this.registrationType === 'Contabilidade') {
        this.form = new ContabilidadeRegistration(this.contabilidadeSubType)
        this.validationRules = ContabilidadeValidation // Ou regras combinadas, dependendo do seu modelo
      } else {
        this.form = null
        this.validationRules = {}
      }
      this.currentStep = 1 // Volta para o primeiro passo ao mudar o tipo
      this.error = null
      this.isSubmitted = false
    },

    nextStep() {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    async fetchDocData(doc) {
      this.isLoading = true
      this.error = null
      try {
        if (
          this.registrationType === 'PF' ||
          (this.registrationType === 'Contabilidade' &&
            this.contabilidadeSubType === 'PF')
        ) {
          notifyError(
            'Busca automática de dados para CPF (Pessoa Física) não disponível.',
            null,
            { position: 'top' }
          )
          return
        }

        const data = await publicService.findCompanyByCNPJ(doc)

        if (data.status === 'ERROR' || data.cnpj === undefined) {
          throw new Error(data.message || 'CNPJ não encontrado ou inválido.')
        }

        if (
          this.registrationType === 'Contabilidade' &&
          this.form instanceof ContabilidadeRegistration
        ) {
          if (this.form.data instanceof PessoaJuridicaRegistration) {
            this.form.data.parseFromReceitaWS(data)
          }
        } else if (this.form instanceof PessoaJuridicaRegistration) {
          this.form.parseFromReceitaWS(data)
        }
        notifySuccess('Dados da empresa preenchidos com sucesso!', {
          position: 'top',
        })
      } catch (err) {
        console.error('Erro ao buscar dados da ReceitaWS:', err)
        this.error =
          err.message ||
          'Erro ao buscar dados. Verifique o CNPJ e tente novamente.'
        notifyError(this.error, err, { position: 'top' })
        // Limpar dados do formulário em caso de erro na busca
        if (
          this.registrationType === 'Contabilidade' &&
          this.form &&
          this.form.data instanceof PessoaJuridicaRegistration
        ) {
          this.form.data.razaoSocial = ''
          this.form.data.fantasia = ''
          this.form.data.telefone = ''
          this.form.data.telefoneSecundario = ''
          this.form.data.address.reset()
        } else if (this.form instanceof PessoaJuridicaRegistration) {
          this.form.razaoSocial = ''
          this.form.fantasia = ''
          this.form.telefone = ''
          this.form.telefoneSecundario = ''
          this.form.address.reset()
        }
      } finally {
        this.isLoading = false
      }
    },

    async submitRegistration() {
      this.isLoading = true
      this.error = null
      this.isSubmitted = false

      try {
        if (!this.form) {
          throw new Error('Formulário não inicializado.')
        }

        const payload = this.form.toRequest()
        console.log('Payload para submissão:', payload)

        // let apiEndpoint = '/register'
        // const response = await api.post(apiEndpoint, payload)

        // console.log('Cadastro realizado com sucesso!', response.data)
        this.isSubmitted = true
        this.resetForm()
        notifySuccess('Cadastro realizado com sucesso!', { position: 'top' })
      } catch (err) {
        console.error('Erro ao submeter cadastro:', err)
        this.error =
          err.response?.data?.message ||
          'Ocorreu um erro ao finalizar o cadastro. Tente novamente.'
        notifyError(this.error, err, { position: 'top' })
        this.isSubmitted = false
      } finally {
        this.isLoading = false
      }
    },

    resetForm() {
      this.registrationType = null
      this.contabilidadeSubType = null
      if (this.form) {
        this.form.reset()
      }
      this.form = null
      this.validationRules = {}
      this.currentStep = 1
      this.isLoading = false
      this.error = null
      this.isSubmitted = false
    },
  },
  getters: {
    progress: (state) => (state.currentStep / state.totalSteps) * 100,
    activeForm: (state) => {
      // Retorna o sub-formulário ativo (PessoaFisicaRegistration ou PessoaJuridicaRegistration)
      // se for Contabilidade, caso contrário, retorna o formulário principal.
      if (state.registrationType === 'Contabilidade' && state.form) {
        return state.form.data
      }
      return state.form
    },
    activeFormValidationRules: (state) => {
      // Retorna as regras de validação para o formulário ativo.
      if (
        state.registrationType === 'Contabilidade' &&
        state.contabilidadeSubType
      ) {
        if (state.contabilidadeSubType === 'PF') {
          const customPFRules = { ...PessoaFisicaValidation }
          if (customPFRules.ie) {
            delete customPFRules.ie.required // IE não é obrigatória para Contabilidade-PF
          }
          return customPFRules
        } else if (state.contabilidadeSubType === 'PJ') {
          return PessoaJuridicaValidation
        }
      }
      return state.validationRules
    },
  },
})
