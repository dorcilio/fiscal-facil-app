<template>
  <div class="main">
    <a :href="cmpPhone" class="column-edit cursor-pointer">
      <slot></slot>
      <q-icon :name="icon" />
    </a>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'CustomCallPhone',
  props: {
    icon: {
      type: String,
      default: 'fa-solid fa-pen-to-square',
    },
    phone: {
      required: true,
      type: [String, Number],
    },
  },
  setup(props) {
    const cmpPhone = computed(() => {
      return `tel:+55${typeof props.phone === 'number' ? props.phone : props.phone.replace(/\D/g, '')}`
    })
    return {
      cmpPhone,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/quasar-variables.scss';

.main {
  display: inline;
}

.column-edit {
  color: $primary;
  font-weight: 500;
  text-decoration: none;
  outline: 0;
  border-bottom: 1px dotted currentColor;
  vertical-align: center;
  transition: opacity 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.8;
  }

  .q-icon {
    margin-top: -3px;
    margin-left: 4px;
  }
}
</style>
