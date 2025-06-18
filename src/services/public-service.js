import { API_CEP, API_GEO_IP, API_RECEITA } from '../config'
import { axios } from '../plugins/http'

/**
 * Serviço para operações públicas
 * @class PublicService
 */
class PublicService {
  /**
   * Busca todos gêneros para usuário
   * @returns {Promise<Object>} Objeto contendo os dados do usuário
   */
  async findGeoInfo() {
    const response = await axios.get(API_GEO_IP, {
      withCredentials: false,
    })
    if (response.data.success === false) {
      throw new Error(response.data.message)
    }
    return {
      data: response.data,
      message: 'Localização e IP carregados com sucesso',
    }
  }

  /**
   * Busca endereço por CEP
   * @param {string} cep CEP para busca
   * @returns {Promise<Object>} Objeto contendo os dados do endereço
   */
  async findAddressByCEP(cep) {
    const response = await axios.get(`${API_CEP}/${cep}/json/`)
    return response.data
  }

  /**
   * Busca empresa pela Receita Federal
   * @param {string} cnpj CNPJ para busca
   * @returns {Promise<Object>} Objeto contendo os dados da empresa
   */
  async findCompanyByCNPJ(cnpj = '') {
    const response = await axios.get(
      `${API_RECEITA}/${cnpj.replace(/\D/g, '')}`
    )
    return response.data
  }
}

export const publicService = new PublicService()
export default publicService
