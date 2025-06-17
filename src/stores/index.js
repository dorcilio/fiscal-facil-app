import { createPinia } from 'pinia'

/**
 * Stores manager
 */
const pinia = createPinia()

export default pinia

export { useAppStore } from './app'
export { useCookiesStore } from './cookies'
export { useUserStore } from './user'
export { useSocketStore } from './socket'
