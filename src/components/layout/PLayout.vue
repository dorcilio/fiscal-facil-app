<template>
  <q-layout view="lHh LpR lFr">
    <p-header
      v-if="!metaData.layoutClean"
      :drawer="state.drawer"
      @update:drawer="state.drawer = $event"
    />
    <p-drawer
      v-if="!metaData.layoutClean"
      :drawer="state.drawer"
      :nav-itens="navItens"
      @update:drawer="state.drawer = $event"
    />
    <q-page-container :class="{ 'bg-grey-4': !$q.dark.isActive }">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>
    <reload-prompt />
    <cookies-banner />
    <!-- <dialog-parceiro-info /> -->
  </q-layout>
</template>

<script>
import { computed, onBeforeMount, reactive } from 'vue'
import { useAppStore } from '../../stores/app'
import { useQuasar } from 'quasar'
import { parsedItensDrawer } from '../../router/navItens'
import { useRoute } from 'vue-router'
import ReloadPrompt from './ReloadPrompt.vue'
import CookiesBanner from '../CookiesBanner.vue'
import PHeader from './PHeader.vue'
import PDrawer from './PDrawer.vue'
import { initializeCookieManagement } from '../../utils/cookies'
import { useUserStore } from '../../stores/user'
// import DialogParceiroInfo from './parceiro/DialogParceiroInfo.vue'
export default {
  name: 'PLayout',
  components: {
    ReloadPrompt,
    CookiesBanner,
    PHeader,
    PDrawer,
    // DialogParceiroInfo,
  },
  setup() {
    const userStore = useUserStore()
    const userInStore = computed(() => userStore.user)

    const navItens = computed(() =>
      parsedItensDrawer(userInStore.value.modules)
    )

    const $q = useQuasar()
    const state = reactive({
      drawer: $q.platform.is.desktop,
    })

    const appStore = useAppStore()
    const darkModeInStore = computed(() => appStore.darkMode)
    const route = useRoute()
    onBeforeMount(() => {
      // Initialize dark mode
      $q.dark.set(darkModeInStore.value)
      // Initialize cookie management
      initializeCookieManagement()
      if (route.meta?.requiresAuth) userStore.findForProfile()
    })
    return {
      navItens,
      state,
      metaData: computed(() => route.meta),
    }
  },
}
</script>
