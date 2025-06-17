import { useUserStore } from '../../stores/user'
import { notifyError } from '../notify'

// Flags para controle de estado
let isLoggingOut = false
let isRefreshing = false
let hasShownSessionExpiredNotification = false
let failedQueue = []

// Função para processar fila de requisições após refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

export default function setupInterceptors(api) {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const userStore = useUserStore()

      // Add auth token if available
      if (userStore.accessToken) {
        config.headers.Authorization = `Bearer ${userStore.accessToken}`
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Reset notification flag on successful response
      hasShownSessionExpiredNotification = false
      return response
    },
    async (error) => {
      const userStore = useUserStore()
      const originalRequest = error.config

      // Handle 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        // Verifica se não estamos em páginas de autenticação
        const currentPath = window.location.pathname
        const isAuthPage =
          currentPath === '/login' ||
          currentPath === '/register' ||
          currentPath.startsWith('/auth')

        // Se estamos em página de auth, não tenta refresh
        if (isAuthPage) {
          return Promise.reject(error)
        }

        // Se já estamos fazendo refresh, adiciona à fila
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return api(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          // Tenta fazer refresh do token
          const newToken = await userStore.refreshToken()

          if (newToken) {
            // Sucesso no refresh
            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          } else {
            // Falha no refresh - fazer logout
            throw new Error('Refresh token failed')
          }
        } catch (refreshError) {
          // Falha no refresh token
          processQueue(refreshError, null)

          // Previne múltiplos logouts simultâneos
          if (!isLoggingOut) {
            isLoggingOut = true

            // Faz logout
            await userStore.logout()

            // Mostra notificação apenas uma vez
            if (!hasShownSessionExpiredNotification) {
              hasShownSessionExpiredNotification = true
              notifyError('Sessão expirada. Faça login novamente.')
            }

            // Redireciona após pequeno delay
            setTimeout(() => {
              window.location.href = '/login'
              isLoggingOut = false
            }, 100)
          }

          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // Handle 403 Forbidden
      else if (error.response?.status === 403) {
        notifyError('Acesso negado. Você não tem permissão para esta ação.')
      }

      // Handle server errors (500+)
      else if (error.response?.status >= 500) {
        notifyError('Ocorreu um erro no servidor. Tente novamente mais tarde.')
      }

      // Handle network errors
      else if (!error.response) {
        notifyError('Erro de rede. Verifique sua conexão.')
      }

      return Promise.reject(error)
    }
  )
}
