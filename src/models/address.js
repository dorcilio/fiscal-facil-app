import {
  helpers,
  maxLength,
  minLength,
  numeric,
  required,
  requiredIf,
} from '@vuelidate/validators'
import { capitalize } from '../shared/input'

class Address {
  /**
   * @param {string} [zipCode=''] CEP do endereço
   * @param {string} [address=''] Logradouro do endereço
   * @param {string} [addressNumber=''] Número do endereço
   * @param {string} [neighborhood=''] Bairro do endereço
   * @param {string} [city=''] Cidade do endereço
   * @param {string} [ibge=''] C digo do munic pio (IBGE)
   * @param {string} [state=''] Estado do endereço
   * @param {string} [complement=''] Complemento do endereço
   */
  constructor(
    zipCode = '',
    address = '',
    addressNumber = '',
    neighborhood = '',
    city = '',
    ibge = '',
    state = '',
    complement = ''
  ) {
    this.zipCode = zipCode
    this.address = address
    this.addressNumber = addressNumber
    this.neighborhood = neighborhood
    this.city = city
    this.ibge = ibge
    this.state = state
    this.complement = complement
  }

  /**
   * Popula o objeto a partir dos dados obtidos via API ViaCEP
   * @param {Object} data Dados do endereço obtidos via API ViaCEP
   * @param {string} data.zipCode CEP do endereço
   * @param {string} data.uf Sigla do estado (UF)
   * @param {string} data.localidade Nome do município
   * @param {string} data.bairro Nome do bairro
   * @param {string} data.ibge Código do município (IBGE)
   * @param {string} data.logradouro Nome do logradouro
   * @param {string} data.numero Número do endereço
   * @param {string} data.complemento Complemento do endereço
   */
  parseFromViaCep(data) {
    this.zipCode = data.cep.replace(/\D/g, '')
    this.state = data.uf.toUpperCase()
    this.city = capitalize(data.localidade)
    this.neighborhood = capitalize(data.bairro)
    this.ibge = data.ibge
    this.address = capitalize(data.logradouro)
    this.addressNumber =
      !data.numero || data.numero?.includes('SN') ? null : data.numero
    this.complement = capitalize(data.complemento)
  }

  /**
   * Populates the address object with data obtained from ReceitaWS API.
   * @param {Object} data - The address data from ReceitaWS API.
   * @param {string} [data.cep] - The postal code of the address.
   * @param {string} data.uf - The state abbreviation.
   * @param {string} data.municipio - The name of the city.
   * @param {string} data.bairro - The name of the neighborhood.
   * @param {string} data.ibge - The IBGE code of the municipality.
   * @param {string} data.logradouro - The name of the street.
   * @param {string} [data.numero] - The number of the address.
   * @param {string} [data.complemento] - The address complement.
   */
  parseFromReceitaWS(data) {
    this.zipCode = data?.cep?.replace(/\D/g, '')
    this.state = data.uf.toUpperCase()
    this.city = capitalize(data.municipio)
    this.neighborhood = capitalize(data.bairro)
    this.ibge = data.ibge
    this.address = capitalize(data.logradouro)
    this.addressNumber = data.numero?.includes('SN') ? null : data.numero
    this.complement = capitalize(data.complemento)
  }

  /**
   * Returns the address object formatted as a request to the API.
   * @returns {Object} The address object with the following properties:
   *                  - zipCode: string
   *                  - address: string
   *                  - addressNumber: string
   *                  - neighborhood: string
   *                  - city: string
   *                  - ibge: string
   *                  - state: string
   *                  - complement: string
   */
  toRequest() {
    return {
      zipCode: this.zipCode,
      address: this.address,
      addressNumber: this.addressNumber,
      neighborhood: this.neighborhood,
      city: this.city,
      ibge: this.ibge,
      state: this.state,
      complement: this.complement,
    }
  }

  /**
   * Resets the address object with default values.
   *
   * @returns {void}
   */
  reset() {
    this.zipCode = ''
    this.address = ''
    this.addressNumber = ''
    this.neighborhood = ''
    this.city = ''
    this.ibge = ''
    this.state = ''
    this.complement = ''
  }
}

const AddressValidation = {
  zipCode: {
    required: helpers.withMessage('É necessário informar o CEP', required),
    numeric: helpers.withMessage('CEP deve conter apenas números', numeric),
    minLength: helpers.withMessage(
      'CEP deve conter 8 caracteres',
      minLength(8)
    ),
    maxLength: helpers.withMessage(
      'CEP deve conter 8 caracteres',
      maxLength(8)
    ),
  },
  address: {
    required: helpers.withMessage(
      'É necessário informar o Logradouro',
      required
    ),
    minLength: helpers.withMessage(
      'Logradouro deve ser maior que 1 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Logradouro pode conter apenas 60 caracteres',
      maxLength(60)
    ),
  },
  addressNumber: {
    required: false,
    numeric: helpers.withMessage(
      'Número do endereço só aceita números',
      numeric
    ),
  },
  neighborhood: {
    required: helpers.withMessage(
      'É necessário informar o Município',
      required
    ),
    minLength: helpers.withMessage(
      'Município deve ser maior que 1 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Município pode conter apenas 60 caracteres',
      maxLength(60)
    ),
  },
  city: {
    required: helpers.withMessage('É necessário informar a cidade', required),
    minLength: helpers.withMessage(
      'Cidade deve ser maior que 1 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Cidade pode conter apenas 60 caracteres',
      maxLength(60)
    ),
  },
  ibge: {
    required: helpers.withMessage(
      'É necessário informar o código IBGE',
      required
    ),
    numeric: helpers.withMessage(
      'Código IBGE deve conter apenas números',
      numeric
    ),
  },
  state: {
    required: helpers.withMessage(
      'É necessário informar a unidade federativa',
      required
    ),
    minLength: helpers.withMessage(
      'Unidade federativa deve conter 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Unidade federativa deve conter 2 caracteres',
      maxLength(2)
    ),
  },
  complement: {
    required: helpers.withMessage(
      'Caso for informar o complemento, siga o padrão',
      requiredIf((value) => {
        return !!value
      })
    ),
    minLength: helpers.withMessage(
      'Complemento deve conter 2 caracteres',
      minLength(2)
    ),
    maxLength: helpers.withMessage(
      'Complemento pode conter apenas 120 caracteres',
      maxLength(120)
    ),
  },
}

export default Address
export { Address, AddressValidation }
