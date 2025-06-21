<template>
  <q-input
    v-model="valueInput"
    :name="name"
    :spellcheck="spellcheck"
    :autocomplete="autocomplete"
    type="tel"
    :filled="filled"
    :outlined="outlined"
    :standout="standout"
    :borderless="borderless"
    :dense="dense"
    :clearable="clearable"
    :counter="counter"
    :maxlength="maxlength"
    :placeholder="placeholder"
    :prefix="prefix"
    :suffix="suffix"
    :loading="loading"
    :color="color"
    :bg-color="bgColor"
    :input-class="inputClass"
    :input-style="inputStyle"
    mask="##/##/####"
    :lazy-rules="lazyRules"
    :rules="rules"
    :autofocus="autofocus"
    :error="error"
    :error-message="errorMessage"
    :stack-label="stackLabel"
    :label="label"
    :hint="hint"
    :disable="disable"
    :readonly="readonly"
    @update:model-value="typingInput"
  >
    <template v-if="icon" #before>
      <q-icon :name="icon" />
    </template>
    <template v-if="!isDisable()" #append>
      <q-icon name="fa-solid fa-calendar-day" class="cursor-pointer">
        <q-popup-proxy v-model="showCalendar" cover :disable="isDisable()">
          <q-date
            v-model="valueDate"
            :mask="dateMask"
            @update:model-value="pickDate"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script>
import { ref } from 'vue'
import { DateTime } from 'luxon'
export default {
  name: 'QInputDate',
  props: {
    name: {
      required: false,
      type: String,
      default: 'data',
    },
    spellcheck: {
      required: false,
      type: [Boolean, String],
      default: true,
    },
    autocomplete: {
      required: false,
      type: String,
      default: 'on',
    },
    modelValue: {
      type: String,
      default: '',
    },
    dateMask: {
      type: String,
      default: 'YYYY-MM-DD',
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    stackLabel: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    hint: {
      required: false,
      type: String,
      default: '',
    },
    icon: {
      required: false,
      type: String,
      default: '',
    },
    error: {
      required: false,
      type: Boolean,
      default: false,
    },
    errorMessage: {
      required: false,
      type: String,
      default: 'Erro na validação',
    },
    lazyRules: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    rules: {
      required: false,
      type: Array,
      default: () => [],
    },
    autofocus: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    disable: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    readonly: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    filled: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    outlined: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    standout: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    borderless: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    dense: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    clearable: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    counter: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
    maxlength: {
      required: false,
      type: [Number, String],
      default: null,
    },
    placeholder: {
      required: false,
      type: String,
      default: '',
    },
    prefix: {
      required: false,
      type: String,
      default: '',
    },
    suffix: {
      required: false,
      type: String,
      default: '',
    },
    loading: {
      required: false,
      type: Boolean,
      default: false,
    },
    color: {
      required: false,
      type: String,
      default: '', // Usará a cor padrão do tema Quasar
    },
    bgColor: {
      required: false,
      type: String,
      default: '', // Usará a cor de fundo padrão do tema Quasar
    },
    inputClass: {
      required: false,
      type: [String, Array, Object],
      default: '',
    },
    inputStyle: {
      required: false,
      type: [String, Array, Object],
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const valueInput = ref(
      DateTime.fromISO(props.modelValue).toFormat('dd/MM/yyyy')
    )
    const valueDate = ref(props.modelValue)
    const showCalendar = ref(false)

    const daysInMonth = (month, year) => {
      switch (month) {
        case 1: // Fevereiro (0-indexed para Luxon, ou 1-indexed para sua lógica)
          return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28
        case 8: // Setembro (0-indexed)
        case 3: // Abril (0-indexed)
        case 5: // Junho (0-indexed)
        case 10: // Novembro (0-indexed)
          return 30
        default:
          return 31
      }
    }

    const isValidDate = (date) => {
      const [year, month, day] = date.split('-').map(Number)
      // Ajuste para mês 1-indexed se sua lógica `daysInMonth` espera isso
      return (
        month >= 1 &&
        month <= 12 &&
        day > 0 &&
        day <= daysInMonth(month - 1, year) // Ajustado para 0-indexed se daysInMonth usa 0-indexed months, se não remover o -1
      )
    }

    const isDisable = () => {
      return props.readonly || props.disable
    }

    const pickDate = (date) => {
      valueInput.value = date.split('-').reverse().join('/')
      valueDate.value = date
      emit('update:modelValue', date)
      showCalendar.value = false
    }

    const typingInput = (value) => {
      const date = value.split('/').reverse().join('-')
      if (date.length === 10) {
        if (isValidDate(date)) {
          valueDate.value = date
        } else {
          valueDate.value = ''
        }
      } else {
        valueDate.value = ''
      }
      valueInput.value = value
      emit('update:modelValue', date)
    }
    return {
      valueInput,
      valueDate,
      showCalendar,
      isDisable,
      pickDate,
      typingInput,
    }
  },
}
</script>
