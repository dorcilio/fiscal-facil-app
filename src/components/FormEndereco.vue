<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.cep"
        filled
        name="cep"
        type="tel"
        mask="#####-###"
        unmasked-value
        maxlength="9"
        hint="Ex.: 78635-000"
        :loading="compLoading"
        :error-message="v$.endereco.cep?.$errors[0]?.$message ?? ''"
        :error="v$.endereco.cep.$invalid && v$.endereco.cep.$dirty"
        label="CEP *"
        @blur="v$.endereco.cep.$touch()"
        @update:model-value="searchByCEP"
      >
        <template #before>
          <q-icon name="fa-solid fa-map-location-dot" />
        </template>
        <template #append>
          <q-icon name="fa-brands fa-searchengin" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.logradouro"
        filled
        autogrow
        name="logradouro"
        maxlength="60"
        hint="Ex.: Av. Júlio Campos"
        :error-message="v$.endereco.logradouro?.$errors[0]?.$message ?? ''"
        :error="
          v$.endereco.logradouro.$invalid && v$.endereco.logradouro.$dirty
        "
        label="Logradouro *"
        @blur="v$.endereco.logradouro.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-road" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.numero"
        v-numeric
        filled
        name="numero"
        type="tel"
        hint="Ex.: 2222"
        :error-message="v$.endereco.numero?.$errors[0]?.$message ?? ''"
        :error="v$.endereco.numero.$invalid && v$.endereco.numero.$dirty"
        label="Número"
        @blur="v$.endereco.numero.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-map-location-dot" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-8 col-md-8 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.bairro"
        filled
        name="bairro"
        type="text"
        maxlength="60"
        hint="Ex.: Centro"
        :error-message="v$.endereco.bairro?.$errors[0]?.$message ?? ''"
        :error="v$.endereco.bairro.$invalid && v$.endereco.bairro.$dirty"
        label="Bairro *"
        @blur="v$.endereco.bairro.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-signs-post" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-5 col-md-5 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.municipio"
        filled
        readonly
        name="municipio"
        type="text"
        hint="Ex.: Água Boa"
        :error-message="v$.endereco.municipio?.$errors[0]?.$message ?? ''"
        :error="v$.endereco.municipio.$invalid && v$.endereco.municipio.$dirty"
        label="Município *"
        @blur="v$.endereco.municipio.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-map-pin" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-3 col-md-3 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.uf"
        filled
        readonly
        name="uf"
        type="text"
        hint="Ex.: MT"
        :error-message="v$.endereco.uf?.$errors[0]?.$message ?? ''"
        :error="v$.endereco.uf.$invalid && v$.endereco.uf.$dirty"
        label="UF *"
        @blur="v$.endereco.uf.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-map" />
        </template>
      </q-input>
    </div>
    <div class="col-lg-4 col-md-4 col-xs-12 col-sm-12">
      <q-input
        v-model="state.endereco.complemento"
        filled
        name="complemento"
        type="text"
        hint="Ex.: Casa de esquina"
        :error-message="v$.endereco.complemento?.$errors[0]?.$message ?? ''"
        :error="
          v$.endereco.complemento.$invalid && v$.endereco.complemento.$dirty
        "
        label="Complemento"
        @blur="v$.endereco.complemento.$touch()"
      >
        <template #before>
          <q-icon name="fa-solid fa-house" />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script>
import { reactive, computed, inject } from 'vue'
import { Endereco, EnderecoValidation } from '../models/Endereco'
import useVuelidate from '@vuelidate/core'
export default {
  name: 'FormEndereco',
  props: {
    endereco: {
      required: false,
      type: [Endereco, Object],
      default: () => new Endereco(),
    },
    loading: {
      required: false,
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['search:endereco'],
  setup(props, { emit }) {
    const rules = computed(() => {
      return {
        endereco: EnderecoValidation,
      }
    })

    const endereco = computed(() => props.endereco)
    const compLoading = computed(() => props.loading)
    const state = reactive({
      endereco: endereco.value,
    })

    const searchByCEP = (value) => {
      emit('search:endereco', value)
    }

    const v$ = inject('vuelidate', useVuelidate(rules, state))
    return {
      compLoading,
      state,
      searchByCEP,
      v$,
    }
  },
}
</script>
