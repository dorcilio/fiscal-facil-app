import axios from 'axios'
import config from '../../config'
import setupInterceptors from './interceptor'

/**
 * Instancia do axios com config padrao
 */
const http = axios.create({
  withCredentials: true,
  credentials: 'include',
  baseURL: config.SERVICES_DNS,
  timeout: 10000,
})
setupInterceptors(http)

export default http

export { http, axios }
