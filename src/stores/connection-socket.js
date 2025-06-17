import { defineStore, acceptHMRUpdate } from 'pinia'
import { useUserStore } from './user'
import io from 'socket.io-client'
import { SOCKET_URL } from '../config'

// This store manages the dark mode theme setting for the application
// It allows toggling between dark and light modes and persists the setting in localStorage
export const useConnectionSocketStore = defineStore('connectionSocket', {
  state: () => ({
    socket: null,
    isConnected: false,
    connectionError: null,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectInterval: null,
  }),
  getters: {
    canReconnect: (state) =>
      state.reconnectAttempts < state.maxReconnectAttempts,
  },
  actions: {
    /**
     * Conecta ao socket.
     *
     * Verifica se o token de autenticação do usuário está disponível.
     * Se o socket já estiver conectado, retorna imediatamente.
     * Caso contrário, tenta conectar ao socket com o token de autenticação.
     * Se ocorrer um erro, guarda a mensagem de erro e retorna.
     */
    connect() {
      const userStore = useUserStore()

      if (!userStore.accessToken) {
        this.connectionError = 'Token de autenticação não encontrado'
      }

      if (this.socket && this.isConnected) {
        console.log('Socket já está conectado')
        return
      }
      try {
        const socketUrl = SOCKET_URL || 'http://localhost:3000'
        this.socket = io(socketUrl, {
          auth: {
            token: userStore.accessToken,
          },
          transports: ['websocket', 'polling'],
          timeout: 20000,
          forceNew: true,
        })
      } catch (error) {
        console.error('Erro ao conectar socket:', error)
        this.connectionError = error.message
      }
    },
    /**
     * Desconecta do socket.
     *
     * Se o socket estiver conectado, desconecta e limpa a referência.
     * Zera a flag de conexão, limpa o intervalo de reconexão
     * e zera a quantidade de tentativas de reconexão.
     */
    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }

      this.isConnected = false
      this.clearReconnectInterval()
      this.reconnectAttempts = 0
      this.connectionError = null
    },
    /**
     * Seta os listeners do socket.
     *
     * Verifica se o socket existe e, se sim, define os listeners para os eventos de conexão,
     * desconexão, erro de conexão e erro do socket.
     * Se o socket desconectar por causa do servidor, tenta reconectar.
     * Se o erro de conexão for de autenticação, faz logout.
     * Se o erro for outro, tenta reconectar.
     * Se o token expirar, renova o token e reconecta.
     */
    setupSocketListeners() {
      if (!this.socket) return

      this.socket.on('connect', () => {
        console.log('Socket conectado:', this.socket.id)
        this.isConnected = true
        this.connectionError = null
        this.reconnectAttempts = 0
        this.clearReconnectInterval()
      })

      this.socket.on('disconnect', (reason) => {
        console.log('Socket desconectado')
        this.isConnected = false
        if (reason === 'io server disconnect') {
          // Servidor desconectou, tentar reconectar
          this.attemptReconnect()
        }
      })

      this.socket.on('connect_error', (error) => {
        console.error('Erro ao conectar ao socket:', error)
        this.connectionError = error.message
        this.isConnected = false
        if (error.message.toLowerCase().includes('authentication')) {
          // Erro de autenticação, fazer logout
          const userStore = useUserStore()
          userStore.logout()
        } else {
          this.attemptReconnect()
        }
      })

      this.socket.on('error', (error) => {
        console.error('Erro do socket:', error)
        this.connectionError = error.message
      })

      this.socket.on('token_expired', () => {
        console.log('Token expirado, renovando...')
        const userStore = useUserStore()
        userStore.refreshToken().then(() => {
          this.disconnect()
          this.connect()
        })
      })
    },
    /**
     * Attempts to reconnect to the socket server with exponential backoff strategy.
     *
     * Checks if reconnection attempts have not exceeded the maximum allowed.
     * If already attempting to reconnect, exits early.
     * Calculates a delay using exponential backoff and sets a timeout to retry connection.
     * Increments the reconnection attempts counter upon each attempt.
     */
    attemptReconnect() {
      if (!this.canReconnect) {
        console.log('Máximo de tentativas de reconexão atingido')
        return
      }

      if (this.reconnectInterval) {
        return // Já está tentando reconectar
      }

      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000) // Backoff exponencial

      this.reconnectInterval = setTimeout(() => {
        console.log(
          `Tentativa de reconexão ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts}`
        )
        this.reconnectAttempts++
        this.clearReconnectInterval()
        this.connect()
      }, delay)
    },
    /**
     * Clears the reconnection interval timer.
     *
     * If there is an active reconnection interval, clears the timeout
     * and resets the reconnection interval reference to null.
     */
    clearReconnectInterval() {
      if (this.reconnectInterval) {
        clearTimeout(this.reconnectInterval)
        this.reconnectInterval = null
      }
    },
    /**
     * Sends an event to the socket server if connected.
     *
     * Checks if the socket is connected before sending the event.
     * If connected, sends the event with the given data and returns true.
     * If not connected, logs a warning and returns false.
     *
     * @param {string} event - The event to send
     * @param {*} data - The data to send with the event
     * @return {boolean} Whether the event was sent successfully
     */
    emit(event, data) {
      if (this.socket && this.isConnected) {
        this.socket.emit(event, data)
        return true
      } else {
        console.warn('Socket não está conectado. Evento não enviado:', event)
        return false
      }
    },
    /**
     * Listens for an event on the socket.
     *
     * If the socket is connected, listens for the given event and executes the callback
     * when the event is triggered. If the socket is not connected, does nothing.
     *
     * @param {string} event - The event to listen for
     * @param {Function} callback - The callback to execute when the event is triggered
     */
    on(event, callback) {
      if (this.socket) {
        this.socket.on(event, callback)
      }
    },
    /**
     * Stops listening for an event on the socket.
     *
     * If the socket is connected, stops listening for the given event and callback.
     * If the socket is not connected, does nothing.
     *
     * @param {string} event - The event to stop listening for
     * @param {Function} callback - The callback to remove from the event listeners
     */
    off(event, callback) {
      if (this.socket) {
        this.socket.off(event, callback)
      }
    },
    /**
     * Updates the authentication token used by the socket connection.
     *
     * If the user store has an access token, updates the authentication token
     * used by the socket connection to use the new access token. If the socket
     * connection is not connected or the user store does not have an access token,
     * does nothing.
     */
    updateAuthToken() {
      const userStore = useUserStore()

      if (this.socket && userStore.accessToken) {
        this.socket.auth.token = userStore.accessToken
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useConnectionSocketStore, import.meta.hot)
  )
}
