<template>
  <q-header
    class="rounded-borders q-mx-lg q-mt-md q-py-sm"
    :class="{ 'bg-dark': $q.dark.isActive, 'bg-white': !$q.dark.isActive }"
  >
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        :color="$q.dark.isActive ? 'white' : 'black'"
        aria-label="Menu"
        icon="fas fa-bars"
        @click="changeDrawer"
      />
      <q-toolbar-title>
        <q-img
          :width="$q.platform.is.desktop ? '5%' : '45%'"
          :alt="logoTheme.alt"
          :src="logoTheme.src"
          spinner-color="white"
        />
      </q-toolbar-title>
      <!-- <parceiro-find v-if="compUser?.contabilidade ?? false" /> -->
      <q-btn
        flat
        round
        :color="darkMode ? 'white' : 'black'"
        title="Mudar tema"
        :icon="darkMode ? 'fa-solid fa-cloud-moon' : 'fa-solid fa-sun'"
        @click="changeThemeInStore"
      />
    </q-toolbar>
  </q-header>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from '../../stores/app'
import { useUserStore } from '../../stores/user'
import logoDefault from '../../assets/fiscal-facil.svg?url'
import logoDark from '../../assets/fiscal-facil-dark.svg?url'
// import ParceiroFind from './parceiro/ParceiroFind.vue'
export default defineComponent({
  name: 'PHeader',
  components: {
    // ParceiroFind,
  },
  props: {
    drawer: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:drawer'],
  setup(props, { emit }) {
    const appStore = useAppStore()
    const darkModeInStore = computed(() => appStore.darkMode)
    const userStore = useUserStore()
    const userInStore = computed(() => userStore.user)
    const drawerOpen = computed(() => props.drawer)

    const $q = useQuasar()
    const darkMode = ref(darkModeInStore.value)

    const changeDrawer = () => {
      emit('update:drawer', !drawerOpen.value)
    }

    const changeThemeInStore = () => {
      darkMode.value = !darkMode.value
      appStore.changeTheme()
      $q.dark.set(darkMode.value)
    }

    const logoTheme = computed(() => {
      return {
        src: $q.dark.isActive ? logoDark : logoDefault,
        alt: $q.dark.isActive ? 'logo-fiscal-facil-dark' : 'logo-fiscal-facil',
      }
    })
    return {
      userInStore,
      darkMode,
      changeDrawer,
      changeThemeInStore,
      logoTheme,
    }
  },
})
</script>
