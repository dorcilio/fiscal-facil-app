<template>
  <div
    v-if="offlineReady || needRefresh"
    class="pwa-toast"
    role="alert"
    aria-labelledby="toast-message"
  >
    <div class="message">
      <span id="toast-message">
        {{
          offlineReady
            ? 'App ready to work offline'
            : 'New content available, click on reload button to update.'
        }}
      </span>
    </div>
    <div class="buttons">
      <button
        v-if="needRefresh"
        type="button"
        class="pwa-refresh"
        @click="updateServiceWorker()"
      >
        Reload
      </button>
      <button type="button" class="pwa-cancel" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

export default defineComponent({
  name: 'ReloadPrompt',
  setup() {
    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW()

    const close = () => {
      offlineReady.value = false
      needRefresh.value = false
    }

    return {
      offlineReady,
      needRefresh,
      updateServiceWorker,
      close,
    }
  },
})
</script>

<style scoped>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 2;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
}

.pwa-toast .message {
  margin-bottom: 8px;
}

.pwa-toast .buttons {
  display: flex;
  justify-content: flex-end;
}

.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}

.pwa-refresh {
  background-color: #eee;
}

.pwa-cancel {
  background-color: #aaa;
}
</style>
