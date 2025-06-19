<template>
  <q-field
    :label="label"
    :hint="hint"
    :rules="rules"
    :error="error"
    :error-message="errorMessage"
    :dense="dense"
    :outlined="outlined"
    :filled="filled"
    :standout="standout"
    :borderless="borderless"
    :square="square"
    :readonly="readonly"
    :disable="disable"
    :model-value="internalMaskedValue"
    :class="{
      'q-field--float':
        (internalMaskedValue && internalMaskedValue.length > 0) || focused,
    }"
  >
    <template #control>
      <input
        ref="inputRef"
        v-imask="maskOptions"
        :value="internalMaskedValue"
        class="q-field__input"
        :autofocus="autofocus"
        @accept="onAccept"
        @complete="onComplete"
        @focus="onFocus"
        @blur="onBlur"
      />
    </template>

    <template v-if="$slots?.append" #append>
      <slot name="append"></slot>
    </template>
  </q-field>
</template>

<script>
import {
  ref,
  computed,
  watch,
  toRefs,
  onMounted,
  nextTick,
  onActivated,
} from 'vue'
import { IMaskDirective } from 'vue-imask'

export default {
  name: 'QInputMask',
  directives: {
    imask: IMaskDirective,
  },
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    maskedModelValue: {
      type: String,
      default: '',
    },
    label: String,
    hint: String,
    mask: {
      type: [Object, String, Array],
      required: true,
    },
    rules: Array,
    error: Boolean,
    errorMessage: String,
    dense: Boolean,
    outlined: Boolean,
    filled: Boolean,
    standout: Boolean,
    borderless: Boolean,
    square: Boolean,
    readonly: Boolean,
    disable: Boolean,
    autofocus: Boolean,
  },
  emits: ['update:modelValue', 'update:maskedModelValue'],
  setup(props, { emit }) {
    const { modelValue, maskedModelValue, mask, autofocus } = toRefs(props)
    const internalUnmaskedValue = ref('')
    const internalMaskedValue = ref('')
    const inputRef = ref(null)
    const focused = ref(false)
    const isInitialized = ref(false)

    const maskOptions = computed(() => {
      if (typeof mask.value === 'object' && mask.value !== null) {
        return mask.value
      }
      return { mask: mask.value }
    })

    // Função para inicializar o valor mascarado baseado no modelValue
    const initializeMaskedValue = (value) => {
      const stringValue = String(
        value === undefined || value === null ? '' : value
      )

      if (stringValue) {
        // Se temos um valor, precisamos aplicar a máscara manualmente para exibição inicial
        try {
          // Para máscaras simples de string, podemos tentar aplicar diretamente
          if (typeof mask.value === 'string') {
            // Aplica a máscara caractere por caractere
            let maskedResult = ''
            let valueIndex = 0

            for (
              let i = 0;
              i < mask.value.length && valueIndex < stringValue.length;
              i++
            ) {
              const maskChar = mask.value[i]
              const valueChar = stringValue[valueIndex]

              if (maskChar === '0' || maskChar === '9') {
                // Dígito
                if (/\d/.test(valueChar)) {
                  maskedResult += valueChar
                  valueIndex++
                } else {
                  break
                }
              } else if (maskChar === 'a' || maskChar === 'A') {
                // Letra
                if (/[a-zA-Z]/.test(valueChar)) {
                  maskedResult +=
                    maskChar === 'A'
                      ? valueChar.toUpperCase()
                      : valueChar.toLowerCase()
                  valueIndex++
                } else {
                  break
                }
              } else {
                // Caractere fixo da máscara
                maskedResult += maskChar
              }
            }

            internalMaskedValue.value = maskedResult
          } else {
            // Para máscaras complexas, deixa o IMask processar
            internalMaskedValue.value = stringValue
          }
        } catch (error) {
          console.error('Erro ao aplicar máscara:', error)
          // Em caso de erro, usa o valor original
          internalMaskedValue.value = stringValue
        }
      } else {
        internalMaskedValue.value = ''
      }

      internalUnmaskedValue.value = stringValue
    }

    // Função para sincronizar com o IMask quando disponível
    const syncWithIMask = (value) => {
      const stringValue = String(
        value === undefined || value === null ? '' : value
      )

      if (inputRef.value && inputRef.value.imask) {
        // IMask está disponível, usa ele para processar
        if (inputRef.value.imask.unmaskedValue !== stringValue) {
          inputRef.value.imask.unmaskedValue = stringValue
        }

        internalUnmaskedValue.value = inputRef.value.imask.unmaskedValue
        internalMaskedValue.value = inputRef.value.imask.value
        isInitialized.value = true
      } else {
        // IMask não está disponível, usa inicialização manual
        initializeMaskedValue(value)
      }
    }

    // Watcher para modelValue
    watch(
      modelValue,
      (newValue) => {
        // Evita loops infinitos verificando se o valor realmente mudou
        if (String(newValue || '') !== internalUnmaskedValue.value) {
          syncWithIMask(newValue)
        }
      },
      { immediate: true }
    )

    // Watcher para maskedModelValue
    watch(maskedModelValue, (newMaskedValue) => {
      if (internalMaskedValue.value !== newMaskedValue) {
        if (inputRef.value && inputRef.value.imask) {
          inputRef.value.imask.value = newMaskedValue
        } else {
          internalMaskedValue.value = newMaskedValue
        }
      }
    })

    // Função para garantir sincronização após montagem/ativação
    const ensureSync = () => {
      nextTick(() => {
        if (inputRef.value && inputRef.value.imask) {
          syncWithIMask(modelValue.value)

          if (autofocus.value) {
            inputRef.value.focus()
          }
        } else {
          // Se IMask ainda não está pronto, tenta novamente após um pequeno delay
          setTimeout(() => {
            if (inputRef.value && inputRef.value.imask) {
              syncWithIMask(modelValue.value)
            }
          }, 50)
        }
      })
    }

    onMounted(() => {
      ensureSync()
    })

    // onActivated é chamado quando o componente é reativado (útil com keep-alive)
    onActivated(() => {
      if (!isInitialized.value) {
        ensureSync()
      }
    })

    const onAccept = (e) => {
      const maskRef = e.detail

      // Atualiza valores internos
      internalUnmaskedValue.value = maskRef.unmaskedValue
      internalMaskedValue.value = maskRef.value
      isInitialized.value = true

      // Emite apenas se os valores mudaram para evitar loops
      if (props.modelValue !== maskRef.unmaskedValue) {
        emit('update:modelValue', maskRef.unmaskedValue)
      }
      if (props.maskedModelValue !== maskRef.value) {
        emit('update:maskedModelValue', maskRef.value)
      }
    }

    const onComplete = (e) => {
      onAccept(e)
    }

    const onFocus = () => {
      focused.value = true
    }

    const onBlur = () => {
      focused.value = false
    }

    return {
      inputRef,
      internalMaskedValue,
      maskOptions,
      onAccept,
      onComplete,
      onFocus,
      onBlur,
      focused,
    }
  },
}
</script>
