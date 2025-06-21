const NumericDirective = {
  twoWay: true,
  mounted(el, binding) {
    const input =
      el.querySelector('input') ||
      el.querySelector('textarea') ||
      el.querySelector('[contenteditable]') ||
      el

    const handleInput = (event) => {
      const value = event.target.value
      if (value !== undefined && value !== null) {
        // Permite apenas números, pontos e vírgulas (para decimais)
        let numericValue = value.replace(/[^0-9.,]/g, '')

        // Se binding.value especifica apenas inteiros
        if (binding.value === 'integer') {
          numericValue = numericValue.replace(/[^0-9]/g, '')
        }

        if (event.target.value !== numericValue) {
          event.target.value = numericValue

          const inputEvent = new Event('input', { bubbles: true })
          const changeEvent = new Event('change', { bubbles: true })

          event.target.dispatchEvent(inputEvent)
          event.target.dispatchEvent(changeEvent)
        }
      }
    }

    const handleKeydown = (event) => {
      // Permite teclas de controle (backspace, delete, tab, escape, enter)
      const allowedKeys = [8, 9, 27, 13, 46, 110, 190]

      // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (
        (event.ctrlKey || event.metaKey) &&
        [65, 67, 86, 88].includes(event.keyCode)
      ) {
        return
      }

      // Permite teclas de seta
      if (event.keyCode >= 35 && event.keyCode <= 40) {
        return
      }

      // Se não é uma tecla permitida e não é um número
      if (
        !allowedKeys.includes(event.keyCode) &&
        (event.keyCode < 48 || event.keyCode > 57) &&
        (event.keyCode < 96 || event.keyCode > 105)
      ) {
        // Se binding.value não permite decimais e é ponto/vírgula
        if (
          binding.value === 'integer' &&
          (event.keyCode === 188 ||
            event.keyCode === 190 ||
            event.keyCode === 110)
        ) {
          event.preventDefault()
        }
      }
    }

    const events = ['input', 'keyup', 'paste']
    events.forEach((eventType) => {
      input.addEventListener(eventType, handleInput)
    })

    input.addEventListener('keydown', handleKeydown)

    el._numericHandler = handleInput
    el._numericKeydownHandler = handleKeydown
    el._numericInput = input
    el._numericEvents = events
  },

  unmounted(el) {
    if (el._numericHandler && el._numericInput && el._numericEvents) {
      el._numericEvents.forEach((eventType) => {
        el._numericInput.removeEventListener(eventType, el._numericHandler)
      })
      el._numericInput.removeEventListener('keydown', el._numericKeydownHandler)
      delete el._numericHandler
      delete el._numericKeydownHandler
      delete el._numericInput
      delete el._numericEvents
    }
  },
}

export default NumericDirective
