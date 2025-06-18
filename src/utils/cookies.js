import { useCookiesStore } from '../stores/cookies'
/**
 * Cookie utility functions for managing browser cookies
 */

/**
 * Set a cookie with specified name, value, and options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options (expires, path, domain, secure, sameSite, type)
 */
export const setCookie = (name, value, options = {}) => {
  // Check if the cookie type is allowed based on user preferences
  const cookieType = options.type || 'necessary'
  if (!isCookieTypeAllowed(cookieType)) {
    console.warn(
      `Cookie "${name}" not set: ${cookieType} cookies are not allowed`
    )
    return false
  }

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.expires) {
    if (options.expires instanceof Date) {
      cookieString += `; expires=${options.expires.toUTCString()}`
    } else if (typeof options.expires === 'number') {
      const date = new Date()
      date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000)
      cookieString += `; expires=${date.toUTCString()}`
    }
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  if (options.secure) {
    cookieString += '; secure'
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
  return true
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const nameEQ = encodeURIComponent(name) + '='
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const c = cookie.trim()
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length))
    }
  }
  return null
}

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options (path, domain)
 */
export const deleteCookie = (name, options = {}) => {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  })
}

/**
 * Check if a specific cookie type is allowed based on user preferences
 * @param {string} type - Cookie type (necessary, functional, performance, targeting)
 * @returns {boolean} Whether the cookie type is allowed
 */
export const isCookieTypeAllowed = (type) => {
  const cookiesStore = useCookiesStore()

  switch (type) {
    case 'necessary':
      return true // Always allowed
    case 'functional':
      return cookiesStore.isFunctionalEnabled
    case 'performance':
      return cookiesStore.isPerformanceEnabled
    case 'targeting':
      return cookiesStore.isTargetingEnabled
    default:
      return false
  }
}

/**
 * Clear all non-necessary cookies based on user preferences
 */
export const clearNonAllowedCookies = async () => {
  const cookiesStore = useCookiesStore()

  // Get all cookies
  const cookies = document.cookie.split(';')

  cookies.forEach((cookie) => {
    const [name] = cookie.trim().split('=')

    // Define cookie categories (you may need to adjust this based on your actual cookies)
    const functionalCookies = ['user-preferences', 'language', 'theme']
    const performanceCookies = ['analytics', 'performance-tracking']
    const targetingCookies = ['advertising', 'marketing', 'tracking']

    let shouldDelete = false

    if (functionalCookies.includes(name) && !cookiesStore.isFunctionalEnabled) {
      shouldDelete = true
    } else if (
      performanceCookies.includes(name) &&
      !cookiesStore.isPerformanceEnabled
    ) {
      shouldDelete = true
    } else if (
      targetingCookies.includes(name) &&
      !cookiesStore.isTargetingEnabled
    ) {
      shouldDelete = true
    }

    if (shouldDelete) {
      deleteCookie(name)
    }
  })
}

/**
 * Initialize cookie management based on user preferences
 */
export const initializeCookieManagement = async () => {
  const cookiesStore = useCookiesStore()

  // Clear non-allowed cookies if consent has been given
  if (cookiesStore.hasConsent) {
    await clearNonAllowedCookies()
  }
}

// Cookie type constants for easy reference
export const COOKIE_TYPES = {
  NECESSARY: 'necessary',
  FUNCTIONAL: 'functional',
  PERFORMANCE: 'performance',
  TARGETING: 'targeting',
}

export default {
  setCookie,
  getCookie,
  deleteCookie,
  isCookieTypeAllowed,
  clearNonAllowedCookies,
  initializeCookieManagement,
  COOKIE_TYPES,
}
