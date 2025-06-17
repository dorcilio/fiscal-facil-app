<template>
  <q-list padding>
    <q-expansion-item
      v-for="item in navItens"
      :key="item.name"
      :to="item.path"
      :default-opened="containsRoute(item.children)"
      class="ff-drawer-item"
      :header-class="{
        'ff-active-children': containsRoute(item.children) && !$q.dark.isActive,
        'ff-active-children-dark':
          containsRoute(item.children) && $q.dark.isActive,
      }"
      :expand-icon-class="item.children ? '' : 'hidden'"
    >
      <template #header>
        <q-item-section v-if="item.icon" avatar>
          <q-icon size="xs" :name="item.icon" />
        </q-item-section>

        <q-item-section>
          {{ item.label || item.name }}
        </q-item-section>

        <q-item-label v-if="item.subtitle" caption>
          {{ item.subtitle }}
        </q-item-label>
      </template>
      <q-item
        v-for="(subItem, subIndex) in item.children"
        :key="subIndex"
        v-ripple
        :to="subItem.path"
        clickable
      >
        <q-item-section v-if="subItem.icon" avatar>
          <q-icon size="xs" :name="subItem.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ subItem.label || subItem.name }}
          </q-item-label>
          <q-item-label v-if="subItem.subtitle" caption>
            {{ subItem.subtitle }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'DrawerItemList',
  props: {
    itens: {
      type: Array,
      default: () => [],
      validator: (value) => Array.isArray(value),
    },
  },
  setup(props) {
    const route = useRoute()
    const navItens = computed(() => props.itens)

    const containsRoute = (children = []) => {
      return children.some((child) => {
        return route.name === child.name
      })
    }
    return {
      navItens,
      containsRoute,
    }
  },
})
</script>

<style lang="scss">
.ff-drawer-item {
  line-height: 24px;
  margin-right: 12px;
  margin-left: 12px;

  :deep(.q-item) {
    border-radius: 8px !important;
  }
}

.ff-active-children-dark {
  background-color: #384250 !important;
}

.ff-active-children {
  background-color: #e8e8e8 !important;
}
</style>
