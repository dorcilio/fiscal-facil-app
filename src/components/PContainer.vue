<template>
  <q-card>
    <q-card-header :header-class="headerClass">
      {{ title }}
    </q-card-header>
    <slot></slot>
  </q-card>
</template>

<script>
import { defineAsyncComponent } from 'vue'

const QCardHeader = defineAsyncComponent(
  () => import(/* webpackChunkName: "qCardHeader" */ './QCardHeader.vue')
)
export default {
  name: 'PContainer',
  components: {
    QCardHeader,
  },
  props: {
    icon: {
      type: String,
      default: 'fa-solid fa-pen-to-square',
    },
    title: {
      required: true,
      type: String,
      default: '',
    },
    headerClass: {
      type: String,
      default: 'bg-blue text-white',
    },
  },
}
</script>
