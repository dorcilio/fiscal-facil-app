import { capitalize } from '../utils/input'

const CapitalizeDirective = {
  twoWay: true,
  mounted: function (el) {
    const handlerInput = (e) => {
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = capitalize(e.target.value)
      e.target.setSelectionRange(start, end)
      e.target.dispatchEvent(new CustomEvent('input'))
    }
    el.addEventListener('input', handlerInput)
  },
}

export default CapitalizeDirective
