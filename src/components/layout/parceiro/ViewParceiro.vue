<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field
        dense
        filled
        :label="
          cmpParceiro.cpfCnpj && cmpParceiro.cpfCnpj.length === 11
            ? 'CPF'
            : 'CNPJ'
        "
        stack-label
        readonly
      >
        <template #before>
          <q-icon
            :name="
              cmpParceiro.cpfCnpj && cmpParceiro.cpfCnpj.length === 11
                ? 'fa-solid fa-user-tag'
                : 'fa-solid fa-building-flag'
            "
          />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ $filters.cpfCnpj(cmpParceiro.cpfCnpj) }}
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
            @click="copy(cmpParceiro.cpfCnpj)"
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
    <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
      <q-field dense filled label="Fantasia" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-building-ngo" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.fantasia }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
      <q-field dense filled label="Razão Social" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-pen-to-square" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.razaoSocial }}
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
            @click="copy(cmpParceiro.razaoSocial)"
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
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field
        dense
        filled
        label="IE"
        title="Inscrição estadual"
        stack-label
        readonly
      >
        <template #before>
          <q-icon name="fa-solid fa-flag" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.ie }}
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
            @click="copy(cmpParceiro.ie)"
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
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field dense filled label="CNAE Principal" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-file-invoice" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.cnae }}
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
            @click="copy(cmpParceiro.cnae)"
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
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-select
        v-model="cmpParceiro.cnaesSecundarios"
        filled
        name="cnae"
        use-chips
        dense
        use-input
        multiple
        emit-value
        map-options
        counter
        max-values="99"
        input-debounce="800"
        label="CNAE's Secundário's"
        :options="cmpCnaes"
        option-value="cnae"
        option-label="cnaeDescricao"
        readonly
      >
        <template #before>
          <q-icon name="fa-solid fa-file-invoice" />
        </template>
        <template #no-option>
          <q-item>
            <q-item-section class="text-grey"> Sem resultados </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
      <q-field
        dense
        filled
        label="Telefone"
        title="Telefone principal"
        stack-label
        readonly
      >
        <template #before>
          <q-icon name="fa-solid fa-phone" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.telefone }}
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
            @click="copy(cmpParceiro.telefone)"
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
    <div class="col-lg-6 col-md-6 col-xs-12 col-sm-12">
      <q-field
        dense
        filled
        label="Celular"
        title="Número de celular"
        stack-label
        readonly
      >
        <template #before>
          <q-icon name="fa-solid fa-mobile" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpParceiro.celular }}
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
            @click="copy(cmpParceiro.celular)"
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
</template>

<script>
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import {
  Contabilidade,
  PessoaJuridica,
  PessoaFisica,
} from '../../../models/Parceiro'

export default {
  name: 'ViewParceiro',
  props: {
    parceiro: {
      required: false,
      type: [PessoaJuridica, PessoaFisica, Contabilidade, Object],
      default: () => new PessoaJuridica(),
    },
    cnaes: {
      required: false,
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const cmpParceiro = computed(() => props.parceiro)
    const cmpCnaes = computed(() => props.cnaes)
    const { copy, isSupported } = useClipboard()
    return {
      cmpParceiro,
      cmpCnaes,
      isSupported,
      copy,
    }
  },
}
</script>
