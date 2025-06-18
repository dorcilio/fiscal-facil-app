<script>
import { computed, defineComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { PessoaJuridicaValidation } from '../../models/pessoa'

export default defineComponent({
  name: 'CompanyInfoForm',
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
    const internalCompanyForm = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const rules = computed(() => PessoaJuridicaValidation)
    const v = useVuelidate(rules, internalCompanyForm, { $autoDirty: true })

    return {
      v,
      internalCompanyForm,
    }
  },
})
</script>

<template>
  <div class="company-info-form q-pa-md">
    <h5 class="text-h6 q-mb-md">Dados da Empresa</h5>

    <q-input
      v-model="internalCompanyForm.cnpj"
      filled
      label="CNPJ *"
      mask="##.###.###/####-##"
      unmasked-value
      readonly
      :error="v.cnpj.$error"
      :error-message="v.cnpj.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.cnpj.$touch"
    />

    <q-input
      v-model="internalCompanyForm.razaoSocial"
      filled
      label="Razão Social *"
      readonly
      :error="v.razaoSocial.$error"
      :error-message="v.razaoSocial.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.razaoSocial.$touch"
    />

    <q-input
      v-model="internalCompanyForm.fantasia"
      filled
      label="Nome Fantasia"
      readonly
      :error="v.fantasia.$error"
      :error-message="v.fantasia.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.fantasia.$touch"
    />

    <q-input
      v-model="internalCompanyForm.email"
      filled
      label="E-mail *"
      :error="v.email.$error"
      :error-message="v.email.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.email.$touch"
    />

    <q-input
      v-model="internalCompanyForm.phone"
      filled
      label="Telefone Principal *"
      mask="(##) #####-####"
      unmasked-value
      :error="v.phone.$error"
      :error-message="v.phone.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.phone.$touch"
    />

    <q-input
      v-model="internalCompanyForm.telefoneSecundario"
      filled
      label="Telefone Secundário"
      mask="(##) #####-####"
      unmasked-value
      :error="v.telefoneSecundario.$error"
      :error-message="
        v.telefoneSecundario.$errors.map((e) => e.$message).join(', ')
      "
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.telefoneSecundario.$touch"
    />

    <q-input
      v-model="internalCompanyForm.ie"
      filled
      label="Inscrição Estadual"
      :error="v.ie.$error"
      :error-message="v.ie.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.ie.$touch"
    />
  </div>
</template>
