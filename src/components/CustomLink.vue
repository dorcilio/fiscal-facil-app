<template>
  <div class="main">
    <router-link v-if="internal" v-slot="{ href, navigate }" :to="to" custom>
      <a :class="getClasses()" :href="href" @click="navigate">
        <slot></slot>
        <q-icon :name="icon" />
      </a>
    </router-link>
    <a
      v-else
      :class="getClasses()"
      :href="to"
      target="_blank"
      rel="noopener noreferrer"
    >
      <slot></slot>
      <q-icon :name="icon" />
    </a>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'CustomLink',
  props: {
    to: {
      type: String,
      required: true,
      validator: (value) => typeof value === 'string' && value.length > 0,
    },
    icon: {
      type: String,
      default: 'fa-solid fa-up-right-from-square',
    },
    textClass: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'green-7',
      validator: (value) =>
        [
          'primary',
          'secondary',
          'accent',
          'positive',
          'negative',
          'info',
          'warning',
          'red',
          'red-1',
          'red-2',
          'red-3',
          'red-4',
          'red-5',
          'red-6',
          'red-7',
          'red-8',
          'red-9',
          'pink',
          'pink-1',
          'pink-2',
          'pink-3',
          'pink-4',
          'pink-5',
          'pink-6',
          'pink-7',
          'pink-8',
          'pink-9',
          'purple',
          'purple-1',
          'purple-2',
          'purple-3',
          'purple-4',
          'purple-5',
          'purple-6',
          'purple-7',
          'purple-8',
          'purple-9',
          'deep-purple',
          'deep-purple-1',
          'deep-purple-2',
          'deep-purple-3',
          'deep-purple-4',
          'deep-purple-5',
          'deep-purple-6',
          'deep-purple-7',
          'deep-purple-8',
          'deep-purple-9',
          'indigo',
          'indigo-1',
          'indigo-2',
          'indigo-3',
          'indigo-4',
          'indigo-5',
          'indigo-6',
          'indigo-7',
          'indigo-8',
          'indigo-9',
          'blue',
          'blue-1',
          'blue-2',
          'blue-3',
          'blue-4',
          'blue-5',
          'blue-6',
          'blue-7',
          'blue-8',
          'blue-9',
          'light-blue',
          'light-blue-1',
          'light-blue-2',
          'light-blue-3',
          'light-blue-4',
          'light-blue-5',
          'light-blue-6',
          'light-blue-7',
          'light-blue-8',
          'light-blue-9',
          'cyan',
          'cyan-1',
          'cyan-2',
          'cyan-3',
          'cyan-4',
          'cyan-5',
          'cyan-6',
          'cyan-7',
          'cyan-8',
          'cyan-9',
          'teal',
          'teal-1',
          'teal-2',
          'teal-3',
          'teal-4',
          'teal-5',
          'teal-6',
          'teal-7',
          'teal-8',
          'teal-9',
          'green',
          'green-1',
          'green-2',
          'green-3',
          'green-4',
          'green-5',
          'green-6',
          'green-7',
          'green-8',
          'green-9',
          'light-green',
          'light-green-1',
          'light-green-2',
          'light-green-3',
          'light-green-4',
          'light-green-5',
          'light-green-6',
          'light-green-7',
          'light-green-8',
          'light-green-9',
          'lime',
          'lime-1',
          'lime-2',
          'lime-3',
          'lime-4',
          'lime-5',
          'lime-6',
          'lime-7',
          'lime-8',
          'lime-9',
          'yellow',
          'yellow-1',
          'yellow-2',
          'yellow-3',
          'yellow-4',
          'yellow-5',
          'yellow-6',
          'yellow-7',
          'yellow-8',
          'yellow-9',
          'amber',
          'amber-1',
          'amber-2',
          'amber-3',
          'amber-4',
          'amber-5',
          'amber-6',
          'amber-7',
          'amber-8',
          'amber-9',
          'orange',
          'orange-1',
          'orange-2',
          'orange-3',
          'orange-4',
          'orange-5',
          'orange-6',
          'orange-7',
          'orange-8',
          'orange-9',
          'deep-orange',
          'deep-orange-1',
          'deep-orange-2',
          'deep-orange-3',
          'deep-orange-4',
          'deep-orange-5',
          'deep-orange-6',
          'deep-orange-7',
          'deep-orange-8',
          'deep-orange-9',
          'brown',
          'brown-1',
          'brown-2',
          'brown-3',
          'brown-4',
          'brown-5',
          'brown-6',
          'brown-7',
          'brown-8',
          'brown-9',
          'grey',
          'grey-1',
          'grey-2',
          'grey-3',
          'grey-4',
          'grey-5',
          'grey-6',
          'grey-7',
          'grey-8',
          'grey-9',
          'blue-grey',
          'blue-grey-1',
          'blue-grey-2',
          'blue-grey-3',
          'blue-grey-4',
          'blue-grey-5',
          'blue-grey-6',
          'blue-grey-7',
          'blue-grey-8',
          'blue-grey-9',
          'white',
          'black',
          'dark',
        ].includes(value),
    },
  },
  setup(props) {
    const color = computed(() => props.color)
    const textClass = computed(() => props.textClass)
    const getClasses = () => {
      return {
        'custom-link': true,
        [`text-${color.value}`]: true,
        [textClass.value]: true,
      }
    }
    return {
      internal: computed(() => props.to.charAt(0) === '/'),
      getClasses,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/quasar-variables.scss';

.main {
  display: inline;
}

.custom-link {
  font-weight: 500;
  text-decoration: none;
  outline: 0;
  border-bottom: 1px dotted currentColor;
  vertical-align: center;
  transition: opacity 0.2s ease-in-out;
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
