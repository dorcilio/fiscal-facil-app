<script>
import { useRoute } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration'
import StepperNavigation from './StepperNavigation.vue'
import DocumentInput from './DocumentInput.vue'
import AddressForm from '@/components/common/AddressForm.vue'
import UserRegistrationForm from '@/components/common/UserRegistrationForm.vue'
import CompanyInfoForm from './CompanyInfoForm.vue'
import PersonalInfoForm from './PersonalInfoForm.vue'
import { notifyError, notifySuccess } from '@/plugins/notify'
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'RegistrationPage',
  components: {
    StepperNavigation,
    DocumentInput,
    AddressForm,
    UserRegistrationForm,
    CompanyInfoForm,
    PersonalInfoForm,
  },
  setup() {
    const route = useRoute()
    const store = useRegistrationStore()

    // Refs para os formulários aninhados (mantido como está)
    const userFormRef = ref(null)
    const personalInfoFormRef = ref(null)
    const companyInfoFormRef = ref(null)
    const addressFormRef = ref(null)

    // Animação de boas-vindas
    const showWelcomeAnimation = ref(false)

    // Mapeamento de computed properties para a store (ajustado para Composition API)
    const currentStep = computed({
      get: () => store.currentStep,
      set: (val) => {
        store.currentStep = val
      },
    })
    const registrationType = computed({
      get: () => store.registrationType,
      set: (val) => {
        store.setRegistrationType(val)
      },
    })
    const contabilidadeSubType = computed({
      get: () => store.contabilidadeSubType,
      set: (val) => {
        store.setContabilidadeSubType(val)
      },
    })
    const activeFormData = computed({
      get: () => {
        if (
          store.registrationType === 'Contabilidade' &&
          store.form &&
          store.form.data
        ) {
          return store.form.data
        }
        return store.form
      },
      set: (value) => {
        if (store.registrationType === 'Contabilidade' && store.form) {
          store.form.data = value
        } else {
          store.form = value
        }
      },
    })
    const userData = computed({
      get: () => store.form?.user,
      set: (value) => {
        if (store.form) store.form.user = value
      },
    })
    const addressData = computed({
      get: () => {
        if (
          store.registrationType === 'Contabilidade' &&
          store.form &&
          store.form.data
        ) {
          return store.form.data.address
        }
        return store.form ? store.form.address : null
      },
      set: (value) => {
        if (
          store.registrationType === 'Contabilidade' &&
          store.form &&
          store.form.data
        ) {
          store.form.data.address = value
        } else if (store.form) {
          store.address = value
        }
      },
    })

    // Watch para 'store.activeForm' pode ser mantido
    // No Vue 3 Composition API, watches são declarados dentro de setup
    // watch(() => store.activeForm, (newVal, oldVal) => {
    //   if (newVal && newVal !== oldVal && store.currentStep === 2) {
    //     if ((newVal.cnpj || newVal.cpf) && !store.error) {
    //       // Lógica de avanço aqui, se desejado.
    //     }
    //   }
    // }, { deep: true });

    onMounted(() => {
      const { registrationType, contabilidadeSubType } = route.query
      if (registrationType) {
        store.setRegistrationType(registrationType)
        if (contabilidadeSubType) {
          store.setContabilidadeSubType(contabilidadeSubType)
        }
      } else {
        notifyError('Tipo de registro não especificado na URL.')
      }
      // Ativar animação de boas-vindas após um pequeno atraso
      setTimeout(() => {
        showWelcomeAnimation.value = true
      }, 300)
    })

    const validateAndGoToNextStep = async () => {
      let isValid = true

      // STEP 1: Seleção do Tipo de Registro
      if (currentStep.value === 1) {
        if (!registrationType.value) {
          isValid = false
          notifyError('Selecione um tipo de registro para continuar.', null, {
            position: 'top',
          })
        }
        if (
          registrationType.value === 'Contabilidade' &&
          !contabilidadeSubType.value
        ) {
          isValid = false
          notifyError(
            'Selecione um subtipo de contabilidade (Pessoa Física ou Jurídica).',
            null,
            { position: 'top' }
          )
        }
      }

      // STEP 2: Documento (CPF/CNPJ)
      if (currentStep.value === 2) {
        if (
          !store.activeForm ||
          (!store.activeForm.cnpj && !store.activeForm.cpf)
        ) {
          isValid = false
          notifyError('Por favor, preencha o CPF/CNPJ.', null, {
            position: 'top',
          })
        } else if (store.error) {
          isValid = false
          notifyError(store.error, null, { position: 'top' })
        }
      }

      // STEP 3: Dados Pessoais / Dados da Empresa
      if (currentStep.value === 3) {
        if (
          store.contabilidadeSubType === 'PF' ||
          store.registrationType === 'PF'
        ) {
          if (personalInfoFormRef.value) {
            const personalValid = await personalInfoFormRef.value.v.$validate()
            if (!personalValid) {
              isValid = false
            }
          } else {
            isValid = false
            notifyError('Formulário de dados pessoais não encontrado.', null, {
              position: 'top',
            })
          }
        } else if (
          store.contabilidadeSubType === 'PJ' ||
          store.registrationType === 'PJ'
        ) {
          if (companyInfoFormRef.value) {
            const companyValid = await companyInfoFormRef.value.v.$validate()
            if (!companyValid) {
              isValid = false
            }
          } else {
            isValid = false
            notifyError(
              'Formulário de dados da empresa não encontrado.',
              null,
              { position: 'top' }
            )
          }
        }
      }

      // STEP 4: Endereço
      if (currentStep.value === 4) {
        if (addressFormRef.value) {
          const addressValid = await addressFormRef.value.v.$validate()
          if (!addressValid) {
            isValid = false
          }
        } else {
          isValid = false
          notifyError('Formulário de endereço não encontrado.', null, {
            position: 'top',
          })
        }
      }

      // STEP 5: Dados do Responsável (UserRegistrationForm)
      if (currentStep.value === 5) {
        if (userFormRef.value) {
          const userValid = await userFormRef.value.v.$validate()
          if (!userValid) {
            isValid = false
          } else {
            await store.submitRegistration()
            if (store.isSubmitted) {
              notifySuccess('Cadastro finalizado com sucesso!', {
                position: 'top',
              })
            } else if (store.error) {
              isValid = false
            }
          }
        } else {
          isValid = false
          notifyError('Formulário de dados de acesso não encontrado.', null, {
            position: 'top',
          })
        }
      }

      if (isValid && currentStep.value < store.totalSteps) {
        store.nextStep()
      }
    }

    const goToPreviousStep = () => {
      store.prevStep()
    }

    return {
      store,
      userFormRef,
      personalInfoFormRef,
      companyInfoFormRef,
      addressFormRef,
      currentStep,
      registrationType,
      contabilidadeSubType,
      activeFormData,
      userData,
      addressData,
      showWelcomeAnimation, // Expor para o template
      validateAndGoToNextStep,
      goToPreviousStep,
    }
  },
}
</script>

<template>
  <q-page class="auth-page">
    <div class="auth-background">
      <div class="bg-decoration bg-decoration--1" />
      <div class="bg-decoration bg-decoration--2" />
      <div class="bg-decoration bg-decoration--3" />
    </div>

    <div class="auth-container">
      <q-card
        class="auth-card"
        :class="{ 'auth-card--loading': store.isLoading }"
      >
        <q-card-section class="login-header">
          <div
            class="welcome-text"
            :class="{ 'animate-slide-up': showWelcomeAnimation }"
          >
            <h1 class="welcome-title">Crie sua conta no Fiscal Fácil! ✨</h1>
            <p class="welcome-subtitle">
              Siga os passos abaixo para se cadastrar e começar a descomplicar.
            </p>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-stepper
            ref="stepper"
            v-model="store.currentStep"
            animated
            flat
            contracted
            alternative-labels
            class="registration-stepper"
          >
            <q-step
              :name="1"
              title="Tipo de Registro"
              icon="fas fa-user-plus"
              :done="store.currentStep > 1"
            >
              <h5 class="text-h6 q-mb-md">
                Qual tipo de registro você deseja fazer?
              </h5>
              <q-option-group
                v-model="registrationType"
                :options="[
                  { label: 'Pessoa Física', value: 'PF' },
                  { label: 'Pessoa Jurídica', value: 'PJ' },
                  { label: 'Contabilidade', value: 'Contabilidade' },
                ]"
                color="primary"
                type="radio"
                inline
                class="q-mb-md"
              />

              <div v-if="registrationType === 'Contabilidade'">
                <h6 class="text-subtitle1 q-mb-sm">
                  Para quem é a contabilidade?
                </h6>
                <q-option-group
                  v-model="contabilidadeSubType"
                  :options="[
                    { label: 'Pessoa Física', value: 'PF' },
                    { label: 'Pessoa Jurídica', value: 'PJ' },
                  ]"
                  color="secondary"
                  type="radio"
                  inline
                  class="q-mb-md"
                />
              </div>
              <StepperNavigation
                :hide-prev="true"
                @next="validateAndGoToNextStep"
              />
            </q-step>

            <q-step
              :name="2"
              title="Documento"
              icon="fas fa-id-card"
              :done="store.currentStep > 2"
              :disable="!store.registrationType"
            >
              <DocumentInput
                v-if="store.activeForm"
                v-model="store.activeForm.doc"
                :doc-type="
                  store.registrationType === 'PF' ||
                  store.contabilidadeSubType === 'PF'
                    ? 'cpf'
                    : 'cnpj'
                "
                :is-loading="store.isLoading"
                @fetch-doc-data="store.fetchDocData"
              />
              <div v-if="store.error" class="text-negative q-mt-md">
                {{ store.error }}
              </div>
              <StepperNavigation
                @next="validateAndGoToNextStep"
                @prev="goToPreviousStep"
              />
            </q-step>

            <q-step
              :name="3"
              :title="
                store.registrationType === 'PF' ||
                store.contabilidadeSubType === 'PF'
                  ? 'Dados Pessoais'
                  : 'Dados da Empresa'
              "
              icon="fas fa-user-circle"
              :done="store.currentStep > 3"
              :disable="
                !store.activeForm || !store.activeForm.doc || store.error
              "
            >
              <PersonalInfoForm
                v-if="
                  store.registrationType === 'PF' ||
                  store.contabilidadeSubType === 'PF'
                "
                ref="personalInfoFormRef"
                v-model="activeFormData"
                :is-loading="store.isLoading"
              />
              <CompanyInfoForm
                v-else-if="
                  store.registrationType === 'PJ' ||
                  store.contabilidadeSubType === 'PJ'
                "
                ref="companyInfoFormRef"
                v-model="activeFormData"
                :is-loading="store.isLoading"
              />
              <StepperNavigation
                @next="validateAndGoToNextStep"
                @prev="goToPreviousStep"
              />
            </q-step>

            <q-step
              :name="4"
              title="Endereço"
              icon="fas fa-map-marker-alt"
              :done="store.currentStep > 4"
              :disable="!addressData"
            >
              <AddressForm
                ref="addressFormRef"
                v-model="addressData"
                :is-loading="store.isLoading"
              />
              <StepperNavigation
                @next="validateAndGoToNextStep"
                @prev="goToPreviousStep"
              />
            </q-step>

            <q-step
              :name="5"
              title="Dados de Acesso"
              icon="fas fa-user"
              :done="store.currentStep > 5"
              :disable="!userData"
            >
              <UserRegistrationForm
                ref="userFormRef"
                v-model="userData"
                :is-loading="store.isLoading"
              />
              <StepperNavigation
                @next="validateAndGoToNextStep"
                @prev="goToPreviousStep"
              />
            </q-step>

            <template #navigation> </template>
          </q-stepper>
        </q-card-section>

        <q-card-actions class="login-actions">
          <div class="signup-section">
            <p class="signup-text">
              Já tem uma conta?
              <custom-link to="/login" color="green-7">
                Faça seu login
              </custom-link>
            </p>
          </div>
        </q-card-actions>
      </q-card>
    </div>
    <q-inner-loading :showing="store.isLoading">
      <q-spinner-hourglass size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<style lang="scss" scoped>
@import '../../styles/quasar-variables.scss';

// Cores e tamanhos do layout geral de autenticação
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #e0f2f1 0%,
    #a7ffeb 100%
  ); /* Light teal/cyan gradient */

  .body--dark & {
    background: linear-gradient(
      135deg,
      #1a2a3a 0%,
      #0a1e3a 100%
    ); /* Darker blue gradient */
  }
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(80px); /* Increased blur for a softer effect */
  animation: float 10s ease-in-out infinite;

  &--1 {
    width: 300px;
    height: 300px;
    background-color: #4caf50; /* Green */
    top: -50px;
    left: -50px;
    animation-delay: 0s;
  }

  &--2 {
    width: 400px;
    height: 400px;
    background-color: #2196f3; /* Blue */
    bottom: -100px;
    right: -100px;
    animation-delay: 2s;
  }

  &--3 {
    width: 250px;
    height: 250px;
    background-color: #ffc107; /* Amber */
    top: 50%;
    left: 20%;
    transform: translateY(-50%);
    animation-delay: 4s;
  }

  .body--dark & {
    opacity: 0.2;
    filter: blur(60px);
    &--1 {
      background-color: #1abc9c;
    } /* Turquoise */
    &--2 {
      background-color: #3498db;
    } /* Peter River */
    &--3 {
      background-color: #f39c12;
    } /* Orange */
  }
}

.auth-container {
  z-index: 10;
  width: 100%;
  max-width: 800px; /* Ajustado para acomodar o stepper */
}

// Estilos do q-form no LoginPage, adaptado para q-card aqui
.auth-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px; /* Desktop default */
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); /* Desktop default */
  transition: all 0.3s ease;
  overflow: hidden; // Para garantir que o blur não vaze

  &--loading {
    opacity: 0.8;
    pointer-events: none; // Desabilita interações quando em loading
  }

  .body--dark & {
    background: rgba(24, 35, 52, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: $breakpoint-xs-max) {
    border-radius: 20px 20px 20px 20px; /* Mobile rounded corners */
    box-shadow: none; /* Mobile no extra shadow */
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

// Estilos para a seção de ações/rodapé do card (adaptado)
.login-actions {
  padding: 0 24px 24px; // Ajuste o padding conforme necessário
  flex-direction: column;

  .signup-section {
    text-align: center;
    width: 100%;
    margin-top: 16px; // Espaço acima da seção de cadastro

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

// Estilos para o Q-Stepper, para que ele se pareça com o conteúdo do Q-Card
.registration-stepper {
  background: transparent; /* Fundo transparente para que o q-card mostre seu fundo */
  box-shadow: none; /* Remove a sombra padrão do stepper */
  border-radius: 0; /* Remove border-radius do stepper para não conflitar com o card */
  padding: 0; // Remove o padding interno padrão do stepper

  .q-stepper__header {
    background: transparent; // Assegura que o cabeçalho do stepper seja transparente
    margin-bottom: 24px; // Espaço entre o cabeçalho e o conteúdo do passo
    padding: 0 24px; // Adiciona padding para alinhar com o card
  }

  .q-stepper__content {
    padding: 0 24px 24px; // Adiciona padding ao conteúdo de cada passo
  }

  // Melhora o feedback visual dos campos de input dentro do stepper
  :deep(.q-field--focused) {
    .q-field__control {
      box-shadow: 0 0 0 2px rgba(33, 186, 69, 0.2) !important;
    }
  }

  :deep(.q-field--error) {
    .q-field__control {
      box-shadow: 0 0 0 2px rgba(193, 0, 21, 0.2) !important;
    }
  }
}

// Animations (mantidas como no LoginPage)
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@media (max-width: $breakpoint-xs-max) {
  // Ajustes específicos para mobile se necessário
  .login-header {
    padding: 24px 16px 16px;
  }
  .registration-stepper {
    .q-stepper__header {
      padding: 0 16px;
    }
    .q-stepper__content {
      padding: 0 16px 16px;
    }
  }
  .login-actions {
    padding: 0 16px 16px;
  }
}
</style>
