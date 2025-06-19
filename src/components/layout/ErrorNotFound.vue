<template>
  <q-layout view="lHh LpR lFr">
    <q-page-container>
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
        <div :class="containerClasses">
          <div class="error-content" :class="{ 'animate-in': showAnimation }">
            <div class="error-number">
              <span class="number-4 number-4--first">4</span>
              <div class="number-0">
                <q-icon
                  name="fas fa-search"
                  class="search-icon"
                  :class="{ 'animate-spin': showAnimation }"
                />
              </div>
              <span class="number-4 number-4--last">4</span>
            </div>

            <div class="error-message">
              <h1 class="error-title">Oops! Página não encontrada</h1>
              <p class="error-subtitle">
                A página que você está procurando pode ter sido removida, teve
                seu nome alterado ou está temporariamente indisponível.
              </p>
            </div>

            <div class="error-suggestions">
              <div class="suggestion-item">
                <q-icon name="fas fa-lightbulb" class="suggestion-icon" />
                <span>Verifique se o endereço foi digitado corretamente</span>
              </div>
              <div class="suggestion-item">
                <q-icon name="fas fa-refresh" class="suggestion-icon" />
                <span>Tente recarregar a página</span>
              </div>
              <div class="suggestion-item">
                <q-icon name="fas fa-home" class="suggestion-icon" />
                <span>Volte para a página inicial</span>
              </div>
            </div>

            <div class="error-actions">
              <q-btn
                color="green-7"
                size="lg"
                icon="fas fa-home"
                label="Ir para Home"
                class="action-btn"
                :loading="isRedirecting"
                no-caps
                @click="goHome"
              />

              <q-btn
                color="grey-7"
                size="lg"
                icon="fas fa-arrow-left"
                label="Voltar"
                class="action-btn"
                :loading="isRedirecting"
                outline
                no-caps
                @click="goBack"
              />
            </div>

            <div v-if="countdown > 0 && !isRedirecting" class="auto-redirect">
              <q-linear-progress
                :value="(10 - countdown) / 10"
                color="green-7"
                class="redirect-progress"
              />
              <p class="redirect-text">
                Redirecionando automaticamente em
                <span class="countdown-number">{{ countdown }}</span>
                segundos...
                <q-btn
                  flat
                  dense
                  size="sm"
                  label="Cancelar"
                  color="grey-6"
                  class="cancel-btn"
                  @click="stopCountdown"
                />
              </p>
            </div>

            <div class="help-links">
              <custom-link to="/contato" icon="fas fa-envelope" color="info">
                Entre em contato
              </custom-link>
              <span class="link-separator">•</span>
              <custom-link
                to="/ajuda"
                icon="fas fa-question-circle"
                color="info"
              >
                Central de ajuda
              </custom-link>
            </div>
          </div>
        </div>

        <q-page-sticky
          v-if="isMobile"
          position="bottom-right"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="fas fa-home"
            color="green-7"
            :loading="isRedirecting"
            @click="goHome"
          />
        </q-page-sticky>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CustomLink from '../CustomLink.vue'
import { useAppStore } from '../../stores/app'

export default defineComponent({
  name: 'ErrorNotFound',
  components: {
    CustomLink,
  },
  setup() {
    const router = useRouter()
    const $q = useQuasar()

    const showAnimation = ref(false)
    const countdown = ref(10)
    const isRedirecting = ref(false)
    const countdownInterval = ref(null)

    const appStore = useAppStore()
    const darkModeInStore = computed(() => appStore.darkMode)

    // Computed properties
    const isDarkMode = computed(() => $q.dark.isActive)
    const isMobile = computed(() => $q.platform.is.mobile)

    const containerClasses = computed(() => ({
      'error-container': true, // This class is custom to ErrorNotFound's wrapper form.
      'error-container--mobile': isMobile.value,
      'error-container--desktop': !isMobile.value,
    }))

    // Methods
    const goHome = () => {
      if (isRedirecting.value) return

      isRedirecting.value = true
      router.push({ name: 'dashboard' })
    }

    const goBack = () => {
      if (isRedirecting.value) return

      isRedirecting.value = true
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push({ name: 'dashboard' })
      }
    }

    const startCountdown = () => {
      countdownInterval.value = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(countdownInterval.value)
          goHome()
        }
      }, 1000)
    }

    const stopCountdown = () => {
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value)
        countdownInterval.value = null
      }
    }

    const handleKeyPress = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        goHome()
      } else if (event.key === 'Escape') {
        goBack()
      }
    }

    // Lifecycle
    onMounted(() => {
      // Add entrance animation
      setTimeout(() => {
        showAnimation.value = true
      }, 100)

      // Start auto-redirect countdown
      setTimeout(() => {
        startCountdown()
      }, 3000)

      // Add keyboard listeners
      document.addEventListener('keydown', handleKeyPress)

      // Cleanup on unmount
      return () => {
        stopCountdown()
        document.removeEventListener('keydown', handleKeyPress)
      }
    })

    onBeforeMount(() => {
      $q.dark.set(darkModeInStore.value)
    })
    return {
      showAnimation,
      countdown,
      isRedirecting,
      isDarkMode,
      isMobile,
      containerClasses,
      goHome,
      goBack,
      stopCountdown,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../styles/quasar-variables.scss'; // Ensure variables are imported

// The core background is now defined in quasar.scss under .error-page
// The decorative elements (bg-shape, bg-particles) are also in quasar.scss
// Therefore, this component's scoped styles focus only on its unique content layout and animations.

// Removed the entire .error-page, .error-background, .bg-shape, .bg-particles
// blocks as they are now global in quasar.scss.

.error-content {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  .body--dark & {
    background: rgba(24, 35, 52, 0.95);
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 600px) {
    padding: 40px 24px;
    border-radius: 20px;
  }
}

.error-number {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  font-size: clamp(80px, 15vw, 120px);
  font-weight: 800;
  color: $green-7;
  line-height: 1;

  .number-4 {
    display: inline-block;
    animation: bounce-in 1s ease-out; // Animation specific to this component

    &--first {
      animation-delay: 0.2s;
    }

    &--last {
      animation-delay: 0.6s;
    }
  }

  .number-0 {
    position: relative;
    width: 1em;
    height: 1em;
    margin: 0 0.1em;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 8px solid $green-7;
    border-radius: 50%;
    animation: scale-in 1s ease-out 0.4s both; // Animation specific to this component

    .search-icon {
      font-size: 0.4em;
      color: $green-7;
      animation: search-pulse 2s ease-in-out infinite; // Animation specific to this component

      &.animate-spin {
        animation:
          search-spin 1s ease-in-out,
          search-pulse 2s ease-in-out infinite 1s; // Animation specific to this component
      }
    }
  }
}

.error-message {
  margin-bottom: 40px;

  .error-title {
    font-size: clamp(24px, 5vw, 32px);
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 16px 0;
    line-height: 1.2;

    .body--dark & {
      color: #ecf0f1;
    }
  }

  .error-subtitle {
    font-size: 16px;
    color: #7f8c8d;
    margin: 0;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;

    .body--dark & {
      color: #bdc3c7;
    }
  }
}

.error-suggestions {
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;

  .suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(33, 186, 69, 0.05);
    border-radius: 12px;
    border-left: 4px solid $green-7;
    text-align: left;
    font-size: 14px;
    color: #5a6c7d;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(33, 186, 69, 0.1);
      transform: translateX(4px);
    }

    .body--dark & {
      background: rgba(255, 255, 255, 0.05);
      color: #bdc3c7;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .suggestion-icon {
      color: $green-7;
      font-size: 16px;
      flex-shrink: 0;
    }
  }
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;

  .action-btn {
    min-width: 140px;
    height: 48px;
    border-radius: 12px;
    font-weight: 600;
    transition: all 0.3s ease;

    &--primary {
      // This class is not directly used in the template, but kept from original CSS
      box-shadow: 0 4px 12px rgba(33, 186, 69, 0.3);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(33, 186, 69, 0.4);
      }
    }

    &--secondary {
      // This class is not directly used in the template, but kept from original CSS
      &:hover:not(:disabled) {
        transform: translateY(-2px);
      }
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;

    .action-btn {
      width: 100%;
      max-width: 280px;
    }
  }
}

.auto-redirect {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(33, 186, 69, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(33, 186, 69, 0.1);

  .body--dark & {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .redirect-progress {
    margin-bottom: 8px;
    border-radius: 4px;
  }

  .redirect-text {
    margin: 0;
    font-size: 14px;
    color: #5a6c7d;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;

    .body--dark & {
      color: #bdc3c7;
    }

    .countdown-number {
      font-weight: 700;
      color: $green-7;
      font-size: 16px;
    }

    .cancel-btn {
      font-size: 12px;
      padding: 2px 8px;
    }
  }
}

.help-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 14px;
  flex-wrap: wrap;

  .link-separator {
    color: #bdc3c7;
    font-weight: bold;
  }
}

// Animations specific to ErrorNotFound content, moved here from original stylesheet
@keyframes bounce-in {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(-90deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes search-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes search-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

// Responsive improvements for ErrorNotFound (remaining local adjustments)
@media (max-width: 768px) {
  .error-suggestions {
    .suggestion-item {
      font-size: 13px;
      padding: 10px 14px;
    }
  }
}

@media (max-width: 480px) {
  .error-number {
    margin-bottom: 32px;
  }

  .error-message {
    margin-bottom: 32px;
  }

  .error-suggestions {
    margin-bottom: 32px;
  }
}

// Accessibility improvements specific to ErrorNotFound
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

// Focus improvements for ErrorNotFound buttons
.action-btn:focus-visible {
  outline: 2px solid $primary;
  outline-offset: 2px;
}

// Loading state
.action-btn[loading] {
  pointer-events: none;
}
</style>
