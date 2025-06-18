<template>
  <q-select
    v-model="state.parceiro"
    :options="state.parceiros"
    :readonly="!state.parceirosBackup.length"
    option-value="cpfCnpj"
    option-label="razaoSocial"
    clearable
    use-input
    map-options
    stack-label
    input-debounce="0"
    label-color="white"
    color="white"
    behavior="dialog"
    dark
    label="Parceiro"
    @filter="filterPartners"
    @update:model-value="changePartner"
  >
    <template #before-options>
      <q-item v-ripple:positive clickable @click="findAllPartners">
        <q-item-section>
          <q-item-label caption class="text-center text-positive">
            Atualizar lista de parceiros
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.razaoSocial }}</q-item-label>
          <q-item-label caption>{{
            `${scope.opt.fantasia} (${scope.opt.localidade})`
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template #before>
      <q-icon name="fa-solid fa-building" color="white" />
    </template>
    <template v-if="state.parceiro" #after>
      <q-btn
        round
        dense
        flat
        icon="fa-solid fa-circle-info"
        title="Informações do parceiro"
        @click="onShowPartnerInfo"
      />
    </template>
  </q-select>
</template>

<script>
import { computed, defineComponent, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { sendMessage } from '../../../plugins'
import { findParceirosContabilidade } from '../../../services/parceiro-service'
import { unaccent } from '../../../utils/input'

export default defineComponent({
  name: 'PartnerFind',
  setup() {
    const store = useStore()
    const compPartner = computed(() => store.state.partner.partner)
    const compUser = computed(() => store.state.user.user)

    const state = reactive({
      loading: false,
      parceiro: compPartner.value,
      parceiros: [],
      parceirosBackup: [],
    })

    const retrievePartners = async () => {
      try {
        state.loading = true
        const response = await findParceirosContabilidade({
          page: 1,
          rowsPerPage: 1000,
        })
        state.parceiros = response.data.rows || []
        state.parceirosBackup = [...state.parceiros]
      } catch (error) {
        state.parceiros = []
        state.parceirosBackup = []
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao buscar parceiros',
          error,
        })
      } finally {
        state.loading = false
      }
    }

    const changePartner = (partner) => {
      store.dispatch('partner/changePartner', partner)
    }

    const filterPartners = (value, update) => {
      if (value === '') {
        update(() => {
          state.parceiros = [...state.parceirosBackup]
        })
        return
      }

      update(() => {
        const needle = unaccent(value.toLowerCase())
        state.parceiros = state.parceirosBackup.filter(
          (parceiro) =>
            parceiro.razaoSocial.toLowerCase().indexOf(needle) > -1 ||
            parceiro.fantasia.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    const onShowPartnerInfo = () => {
      store.dispatch('partner/showDialogPartner', state.parceiro)
    }

    const findAllPartners = () => {
      if (compUser?.value?.contabilidade ?? false) {
        retrievePartners()
      } else {
        state.parceiros = []
        state.parceirosBackup = []
      }
    }

    onMounted(() => {
      findAllPartners()
    })
    return {
      state,
      changePartner,
      filterPartners,
      onShowPartnerInfo,
      findAllPartners,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../../styles/quasar-variables';

.q-select :deep(.q-field__marginal) {
  color: white !important;
  caret-color: white !important;
}

.q-select
  :deep(.q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input) {
  color: white !important;
}

.q-field :deep(.q-field__marginal) {
  color: white !important;
  caret-color: white !important;
}

.q-field
  :deep(.q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input) {
  color: white !important;
}
</style>
