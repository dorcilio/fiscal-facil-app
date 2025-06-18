import { defineStore, acceptHMRUpdate } from 'pinia'
import userService from '../services/user-service'
import Cryptography from '../utils/cryptography'
import { UserProfile } from '../models/user'
import { notifyError } from '../plugins/notify'
import { useConnectionSocketStore } from './connection-socket'

const ACCESS_TOKEN_KEY = 'ff-access-token'
const USER_TOKEN_KEY = 'ff-user-token'
const REMEMBER_KEY = 'ff-remember'
const REMEMBER_EMAIL_KEY = 'ff-remember-email'

const localAccessToken = JSON.parse(
  window.localStorage.getItem(ACCESS_TOKEN_KEY)
)
const localTempUser = window.localStorage.getItem(USER_TOKEN_KEY)
const user = localTempUser ? Cryptography.decrypt(localTempUser) : null
const localRememberMe = window.localStorage.getItem(REMEMBER_KEY)
const localRememberEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY)

// This store manages the dark mode theme setting for the application
// It allows toggling between dark and light modes and persists the setting in localStorage
export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: localAccessToken ? localAccessToken : null,
    user: user ? user : new UserProfile(),
    isLoading: false,
    errorMessage: '',
    errorCode: '',
    isAuthenticated: user && localAccessToken ? true : false,
    rememberMe: localRememberMe ? JSON.parse(localRememberMe) : false,
    rememberEmail: localRememberEmail ? localRememberEmail : '',
  }),
  getters: {
    getRememberEmail: (state) => state.rememberEmail,
    getRemember: (state) => state.remember,
    getEmailByUser: (state) => state.user?.email ?? '',
    getModulesByUser: (state) => state.user?.modules ?? ['default'],
    getRazaoSocialByUser: (state) => state.user?.razaoSocial ?? '',
    isLoggedIn: (state) => state.isAuthenticated && state.accessToken !== null,
    isUserRoot: (state) => state.user?.root ?? false,
  },
  actions: {
    /**
     * Busca dados do usuário para perfil
     * @returns {Promise<Object>} Objeto contendo os dados do usuário
     */
    async findForProfile() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { data } = await userService.findUserForProfile()
        return Promise.resolve(data)
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro desconhecido'
        this.errorCode = error?.data?.code ?? 'UNKNOWN_ERROR'
        notifyError(this.errorMessage, error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Handles user login process by performing the following steps:
     * 1. Sets the loading state to true.
     * 2. Calls the login function from the user service with provided credentials.
     * 3. Sets the access token in the store.
     * 4. Fetches user profile data and updates the user state.
     * 5. Saves the user's email for "Remember Me" functionality.
     * 6. Handles errors by displaying an error notification if any occur.
     * 7. Resets the loading state to false regardless of success or failure.
     * @param {Object} credentials - User credentials for login.
     * @param {string} credentials.email - User's email address.
     * @param {string} credentials.senha - User's password.
     * @returns {Promise<Object>} - Promise resolving to user profile data.
     */
    async login(credentials) {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { accessToken } = await userService.login(credentials)
        this.setAccessToken(accessToken)
        const data = await this.findForProfile()
        this.setUser(data)
        this.setRememberEmail(credentials.email)
        // Conectar socket após login
        // const socketStore = duseConnectionSocketStore()
        // socketStore.connect()

        return Promise.resolve(data)
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro desconhecido'
        this.errorCode = error?.data?.code ?? 'UNKNOWN_ERROR'
        notifyError(this.errorMessage, error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Handles the refresh token process by performing the following steps:
     * 1. Sets the loading state to true.
     * 2. Calls the refresh function from the user service.
     * 3. Sets the access token in the store.
     * 4. Handles errors by displaying an error notification if any occur.
     * 5. Resets the loading state to false regardless of success or failure.
     * @returns {Promise<string>} - Promise resolving to the new access token.
     */
    async refreshToken() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        const { accessToken } = await userService.refresh()
        this.setAccessToken(accessToken)
        useConnectionSocketStore().updateAuthToken()
        return Promise.resolve(accessToken)
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro desconhecido'
        this.errorCode = error?.data?.code ?? 'UNKNOWN_ERROR'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Salva o e-mail do usuário no local storage e atualiza o estado para lembrar ou não
     * @param {string} email - E-mail do usuário
     */
    setRememberEmail(email) {
      this.rememberEmail = email
      this.rememberMe = !!email
      if (!email) {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
        window.localStorage.setItem(REMEMBER_KEY, false)
      } else {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, email)
        window.localStorage.setItem(REMEMBER_KEY, true)
      }
    },

    /**
     * Salva o access token no local storage e atualiza o estado de autenticação do usuário
     * @param {string} accessToken - Token de acesso do usu rio
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
     * Sets the user information in the store and localStorage.
     * If a user object is provided, it encrypts and stores it in localStorage,
     * updates the store with the user data, and sets the authenticated state to true.
     * If no user object is provided, it removes the user data from localStorage,
     * resets the store's user data to a new UserProfile instance, and sets the
     * authenticated state to false.
     *
     * @param {Object|null} user - The user object to be set, or null to reset the user.
     */
    setUser(user) {
      if (user) {
        window.localStorage.setItem(USER_TOKEN_KEY, Cryptography.encrypt(user))
        this.user = user
        this.isAuthenticated = true
      } else {
        window.localStorage.removeItem(USER_TOKEN_KEY)
        this.user = new UserProfile()
        this.isAuthenticated = false
      }
    },

    /**
     * Logs out the user by performing the following steps:
     * 1. Sets the loading state to true.
     * 2. Calls the logout function from the user service.
     * 3. Removes access token and user token from localStorage.
     * 4. Updates the authentication state and resets user data in the store.
     * 5. Disconnects any active socket connections.
     * 6. Handles errors by displaying an error notification if any occur.
     * 7. Resets the loading state to false regardless of success or failure.
     */
    async logout() {
      this.isLoading = true
      this.errorMessage = ''
      this.errorCode = ''
      try {
        await userService.logout()
        window.localStorage.removeItem(ACCESS_TOKEN_KEY)
        window.localStorage.removeItem(USER_TOKEN_KEY)
        this.isAuthenticated = false
        this.accessToken = null
        this.user = null
        const socketStore = useConnectionSocketStore()
        socketStore.disconnect()
      } catch (error) {
        this.errorMessage = error?.data?.message ?? 'Erro desconhecido'
        this.errorCode = error?.data?.code ?? 'UNKNOWN_ERROR'
        notifyError(this.errorMessage, error)
      } finally {
        this.isLoading = false
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
