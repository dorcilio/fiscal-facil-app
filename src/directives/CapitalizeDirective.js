import { capitalize } from '../utils/input'

const CapitalizeDirective = {
  twoWay: true,
  mounted(el) {
    // Melhor seletor para componentes Quasar
    const input =
      el.querySelector('input') ||
      el.querySelector('textarea') ||
      el.querySelector('[contenteditable]') ||
      el

    const handleInput = (event) => {
      const value = event.target.value
      if (value !== undefined && value !== null) {
        const capitalizedValue = capitalize(value)

        if (event.target.value !== capitalizedValue) {
          event.target.value = capitalizedValue

          // Para componentes Vue/Quasar, também disparar eventos customizados
          const inputEvent = new Event('input', { bubbles: true })
          const changeEvent = new Event('change', { bubbles: true })

          event.target.dispatchEvent(inputEvent)
          event.target.dispatchEvent(changeEvent)
        }
      }
    }

    // Adicionar listeners para múltiplos eventos
    const events = ['input', 'keyup', 'paste']
    events.forEach((eventType) => {
      input.addEventListener(eventType, handleInput)
    })

    // Armazenar referências para cleanup
    el._capitalizeHandler = handleInput
    el._capitalizeInput = input
    el._capitalizeEvents = events
  },

  unmounted(el) {
    if (el._capitalizeHandler && el._capitalizeInput && el._capitalizeEvents) {
      el._capitalizeEvents.forEach((eventType) => {
        el._capitalizeInput.removeEventListener(
          eventType,
          el._capitalizeHandler
        )
      })
      delete el._capitalizeHandler
      delete el._capitalizeInput
      delete el._capitalizeEvents
    }
  },
}

export default CapitalizeDirective
