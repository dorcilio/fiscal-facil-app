<template>
  <q-dialog
    v-model="dialogStatus"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="q-popup-edit dialog-size">
      <div class="q-dialog__title q-mt-sm q-mb-sm">
        Redefinição de Senha
        <q-btn
          v-close-popup
          class="float-right"
          icon="fa-solid fa-xmark"
          flat
          round
          dense
        />
      </div>
      <q-form
        autocorrect="on"
        autocapitalize="on"
        autocomplete="on"
        spellcheck="true"
        @submit="onSend"
        @reset="onReset"
      >
        <div class="row q-col-gutter-sm">
          <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <q-input
              v-model="emailResetPassword"
              filled
              name="email"
              spellcheck="true"
              type="email"
              maxlength="320"
              hint="Ex.: joao@exemplo.com"
              autofocus
              :error-message="emailResetPassword$?.$errors[0]?.$message ?? ''"
              :error="
                emailResetPassword$.$invalid && emailResetPassword$.$dirty
              "
              label="E-mail *"
              @blur="emailResetPassword$.$touch()"
            >
              <template #before>
                <q-icon name="fa-solid fa-at" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="q-pt-md" align="right">
          <q-btn
            type="reset"
            label="Cancelar"
            flat
            title="Cancelar redefinição"
            color="negative"
            icon="fa-solid fa-xmark"
          />
          <q-btn
            type="submit"
            label="Solicitar"
            flat
            title="Enviar e-mail de redefinição"
            color="primary"
            icon="fa-solid fa-paper-plane"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent, inject } from 'vue'
import { EmailValidation } from '../../models/user'
import useVuelidate from '@vuelidate/core'
export default defineComponent({
  name: 'DialogResetPassword',
  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
    },
    email: {
      required: true,
      type: String,
    },
  },
  emits: ['update:dialog-visible', 'update:email', 'send-email', 'reset-email'],
  setup(props, { emit }) {
    const rulesForgotPassword = computed(() => EmailValidation)

    const dialogStatus = computed({
      get() {
        return props.dialogVisible
      },
      set(value) {
        emit('update:dialog-visible', value)
      },
    })

    const emailResetPassword = computed({
      get() {
        return props.email
      },
      set(value) {
        emit('update:email', value)
      },
    })

    const emailResetPassword$ = inject(
      'vuelidate',
      useVuelidate(rulesForgotPassword, emailResetPassword)
    )

    const onReset = () => {
      emit('reset-email')
    }
    const onSend = () => {
      if (!emailResetPassword$.value.$invalid) emit('send-email')
    }
    return {
      dialogStatus,
      emailResetPassword,
      emailResetPassword$,
      onReset,
      onSend,
    }
  },
})
</script>

<style lang="scss" scoped>
.dialog-size {
  min-width: 30% !important;
}
</style>
