<template>
  <div>
    <q-img
      class="absolute-top"
      :src="background.src"
      style="height: 204px"
      :alt="background.alt"
      spinner-color="purple"
    >
      <div
        v-if="isUserProfile?.email ?? false"
        class="absolute-bottom bg-transparent"
      >
        <q-avatar size="56px" class="q-mb-sm">
          <q-img :alt="avatar.alt" :src="avatar.src" spinner-color="purple" />
          <q-badge
            :color="socketOnline ? 'positive' : 'negative'"
            rounded
            floating
          />
        </q-avatar>
        <div class="text-weight-bold">{{ isUserProfile?.fullName }}</div>
        <q-badge :color="getColor()">{{ isUserProfile?.roleName }}</q-badge>
        <div>{{ isUserProfile?.email ?? '' }}</div>
        <div class="text-center">
          <div class="q-gutter-sm">
            <q-btn
              title="Painel da empresa"
              round
              color="indigo"
              icon="fa-solid fa-landmark"
              @click.prevent="infoParceiro"
            ></q-btn>
            <q-btn
              title="Perfil do usuário"
              round
              color="blue-6"
              icon="fa-solid fa-user-gear"
              @click.prevent="profile"
            ></q-btn>
            <q-btn
              title="Sair do sistema"
              round
              color="red"
              icon="fa-solid fa-power-off"
              @click.prevent="logout"
            ></q-btn>
          </div>
        </div>
      </div>
    </q-img>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import defaultBackground from '../../assets/default-background.jpg?url'
import defaultAvatar from '../../assets/default-avatar.jpg?url'
import { UserProfile } from '../../models/user'
export default defineComponent({
  name: 'DrawerProfile',
  props: {
    userProfile: {
      required: false,
      type: Object,
      default: () => new UserProfile(),
    },
  },
  emits: ['profile-parceiro', 'profile', 'logout'],
  setup(props, { emit }) {
    const isUserProfile = computed(() => props.userProfile)
    const avatar = computed(() => {
      return {
        src: isUserProfile.value.avatar || defaultAvatar,
        alt: isUserProfile.value.avatar
          ? `${isUserProfile.value.email}-avatar`
          : 'default-avatar',
      }
    })
    const background = computed(() => {
      return {
        src: defaultBackground,
        alt: 'default-background',
      }
    })
    const infoParceiro = () => {
      emit('profile-parceiro')
    }
    const profile = () => {
      emit('profile')
    }
    const logout = () => {
      emit('logout')
    }

    const getColor = () => {
      const roleId = isUserProfile.value?.roleId ?? null
      /** Administrador */
      if (roleId === 0 || roleId === 1) {
        return 'red'
        /** Contabilista */
      } else if (roleId === 3) {
        return 'orange'
        /** Admin Parceiro */
      } else if (roleId === 4) {
        return 'deep-purple'
        /** Admin Contabilista */
      } else if (roleId === 5) {
        return 'deep-orange'
        /** Parceiro e outros */
      } else {
        return 'indigo'
      }
    }
    return {
      isUserProfile,
      background,
      avatar,
      socketOnline: false,
      infoParceiro,
      profile,
      logout,
      getColor,
    }
  },
})
</script>
