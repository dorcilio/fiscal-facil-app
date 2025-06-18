<script>
import { computed, defineComponent, watch } from 'vue'
import { notifyWarning } from '@/plugins/notify'

export default defineComponent({
  name: 'DocumentInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    docType: {
      type: String,
      required: true,
      validator: (value) => ['cpf', 'cnpj'].includes(value),
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'fetch-doc-data'],

  setup(props, { emit }) {
    const internalDoc = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    })

    const inputMask = computed(() =>
      props.docType === 'cpf' ? '###.###.###-##' : '##.###.###/####-##'
    )
    const inputLabel = computed(() =>
      props.docType === 'cpf' ? 'CPF *' : 'CNPJ *'
    )

    const searchDoc = () => {
      const cleanedDoc = internalDoc.value
        ? internalDoc.value.replace(/\D/g, '')
        : ''
      if (props.docType === 'cpf' && cleanedDoc.length !== 11) {
        notifyWarning('CPF deve ter 11 dígitos.', { position: 'top' })
        return
      }
      if (props.docType === 'cnpj' && cleanedDoc.length !== 14) {
        notifyWarning('CNPJ deve ter 14 dígitos.', { position: 'top' })
        return
      }
      emit('fetch-doc-data', cleanedDoc)
    }

    watch(internalDoc, (newVal) => {
      const cleaned = newVal ? newVal.replace(/\D/g, '') : ''
      if (
        props.docType === 'cnpj' &&
        cleaned.length === 14 &&
        !props.isLoading
      ) {
        searchDoc()
      }
    })

    return {
      internalDoc,
      inputMask,
      inputLabel,
      searchDoc,
    }
  },
})
</script>

<template>
  <div class="document-input q-pa-md">
    <h5 class="text-h6 q-mb-md">Informações do Documento</h5>
    <q-input
      v-model="internalDoc"
      filled
      :label="inputLabel"
      :mask="inputMask"
      unmasked-value
      :disable="isLoading"
      class="q-mb-md"
    >
      <template #append>
        <q-btn
          v-if="docType === 'cnpj'"
          flat
          round
          icon="fas fa-search"
          :disable="isLoading || internalDoc.replace(/\D/g, '').length !== 14"
          :loading="isLoading"
          @click="searchDoc"
        />
      </template>
    </q-input>
    <q-btn
      v-if="docType === 'cpf'"
      color="primary"
      label="Verificar CPF"
      :disable="isLoading || internalDoc.replace(/\D/g, '').length !== 11"
      :loading="isLoading"
      class="q-mt-md"
      @click="searchDoc"
    />
  </div>
</template>
