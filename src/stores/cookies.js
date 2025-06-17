import { defineStore, acceptHMRUpdate } from 'pinia'

const COOKIES_CONSENT_KEY = 'ff-cookies-consent'
const COOKIES_PREFERENCES_KEY = 'ff-cookies-preferences'

// Get stored consent status
const storedConsent = JSON.parse(
  window.localStorage.getItem(COOKIES_CONSENT_KEY)
)
const storedPreferences = JSON.parse(
  window.localStorage.getItem(COOKIES_PREFERENCES_KEY)
)

// Default cookie preferences
const defaultPreferences = {
  necessary: true, // Always true, cannot be disabled
  functional: false,
  performance: false,
  targeting: false,
}

export const useCookiesStore = defineStore('cookies', {
  state: () => ({
    consentGiven: storedConsent || false,
    showBanner: !storedConsent,
    preferences: storedPreferences || { ...defaultPreferences },
  }),

  getters: {
    shouldShowBanner: (state) => state.showBanner,
    hasConsent: (state) => state.consentGiven,
    cookiePreferences: (state) => state.preferences,
    isNecessaryEnabled: (state) => state.preferences.necessary,
    isFunctionalEnabled: (state) => state.preferences.functional,
    isPerformanceEnabled: (state) => state.preferences.performance,
    isTargetingEnabled: (state) => state.preferences.targeting,
  },

  actions: {
    /**
     * Set all cookie categories to enabled and save preferences
     */
    acceptAllCookies() {
      this.preferences = {
        necessary: true,
        functional: true,
        performance: true,
        targeting: true,
      }
      this.consentGiven = true
      this.showBanner = false
      this.savePreferences()
    },

    /**
     * Rejects all non-necessary cookies, resets preferences to default,
     * sets consent as given, hides the cookie banner, and saves the updated preferences.
     */
    rejectAllCookies() {
      this.preferences = { ...defaultPreferences }
      this.consentGiven = true
      this.showBanner = false
      this.savePreferences()
    },

    /**
     * Save custom cookie preferences
     * @param {object} preferences - Custom cookie preferences
     * @property {boolean} functional - Functional cookies
     * @property {boolean} performance - Performance cookies
     * @property {boolean} targeting - Targeting cookies
     */
    saveCustomPreferences(preferences) {
      this.preferences = {
        necessary: true, // Always true
        ...preferences,
      }
      this.consentGiven = true
      this.showBanner = false
      this.savePreferences()
    },

    /**
     * Save the current consent and preferences state to localStorage.
     * This includes the consent status and the preferences for functional,
     * performance, and targeting cookies.
     */
    savePreferences() {
      window.localStorage.setItem(
        COOKIES_CONSENT_KEY,
        JSON.stringify(this.consentGiven)
      )
      window.localStorage.setItem(
        COOKIES_PREFERENCES_KEY,
        JSON.stringify(this.preferences)
      )
    },

    /**
     * Resets the consent and preferences state to the default state, removing
     * the cookie consent and preferences from localStorage. This will cause the
     * cookie banner to appear again on the next page load.
     */
    resetConsent() {
      this.consentGiven = false
      this.showBanner = true
      this.preferences = { ...defaultPreferences }
      window.localStorage.removeItem(COOKIES_CONSENT_KEY)
      window.localStorage.removeItem(COOKIES_PREFERENCES_KEY)
    },

    /**
     * Updates the value of a specific cookie preference.
     * @param {string} type - The type of cookie preference to update.
     * @param {boolean} value - The new value for the cookie preference.
     */
    updatePreference(type, value) {
      if (type !== 'necessary') {
        // Necessary cookies cannot be disabled
        this.preferences[type] = value
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCookiesStore, import.meta.hot))
}
