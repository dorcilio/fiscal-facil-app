<template>
  <q-dialog
    v-model="showBanner"
    persistent
    position="bottom"
    class="cookies-banner-dialog"
  >
    <q-card
      class="cookies-banner"
      :class="{
        'bg-dark text-white': $q.dark.isActive,
        'bg-white text-dark': !$q.dark.isActive,
      }"
    >
      <q-card-section class="q-pb-none">
        <div class="row items-center q-mb-md">
          <q-icon
            name="fas fa-cookie-bite"
            size="md"
            class="q-mr-sm text-green-7"
          />
          <div class="text-h6 text-weight-bold">Configurações de Cookies</div>
        </div>

        <div class="text-body2 q-mb-md">
          Utilizamos cookies para melhorar sua experiência em nosso site,
          personalizar conteúdo e anúncios, fornecer recursos de mídia social e
          analisar nosso tráfego. Você pode escolher quais tipos de cookies
          aceitar clicando em "Personalizar" ou aceitar todos clicando em
          "Aceitar Todos".
        </div>

        <!-- Cookie Categories -->
        <div v-if="showDetails" class="q-mb-md">
          <div class="text-subtitle2 text-weight-bold q-mb-sm">
            Tipos de Cookies:
          </div>

          <!-- Necessary Cookies -->
          <div class="cookie-category q-mb-sm">
            <q-checkbox
              v-model="localPreferences.necessary"
              disable
              color="green-7"
              class="q-mr-sm"
            />
            <div class="cookie-info">
              <div class="text-weight-medium">Cookies Necessários</div>
              <div class="text-caption text-grey-6">
                Essenciais para o funcionamento básico do site. Sempre ativos.
              </div>
            </div>
          </div>

          <!-- Functional Cookies -->
          <div class="cookie-category q-mb-sm">
            <q-checkbox
              v-model="localPreferences.functional"
              color="green-7"
              class="q-mr-sm"
            />
            <div class="cookie-info">
              <div class="text-weight-medium">Cookies Funcionais</div>
              <div class="text-caption text-grey-6">
                Permitem funcionalidades aprimoradas e personalização.
              </div>
            </div>
          </div>

          <!-- Performance Cookies -->
          <div class="cookie-category q-mb-sm">
            <q-checkbox
              v-model="localPreferences.performance"
              color="green-7"
              class="q-mr-sm"
            />
            <div class="cookie-info">
              <div class="text-weight-medium">Cookies de Performance</div>
              <div class="text-caption text-grey-6">
                Coletam informações sobre como você usa nosso site para
                melhorias.
              </div>
            </div>
          </div>

          <!-- Targeting Cookies -->
          <div class="cookie-category q-mb-sm">
            <q-checkbox
              v-model="localPreferences.targeting"
              color="green-7"
              class="q-mr-sm"
            />
            <div class="cookie-info">
              <div class="text-weight-medium">Cookies de Publicidade</div>
              <div class="text-caption text-grey-6">
                Utilizados para exibir anúncios relevantes baseados em seus
                interesses.
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-pt-none" align="right">
        <div class="row q-gutter-sm full-width">
          <!-- Mobile: Stack buttons vertically -->
          <div v-if="$q.platform.is.mobile" class="col-12">
            <q-btn
              v-if="!showDetails"
              flat
              color="grey-7"
              label="Personalizar"
              class="full-width q-mb-xs"
              @click="toggleDetails"
            />
            <q-btn
              color="negative"
              label="Rejeitar Todos"
              class="full-width q-mb-xs"
              @click="rejectAll"
            />
            <q-btn
              v-if="showDetails"
              color="primary"
              label="Salvar Preferências"
              class="full-width q-mb-xs"
              @click="savePreferences"
            />
            <q-btn
              color="positive"
              label="Aceitar Todos"
              class="full-width"
              @click="acceptAll"
            />
          </div>

          <!-- Desktop: Horizontal layout -->
          <div v-else class="col-12 row q-gutter-sm justify-end">
            <q-btn
              v-if="!showDetails"
              flat
              color="grey-7"
              label="Personalizar"
              @click="toggleDetails"
            />
            <q-btn color="negative" label="Rejeitar Todos" @click="rejectAll" />
            <q-btn
              v-if="showDetails"
              color="primary"
              label="Salvar Preferências"
              @click="savePreferences"
            />
            <q-btn color="positive" label="Aceitar Todos" @click="acceptAll" />
          </div>
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useCookiesStore } from '../stores/cookies'
import { notify } from '../plugins'

export default defineComponent({
  name: 'CookiesBanner',
  setup() {
    const cookiesStore = useCookiesStore()
    const showDetails = ref(false)

    // Local preferences for real-time updates
    const localPreferences = ref({
      necessary: true,
      functional: cookiesStore.preferences.functional,
      performance: cookiesStore.preferences.performance,
      targeting: cookiesStore.preferences.targeting,
    })

    const showBanner = computed({
      get: () => cookiesStore.shouldShowBanner,
      set: (value) => {
        if (!value) {
          cookiesStore.showBanner = false
        }
      },
    })

    // Watch for changes in store preferences
    watch(
      () => cookiesStore.preferences,
      (newPreferences) => {
        localPreferences.value = { ...newPreferences }
      },
      { deep: true }
    )

    const toggleDetails = () => {
      showDetails.value = !showDetails.value
    }

    const acceptAll = () => {
      cookiesStore.acceptAllCookies()
      notify({
        color: 'positive',
        message: 'Todas as preferências de cookies foram aceitas.',
        icon: 'fas fa-check',
      })
    }

    const rejectAll = () => {
      cookiesStore.rejectAllCookies()
      notify({
        color: 'info',
        message: 'Apenas cookies necessários serão utilizados.',
        icon: 'fas fa-info-circle',
      })
    }

    const savePreferences = () => {
      cookiesStore.saveCustomPreferences(localPreferences.value)
      notify({
        color: 'positive',
        message: 'Suas preferências de cookies foram salvas.',
        icon: 'fas fa-save',
      })
    }

    return {
      showBanner,
      showDetails,
      localPreferences,
      toggleDetails,
      acceptAll,
      rejectAll,
      savePreferences,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../styles/quasar-variables.scss';

.cookies-banner-dialog {
  .q-dialog__inner {
    padding: 0;
  }
}

.cookies-banner {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  border-radius: 12px 12px 0 0;

  @media (max-width: 600px) {
    border-radius: 0;
    max-height: 90vh;
    overflow-y: auto;
  }
}

.cookie-category {
  display: flex;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .cookie-info {
    flex: 1;
    min-width: 0;
  }
}

.body--dark .cookie-category {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

// Responsive adjustments
@media (max-width: 600px) {
  .cookies-banner {
    .q-card-section {
      padding: 16px;
    }

    .q-card-actions {
      padding: 16px;
    }
  }
}
</style>
