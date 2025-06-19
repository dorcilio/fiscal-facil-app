import { defineStore, acceptHMRUpdate } from 'pinia'
import userService from '../services/user-service'
import Cryptography from '../utils/cryptography'
import { UserProfile } from '../models/user'
import { notifyError } from '../plugins/notify'
import { useConnectionSocketStore } from './connection-socket'

const ACCESS_TOKEN_KEY = 'ff-access-token'
const USER_TOKEN_KEY = 'ff-user-token'
const REMEMBER_ME_KEY = 'ff-remember-me' // Renomeado para maior clareza
const REMEMBER_EMAIL_KEY = 'ff-remember-email'

// Carrega os estados iniciais do localStorage
const localAccessToken = JSON.parse(
  window.localStorage.getItem(ACCESS_TOKEN_KEY)
)
const localTempUser = window.localStorage.getItem(USER_TOKEN_KEY)
const user = localTempUser ? Cryptography.decrypt(localTempUser) : null
const localRememberMe = window.localStorage.getItem(REMEMBER_ME_KEY) // Usando a nova chave
const localRememberEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY)

// This store manages user authentication state, profile, and session tokens.
// It allows for login, logout, token refresh, and remembering user email.
export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localAccessToken,
    user: user || new UserProfile(), // Garante que user seja sempre uma instância de UserProfile
    isLoading: false,
    errorMessage: '',
    errorCode: '',
    isAuthenticated: !!(user && localAccessToken), // Simplificado para boolean
    rememberMe: localRememberMe ? JSON.parse(localRememberMe) : false,
    rememberEmail: localRememberEmail || '',
  }),
  getters: {
    getRememberEmail: (state) => state.rememberEmail,
    // getRemember foi removido, pois rememberMe já é direto
    getEmailByUser: (state) => state.user?.email ?? '',
    getModulesByUser: (state) => state.user?.modules ?? ['default'],
    getRazaoSocialByUser: (state) => state.user?.razaoSocial ?? '',
    isLoggedIn: (state) => state.isAuthenticated && state.accessToken !== null,
    isUserRoot: (state) => state.user?.root ?? false,
  },
  actions: {
    /**
     * Busca dados do usuário para perfil.
     * Gerencia o estado de loading e exibe notificações de erro.
     * @returns {Promise<Object|null>} Objeto contendo os dados do usuário, ou null em caso de erro.
     */
    async findForProfile() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { data } = await userService.findUserForProfile()
        return data
      } catch (error) {
        this.errorMessage =
          error?.data?.message ?? 'Erro ao buscar perfil do usuário'
        this.errorCode = error?.data?.code ?? 'PROFILE_FETCH_ERROR'
        notifyError(this.errorMessage, error)
        return null // Retorna null em caso de erro
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Lida com o processo de login do usuário.
     * 1. Define o estado de carregamento.
     * 2. Chama o serviço de login.
     * 3. Define o token de acesso e busca o perfil do usuário.
     * 4. Salva o e-mail se a opção "Lembrar-me" estiver ativada.
     * 5. Conecta o socket se o login for bem-sucedido.
     * 6. Lida com erros e reinicia o estado de carregamento.
     * @param {Object} credentials - Credenciais do usuário (email e senha).
     * @param {string} credentials.email - Endereço de e-mail do usuário.
     * @param {string} credentials.senha - Senha do usuário.
     * @returns {Promise<Object|null>} Retorna os dados do perfil do usuário em caso de sucesso, ou null em caso de falha.
     */
    async login(credentials) {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { accessToken } = await userService.login(credentials)
        this.setAccessToken(accessToken)

        const userData = await this.findForProfile() // Chamada que já trata erros e loading
        if (!userData) {
          throw new Error('Falha ao obter dados do perfil após o login.')
        }
        this.setUser(userData)

        // Lógica para "Lembrar-me" agora baseada no estado do checkbox do componente
        if (this.rememberMe) {
          window.localStorage.setItem(REMEMBER_EMAIL_KEY, credentials.email)
        } else {
          window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }
        window.localStorage.setItem(
          REMEMBER_ME_KEY,
          JSON.stringify(this.rememberMe)
        )

        // Conectar socket após login (removido comentário desnecessário)
        const socketStore = useConnectionSocketStore()
        socketStore.connect()

        return userData // Retorna os dados do usuário em caso de sucesso
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro ao realizar login'
        this.errorCode = error?.data?.code ?? 'LOGIN_ERROR'
        notifyError(this.errorMessage, error)
        this.clearSession() // Limpa a sessão em caso de erro de login
        return null
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Lida com o processo de atualização do token de acesso.
     * 1. Define o estado de carregamento.
     * 2. Chama o serviço de atualização de token.
     * 3. Define o novo token de acesso na store.
     * 4. Lida com erros e reinicia o estado de carregamento.
     * @returns {Promise<string>} Promessa que resolve para o novo token de acesso.
     */
    async refreshToken() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { accessToken } = await userService.refresh()
        this.setAccessToken(accessToken)
        useConnectionSocketStore().updateAuthToken() // Atualiza o token no socket
        return accessToken
      } catch (error) {
        this.errorMessage =
          error?.data?.message ?? 'Erro ao renovar token de acesso'
        this.errorCode = error?.data?.code ?? 'TOKEN_REFRESH_ERROR'
        notifyError(this.errorMessage, error)
        this.clearSession() // Limpa a sessão se o refresh falhar
        throw error // Re-lança o erro para que chamadas externas possam tratá-lo
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Define o e-mail para a funcionalidade "Lembrar-me".
     * Esta função é chamada pelo v-model do checkbox no componente.
     * A persistência no localStorage ocorre no 'login' e no próprio v-model do checkbox se for implementado um watcher.
     * @param {string} email - E-mail do usuário a ser lembrado.
     */
    setRememberEmail(email) {
      this.rememberEmail = email
      // A persistência no localStorage para REMEMBER_EMAIL_KEY e REMEMBER_ME_KEY
      // é agora tratada na ação `login` com base no estado `this.rememberMe` do checkbox,
      // e no watcher da `rememberMe` no componente.
      // Ou, se você quiser que este método seja o único a tocar no localStorage para rememberEmail:
      // if (!email) {
      //   window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
      // } else {
      //   window.localStorage.setItem(REMEMBER_EMAIL_KEY, email)
      // }
      // NÃO SETAR rememberMe aqui diretamente, pois ele é controlado pelo checkbox via v-model.
    },

    /**
     * Salva o access token no local storage e atualiza o estado de autenticação do usuário.
     * @param {string} accessToken - Token de acesso do usuário.
     */
    setAccessToken(accessToken) {
      if (accessToken) {
        window.localStorage.setItem(
          ACCESS_TOKEN_KEY,
          JSON.stringify(accessToken)
        )
        this.accessToken = accessToken
        this.isAuthenticated = true
      } else {
        window.localStorage.removeItem(ACCESS_TOKEN_KEY)
        this.accessToken = null
        this.isAuthenticated = false
      }
    },

    /**
     * Define as informações do usuário na store e no localStorage.
     * Se um objeto de usuário for fornecido, ele é criptografado e armazenado.
     * Se for null, os dados do usuário são removidos.
     * @param {Object|null} user - O objeto do usuário a ser definido, ou null para resetar.
     */
    setUser(user) {
      if (user) {
        window.localStorage.setItem(USER_TOKEN_KEY, Cryptography.encrypt(user))
        this.user = user
        this.isAuthenticated = true
      } else {
        window.localStorage.removeItem(USER_TOKEN_KEY)
        this.user = new UserProfile() // Reseta para uma nova instância
        this.isAuthenticated = false
      }
    },

    /**
     * Limpa todos os dados da sessão do usuário no localStorage e na store.
     * Usado internamente em caso de logout ou falha crítica de autenticação.
     */
    clearSession() {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY)
      window.localStorage.removeItem(USER_TOKEN_KEY)
      // Mantém REMEMBER_ME_KEY e REMEMBER_EMAIL_KEY intactos para a funcionalidade "Lembrar-me"
      // Se rememberMe estiver desativado no login, eles serão limpos lá.
      this.isAuthenticated = false
      this.accessToken = null
      this.user = new UserProfile()
      // O rememberMe e rememberEmail não são alterados aqui,
      // pois são persistidos separadamente e dependem da escolha do usuário.
    },

    /**
     * Realiza o logout do usuário.
     * 1. Define o estado de carregamento.
     * 2. Chama o serviço de logout.
     * 3. Limpa a sessão.
     * 4. Desconecta o socket.
     * 5. Lida com erros e reinicia o estado de carregamento.
     * @returns {Promise<void>}
     */
    async logout() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        await userService.logout() // Chama o serviço de logout no backend
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro ao realizar logout'
        this.errorCode = error?.data?.code ?? 'LOGOUT_ERROR'
        notifyError(this.errorMessage, error)
      } finally {
        this.clearSession() // Sempre limpa a sessão, mesmo se o logout no backend falhar
        const socketStore = useConnectionSocketStore()
        socketStore.disconnect() // Garante que o socket seja desconectado
        this.isLoading = false
      }
    },
  },
})

// HMR para desenvolvimento
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
