<template>
  <div class="header-toolbar row items-center q-pr-sm">
    <div class="doc-card-title q-my-xs q-mr-sm" :class="headerClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QCardHeader',
  props: {
    icon: {
      type: String,
      default: 'fa-solid fa-pen-to-square',
    },
    headerClass: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../styles/quasar-variables.scss';

// Custom header card
body.body--dark .doc-card-title {
  background: #475d66;
  color: #cbcbcb;
}
.doc-card-title {
  margin-left: -12px;
  padding: 4px 8px 4px 28px;
  position: relative;
  border-radius: 3px 5px 5px 0;
  background: #d8e1e5;
  color: #757575;
  font-size: 18px;
  letter-spacing: 0.7px;
}
body.body--dark .doc-card-title:after {
  border-top-color: #324147;
}
.doc-card-title:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  width: 0;
  height: 0;
  border: 0 solid transparent;
  border-width: 9px 0 0 11px;
  border-top-color: #b0c2ca;
}
</style>
