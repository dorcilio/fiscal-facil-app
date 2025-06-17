const MODE = import.meta.env.MODE
console.log(`Ambiente: ${MODE}`)
const USER_TOKEN_SECRET =
  import.meta.env.VITE_USER_TOKEN_SECRET || 'FF_USER_TOKEN_SECRET'
const SERVICES_DNS =
  import.meta.env.VITE_SERVICES_DNS || 'https://api.next.fiscalfacil.app'
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  'https://api.next.fiscalfacil.app/socket.io'
const API_CEP = import.meta.env.VITE_API_CEP || 'https://viacep.com.br/ws'
const API_GEO_IP = import.meta.env.VITE_API_GEOIP || 'https://ipwho.is'
const API_RECEITA =
  import.meta.env.VITE_API_RECEITA || 'https://receitaws.com.br/v1'

export default {
  USER_TOKEN_SECRET,
  SERVICES_DNS,
  SOCKET_URL,
  API_CEP,
  API_GEO_IP,
  API_RECEITA,
  MODE,
}

export {
  USER_TOKEN_SECRET,
  SERVICES_DNS,
  SOCKET_URL,
  API_CEP,
  API_GEO_IP,
  API_RECEITA,
  MODE,
}
