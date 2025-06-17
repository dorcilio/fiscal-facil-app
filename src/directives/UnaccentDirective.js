import { unaccent } from '../shared/input'

const UnaccentDirective = {
  twoWay: true,
  mounted: function (el) {
    const handlerInput = (e) => {
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      e.target.value = unaccent(e.target.value)
      e.target.setSelectionRange(start, end)
      e.target.dispatchEvent(new CustomEvent('input'))
    }
    el.addEventListener('input', handlerInput)
  },
}

export default UnaccentDirective
