import { http } from '../plugins/http'
// import queryString from 'query-string'

/**
 * Serviço para operações de usuário
 * @class UserService
 */
class UserService {
  /**
   * Realiza login do usuário
   * @param {Object} credentials - Credenciais do usuário
   * @param {string} credentials.email - Email do usuário
   * @param {string} credentials.senha - Senha do usuário
   * @returns {Promise<Object>} accessToken
   */
  async login(credentials) {
    const response = await http.post('/auth/login', credentials, {
      headers: {
        requestLoading: true,
      },
    })
    return {
      data: response.data,
      accessToken: response.data.accessToken,
      expiresIn: response.data.expiresIn,
      message: response.data.message || 'Login realizado com sucesso',
    }
  }

  /**
   * Realiza logout do usuário
   * @returns {Promise<Object>} message - Mensagem de confirma o do logout
   */
  async logout() {
    const response = await http.delete('/auth/logout', {
      headers: {
        requestLoading: true,
      },
    })
    return {
      message: response.data.message || 'Logout realizado com sucesso',
    }
  }

  /**
   * Realiza refresh do access token
   * @returns {Promise<Object>} accessToken
   */
  async refresh() {
    const response = await http.get('/auth/refresh')
    return {
      ...response.data,
      message: response.data.message || 'Refresh realizado com sucesso',
    }
  }

  /**
   * Busca dados do usuário
   * @returns {Promise<Object>} Objeto contendo os dados do usuário
   */
  async findUserForProfile() {
    const response = await http.get('/auth/me')
    return {
      data: response.data,
      message: response.message || 'Usuário carregado com sucesso',
    }
  }
}

export const userService = new UserService()
export default userService
