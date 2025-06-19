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
            <h1 class="welcome-title">Crie sua conta no Fiscal Fácil! ✨</h1>
            <p class="welcome-subtitle">
              Siga os passos abaixo para se cadastrar e começar a descomplicar.
            </p>
          </div>
        </q-card-section>
        <q-card-section>
          <q-stepper
            ref="stepper"
            v-model="currentStep"
            animated
            flat
            contracted
            alternative-labels
            active-color="green-7"
            done-color="green-7"
            class="registration-stepper"
          >
            <q-step
              :name="1"
              title="Tipo e Documento"
              icon="fa-solid fa-gear"
              :done="currentStep > 1"
            >
              <div class="q-gutter-sm q-mb-md">
                <q-option-group
                  v-model="selectedType"
                  :options="[
                    { label: 'Contabilidade', value: 'contabilidade' },
                    { label: 'Pessoa Física', value: 'pessoaFisica' },
                    { label: 'Pessoa Jurídica', value: 'pessoaJuridica' },
                  ]"
                  color="green-7"
                  inline
                  @update:model-value="resetPartnerData"
                />
              </div>

              <q-input-mask
                v-if="selectedType === 'contabilidade'"
                v-model="v$.partnerRegistration.cpfCnpj.$model"
                outlined
                :label="cpfCnpjLabel"
                :mask="cpfCnpjMask"
                :error="v$.partnerRegistration.cpfCnpj.$error"
                :error-message="
                  v$.partnerRegistration.cpfCnpj.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                autofocus
                name="cpf-cnpj"
                @blur="v$.partnerRegistration.cpfCnpj.$touch"
              >
                <template
                  v-if="
                    isCompanyType &&
                    v$.partnerRegistration.cpfCnpj?.$model?.length === 14
                  "
                  #append
                >
                  <q-btn
                    flat
                    dense
                    round
                    icon="fa-solid fa-magnifying-glass"
                    :disable="isLoading"
                    @click="searchReceitaWS"
                  />
                  <q-spinner v-if="isLoading" color="primary" size="2em" />
                </template>
              </q-input-mask>
              <q-input
                v-else
                v-model="v$.partnerRegistration.cpfCnpj.$model"
                outlined
                :label="cpfCnpjLabel"
                name="cpfCnpj"
                :mask="isCompanyType ? '##.###.###/####-##' : '###.###.###-##'"
                unmasked-value
                :error="v$.partnerRegistration.cpfCnpj.$error"
                :error-message="
                  v$.partnerRegistration.cpfCnpj.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.cpfCnpj.$touch"
              >
                <template
                  v-if="
                    isCompanyType &&
                    v$.partnerRegistration.cpfCnpj.$model.length === 14
                  "
                  #append
                >
                  <q-btn
                    flat
                    dense
                    round
                    icon="fa-solid fa-magnifying-glass"
                    :disable="isLoading"
                    @click="searchReceitaWS"
                  />
                  <q-spinner v-if="isLoading" color="primary" size="2em" />
                </template>
              </q-input>
            </q-step>

            <q-step
              :name="2"
              title="Dados da Empresa"
              icon="fa-solid fa-building"
              :done="currentStep > 2"
            >
              <q-input
                v-model="v$.partnerRegistration.razaoSocial.$model"
                outlined
                label="Razão Social"
                class="q-mb-md"
                :error="v$.partnerRegistration.razaoSocial.$error"
                :error-message="
                  v$.partnerRegistration.razaoSocial.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.razaoSocial.$touch"
              />
              <q-input
                v-model="v$.partnerRegistration.fantasia.$model"
                outlined
                label="Nome Fantasia"
                class="q-mb-md"
                :error="v$.partnerRegistration.fantasia.$error"
                :error-message="
                  v$.partnerRegistration.fantasia.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.fantasia.$touch"
              />
              <q-input
                v-model="v$.partnerRegistration.telefone.$model"
                outlined
                label="Telefone Principal"
                mask="(##) #####-####"
                unmasked-value
                class="q-mb-md"
                :error="v$.partnerRegistration.telefone.$error"
                :error-message="
                  v$.partnerRegistration.telefone.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.telefone.$touch"
              />
              <q-input
                v-model="v$.partnerRegistration.telefoneSecundario.$model"
                outlined
                label="Telefone Secundário (Opcional)"
                mask="(##) #####-####"
                unmasked-value
                class="q-mb-md"
                :error="v$.partnerRegistration.telefoneSecundario.$error"
                :error-message="
                  v$.partnerRegistration.telefoneSecundario.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.telefoneSecundario.$touch"
              />

              <q-input
                v-if="isCompanyType"
                v-model="v$.partnerRegistration.cnaeId.$model"
                outlined
                label="CNAE Principal"
                class="q-mb-md"
                :error="v$.partnerRegistration.cnaeId.$error"
                :error-message="
                  v$.partnerRegistration.cnaeId.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.cnaeId.$touch"
              />
              <q-input
                v-if="isCompanyType"
                v-model="partnerRegistration.cnaeDescricao"
                outlined
                label="Descrição CNAE"
                readonly
                class="q-mb-md"
              />
              <q-input
                v-if="
                  selectedType === 'pessoaFisica' ||
                  selectedType === 'pessoaJuridica'
                "
                v-model="v$.partnerRegistration.ie.$model"
                outlined
                label="Inscrição Estadual (IE)"
                class="q-mb-md"
                :error="v$.partnerRegistration.ie.$error"
                :error-message="
                  v$.partnerRegistration.ie.$errors
                    .map((e) => e.$message)
                    .join(', ')
                "
                lazy-rules
                @blur="v$.partnerRegistration.ie.$touch"
              />
            </q-step>

            <q-step
              :name="3"
              title="Endereço"
              icon="fa-solid fa-location-dot"
              :done="currentStep > 3"
            >
              <address-form
                ref="addressFormComponent"
                v-model="partnerRegistration.address"
              />
            </q-step>

            <q-step
              :name="4"
              title="Dados do Usuário"
              icon="fa-solid fa-user"
              :done="currentStep > 4"
            >
              <user-registration-form
                ref="userFormComponent"
                v-model="partnerRegistration.user"
              />
            </q-step>

            <template #navigation>
              <q-stepper-navigation class="q-pt-md text-center">
                <q-btn
                  v-if="currentStep > 1"
                  flat
                  size="lg"
                  color="green-7"
                  label="Anterior"
                  class="q-ml-sm"
                  @click="stepper.previous()"
                />
                <q-btn
                  v-if="currentStep < 4"
                  size="lg"
                  color="green-7"
                  label="Próximo"
                  class="q-ml-sm"
                  @click="nextStep"
                />
                <q-btn
                  v-if="currentStep === 4"
                  size="lg"
                  color="green-7"
                  label="Cadastrar"
                  class="q-ml-sm"
                  @click="submitRegistration"
                />
              </q-stepper-navigation>
            </template>
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
  </q-page>
</template>

<script>
import { ref, computed, watch, reactive, onMounted } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { useQuasar } from 'quasar'

import {
  ContabilidadeRegistration,
  PessoaFisicaRegistration,
  PessoaJuridicaRegistration,
  ContabilidadeValidation,
  PessoaFisicaValidation,
  PessoaJuridicaValidation,
} from '@/models/partner'

import QInputMask from '@/components/QInputMask.vue'
import AddressForm from '@/components/AddressForm.vue'
import UserRegistrationForm from '@/components/partner/UserRegistrationForm.vue'
import CustomLink from '@/components/CustomLink.vue'

// Assets
import logoDefault from '../../assets/fiscal-facil.svg?url'
import logoDark from '../../assets/fiscal-facil-dark.svg?url'

export default {
  name: 'PartnerRegistrationComponent',
  components: {
    QInputMask,
    AddressForm,
    UserRegistrationForm,
    CustomLink,
  },
  setup() {
    // Refs de Componente
    const addressFormComponent = ref(null)
    const userFormComponent = ref(null)
    const stepper = ref(null)
    const docType = ref('')

    // Estado Reativo
    const currentStep = ref(1)
    const selectedType = ref('pessoaJuridica')
    const partnerRegistration = ref(null)
    const isLoading = ref(false)
    const showWelcomeAnimation = ref(false)

    // Hooks de Bibliotecas
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

    // Propriedades Computadas
    const cpfCnpjLabel = computed(() => {
      if (docType.value === 'cpf') {
        return 'CPF'
      } else if (docType.value === 'cnpj') {
        return 'CNPJ'
      }
      return 'CPF/CNPJ'
    })

    // Propriedade computada para a máscara do input
    const cpfCnpjMask = computed(() => {
      if (selectedType.value === 'pessoaFisica') {
        return '000.000.000-00' // Agora retorna um array mesmo para uma única máscara
      } else if (selectedType.value === 'pessoaJuridica') {
        return '00.000.000/0000-00' // Retorna array
      }
      // Para Contabilidade ou tipo não selecionado (detecção automática)
      return [
        {
          mask: '000.000.000-00', // CPF
        },
        {
          mask: '00.000.000/0000-00', // CNPJ
        },
      ]
    })
    console.log('cpfCnpjMask', cpfCnpjMask.value)

    const isCompanyType = computed(() => {
      return (
        selectedType.value === 'contabilidade' ||
        selectedType.value === 'pessoaJuridica'
      )
    })

    const validationRules = computed(() => {
      switch (selectedType.value) {
        case 'contabilidade':
          return { partnerRegistration: ContabilidadeValidation }
        case 'pessoaFisica':
          return { partnerRegistration: PessoaFisicaValidation }
        case 'pessoaJuridica':
          return { partnerRegistration: PessoaJuridicaValidation }
        default:
          return {}
      }
    })

    // Vuelidate
    const v$ = useVuelidate(validationRules, { partnerRegistration })

    // Watcher
    watch(
      selectedType,
      (newType) => {
        if (newType) {
          switch (newType) {
            case 'contabilidade':
              partnerRegistration.value = reactive(
                new ContabilidadeRegistration()
              )
              docType.value = '' // Volta ao estado de detecção automática
              break
            case 'pessoaFisica':
              partnerRegistration.value = reactive(
                new PessoaFisicaRegistration()
              )
              docType.value = 'cpf' // CPF é fixo para Pessoa Física
              break
            case 'pessoaJuridica':
              partnerRegistration.value = reactive(
                new PessoaJuridicaRegistration()
              )
              docType.value = 'cnpj' // CNPJ é fixo para Pessoa Jurídica
              break
          }
          v$.value.$reset()
        }
      },
      { immediate: true }
    )

    onMounted(() => {
      setTimeout(() => {
        showWelcomeAnimation.value = true
      }, 300)
    })

    function resetPartnerData() {
      if (partnerRegistration.value?.reset) {
        partnerRegistration.value.reset()
      }
      docType.value = ''
      v$.value.$reset()
    }

    async function nextStep() {
      let isStepValid = false
      switch (currentStep.value) {
        case 1:
          isStepValid = await v$.value.partnerRegistration.cpfCnpj.$validate()
          break
        case 2:
          isStepValid = await v$.value.partnerRegistration.$validate([
            'razaoSocial',
            'fantasia',
            'telefone',
            // O CNAE e IE são condicionais, então precisamos ajustar a validação para eles
            ...(isCompanyType.value ? ['cnaeId'] : []), // Adiciona cnaeId se for tipo empresa
            ...(selectedType.value === 'pessoaFisica' ||
            selectedType.value === 'pessoaJuridica'
              ? ['ie']
              : []), // Adiciona ie se for PF ou PJ
          ])
          break
        case 3:
          if (addressFormComponent.value) {
            isStepValid = await addressFormComponent.value.validate()
          }
          break
      }

      if (isStepValid) {
        stepper.value.next()
      } else {
        $q.notify({
          type: 'negative',
          message: 'Por favor, corrija os erros antes de prosseguir.',
          position: 'top',
        })
      }
    }

    async function searchReceitaWS() {
      // Sua lógica para buscar na Receita WS
      // Lembre-se de usar partnerRegistration.value.cpfCnpj (já unmasked)
      // E atualizar os campos do partnerRegistration com os dados da Receita WS
      isLoading.value = true
      try {
        // Exemplo de lógica (substitua pela sua API)
        console.log(`Buscando CNPJ: ${partnerRegistration.value.cpfCnpj}`)
        // Simulação de delay de API
        await new Promise((resolve) => setTimeout(resolve, 1500))
        // Preencher dados (exemplo)
        if (partnerRegistration.value.cpfCnpj === '00000000000000') {
          partnerRegistration.value.razaoSocial = 'Empresa Teste LTDA'
          partnerRegistration.value.fantasia = 'Teste Fantasia'
          partnerRegistration.value.cnaeId = '6201601' // Exemplo CNAE
          partnerRegistration.value.cnaeDescricao =
            'Desenvolvimento de programas de computador'
          partnerRegistration.value.address.cep = '78600000' // Exemplo de CEP
          partnerRegistration.value.address.logradouro = 'Rua Exemplo'
          partnerRegistration.value.address.numero = '123'
          partnerRegistration.value.address.bairro = 'Centro'
          partnerRegistration.value.address.cidade = 'Barra do Garças'
          partnerRegistration.value.address.estado = 'MT'
          $q.notify({
            type: 'positive',
            message: 'Dados preenchidos com sucesso!',
          })
        } else {
          $q.notify({
            type: 'warning',
            message: 'CNPJ não encontrado ou exemplo inválido.',
          })
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao buscar dados da Receita WS.',
        })
        console.error('Erro Receita WS:', error)
      } finally {
        isLoading.value = false
      }
    }

    async function submitRegistration() {
      // Validar todos os passos antes de submeter
      const isStep1Valid =
        await v$.value.partnerRegistration.cpfCnpj.$validate()
      let isStep2Valid = true // Assume true e valida condicionalmente
      if (currentStep.value >= 2) {
        isStep2Valid = await v$.value.partnerRegistration.$validate([
          'razaoSocial',
          'fantasia',
          'telefone',
          ...(isCompanyType.value ? ['cnaeId'] : []),
          ...(selectedType.value === 'pessoaFisica' ||
          selectedType.value === 'pessoaJuridica'
            ? ['ie']
            : []),
        ])
      }
      let isStep3Valid = true
      if (currentStep.value >= 3 && addressFormComponent.value) {
        isStep3Valid = await addressFormComponent.value.validate()
      }
      let isStep4Valid = true
      if (currentStep.value >= 4 && userFormComponent.value) {
        isStep4Valid = await userFormComponent.value.validate()
      }

      if (isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid) {
        // Lógica de envio do formulário
        console.log(
          'Dados do Parceiro para registro:',
          JSON.parse(JSON.stringify(partnerRegistration.value))
        )
        $q.notify({
          type: 'positive',
          message: 'Registro submetido com sucesso!',
          position: 'top',
        })
        // Aqui você faria a chamada à API para registrar o parceiro
      } else {
        $q.notify({
          type: 'negative',
          message: 'Por favor, corrija todos os erros antes de cadastrar.',
          position: 'top',
        })
      }
    }

    return {
      // Estado
      currentStep,
      selectedType,
      partnerRegistration,
      isLoading,
      v$,

      // Refs de Componente
      stepper,
      addressFormComponent,
      userFormComponent,
      logoTheme,
      showWelcomeAnimation,

      // Computeds
      cpfCnpjLabel,
      cpfCnpjMask,
      isCompanyType,

      // Métodos
      resetPartnerData,
      nextStep,
      searchReceitaWS,
      submitRegistration,
    }
  },
}
</script>

<style lang="scss" scoped>
.logo-container.animate-fade-in {
  animation: animate-fade-in 0.6s ease forwards;
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

.login-actions {
  padding: 0 24px 24px;
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

.registration-stepper {
  background: transparent;
  box-shadow: none;
  border-radius: 0;
  padding: 0;

  .q-stepper__header {
    background: transparent;
    margin-bottom: 24px;
    padding: 0 24px;
  }

  .q-stepper__content {
    padding: 0 24px 24px;
  }
}

@media (max-width: $breakpoint-xs-max) {
  // Ajustes específicos para mobile se necessário, mantendo os que já estavam aqui.
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
