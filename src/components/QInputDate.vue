<template>
  <q-input
    v-model="valueInput"
    :name="name"
    :spellcheck="spellcheck"
    :autocomplete="autocomplete"
    type="tel"
    filled
    mask="##/##/####"
    :lazy-rule="lazyRules"
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
        case 1:
          return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28
        case 8:
        case 3:
        case 5:
        case 10:
          return 30
        default:
          return 31
      }
    }

    const isValidDate = (date) => {
      const [year, month, day] = date.split('-').map(Number)
      return (
        month >= 0 && month < 12 && day > 0 && day <= daysInMonth(month, year)
      )
    }

    const isDisable = () => {
      return props.readonly
        ? props.readonly
        : props.disable
          ? props.disable
          : false
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
