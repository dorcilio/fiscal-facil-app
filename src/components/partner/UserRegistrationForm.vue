<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalUser.email"
        outlined
        label="Email *"
        type="email"
        :error="hasFieldError('email')"
        :error-message="getFieldErrorMessage('email')"
        :disable="isLoading"
        @blur="validateField('email')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalUser.fullName"
        outlined
        capitalize
        label="Nome Completo *"
        name="fullName"
        :error="hasFieldError('fullName')"
        :error-message="getFieldErrorMessage('fullName')"
        :disable="isLoading"
        @blur="validateField('fullName')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-select
        v-model="internalUser.genderId"
        name="gender"
        outlined
        stack-label
        label="Gênero *"
        :options="genders"
        :loading="isLoading"
        option-value="genderId"
        option-label="genderName"
        emit-value
        map-options
        :behavior="$q.platform.is.mobile ? 'dialog' : 'menu'"
        :error="hasFieldError('genderId')"
        :error-message="getFieldErrorMessage('genderId')"
        @blur="validateField('genderId')"
      >
        <!-- <template #prepend>
          <q-icon name="fa-solid fa-venus-mars" />
        </template> -->
      </q-select>
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input-date
        v-model="internalUser.birthDate"
        outlined
        label="Data de Nascimento *"
        name="birthDate"
        :error="hasFieldError('birthDate')"
        :error-message="getFieldErrorMessage('birthDate')"
        :disable="isLoading"
        @blur="validateField('birthDate')"
      >
      </q-input-date>
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalUser.phone"
        outlined
        label="Telefone"
        name="phone"
        mask="(##) #####-####"
        unmasked-value
        :error="hasFieldError('phone')"
        :error-message="getFieldErrorMessage('phone')"
        :disable="isLoading"
        @blur="validateField('phone')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalUser.password"
        outlined
        label="Senha *"
        name="password"
        type="password"
        autocomplete
        :error="hasFieldError('password')"
        :error-message="getFieldErrorMessage('password')"
        :disable="isLoading"
        @blur="validateField('password')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-input
        v-model="internalUser.confirmPassword"
        outlined
        label="Confirmar Senha *"
        name="confirmPassword"
        type="password"
        autocomplete
        :error="hasFieldError('confirmPassword')"
        :error-message="getFieldErrorMessage('confirmPassword')"
        :disable="isLoading"
        @blur="validateField('confirmPassword')"
      />
    </div>

    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-checkbox
        v-model="internalUser.acceptTerms"
        color="green-7"
        :error="hasFieldError('acceptTerms')"
        :disable="isLoading"
        keep-color
        @change="validateField('acceptTerms')"
      >
      </q-checkbox>
      <span>
        Eu li e aceito os
        <custom-click @click.prevent="openTermsModal('terms')">
          Termos de Uso
        </custom-click>
        e a
        <custom-click @click.prevent="openTermsModal('privacy')">
          Política de Privacidade
        </custom-click>
      </span>
      <div
        v-if="hasFieldError('acceptTerms')"
        class="text-red-8 q-ml-md q-mb-md"
      >
        {{ getFieldErrorMessage('acceptTerms') }}
      </div>
      <!-- Modal -->
      <terms-and-privacy-modal
        v-model="showTermsModal"
        :initial-tab="selectedTab"
        :show-accept-button="showAcceptButton"
        @update:tab="selectedTab = $event"
        @accept="handleTermsAcceptance"
      />
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, inject } from 'vue'
import useVuelidate from '@vuelidate/core'
import {
  UserRegistration,
  UserRegistrationValidation,
  mockGenderOptions,
} from '@/models/user'
import QInputDate from '@/components/QInputDate.vue'
import CustomClick from '@/components/CustomClick.vue'
import TermsAndPrivacyModal from '@/components/TermsAndPrivacyModal.vue'

export default defineComponent({
  name: 'UserRegistrationForm',
  components: { QInputDate, CustomClick, TermsAndPrivacyModal },
  props: {
    modelValue: {
      type: [Object, UserRegistration],
      default: () => new UserRegistration(),
    },
    validationRules: {
      type: [Object, UserRegistrationValidation],
      default: () => UserRegistrationValidation,
    },
    genderOptions: {
      type: Array,
      default: () => mockGenderOptions,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const showTermsModal = ref(false)
    const selectedTab = ref('terms')
    const showAcceptButton = ref(false)

    // Estado interno reativo
    const internalUser = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    // Opções de gênero
    const genders = computed(() => props.genderOptions)
    console.log(genders)

    // Regras de validação
    const rules = computed(() => props.validationRules)

    // isLoading indicará se o formulário está sendo carregado
    const isLoading = computed(() => props.loading)

    // Instância do Vuelidate
    const v$ = inject('userVuelidate', useVuelidate(rules, internalUser))

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

    const openTermsModal = (tab = 'terms') => {
      selectedTab.value = tab
      showAcceptButton.value = !internalUser.value.acceptTerms
      showTermsModal.value = true
    }

    const handleTermsAcceptance = (data) => {
      internalUser.value.acceptTerms = true
      console.log('Termos aceitos:', data)
    }
    return {
      showTermsModal,
      selectedTab,
      showAcceptButton,
      isLoading,
      v$,
      internalUser,
      genders,
      hasFieldError,
      getFieldErrorMessage,
      validateField,
      validate,
      resetValidation,
      openTermsModal,
      handleTermsAcceptance,
    }
  },
})
</script>
