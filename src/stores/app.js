import { defineStore, acceptHMRUpdate } from 'pinia'

const DARK_MODE_KEY = 'ff-dark-mode'
const localdarkMode = JSON.parse(window.localStorage.getItem(DARK_MODE_KEY))

// This store manages the dark mode theme setting for the application
// It allows toggling between dark and light modes and persists the setting in localStorage
export const useAppStore = defineStore('app', {
  state: () => ({
    darkMode: localdarkMode ? localdarkMode : false,
  }),
  getters: {
    isDarkMode: (state) => state.darkMode,
  },
  actions: {
    /**
     * Toggles the dark mode theme setting for the application.
     * This function updates the dark mode state and persists it in localStorage.
     */
    changeTheme() {
      window.localStorage.setItem(DARK_MODE_KEY, !this.darkMode)
      this.darkMode = !this.darkMode
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
