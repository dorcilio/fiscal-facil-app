<template>
  <q-dialog v-model="cmpDialogVisible">
    <q-card class="q-popup-edit" style="width: 900px; max-width: 90vw">
      <div class="q-dialog__title q-mt-sm q-mb-sm">
        Informações {{ cmpCpfCnpj ? 'do Parceiro' : 'da Empresa' }}
        <q-btn
          v-close-popup
          class="float-right"
          icon="fa-solid fa-xmark"
          flat
          round
          dense
        />
      </div>
      <q-tabs
        v-model="state.tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="main" label="Principal" />
        <q-tab name="address" label="Endereço" />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="state.tab"
        animated
        transition-prev="fade"
        transition-next="fade"
      >
        <q-tab-panel name="main">
          <q-skeleton v-if="state.loading" height="350px" />
          <div v-else>
            <view-parceiro v-if="!state.editing" :parceiro="state.parceiro" />
            <form-pessoa-juridica
              v-if="state.editing && state.parceiro.pessoaJuridica"
              editing
              :loading="state.loading"
              :pessoa-juridica="state.parceiro"
              @update:pessoa-juridica="state.parceiro = $event"
            ></form-pessoa-juridica>
            <form-contabilidade
              v-if="state.editing && state.parceiro.contabilidade"
              editing
              :loading="state.loading"
              :contabilidade="state.parceiro"
              @update:contabilidade="state.parceiro = $event"
            ></form-contabilidade>
            <form-pessoa-fisica
              v-if="
                state.editing &&
                !state.parceiro.pessoaJuridica &&
                !state.parceiro.contabilidade
              "
              editing
              :loading="state.loading"
              :pessoa-fisica="state.parceiro"
              @update:pessoa-fisica="state.parceiro = $event"
            ></form-pessoa-fisica>
          </div>
        </q-tab-panel>

        <q-tab-panel name="address">
          <q-skeleton v-if="state.loading" height="350px" />
          <div v-else>
            <view-endereco
              v-if="!state.editing"
              dense
              :endereco="state.endereco"
            />
            <form-endereco
              v-else
              :loading="state.loading"
              :endereco="state.endereco"
              @update:endereco="state.endereco = $event"
              @search:endereco="onSearchByCEP"
            ></form-endereco>
          </div>
        </q-tab-panel>
      </q-tab-panels>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Atualização RFB"
          color="info"
          icon="fa-solid fa-rotate"
          title="Atualizar cadastro com a receita federal"
          :disable="state.editing"
        ></q-btn>
        <q-btn
          flat
          :label="state.editing ? 'Cancelar' : 'Editar'"
          :color="state.editing ? 'negative' : 'warning'"
          :icon="state.editing ? 'fa-solid fa-trash' : 'fa-solid fa-pencil'"
          :title="
            state.editing
              ? 'Cancelar alterações'
              : 'Editar cadastro manualmente'
          "
          @click="onCancel"
        ></q-btn>
        <q-btn
          v-if="state.editing"
          flat
          label="Salvar"
          color="primary"
          icon="fa-solid fa-floppy-disk"
          title="Salvar alterações"
          @click="onSave"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineAsyncComponent, onUpdated, reactive } from 'vue'
import { useStore } from 'vuex'
import { sendMessage } from '../../../plugins'
import { PessoaJuridica } from '../../../models/Parceiro'
import { Endereco } from '../../../models/Endereco'
import { findInfoParceiro } from '../../../services/parceiro-service'
import { searchByCEP } from '../../../services/endereco-service'
const ViewParceiro = defineAsyncComponent(
  () => import(/* webpackChunkName: "viewParceiro" */ './ViewParceiro.vue')
)
const ViewEndereco = defineAsyncComponent(
  () => import(/* webpackChunkName: "viewEndereco" */ '../../ViewEndereco.vue')
)
const FormPessoaJuridica = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "formPessoaJuridica" */ '../../../views/pessoa-juridica/FormPessoaJuridica.vue'
    )
)
const FormPessoaFisica = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "formPessoaFisica" */ '../../../views/pessoa-fisica/FormPessoaFisica.vue'
    )
)
const FormContabilidade = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "formContabilidade" */ '../../../views/contabilidade/FormContabilidade.vue'
    )
)
const FormEndereco = defineAsyncComponent(
  () => import(/* webpackChunkName: "formEndereco" */ '../../FormEndereco.vue')
)
export default {
  name: 'DialogPartnerInfo',
  components: {
    ViewParceiro,
    FormPessoaJuridica,
    FormPessoaFisica,
    FormContabilidade,
    ViewEndereco,
    FormEndereco,
  },
  setup() {
    const store = useStore()
    const cmpDialogVisible = computed({
      get() {
        return store.state.partner.dialog.visible
      },
      set(value) {
        store.dispatch('partner/setDialogVisible', value)
      },
    })
    const cmpCpfCnpj = computed(() => store.state.partner.dialog.cpfCnpj)
    const cmpIe = computed(() => store.state.partner.dialog.ie)

    const state = reactive({
      loading: false,
      tab: 'main',
      editing: false,
      parceiro: new PessoaJuridica(),
      endereco: new Endereco(),
      parceiroBackup: new PessoaJuridica(),
      enderecoBackup: new Endereco(),
    })

    const infoPartner = async () => {
      try {
        state.loading = true
        let params = {}
        if (cmpCpfCnpj.value) {
          params = {
            cpfCnpj: cmpCpfCnpj.value,
            ie: cmpIe.value,
          }
        }
        const { data } = await findInfoParceiro(params)
        state.parceiro = data.parceiro
        state.endereco = data.endereco
        state.parceiroBackup = { ...data.parceiro }
        state.enderecoBackup = { ...data.endereco }
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: `Ocorreu algum erro ao buscar dados ${cmpCpfCnpj.value ? 'do parceiro' : 'da empresa'}`,
          error,
        })
      } finally {
        state.loading = false
      }
    }

    const onSearchByCEP = async (cep) => {
      try {
        state.loading = true
        if (cep.length === 8) {
          const { data } = await searchByCEP(cep)
          if (data.erro)
            return sendMessage({
              color: 'warning',
              message: 'CEP não encontrado, verifique e tente novamente.',
            })
          state.endereco.setValues(data)
        }
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao buscar CEP',
          error,
        })
      } finally {
        state.loading = false
      }
    }

    const onCancel = () => {
      if (state.editing) {
        state.parceiro = { ...state.parceiroBackup }
        state.endereco = { ...state.enderecoBackup }
      }
      state.editing = !state.editing
    }

    const onSave = async () => {
      try {
        state.loading = true
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao salvar alterações',
          error,
        })
      } finally {
        state.loading = false
      }
    }

    onUpdated(() => {
      if (cmpDialogVisible.value) {
        infoPartner()
      } else {
        state.tab = 'main'
        state.editing = false
      }
    })
    return {
      cmpCpfCnpj,
      cmpDialogVisible,
      state,
      infoPartner,
      onSearchByCEP,
      onCancel,
      onSave,
    }
  },
}
</script>
