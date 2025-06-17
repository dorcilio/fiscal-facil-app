<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="CEP" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-map-location-dot" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ $filters.cep(cmpEndereco.cep) }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="Logradouro" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-road" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.logradouro }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="Número" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-map-location-dot" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.numero }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="Bairro" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-signs-post" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.bairro }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-5 col-md-5 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="Município" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-map-pin" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.municipio }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-3 col-md-3 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="UF" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-map" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.uf }}
          </div>
        </template>
      </q-field>
    </div>
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-field :dense="dense" filled label="Complemento" stack-label readonly>
        <template #before>
          <q-icon name="fa-solid fa-house" />
        </template>
        <template #control>
          <div class="self-center full-width no-outline" tabindex="0">
            {{ cmpEndereco.complemento }}
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { Endereco } from '../models/Endereco'
export default {
  name: 'ViewEndereco',
  props: {
    endereco: {
      required: false,
      type: [Endereco, Object],
      default: () => new Endereco(),
    },
    dense: {
      required: false,
      type: [Boolean, String],
      default: false,
    },
  },
  setup(props) {
    const cmpEndereco = computed(() => props.endereco)

    return {
      cmpEndereco,
    }
  },
}
</script>
