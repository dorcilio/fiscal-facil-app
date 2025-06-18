<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StepperNavigation',
  props: {
    hidePrev: {
      type: Boolean,
      default: false,
    },
    hideNext: {
      type: Boolean,
      default: false,
    },
    nextLabel: {
      type: String,
      default: 'Próximo',
    },
    prevLabel: {
      type: String,
      default: 'Voltar',
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['next', 'prev'],
  setup(props, { emit }) {
    const onNext = () => {
      emit('next')
    }

    const onPrev = () => {
      emit('prev')
    }

    return {
      onNext,
      onPrev,
    }
  },
})
</script>

<template>
  <q-card-actions align="right" class="q-mt-md">
    <q-btn
      v-if="!hidePrev"
      flat
      color="primary"
      :label="prevLabel"
      :disable="isLoading"
      @click="onPrev"
    />
    <q-btn
      v-if="!hideNext"
      color="primary"
      :label="nextLabel"
      :loading="isLoading"
      :disable="isLoading"
      @click="onNext"
    />
  </q-card-actions>
</template>
