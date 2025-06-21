<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.zipCode"
        outlined
        autofocus
        label="CEP *"
        name="cep"
        mask="#####-###"
        unmasked-value
        :error="hasFieldError('cep')"
        :error-message="getFieldErrorMessage('cep')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('cep')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.address"
        v-capitalize
        outlined
        label="Rua *"
        name="rua"
        :error="hasFieldError('address')"
        :error-message="getFieldErrorMessage('address')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('address')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.addressNumber"
        outlined
        type="number"
        maxlength="10"
        label="Número *"
        name="numero"
        :error="hasFieldError('addressNumber')"
        :error-message="getFieldErrorMessage('addressNumber')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('addressNumber')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.complement"
        outlined
        label="Complemento"
        name="complemento"
        :error="hasFieldError('addressNumber')"
        :error-message="getFieldErrorMessage('addressNumber')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('addressNumber')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.neighborhood"
        v-capitalize
        outlined
        label="Bairro *"
        name="bairro"
        :error="hasFieldError('neighborhood')"
        :error-message="getFieldErrorMessage('neighborhood')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('neighborhood')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.city"
        v-capitalize
        outlined
        label="Cidade *"
        :error="hasFieldError('city')"
        :error-message="getFieldErrorMessage('city')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('city')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalAddress.state"
        outlined
        uppercase
        label="Estado *"
        name="estado"
        mask="AA"
        maxlength="2"
        :error="hasFieldError('state')"
        :error-message="getFieldErrorMessage('state')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('state')"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, inject } from 'vue'
import useVuelidate from '@vuelidate/core'
import { Address, AddressValidation } from '@/models/address'

export default defineComponent({
  name: 'AddressForm',
  props: {
    modelValue: {
      type: Object,
      default: () => new Address(),
    },
    validationRules: {
      type: [Object, AddressValidation],
      default: () => AddressValidation,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    // Estado interno reativo
    const internalAddress = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    // Regras de validação
    const rules = computed(() => props.validationRules)

    // isLoading indicará se o formulário está sendo carregado
    const isLoading = computed(() => props.loading)

    // Instância do Vuelidate
    const v$ = inject('addressVuelidate', useVuelidate(rules, internalAddress))

    /**
     * Verifica se um campo específico tem erro de validação.
     * Caso o campo tenha uma validação associada, retorna o valor da propriedade `$error` desse campo.
     * Caso o campo não tenha validação associada, ou se o Vuelidate estiver sem instância, retorna `false`.
     * @param {string} fieldName - Nome do campo a ser verificado.
     * @returns {boolean} - Se o campo tem erro de validação, retorna `true`; caso contrário, retorna `false`.
     */
    const hasFieldError = (fieldName) => {
      return v$.value ? v$.value[fieldName]?.$error || false : false
    }

    /**
     * Retorna a mensagem de erro para um campo especificado, se houver.
     * Caso o campo esteja válido, retorna uma string vazia.
     * @param {string} fieldName - Nome do campo a ser verificado.
     * @returns {string} - Mensagem de erro, ou uma string vazia.
     */
    const getFieldErrorMessage = (fieldName) => {
      if (!v$.value || !v$.value[fieldName]?.$error) {
        return ''
      }
      return v$.value[fieldName].$errors
        .map((error) => error.$message)
        .join(', ')
    }

    /**
     * Valida um campo especificado do formulário.
     * Se o campo tiver uma validação associada, a executa.
     * @param {string} fieldName - Nome do campo a ser validado.
     * @returns {Promise<void>}
     */
    const validateField = async (fieldName) => {
      if (v$.value && v$.value[fieldName]) {
        await v$.value[fieldName].$touch()
      }
    }

    /**
     * Valida todos os campos gerenciados por este componente.
     * Retorna true se a validação for bem-sucedida, false caso contrário.
     * @async
     * @returns {Promise<boolean>}
     */
    const validate = async () => {
      if (v$.value) {
        return await v$.value.$validate()
      }
      return true
    }

    /**
     * Redefina a validação de todos os campos neste componente.
     * Útil quando o usuário sai da etapa atual.
     */
    const resetValidation = () => {
      if (v$.value) {
        v$.value.$reset()
      }
    }
    return {
      isLoading,
      v$,
      internalAddress,
      hasFieldError,
      getFieldErrorMessage,
      validateField,
      validate,
      resetValidation,
    }
  },
})
</script>
