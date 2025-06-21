<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalDetails.razaoSocial"
        v-capitalize
        outlined
        autofocus
        label="Razão Social *"
        name="razaoSocial"
        maxlength="115"
        :error="hasFieldError('razaoSocial')"
        :error-message="getFieldErrorMessage('razaoSocial')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('razaoSocial')"
      />
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalDetails.fantasia"
        v-capitalize
        outlined
        label="Fantasia"
        name="fantasia"
        maxlength="115"
        :error="hasFieldError('fantasia')"
        :error-message="getFieldErrorMessage('fantasia')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('fantasia')"
      />
    </div>
    <div
      v-if="shouldShowField('ie')"
      class="col-lg-12 col-md-12 col-xs-12 col-sm-12"
    >
      <q-input
        v-model="internalDetails.ie"
        outlined
        :label="getFieldLabel('ie')"
        name="ie"
        mask="################"
        maxlength="15"
        unmasked-value
        :error="hasFieldError('ie')"
        :error-message="getFieldErrorMessage('ie')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('ie')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalDetails.telefone"
        outlined
        label="Telefone Principal *"
        name="telefone"
        mask="(##) #####-####"
        unmasked-value
        :error="hasFieldError('telefone')"
        :error-message="getFieldErrorMessage('telefone')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('telefone')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalDetails.telefoneSecundario"
        outlined
        label="Telefone Secundário"
        name="telefoneSecundario"
        mask="(##) #####-####"
        unmasked-value
        :error="hasFieldError('telefoneSecundario')"
        :error-message="getFieldErrorMessage('telefoneSecundario')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('telefoneSecundario')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalDetails.cnaeId"
        outlined
        label="CNAE Principal *"
        name="cnae"
        mask="#######"
        maxlength="7"
        unmasked-value
        :error="hasFieldError('cnaeId')"
        :error-message="getFieldErrorMessage('cnaeId')"
        :disable="isLoading"
        lazy-rules
        @blur="validateField('cnaeId')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-field outlined label="CNAE Descrição" stack-label readonly>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ internalDetails.cnaeDescricao }}
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, inject } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { BaseRegistration, BaseRegistrationValidation } from '@/models/partner'

export default defineComponent({
  name: 'PartnerDetailsForm',
  props: {
    // modelValue conterá o objeto `details` (BaseRegistration)
    modelValue: {
      type: [Object, BaseRegistration],
      default: () => new BaseRegistration(),
    },
    // validationRules receberá as regras de validação específicas para `details`
    validationRules: {
      type: [Object, BaseRegistrationValidation],
      default: () => BaseRegistrationValidation,
    },
    // isLoading indicará se o formulário está sendo carregado
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    // Estado interno reativo
    const internalDetails = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    // Regras de validação
    const rules = computed(() => props.validationRules)

    // isLoading indicará se o formulário está sendo carregado
    const isLoading = computed(() => props.loading)

    // Instância do Vuelidate
    const v$ = inject('detailsVuelidate', useVuelidate(rules, internalDetails))

    /**
     * Verifica se um campo específico deve ser mostrado com base na validação.
     * Se o campo tiver uma validação associada, retorna `true` se o campo for válido e `false` caso contrário.
     * Se o campo não tiver validação associada, ou se o Vuelidate estiver sem instância, retorna `true`.
     * @param {string} fieldName - Nome do campo a ser verificado.
     * @returns {boolean} - Se o campo deve ser mostrado, retorna `true`; caso contrário, retorna `false`.
     */
    const shouldShowField = (fieldName) => {
      return v$.value ? !!v$.value[fieldName] : true
    }

    /**
     * Retorna o rótulo do campo especificado, levando em conta se o campo é obrigatório.
     * Se o campo for 'ie' e tiver uma validação associada, retorna 'Inscrição Estadual *' se
     * for obrigatório e 'Inscrição Estadual' caso contrário. Para outros campos, retorna apenas 'Campo'.
     * @param {string} fieldName - Nome do campo a ser verificado.
     * @returns {string} - O rótulo do campo.
     */
    const getFieldLabel = (fieldName) => {
      if (fieldName === 'ie' && v$.value?.ie) {
        const isRequired = v$.value.ie.$params?.required
        return isRequired ? 'Inscrição Estadual *' : 'Inscrição Estadual'
      }
      return 'Campo'
    }

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
      internalDetails,
      isLoading,
      v$,
      shouldShowField,
      getFieldLabel,
      hasFieldError,
      getFieldErrorMessage,
      validateField,
      validate,
      resetValidation,
    }
  },
})
</script>

<style scoped>
/* Adicione estilos específicos do componente aqui, se necessário */
</style>
