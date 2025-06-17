<template>
  <q-page class="auth-page">
    <div class="auth-background">
      <!-- Background decorative elements -->
      <div class="bg-decoration bg-decoration--1" />
      <div class="bg-decoration bg-decoration--2" />
      <div class="bg-decoration bg-decoration--3" />
    </div>

    <div class="auth-container">
      <q-form
        :class="formClasses"
        novalidate
        @submit.prevent="handleFormSubmit"
      >
        <q-card class="auth-card" :class="{ 'auth-card--loading': isLoading }">
          <!-- Header Section -->
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

          <!-- Form Section -->
          <q-card-section>
            <div class="row q-col-gutter-sm items-center">
              <!-- Email Input -->
              <div class="col-12">
                <q-input
                  v-model="state.userLogin.email"
                  filled
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

              <!-- Password Input -->
              <div class="col-12">
                <q-input
                  v-model="state.userLogin.password"
                  filled
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

              <!-- Remember Me & Forgot Password -->
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

          <!-- Actions Section -->
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
                <custom-link to="/cadastro" color="green-7">
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
      @send:email="sendEmailResetPassword"
      @reset:email="onResetEmailResetPassword"
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

    const formClasses = computed(() => ({
      'form-container': true,
      'form-container--mobile': $q.platform.is.mobile,
      'form-container--desktop': !$q.platform.is.mobile,
      'form-container--loading': isLoading.value,
    }))

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
      formClasses,
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
@import '../../styles/quasar-variables.scss';
.form-container {
  width: 100%;

  &--mobile {
    .auth-card {
      border-radius: 20px 20px 20px 20px;
    }
  }

  &--desktop {
    .auth-card {
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    }
  }

  &--loading {
    pointer-events: none;
  }
}

.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &--loading {
    opacity: 0.8;
  }

  .body--dark & {
    background: rgba(24, 35, 52, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.login-header {
  text-align: center;
  padding: 32px 24px 24px;

  .logo-container {
    margin-bottom: 24px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;

    &.animate-fade-in {
      opacity: 1;
      transform: translateY(0);
    }

    .logo {
      max-width: 100%;
      height: auto;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
  }

  .welcome-text {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease 0.2s;

    &.animate-slide-up {
      opacity: 1;
      transform: translateY(0);
    }

    .welcome-title {
      font-size: 24px;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 8px 0;
      line-height: 1.3;

      .body--dark & {
        color: #ecf0f1;
      }
    }

    .welcome-subtitle {
      font-size: 15px;
      color: #7f8c8d;
      margin: 0;
      line-height: 1.4;

      .body--dark & {
        color: #bdc3c7;
      }
    }
  }
}

.login-actions {
  padding: 0 24px 24px;
  flex-direction: column;

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

.partner-section {
  text-align: center;
  padding: 16px 24px;
  background: rgba(0, 0, 0, 0.02);

  .body--dark & {
    background: rgba(255, 255, 255, 0.02);
  }

  .partner-text {
    margin: 0;
    color: #7f8c8d;
    font-size: 14px;

    .body--dark & {
      color: #bdc3c7;
    }
  }
}

// Animations
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: 480px) {
  .auth-form {
    padding: 0 20px 20px;
  }

  .login-actions {
    padding: 0 20px 20px;
  }

  .partner-section {
    padding: 16px 20px;
  }
}

// Loading state improvements
.q-form {
  transition: opacity 0.3s ease;
}

// Focus improvements
:deep(.q-field--focused) {
  .q-field__control {
    box-shadow: 0 0 0 2px rgba(33, 186, 69, 0.2) !important;
  }
}

// Error state improvements
:deep(.q-field--error) {
  .q-field__control {
    box-shadow: 0 0 0 2px rgba(193, 0, 21, 0.2) !important;
  }
}
</style>
