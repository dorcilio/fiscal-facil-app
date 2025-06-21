<template>
  <q-dialog
    v-model="isOpen"
    persistent
    full-height
    class="flex flex-center"
    style="max-width: 90vw; width: 600px"
  >
    <q-card class="column full-height full-width">
      <q-card-section class="row items-center q-pa-md bg-primary text-white">
        <div class="text-h6 ellipsis">
          {{
            currentTab === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'
          }}
        </div>
        <q-space />
        <q-btn
          icon="fa-solid fa-xmark"
          flat
          round
          dense
          color="white"
          aria-label="Fechar"
          @click="closeModal"
        />
      </q-card-section>

      <q-tabs
        v-model="currentTab"
        dense
        class="text-grey-8"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="terms" label="Termos de Uso" />
        <q-tab name="privacy" label="Política de Privacidade" />
      </q-tabs>

      <q-separator />

      <q-card-section class="col scroll q-pa-none">
        <q-tab-panels v-model="currentTab" animated class="full-height">
          <q-tab-panel name="terms" class="q-pa-md">
            <terms-of-use-content />
          </q-tab-panel>

          <q-tab-panel name="privacy" class="q-pa-md">
            <privacy-policy-content />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>

      <q-card-actions align="right" class="bg-grey-1 q-pa-md">
        <q-btn flat label="Fechar" color="grey-7" @click="closeModal" />
        <q-btn
          v-if="showAcceptButton"
          unelevated
          label="Aceitar"
          color="primary"
          :loading="isAccepting"
          @click="acceptTerms"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import TermsOfUseContent from './TermsOfUseContent.vue'
import PrivacyPolicyContent from './PrivacyPolicyContent.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  showAcceptButton: {
    type: Boolean,
    default: false,
  },
  initialTab: {
    type: String,
    default: 'terms',
    validator: (value) => ['terms', 'privacy'].includes(value),
  },
})

// Emits
const emit = defineEmits(['update:modelValue', 'update:tab', 'accept', 'close'])

// Estado
const currentTab = computed({
  get: () => props.initialTab,
  set: (value) => emit('update:tab', value),
})
const isAccepting = ref(false)

// Computed
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Métodos
const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const acceptTerms = async () => {
  isAccepting.value = true

  try {
    // Simular delay de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000))

    emit('accept', {
      acceptTerms: isAccepting,
      timestamp: new Date().toISOString(),
    })

    closeModal()
  } catch (error) {
    console.error('Erro ao aceitar termos:', error)
  } finally {
    isAccepting.value = false
  }
}
</script>

<style lang="scss" scoped>
/* Você pode adicionar estilos específicos aqui se precisar de algo que as classes do Quasar não cubram */
</style>
