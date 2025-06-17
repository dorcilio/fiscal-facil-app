<template>
  <q-drawer v-model="drawerOpen" show-if-above side="left" bordered>
    <q-scroll-area fit class="scroll-area">
      <drawer-item-list :itens="drawerItens" />
    </q-scroll-area>
    <drawer-profile
      v-if="!isLoading"
      :user-profile="userInStore"
      @profile="profile"
      @logout="logout"
      @profile-parceiro="profileParceiro"
    >
    </drawer-profile>
    <q-skeleton
      v-if="isLoading"
      class="absolute-top"
      height="204px"
      width="300px"
      square
    />
  </q-drawer>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import DrawerItemList from './DrawerItemList.vue'
import DrawerProfile from './DrawerProfile.vue'
import { useUserStore } from '../../stores/user'
import { storeToRefs } from 'pinia'
export default {
  name: 'PDrawer',
  components: {
    DrawerItemList,
    DrawerProfile,
  },
  props: {
    drawer: {
      required: false,
      type: Boolean,
      default: false,
    },
    navItens: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:drawer'],
  setup(props, { emit }) {
    const drawerOpen = computed({
      get() {
        return props.drawer
      },
      set(newValue) {
        emit('update:drawer', newValue)
      },
    })
    const drawerItens = computed(() => props.navItens)
    const userStore = useUserStore()
    const { user, isLoading } = storeToRefs(userStore)
    const userInStore = computed(() => user.value)

    const router = useRouter()
    const profile = () => {
      router.push({ path: '/profile' })
    }
    const logout = () => {
      router.push({ path: '/login' })
      // store.dispatch('connectionSocket/disconnect')
      // store.dispatch('partner/removePartner')
      // store.dispatch('user/logout').then(
      //   async () => {
      //     console.log('Deslogado')
      //   },
      //   async (error) => {
      //     console.error(error)
      //   }
      // )
    }
    const profileParceiro = () => {
      // store.dispatch('partner/showDialog')
    }
    return {
      drawerOpen,
      drawerItens,
      userInStore,
      isLoading,
      profile,
      logout,
      profileParceiro,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/quasar-variables.scss';
.scroll-area {
  height: calc(100% - 204px - 18px);
  margin-top: 204px;
  margin-bottom: 18px;
}
</style>
