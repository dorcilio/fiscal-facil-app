<template>
  <div class="user-registration-form q-pa-md">
    <h5 class="text-h6 q-mb-md">Dados do Responsável</h5>

    <q-input
      v-model="internalUserForm.email"
      filled
      label="E-mail *"
      :error="v.email.$error"
      :error-message="v.email.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.email.$touch"
    />

    <q-input
      v-model="internalUserForm.fullName"
      filled
      label="Nome Completo *"
      :error="v.fullName.$error"
      :error-message="v.fullName.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.fullName.$touch"
    />

    <q-select
      v-model="internalUserForm.genderId"
      filled
      :options="[
        { label: 'Masculino', value: 1 },
        { label: 'Feminino', value: 2 },
        { label: 'Outro', value: 3 },
      ]"
      emit-value
      map-options
      label="Gênero *"
      :error="v.genderId.$error"
      :error-message="v.genderId.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.genderId.$touch"
    />

    <q-input
      v-model="internalUserForm.birthDate"
      filled
      type="date"
      label="Data de Nascimento *"
      :error="v.birthDate.$error"
      :error-message="v.birthDate.$errors.map((e) => e.$message).join(', ')"
      stack-label
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.birthDate.$touch"
    />

    <q-input
      v-model="internalUserForm.phone"
      filled
      label="Telefone *"
      mask="(##) #####-####"
      unmasked-value
      :error="v.phone.$error"
      :error-message="v.phone.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.phone.$touch"
    />

    <q-input
      v-model="internalUserForm.password"
      filled
      type="password"
      label="Senha *"
      :error="v.password.$error"
      :error-message="v.password.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.password.$touch"
    />

    <q-input
      v-model="internalUserForm.confirmPassword"
      filled
      type="password"
      label="Confirmar Senha *"
      :error="v.confirmPassword.$error"
      :error-message="
        v.confirmPassword.$errors.map((e) => e.$message).join(', ')
      "
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.confirmPassword.$touch"
    />

    <q-checkbox
      v-model="internalUserForm.acceptTerms"
      label="Eu aceito os Termos de Uso e Política de Privacidade *"
      :error="v.acceptTerms.$error"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.acceptTerms.$touch"
    />
    <div v-if="v.acceptTerms.$error" class="text-negative text-caption q-ml-sm">
      {{ v.acceptTerms.$errors.map((e) => e.$message).join(', ') }}
    </div>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { UserRegistrationValidation } from '../../models/user' // Verifique o caminho
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  name: 'UserRegistrationForm',
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const internalUserForm = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const rules = computed(() => UserRegistrationValidation)
    const v = useVuelidate(rules, internalUserForm, { $autoDirty: true })

    return {
      v,
      internalUserForm,
    }
  },
})
</script>
