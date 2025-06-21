const UpperCaseDirective = {
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
        const upperValue = value.toUpperCase()

        if (event.target.value !== upperValue) {
          event.target.value = upperValue

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

    el._uppercaseHandler = handleInput
    el._uppercaseInput = input
    el._uppercaseEvents = events
  },

  unmounted(el) {
    if (el._uppercaseHandler && el._uppercaseInput && el._uppercaseEvents) {
      el._uppercaseEvents.forEach((eventType) => {
        el._uppercaseInput.removeEventListener(eventType, el._uppercaseHandler)
      })
      delete el._uppercaseHandler
      delete el._uppercaseInput
      delete el._uppercaseEvents
    }
  },
}

export default UpperCaseDirective
