import { Notify } from 'quasar'

/**
 * Enhanced notification service with better error handling and type safety
 * @param {Object} options - Notification options
 * @param {string} options.color - Notification color
 * @param {string} options.icon - Custom icon
 * @param {string} options.message - Notification message
 * @param {boolean} options.multiLine - Multi-line support
 * @param {boolean} options.html - HTML support
 * @param {string} options.caption - Caption text
 * @param {boolean} options.progress - Show progress bar
 * @param {number} options.timeout - Auto-dismiss timeout
 * @param {string} options.position - Notification position
 * @param {Error} options.error - Error object for logging
 * @param {Array} options.actions - Action buttons
 */
export const notify = ({
  color = 'positive',
  icon,
  message,
  multiLine = false,
  html = false,
  caption,
  progress = true,
  timeout = 5000,
  position = 'top-right',
  error,
  actions = [],
}) => {
  // Enhanced error logging
  if (error) {
    console.group('🚨 Notification Error')
    console.error('Error details:', error)
    console.error('Stack trace:', error.stack)
    console.groupEnd()
  }

  // Validate required parameters
  if (!message || typeof message !== 'string') {
    console.warn('Notification message is required and must be a string')
    return
  }

  // Smart icon selection
  const iconDef = icon || getDefaultIcon(color)

  // Smart caption generation
  const captionDef = caption || getDefaultCaption(color)

  try {
    Notify.create({
      message,
      multiLine,
      html,
      caption: captionDef,
      progress,
      timeout,
      icon: iconDef,
      color,
      position,
      actions: actions.map((action) => ({
        ...action,
        // Ensure action handlers are wrapped in try-catch
        handler: action.handler ? wrapActionHandler(action.handler) : undefined,
      })),
    })
  } catch (notifyError) {
    console.error('Failed to create notification:', notifyError)
    // Fallback to basic browser notification
    if ('Notification' in window) {
      new Notification(message)
    }
  }
}

/**
 * Get default icon based on notification color
 * @param {string} color - Notification color
 * @returns {string} Icon name
 */
const getDefaultIcon = (color) => {
  const iconMap = {
    positive: 'fas fa-check',
    negative: 'fas fa-exclamation-triangle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
  }
  return iconMap[color] || 'fas fa-bell'
}

/**
 * Get default caption based on notification color
 * @param {string} color - Notification color
 * @returns {string} Caption text
 */
const getDefaultCaption = (color) => {
  const captionMap = {
    negative: 'Tente novamente ou procure o suporte!',
    warning: 'Atenção necessária',
    info: 'Informação',
  }
  return captionMap[color] || ''
}

/**
 * Wrap action handler with error handling
 * @param {Function} handler - Original handler
 * @returns {Function} Wrapped handler
 */
const wrapActionHandler = (handler) => {
  return (...args) => {
    try {
      return handler(...args)
    } catch (error) {
      console.error('Notification action handler error:', error)
    }
  }
}

// Convenience methods for common notification types
export const notifySuccess = (message, options = {}) => {
  notify({ ...options, message, color: 'positive' })
}

export const notifyError = (
  message,
  error,
  options = {
    timeout: 10000,
  }
) => {
  notify({ ...options, message, color: 'negative', error })
}

export const notifyWarning = (message, options = {}) => {
  notify({ ...options, message, color: 'warning' })
}

export const notifyInfo = (message, options = {}) => {
  notify({ ...options, message, color: 'info' })
}

export default notify
