<template>
  <q-page padding>
    <p-container title="API's Fiscal Fácil">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
            <q-breadcrumbs class="text-positive" active-color="primary">
              <template #separator>
                <q-icon
                  size="1.2em"
                  name="fa-solid fa-arrow-right"
                  color="primary"
                />
              </template>
              <q-breadcrumbs-el
                label="Dashboard"
                icon="fas fa-chart-line"
                to="/dashboard"
              />
              <q-breadcrumbs-el
                label="API's"
                icon="fa-solid fa-network-wired"
                to="/apis"
              />
            </q-breadcrumbs>
          </div>
          <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12 text-right">
            <q-btn
              color="primary"
              label="Nova"
              icon="fa-solid fa-plus"
              title="Nova API"
              @click="state.dialogVisible = !state.dialogVisible"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <grid-apis
              flat
              :loading="state.loading"
              :rows="state.apis"
              :filter="state.filter"
              :pagination="state.pagination"
              @update:loading="state.loading = $event"
              @update:rows="state.apis = $event"
              @update:filter="state.filter = $event"
              @update:pagination="state.pagination = $event"
              @request="onRequest"
              @syncronize="onSync"
              @on-remove="onRemoveApi"
              @on-change-key="onChangeApiKey"
            />
          </div>
        </div>
      </q-card-section>
    </p-container>
    <dialog-api
      :dialog-visible="state.dialogVisible"
      :api="state.api"
      @update:dialog-visible="state.dialogVisible = $event"
      @update:api="onUpdateApi"
      @reset-api="onResetApi"
    >
    </dialog-api>
    <dialog-api-key
      :dialog-visible="state.dialogApiKey"
      :api="state.api"
      @update:dialog-visible="onDialogApiKey"
    >
    </dialog-api-key>
  </q-page>
</template>

<script>
import {
  computed,
  defineAsyncComponent,
  onMounted,
  provide,
  reactive,
} from 'vue'
import { sendMessage } from '../../plugins'
import { API, APIValidation } from '../../models/Api'
import useVuelidate from '@vuelidate/core'
import {
  requestApiKey,
  changeApiKey,
  deleteApi,
  findApis,
} from '../../services/api-service'
const GridApis = defineAsyncComponent(
  () => import(/* webpackChunkName: "gridApis" */ './GridApis.vue')
)
const DialogApi = defineAsyncComponent(
  () => import(/* webpackChunkName: "dialogApi" */ './DialogApi.vue')
)
const DialogApiKey = defineAsyncComponent(
  () => import(/* webpackChunkName: "dialogApiKey" */ './DialogApiKey.vue')
)
export default {
  name: 'HomeApis',
  components: {
    GridApis,
    DialogApi,
    DialogApiKey,
  },
  setup() {
    const rules = computed(() => {
      return {
        api: APIValidation,
      }
    })

    const state = reactive({
      api: new API(),
      dialogVisible: false,
      dialogApiKey: false,
      loading: false,
      apis: [],
      filter: '',
      pagination: {
        sortBy: 'apiDescricao',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0,
      },
    })
    const v$ = useVuelidate(rules, state)
    provide('vuelidate', v$)

    const onRequest = async ({ filter, pagination }) => {
      try {
        state.loading = true
        state.filter = filter
        state.pagination = pagination
        const response = await findApis({
          ...pagination,
          filter,
        })
        state.apis = response.body.rows || []
        state.pagination.rowsNumber =
          response.body.rowsNumber || state.pagination.rowsNumber
      } catch (error) {
        state.apis = []
        sendMessage({
          color: 'negative',
          message: "Ocorreu algum erro ao buscar API's.",
          error,
        })
      } finally {
        state.loading = false
      }
    }

    const onSync = () => {
      onRequest({
        filter: state.filter,
        pagination: state.pagination,
      })
    }

    const onUpdateApi = async (api) => {
      try {
        state.api = api
        state.loading = true
        if (v$.value.api.$invalid) {
          v$.value.api.$touch()
          sendMessage({
            color: 'warning',
            message: 'Você deve preencher todos requisitos para cadastrar.',
          })
          return
        }
        const { data } = await requestApiKey(api)
        state.api.apiKey = data.accessToken
        state.dialogVisible = false
        state.dialogApiKey = true
        sendMessage({
          message: `API ${state.api.nomeApi} cadastrada. Não esqueça de copiar API Key!`,
        })
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao cadastrar API.',
          error,
        })
      } finally {
        state.loading = false
      }
    }

    const onResetApi = () => {
      state.dialogVisible = !state.dialogVisible
      state.api = new API()
      v$.value.api.$reset()
    }

    const onDialogApiKey = (value) => {
      state.dialogApiKey = value
      state.api = new API()
      v$.value.api.$reset()
      onSync()
    }

    const onRemoveApi = async ({ apiId, apiDescricao }) => {
      try {
        state.loading = true
        const { data } = await deleteApi({
          apiId,
          apiDescricao,
        })
        sendMessage({
          message: data.message,
        })
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao remove a API.',
          error,
        })
      } finally {
        state.loading = false
        onSync()
      }
    }

    const onChangeApiKey = async (api) => {
      try {
        state.api.setApi(api)
        state.loading = true
        const { data } = await changeApiKey(api)
        state.api.apiKey = data.accessToken
        state.dialogVisible = false
        state.dialogApiKey = true
        sendMessage({
          message: `Token da API ${state.api.apiDescricao} regerado. Não esqueça de copiar API Key!`,
        })
      } catch (error) {
        sendMessage({
          color: 'negative',
          message: 'Ocorreu algum erro ao regerar API Key.',
          error,
        })
      } finally {
        state.loading = false
      }
    }

    onMounted(() => {
      onSync()
    })
    return {
      state,
      onRequest,
      onSync,
      onUpdateApi,
      onResetApi,
      onDialogApiKey,
      onRemoveApi,
      onChangeApiKey,
    }
  },
}
</script>
