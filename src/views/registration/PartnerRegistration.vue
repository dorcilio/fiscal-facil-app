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
          <q-form novalidate @submit.prevent="nextStep">
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
                  v-model="partnerRegistration.details.cpfCnpj"
                  outlined
                  :label="cpfCnpjLabel"
                  :mask="cpfCnpjMask"
                  :error="v$.details.cpfCnpj.$error"
                  :error-message="
                    v$.details.cpfCnpj.$errors.map((e) => e.$message).join(', ')
                  "
                  lazy-rules
                  autofocus
                  name="cpf-cnpj"
                  @blur="v$.details.cpfCnpj.$touch"
                >
                  <template
                    v-if="
                      isCompanyType &&
                      partnerRegistration.details.cpfCnpj.length === 14
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
                  v-model="partnerRegistration.details.cpfCnpj"
                  outlined
                  :label="cpfCnpjLabel"
                  name="cpfCnpj"
                  :mask="
                    isCompanyType ? '##.###.###/####-##' : '###.###.###-##'
                  "
                  unmasked-value
                  :error="v$.details.cpfCnpj.$error"
                  :error-message="
                    v$.details.cpfCnpj.$errors.map((e) => e.$message).join(', ')
                  "
                  lazy-rules
                  @blur="v$.details.cpfCnpj.$touch"
                >
                  <template
                    v-if="
                      isCompanyType &&
                      partnerRegistration.details.cpfCnpj.length === 14
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
                <partner-details-form
                  v-model="partnerRegistration.details"
                  :loading="isLoading"
                />
              </q-step>

              <q-step
                :name="3"
                title="Endereço"
                icon="fa-solid fa-location-dot"
                :done="currentStep > 3"
              >
                <address-form
                  v-model="partnerRegistration.address"
                  :loading="isLoading"
                />
              </q-step>

              <q-step
                :name="4"
                title="Dados do Usuário"
                icon="fa-solid fa-user"
                :done="currentStep > 4"
              >
                <user-registration-form
                  v-model="partnerRegistration.user"
                  :loading="isLoading"
                />
              </q-step>

              <template #navigation>
                <q-stepper-navigation class="q-pt-md text-center">
                  <q-btn
                    v-if="currentStep > 1"
                    type="button"
                    flat
                    size="lg"
                    color="green-7"
                    label="Anterior"
                    class="q-ml-sm"
                    @click="stepper.previous()"
                  />
                  <q-btn
                    v-if="currentStep <= 4"
                    type="submit"
                    size="lg"
                    color="green-7"
                    :label="currentStep === 4 ? 'Finalizar' : 'Próximo'"
                    class="q-ml-sm"
                  />
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-form>
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
import { ref, computed, watch, reactive, onMounted, provide } from 'vue' // Adicionado provide
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
import PartnerDetailsForm from '@/components/partner/PartnerDetailsForm.vue'
import AddressForm from '@/components/AddressForm.vue'
import UserRegistrationForm from '@/components/partner/UserRegistrationForm.vue'
import CustomLink from '@/components/CustomLink.vue'

// Assets
import logoDefault from '../../assets/fiscal-facil.svg?url'
import logoDark from '../../assets/fiscal-facil-dark.svg?url'
import { notifySuccess, notifyWarning } from '@/plugins'

export default {
  name: 'PartnerRegistrationComponent',
  components: {
    QInputMask,
    PartnerDetailsForm,
    AddressForm,
    UserRegistrationForm,
    CustomLink,
  },
  setup() {
    // Refs de Componente (apenas o stepper permanece)
    const stepper = ref(null)

    // Estado Reativo
    const currentStep = ref(1)
    const selectedType = ref('pessoaJuridica')
    const partnerRegistration = ref(new PessoaJuridicaRegistration())
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
      if (selectedType.value === 'pessoaFisica') {
        return 'CPF *'
      } else if (selectedType.value === 'pessoaJuridica') {
        return 'CNPJ *'
      }
      return 'CPF/CNPJ *'
    })

    const cpfCnpjMask = computed(() => {
      if (selectedType.value === 'pessoaFisica') {
        return '000.000.000-00'
      } else if (selectedType.value === 'pessoaJuridica') {
        return '00.000.000/0000-00'
      }
      return [
        {
          mask: '000.000.000-00',
        },
        {
          mask: '00.000.000/0000-00',
        },
      ]
    })

    const isCompanyType = computed(() => {
      return (
        selectedType.value === 'contabilidade' ||
        selectedType.value === 'pessoaJuridica'
      )
    })

    const validationRules = computed(() => {
      switch (selectedType.value) {
        case 'contabilidade':
          return ContabilidadeValidation
        case 'pessoaFisica':
          return PessoaFisicaValidation
        case 'pessoaJuridica':
          return PessoaJuridicaValidation
        default:
          return {}
      }
    })

    // Vuelidate setup
    const v$ = useVuelidate(validationRules, partnerRegistration)

    // PROVIDE as instâncias de validação para os componentes filhos
    // Usamos computed para garantir que as referências sejam reativas
    // e atualizem nos filhos quando partnerRegistration muda.
    provide(
      'partnerDetailsVuelidate',
      computed(() => v$.value.details)
    )
    provide(
      'addressVuelidate',
      computed(() => v$.value.address)
    )
    provide(
      'userRegistrationVuelidate',
      computed(() => v$.value.user)
    )

    // Watcher para `selectedType`
    watch(
      selectedType,
      (newType) => {
        if (newType) {
          switch (newType) {
            case 'contabilidade':
              partnerRegistration.value = reactive(
                new ContabilidadeRegistration()
              )
              break
            case 'pessoaFisica':
              partnerRegistration.value = reactive(
                new PessoaFisicaRegistration()
              )
              break
            case 'pessoaJuridica':
              partnerRegistration.value = reactive(
                new PessoaJuridicaRegistration()
              )
              break
          }
          // Resetar a validação da Vuelidate principal e suas sub-instâncias
          v$.value.$reset()
        }
      },
      { immediate: true }
    )

    // Hook `onMounted`
    onMounted(() => {
      setTimeout(() => {
        showWelcomeAnimation.value = true
      }, 300)
    })

    /**
     * Reseta os dados do parceiro e a validação do formulário.
     * Chamado ao mudar o tipo de registro (Contabilidade, PF, PJ).
     */
    function resetPartnerData() {
      if (partnerRegistration.value?.reset) {
        partnerRegistration.value.reset()
      }
      // Reseta a validação de toda a instância Vuelidate.
      // Os componentes filhos, ao injetar e usar essa instância,
      // terão seus estados de validação resetados automaticamente.
      v$.value.$reset()
    }

    /**
     * Avança para o próximo passo do stepper, validando o passo atual.
     */
    async function nextStep() {
      let isStepValid = false

      switch (currentStep.value) {
        case 1:
          isStepValid = await v$.value.details.cpfCnpj.$validate()
          break
        case 2:
          // A validação agora é feita diretamente na instância Vuelidate do pai
          // que gerencia os dados do PartnerDetailsForm.
          isStepValid = await v$.value.details.$validate()
          break
        case 3:
          // A validação agora é feita diretamente na instância Vuelidate do pai
          // que gerencia os dados do AddressForm.
          isStepValid = await v$.value.address.$validate()
          break
        case 4:
          // A validação agora é feita diretamente na instância Vuelidate do pai
          // que gerencia os dados do UserRegistrationForm.
          isStepValid = await v$.value.user.$validate()
          break
      }

      if (isStepValid) {
        if (currentStep.value < 4) {
          stepper.value.next()
        } else {
          submitRegistration()
        }
      } else {
        notifyWarning(
          'Por favor, preencha os campos obrigatórios antes de prosseguir.'
        )
      }
    }

    /**
     * Envia o formulário de registro após validar todos os passos.
     */
    async function submitRegistration() {
      // Validações individuais para cada passo, feitas diretamente na instância Vuelidate do pai
      const isStep1Valid = await v$.value.details.cpfCnpj.$validate()
      const isStep2Valid = await v$.value.details.$validate()
      const isStep3Valid = await v$.value.address.$validate()
      const isStep4Valid = await v$.value.user.$validate()

      if (isStep1Valid && isStep2Valid && isStep3Valid && isStep4Valid) {
        const payload = partnerRegistration.value.toRequest()
        console.log(
          'Dados do Parceiro para registro:',
          JSON.parse(JSON.stringify(payload))
        )

        notifySuccess('Parceiro registrado com sucesso!')
      } else {
        notifyWarning(
          'Por favor, preencha os campos obrigatórios antes de prosseguir.'
        )
      }
    }

    /**
     * Realiza a busca de dados na Receita WS com base no CNPJ.
     * Popula os campos do formulário com os dados retornados.
     */
    async function searchReceitaWS() {
      isLoading.value = true
      try {
        const cnpj = partnerRegistration.value.details.cpfCnpj
        console.log(`Buscando CNPJ: ${cnpj}`)

        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (cnpj === '00000000000000') {
          partnerRegistration.value.details.parseFromReceitaWS({
            cnpj: '00000000000000',
            razao_social: 'Empresa Teste LTDA',
            nome_fantasia: 'Teste Fantasia',
            ddd_telefone_1: '11987654321',
            ddd_telefone_2: '11123456789',
            situacao: 'ATIVA',
            cnae_fiscal: '6201601',
            cnae_fiscal_descricao: 'Desenvolvimento de programas de computador',
            cnaes_secundarios: [
              {
                codigo: '6202300',
                descricao: 'Consultoria em tecnologia da informação',
              },
            ],
            ie: '123456789',
          })
          partnerRegistration.value.address.parseFromReceitaWS({
            cep: '78600000',
            logradouro: 'Rua Exemplo',
            numero: '123',
            bairro: 'Centro',
            municipio: 'Barra do Garças',
            uf: 'MT',
          })
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
    return {
      currentStep,
      selectedType,
      partnerRegistration,
      isLoading,
      v$, // Vuelidate instance principal

      stepper,
      logoTheme,
      showWelcomeAnimation,

      cpfCnpjLabel,
      cpfCnpjMask,
      isCompanyType,

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
