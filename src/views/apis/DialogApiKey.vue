<template>
  <q-dialog v-model="formDialogVisible" persistent>
    <q-banner
      rounded
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-2'"
      style="width: 700px; max-width: 80vw"
    >
      <div class="row q-col-gutter-sm">
        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 text-h6">
          Atenção, você deve copiar a
          <span class="text-deep-orange">API Key</span>, caso contrário será
          necessário regerar ao sair desta página!
        </div>
        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
          <q-field filled label="Descrição da API" stack-label readonly>
            <template #before>
              <q-icon name="fa-solid fa-keyboard" />
            </template>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ state.api.apiDescricao }}
              </div>
            </template>
            <template #append>
              <q-btn
                color="warning"
                round
                dense
                flat
                title="Copiar"
                icon="fa-solid fa-copy"
                @click="copy(api.apiDescricao)"
              >
                <q-tooltip
                  v-if="!isSupported"
                  class="bg-negative"
                  :offset="[10, 10]"
                >
                  Seu navegador não suporta o Clipboard API
                </q-tooltip>
              </q-btn>
            </template>
          </q-field>
        </div>
        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
          <q-field filled label="URL Git" stack-label readonly>
            <template #before>
              <q-icon name="fa-brands fa-github" />
            </template>
            <template #control>
              <div class="self-center full-width no-outline" tabindex="0">
                {{ state.api.urlGit }}
              </div>
            </template>
            <template #append>
              <q-btn
                color="warning"
                round
                dense
                flat
                title="Copiar"
                icon="fa-solid fa-copy"
                @click="copy(api.urlGit)"
              >
                <q-tooltip
                  v-if="!isSupported"
                  class="bg-negative"
                  :offset="[10, 10]"
                >
                  Seu navegador não suporta o Clipboard API
                </q-tooltip>
              </q-btn>
            </template>
          </q-field>
        </div>
        <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
          <q-field filled label="API Key" stack-label readonly>
            <template #before>
              <q-icon name="fa-solid fa-key" />
            </template>
            <template #control>
              <div
                class="self-center full-width wrap-text text-deep-orange"
                tabindex="0"
              >
                {{ state.api.apiKey }}
              </div>
            </template>
            <template #append>
              <q-btn
                color="warning"
                round
                dense
                flat
                title="Copiar"
                icon="fa-solid fa-copy"
                @click="copy(api.apiKey)"
              >
                <q-tooltip
                  v-if="!isSupported"
                  class="bg-negative"
                  :offset="[10, 10]"
                >
                  Seu navegador não suporta o Clipboard API
                </q-tooltip>
              </q-btn>
            </template>
          </q-field>
        </div>
      </div>
      <template #action>
        <q-btn
          flat
          color="white"
          icon="fa-solid fa-xmark"
          title="Fechar banner"
          label="Fechar"
          @click="closeDialog"
        >
        </q-btn>
      </template>
    </q-banner>
  </q-dialog>
</template>

<script>
import { computed, reactive, inject } from 'vue'
import { API, APIValidation } from '../../models/Api'
import useVuelidate from '@vuelidate/core'
import { useClipboard } from '@vueuse/core'
export default {
  name: 'DialogApi',
  props: {
    api: {
      required: false,
      type: [API, Object],
      default: () => new API(),
    },
    dialogVisible: {
      required: true,
      type: Boolean,
    },
  },
  emits: ['update:dialog-visible'],
  setup(props, { emit }) {
    const rules = computed(() => {
      return {
        api: APIValidation,
      }
    })

    const formDialogVisible = computed({
      get() {
        return props.dialogVisible
      },
      set(value) {
        emit('update:dialog-visible', value)
      },
    })

    const api = computed(() => props.api)
    const state = reactive({
      api,
    })

    const v$ = inject('vuelidate', useVuelidate(rules, state))

    const closeDialog = () => {
      emit('update:dialog-visible', false)
    }

    const { copy, isSupported } = useClipboard()
    return {
      formDialogVisible,
      state,
      v$,
      closeDialog,
      copy,
      isSupported,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/quasar-variables.scss';
.wrap-text {
  word-wrap: break-word;
}
</style>
