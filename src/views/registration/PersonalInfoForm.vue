<script>
import { computed, defineComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { PessoaFisicaValidation } from '../../models/pessoa'

export default defineComponent({
  name: 'PersonalInfoForm',
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
    const internalPersonalInfoForm = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const rules = computed(() => PessoaFisicaValidation)
    const v = useVuelidate(rules, internalPersonalInfoForm, {
      $autoDirty: true,
    })

    return {
      v,
      internalPersonalInfoForm,
    }
  },
})
</script>

<template>
  <div class="personal-info-form q-pa-md">
    <h5 class="text-h6 q-mb-md">Dados Pessoais</h5>

    <q-input
      v-model="internalPersonalInfoForm.cpf"
      filled
      label="CPF *"
      mask="###.###.###-##"
      unmasked-value
      readonly
      :error="v.cpf.$error"
      :error-message="v.cpf.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.cpf.$touch"
    />

    <q-input
      v-model="internalPersonalInfoForm.name"
      filled
      label="Nome Completo *"
      :error="v.name.$error"
      :error-message="v.name.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.name.$touch"
    />

    <q-input
      v-model="internalPersonalInfoForm.email"
      filled
      label="E-mail *"
      :error="v.email.$error"
      :error-message="v.email.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.email.$touch"
    />

    <q-input
      v-model="internalPersonalInfoForm.phone"
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
      v-model="internalPersonalInfoForm.birthDate"
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
  </div>
</template>
