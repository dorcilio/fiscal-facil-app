import { unaccent } from '../utils/input'

const UnaccentDirective = {
  twoWay: true,
  ounted(el) {
    const input =
      el.querySelector('input') ||
      el.querySelector('textarea') ||
      el.querySelector('[contenteditable]') ||
      el

    const handleInput = (event) => {
      const value = event.target.value
      if (value !== undefined && value !== null) {
        const unaccentedValue = unaccent(value)

        if (event.target.value !== unaccentedValue) {
          event.target.value = unaccentedValue

          const inputEvent = new Event('input', { bubbles: true })
          const changeEvent = new Event('change', { bubbles: true })

          event.target.dispatchEvent(inputEvent)
          event.target.dispatchEvent(changeEvent)
        }
      }
    }

    const events = ['input', 'keyup', 'paste']
    events.forEach((eventType) => {
      input.addEventListener(eventType, handleInput)
    })

    el._unaccentHandler = handleInput
    el._unaccentInput = input
    el._unaccentEvents = events
  },

  unmounted(el) {
    if (el._unaccentHandler && el._unaccentInput && el._unaccentEvents) {
      el._unaccentEvents.forEach((eventType) => {
        el._unaccentInput.removeEventListener(eventType, el._unaccentHandler)
      })
      delete el._unaccentHandler
      delete el._unaccentInput
      delete el._unaccentEvents
    }
  },
}

export default UnaccentDirective
