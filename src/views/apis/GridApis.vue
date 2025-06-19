<template>
  <q-table
    v-model:pagination="compPagination"
    dense
    :loading="loading"
    :grid="$q.platform.is.mobile"
    :rows="rows"
    :columns="columns"
    row-key="apiKey"
    :filter="compFilter"
    :flat="flat"
    binary-state-sort
    @request="onRequest"
  >
    <template #top-left>
      <q-input
        v-model="compFilter"
        rounded
        dense
        clearable
        name="api"
        autocorrect="on"
        autocapitalize="on"
        autocomplete="on"
        spellcheck="true"
        standout="bg-purple text-white"
        bottom-slots
        label="Filtrar"
        debounce="1000"
      >
        <template #prepend>
          <q-icon name="fas fa-search" />
        </template>
      </q-input>
    </template>
    <template #top-right>
      <q-btn
        round
        color="green"
        icon="fa-solid fa-rotate"
        title="Sincronizar lista"
        @click.prevent="onSync"
      >
      </q-btn>
    </template>
    <template #loading>
      <q-inner-loading
        showing
        :color="$q.dark.isActive ? 'white' : 'primary'"
      />
    </template>
    <template #body-cell-apiDescricao="props">
      <q-td :props="props">
        <custom-link
          title="Abrir repositório Git em nova aba"
          icon="fa-brands fa-github"
          :to="props.row.urlGit"
        >
          {{ props.value }}
        </custom-link>
      </q-td>
    </template>
    <template #body-cell-apiKey="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          size="sm"
          title="Regerar API Key"
          color="deep-orange"
          icon="fa-solid fa-shuffle"
          @click="onChangeApiKey(props)"
        >
        </q-btn>
      </q-td>
    </template>
    <template #body-cell-remover="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          size="sm"
          title="Remover API"
          color="negative"
          icon="fa-solid fa-trash"
          @click="onRemoveApi(props)"
        >
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script>
import { useQuasar } from 'quasar'
import { computed, defineAsyncComponent } from 'vue'
const CustomLink = defineAsyncComponent(
  () =>
    import(
      /* webpackChunkName: "customLink" */ '../../components/CustomLink.vue'
    )
)
export default {
  name: 'GridApis',
  components: {
    CustomLink,
  },
  props: {
    loading: {
      required: false,
      type: Boolean,
    },
    rows: {
      required: true,
      type: Array,
    },
    filter: {
      required: false,
      type: String,
    },
    pagination: {
      required: true,
      type: Object,
    },
    flat: {
      required: false,
      type: [String, Boolean],
      default: false,
    },
  },
  emits: [
    'request',
    'syncronize',
    'update:filter',
    'update:pagination',
    'on-change-key',
    'on-remove',
  ],
  setup(props, { emit }) {
    const columns = [
      {
        name: 'apiDescricao',
        label: 'Descrição',
        align: 'left',
        field: 'apiDescricao',
        sortable: true,
      },
      {
        name: 'apiKey',
        label: 'Reg. API Key',
        align: 'center',
        field: 'apiKey',
        sortable: false,
      },
      {
        name: 'remover',
        label: 'Remover',
        align: 'center',
        field: 'remover',
        sortable: false,
      },
    ]

    const compFilter = computed({
      get() {
        return props.filter
      },
      set(value) {
        emit('update:filter', value)
      },
    })
    const compPagination = computed({
      get() {
        return props.pagination
      },
      set(value) {
        emit('update:pagination', value)
      },
    })

    const onRequest = (payload) => {
      emit('request', payload)
    }
    const onSync = () => {
      emit('syncronize')
    }

    const $q = useQuasar()
    const onChangeApiKey = (props) => {
      $q.dialog({
        class: 'text-bold',
        title: 'Regerar API Key!?',
        message:
          'Caso confirme a geração de uma nova API Key, anterior se tornará inválida!',
        ok: {
          push: true,
          flat: true,
        },
        cancel: {
          push: true,
          flat: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(() => {
        emit('on-change-key', props.row)
      })
    }
    const onRemoveApi = (props) => {
      $q.dialog({
        class: 'text-bold',
        title: 'Remover API!?',
        message: 'Caso confirme a mesma será removida definitivamente!',
        ok: {
          push: true,
          flat: true,
        },
        cancel: {
          push: true,
          flat: true,
          color: 'negative',
        },
        persistent: true,
      }).onOk(() => {
        emit('on-remove', props.row)
      })
    }
    return {
      columns,
      compFilter,
      compPagination,
      onRequest,
      onSync,
      onChangeApiKey,
      onRemoveApi,
    }
  },
}
</script>
