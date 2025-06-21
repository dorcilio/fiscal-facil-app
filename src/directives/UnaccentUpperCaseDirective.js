import { unaccent } from '../utils/input'

const UnaccentUpperCaseDirective = {
  twoWay: true,
  mounted(el) {
    const input =
      el.querySelector('input') ||
      el.querySelector('textarea') ||
      el.querySelector('[contenteditable]') ||
      el

    const handleInput = (event) => {
      const value = event.target.value
      if (value !== undefined && value !== null) {
        const processedValue = unaccent(value).toUpperCase()

        if (event.target.value !== processedValue) {
          event.target.value = processedValue

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

    el._unaccentUpperHandler = handleInput
    el._unaccentUpperInput = input
    el._unaccentUpperEvents = events
  },

  unmounted(el) {
    if (
      el._unaccentUpperHandler &&
      el._unaccentUpperInput &&
      el._unaccentUpperEvents
    ) {
      el._unaccentUpperEvents.forEach((eventType) => {
        el._unaccentUpperInput.removeEventListener(
          eventType,
          el._unaccentUpperHandler
        )
      })
      delete el._unaccentUpperHandler
      delete el._unaccentUpperInput
      delete el._unaccentUpperEvents
    }
  },
}

export default UnaccentUpperCaseDirective
