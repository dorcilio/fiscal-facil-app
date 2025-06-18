import { unaccent } from '../utils/input'

const UnaccentUpperCaseDirective = {
  twoWay: true,
  mounted: function (el) {
    const handlerInput = (e) => {
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = unaccent(e.target.value).toUpperCase()
      e.target.setSelectionRange(start, end)
      e.target.dispatchEvent(new CustomEvent('input'))
    }
    el.addEventListener('input', handlerInput)
  },
}

export default UnaccentUpperCaseDirective
