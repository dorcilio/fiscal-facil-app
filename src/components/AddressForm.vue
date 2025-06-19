<template>
  <div class="address-form q-pa-md">
    <h5 class="text-h6 q-mb-md">Endereço</h5>

    <q-input
      v-model="internalAddressForm.zipCode"
      filled
      label="CEP *"
      mask="#####-###"
      unmasked-value
      :error="v.zipCode.$error"
      :error-message="v.zipCode.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.zipCode.$touch"
    />

    <q-input
      v-model="internalAddressForm.street"
      filled
      label="Rua *"
      :error="v.street.$error"
      :error-message="v.street.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.street.$touch"
    />

    <q-input
      v-model="internalAddressForm.number"
      filled
      label="Número *"
      :error="v.number.$error"
      :error-message="v.number.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.number.$touch"
    />

    <q-input
      v-model="internalAddressForm.complement"
      filled
      label="Complemento"
      :error="v.complement.$error"
      :error-message="v.complement.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.complement.$touch"
    />

    <q-input
      v-model="internalAddressForm.neighborhood"
      filled
      label="Bairro *"
      :error="v.neighborhood.$error"
      :error-message="v.neighborhood.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.neighborhood.$touch"
    />

    <q-input
      v-model="internalAddressForm.city"
      filled
      label="Cidade *"
      :error="v.city.$error"
      :error-message="v.city.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.city.$touch"
    />

    <q-input
      v-model="internalAddressForm.state"
      filled
      label="Estado *"
      :error="v.state.$error"
      :error-message="v.state.$errors.map((e) => e.$message).join(', ')"
      class="q-mb-md"
      :disable="isLoading"
      @blur="v.state.$touch"
    />
  </div>
</template>

<script>
import { computed, defineComponent, defineExpose } from 'vue'
import { AddressValidation } from '@/models/address'
import useVuelidate from '@vuelidate/core'

export default defineComponent({
  name: 'AddressForm',
  props: {
    // Usamos modelValue para v-model no Vue 3. Deve ser um objeto Address
    modelValue: {
      type: Object,
      required: true,
      // Você pode adicionar um validador para verificar a estrutura do objeto,
      // ou assumir que ele sempre será uma instância de Address
      // validator: (val) => val instanceof Address
    },
    // Prop para desabilitar campos, útil se o formulário pai estiver em loading
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'], // Declarar o evento para v-model

  setup(props, { emit }) {
    // Cria uma referência reativa para o modelValue para trabalhar internamente
    // e garantir que as alterações sejam emitidas de volta ao pai
    const internalAddressForm = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    // As regras de validação para o modelo Address
    const rules = computed(() => AddressValidation)

    // Vuelidate inicializado com a referência reativa
    const v = useVuelidate(rules, internalAddressForm, { $autoDirty: true })

    // Exponha o Vuelidate para validação pelo componente pai
    defineExpose({
      validate: v.value.$validate,
    })
    return {
      v,
      internalAddressForm,
    }
  },
})
</script>
