<template>
  <q-page class="full-page-layout bg-gradient-teal-cyan">
    <div
      class="layout-blob-decoration layout-blob-decoration--green layout-blob-decoration--lg-blur"
      style="
        width: 300px;
        height: 300px;
        top: -50px;
        left: -50px;
        animation-delay: 0s;
      "
    />
    <div
      class="layout-blob-decoration layout-blob-decoration--blue layout-blob-decoration--lg-blur"
      style="
        width: 400px;
        height: 400px;
        bottom: -100px;
        right: -100px;
        animation-delay: 2s;
      "
    />
    <div
      class="layout-blob-decoration layout-blob-decoration--amber layout-blob-decoration--lg-blur"
      style="
        width: 250px;
        height: 250px;
        top: 50%;
        left: 20%;
        transform: translateY(-50%);
        animation-delay: 4s;
      "
    />
    <div class="content-container content-container--wide">
      <q-form novalidate @submit.prevent="handleFormSubmit">
        <q-card
          class="app-card-frosted"
          :class="{ 'app-card-frosted--loading': isLoading }"
        >
          <q-card-section class="login-header">
            <div
              class="logo-container"
              :class="{ 'animate-fade-in': showWelcomeAnimation }"
            >
              <img
                :src="logoTheme.src"
                :alt="logoTheme.alt"
                :width="logoTheme.width"
                class="logo"
                loading="eager"
                fetchpriority="high"
              />
            </div>

            <div
              class="welcome-text"
              :class="{ 'animate-slide-up': showWelcomeAnimation }"
            >
              <h1 class="welcome-title">Bem-vindo ao Fiscal Fácil! 👋</h1>
              <p class="welcome-subtitle">
                Faça login na sua conta e comece descomplicar
              </p>
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-sm items-center">
              <div class="col-12">
                <q-input
                  v-model="state.userLogin.email"
                  outlined
                  stack-label
                  name="email"
                  spellcheck="true"
                  type="email"
                  maxlength="320"
                  hint="Ex.: joao@example.com"
                  autofocus
                  :error-message="v$.userLogin.email?.$errors[0]?.$message"
                  :error="
                    v$.userLogin.email.$invalid && v$.userLogin.email.$dirty
                  "
                  :loading="isLoading"
                  label="E-mail *"
                  @blur="v$.userLogin.email.$touch()"
                  @keyup.enter="handleEmailEnter"
                >
                  <template #prepend>
                    <q-icon name="fa-solid fa-at" />
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  v-model="state.userLogin.password"
                  outlined
                  stack-label
                  name="password"
                  :type="inputType"
                  :error-message="
                    v$.userLogin.password?.$errors[0]?.$message ?? ''
                  "
                  :error="
                    v$.userLogin.password.$invalid &&
                    v$.userLogin.password.$dirty
                  "
                  :loading="isLoading"
                  maxlength="14"
                  autocorrect="off"
                  autocapitalize="off"
                  autocomplete="off"
                  spellcheck="false"
                  label="Senha"
                  @blur="v$.userLogin.password.$touch()"
                  @keyup.enter="handlePasswordEnter"
                >
                  <template #prepend>
                    <q-icon name="fa-solid fa-user-shield" />
                  </template>
                  <template #append>
                    <q-btn
                      :icon="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                      flat
                      round
                      dense
                      size="sm"
                      :title="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
                      @click="togglePasswordVisibility"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-6">
                <q-checkbox
                  v-model="rememberMe"
                  label="Lembrar-me"
                  color="green-7"
                  :disable="isLoading"
                />
              </div>
              <div class="col-6 text-right">
                <column-edit
                  color="green-7"
                  icon="fa-solid fa-key"
                  @click="onShowDialogResetPassword"
                >
                  Esqueceu a senha?
                </column-edit>
              </div>
            </div>
          </q-card-section>

          <q-card-actions class="login-actions">
            <q-btn
              type="submit"
              color="green-7"
              size="lg"
              :loading="isLoading"
              :disable="v$.userLogin.$invalid"
              class="auth-btn auth-btn--green"
              no-caps
            >
              <span v-if="!isLoading">Entrar</span>
              <span v-else>Entrando...</span>
            </q-btn>

            <q-separator class="q-my-md" />

            <div class="signup-section">
              <p class="signup-text">
                Não é parceiro?
                <custom-link to="/registration" color="green-7">
                  Faça seu cadastro
                </custom-link>
              </p>
            </div>
          </q-card-actions>
        </q-card>
      </q-form>
    </div>
    <dialog-reset-password
      :dialog-visible="dialogResetPassword"
      :email="emailResetPassword"
      @update:dialog-visible="dialogResetPassword = $event"
      @update:email="emailResetPassword = $event"
      @send-email="sendEmailResetPassword"
      @reset-email="onResetEmailResetPassword"
    >
    </dialog-reset-password>
  </q-page>
</template>

<script>
import {
  defineComponent,
  reactive,
  computed,
  ref,
  onMounted,
  provide,
} from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import useVuelidate from '@vuelidate/core'
import {
  EmailValidation,
  UserLogin,
  UserLoginValidation,
} from '../../models/user'
import { notifyError, notifySuccess } from '../../plugins/notify'

// Components
import CustomLink from '../../components/CustomLink.vue'
import ColumnEdit from '../../components/ColumnEdit.vue'
import DialogResetPassword from './DialogResetPassword.vue'

// Assets
import logoDefault from '../../assets/fiscal-facil.svg?url'
import logoDark from '../../assets/fiscal-facil-dark.svg?url'
import { storeToRefs } from 'pinia'

/**
 * LoginPage component
 */
export default defineComponent({
  name: 'LoginPage',
  components: {
    CustomLink,
    ColumnEdit,
    DialogResetPassword,
  },
  setup() {
    const userStore = useUserStore()
    const { rememberMe, rememberEmail, isLoading } = storeToRefs(userStore)

    const $q = useQuasar()
    // Logo theme
    const logoTheme = computed(() => {
      const width = $q.platform.is.desktop
        ? 120
        : Math.min(window.innerWidth * 0.4, 200)
      return {
        src: $q.dark.isActive ? logoDark : logoDefault,
        alt: $q.dark.isActive ? 'logo-ff-dark' : 'logo-ff',
        width,
      }
    })

    // Reactive state
    const showWelcomeAnimation = ref(false)
    const emailResetPassword = ref(rememberEmail.value)
    const showPassword = ref(false)
    const dialogResetPassword = ref(false)
    const state = reactive({
      userLogin: new UserLogin(rememberEmail.value),
    })
    // Rules for Vuelidate
    const rulesForgotPassword = computed(() => EmailValidation)
    const rulesLogin = computed(() => {
      return {
        userLogin: UserLoginValidation,
      }
    })
    // Vuelidate state
    const v$ = useVuelidate(rulesLogin, state)
    const emailResetPassword$ = useVuelidate(
      rulesForgotPassword,
      emailResetPassword
    )
    provide('vuelidate', emailResetPassword$)

    const inputType = computed(() => (showPassword.value ? 'text' : 'password'))

    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    const router = useRouter()
    /**
     * Authenticate user
     * @async
     * @returns {Promise<Object>}
     */
    const authenticate = async () => {
      if (isLoading.value) return

      // Validate form
      v$.value.userLogin.$touch()
      if (v$.value.userLogin.$invalid) {
        notifyError(
          'Por favor, corrija os erros no formulário antes de continuar.'
        )
        return
      }
      if (await userStore.login(state.userLogin)) {
        notifySuccess('Login realizado com sucesso! Redirecionando...')
        // Add a small delay for better UX
        setTimeout(() => {
          router.push({ name: 'dashboard' })
        }, 1000)
      }
    }

    /**
     * Handle form submit
     * @returns {void}
     */
    const handleFormSubmit = () => {
      authenticate()
    }

    /**
     * Handle email enter
     * @returns {void}
     */
    const handleEmailEnter = () => {
      // Focus password field when enter is pressed on email
      const passwordInput = document.querySelector('input[name="password"]')
      if (passwordInput) {
        passwordInput.focus()
      }
    }

    /**
     * Handle password enter
     * @returns {void}
     */
    const handlePasswordEnter = () => {
      // Submit form when enter is pressed on password
      if (!v$.value.userLogin.$invalid) {
        authenticate()
      }
    }

    /**
     * Show reset password dialog
     * @returns {void}
     */
    const onShowDialogResetPassword = () => {
      emailResetPassword.value =
        state.userLogin.email || emailResetPassword.value
      dialogResetPassword.value = true
    }

    /**
     * Envia e-mail de redefinição de senha para o e-mail informado.
     * @returns {Promise<void>}
     */
    const sendEmailResetPassword = async () => {
      // Example of commented out logic, keeping it here as it was.
      // loading.value = true
      // await usuarioService.sendEmailResetPassword(emailResetPassword.value)
      // notifySuccess(
      //   `Solicitação de redefinição de senha enviada por e-mail! \nEndereço: ${emailResetPassword.value}`
      // )
      // onResetEmailResetPassword()
    }

    /**
     * Reset email reset password state
     * @description
     * This function reset the email reset password state.
     * It sets the emailResetPassword to empty string, reset the vuelidate state
     * and hides the dialog.
     * @returns {void}
     */
    const onResetEmailResetPassword = () => {
      emailResetPassword.value = ''
      emailResetPassword$.value.$reset()
      dialogResetPassword.value = false
    }

    // Lifecycle
    onMounted(() => {
      // Add welcome animation
      setTimeout(() => {
        showWelcomeAnimation.value = true
      }, 300)
    })
    return {
      logoTheme,
      isLoading,
      showWelcomeAnimation,
      rememberMe,
      rememberEmail,
      emailResetPassword,
      showPassword,
      dialogResetPassword,
      state,
      v$,
      inputType,
      togglePasswordVisibility,
      authenticate,
      handleFormSubmit,
      handleEmailEnter,
      handlePasswordEnter,
      onShowDialogResetPassword,
      sendEmailResetPassword,
      onResetEmailResetPassword,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/quasar-variables.scss'; // Garante que as variáveis do Quasar estejam disponíveis

.content-container {
  width: 100%;
  max-width: 450px; /* Default max-width for smaller screens */
  margin: 0 auto; /* Center the container */
  padding: 16px; /* Add some padding for smaller screens */

  &--wide {
    @media (min-width: $breakpoint-md-min) {
      // Apply on medium and larger screens (desktop)
      max-width: 450px; // Adjust this value to your desired desktop width
      padding: 0; // Remove padding if not needed on desktop
    }
  }
}

// Estilos específicos para o wrapper do formulário nesta página
.form-container {
  width: 100%;

  &--loading {
    pointer-events: none; // Desabilita interações quando carregando
  }
}

// Animações que são específicas desta página de Login
@keyframes animate-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes animate-slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container.animate-fade-in {
  animation: animate-fade-in 0.6s ease forwards;
}

.welcome-text.animate-slide-up {
  animation: animate-slide-up 0.6s ease 0.2s forwards;
}

// Melhorias de foco para inputs do Quasar neste componente
:deep(.q-field--focused) {
  .q-field__control {
    box-shadow: 0 0 0 2px rgba(33, 186, 69, 0.2) !important;
  }
}

// Melhorias de estado de erro para inputs do Quasar neste componente
:deep(.q-field--error) {
  .q-field__control {
    box-shadow: 0 0 0 2px rgba(193, 0, 21, 0.2) !important;
  }
}

// Estilos específicos para ações de login e seção de cadastro
.login-actions {
  .auth-btn.auth-btn--green {
    width: 100%;
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 4px 12px rgba(33, 186, 69, 0.3);
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(33, 186, 69, 0.4);
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  .signup-section {
    text-align: center;
    width: 100%;

    .signup-text {
      margin: 0;
      color: #7f8c8d;
      font-size: 14px;

      .body--dark & {
        color: #bdc3c7;
      }
    }
  }
}

@media (max-width: 480px) {
  .login-actions {
    padding: 0 20px 20px;
  }
}
</style>
