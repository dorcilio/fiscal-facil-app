<template>
  <q-dialog v-model="formDialogVisible" persistent>
    <q-card class="q-popup-edit" style="width: 900px; max-width: 90vw">
      <div class="q-dialog__title q-mt-sm q-mb-sm">
        Informações da API
        <q-btn
          v-close-popup
          class="float-right"
          icon="fa-solid fa-xmark"
          flat
          round
          dense
        />
      </div>
      <q-card-section>
        <q-form
          autocorrect="on"
          autocapitalize="on"
          autocomplete="on"
          spellcheck="true"
          @submit="onSubmit"
          @reset="onReset"
        >
          <div class="row q-col-gutter-sm">
            <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
              <q-input
                v-model="state.api.apiDescricao"
                v-unaccent
                class="full-width"
                filled
                name="apiDescricao"
                type="text"
                minlength="2"
                maxlength="100"
                hint="Ex.: fiscal-facil-xml"
                autofocus
                error-message="Preencha um nome válido"
                :error="
                  v$.api.apiDescricao.$invalid && v$.api.apiDescricao.$dirty
                "
                label="Descrição da API *"
                @blur="v$.api.apiDescricao.$touch()"
              >
                <template #before>
                  <q-icon name="fa-solid fa-keyboard" />
                </template>
              </q-input>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
              <q-input
                v-model="state.api.urlGit"
                class="full-width"
                filled
                name="urlGit"
                type="text"
                minlength="2"
                maxlength="100"
                hint="Ex.: https://github.com/fiscal-facil/fiscal-facil-parceiro"
                autofocus
                error-message="Preencha uma URL válida"
                :error="v$.api.urlGit.$invalid && v$.api.urlGit.$dirty"
                label="URL Git *"
                @blur="v$.api.urlGit.$touch()"
              >
                <template #before>
                  <q-icon name="fa-brands fa-github" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="q-pt-md" align="right">
            <q-btn
              type="reset"
              label="Cancelar"
              title="Cancelar operação"
              flat
              color="negative"
              icon="fa-solid fa-xmark"
            />
            <q-btn
              type="submit"
              label="Salvar"
              title="Adicionar API e gerar sua key"
              flat
              color="primary"
              icon="fa-solid fa-floppy-disk"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, reactive, inject, onBeforeMount } from 'vue'
import { API, APIValidation } from '../../models/Api'
import useVuelidate from '@vuelidate/core'
// import { sendMessage } from '../../plugins'
// import { retrieveApiEnvironments } from '../../services/user.service'
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
  emits: ['update:dialog-visible', 'update:api', 'reset-api'],
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
      environments: [],
    })

    const v$ = inject('vuelidate', useVuelidate(rules, state))

    const onSubmit = () => {
      emit('update:api', state.api)
    }
    const onReset = () => {
      emit('reset-api')
    }

    // const retrieveAllEnvironments = async () => {
    //   try {
    //     const { body } = await retrieveApiEnvironments()
    //     state.environments = body
    //   } catch (error) {
    //     sendMessage({
    //       color: 'negative',
    //       message: error?.data?.error ?? 'Ocorreu um erro ao buscar ambientes',
    //       error,
    //     })
    //   }
    // }

    onBeforeMount(() => {
      // retrieveAllEnvironments()
    })
    return {
      formDialogVisible,
      state,
      v$,
      onSubmit,
      onReset,
    }
  },
}
</script>
