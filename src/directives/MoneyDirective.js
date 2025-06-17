import { format } from '../shared/money/util'
import { setCursor, event } from '../shared/input'
import assign from '../shared/money/assign'
import defaults from '../shared/money/option'

const MoneyDirective = {
  mounted(el, binding) {
    if (!binding.value) return
    const opt = assign(defaults, binding.value)

    // money used on a component that's not a input
    if (el.tagName.toLocaleUpperCase() !== 'INPUT') {
      const els = el.getElementsByTagName('input')
      if (els.length !== 1) {
        throw new Error('money requires 1 input, found ' + els.length)
      } else {
        el = els[0]
      }
    }

    let backspacePressed = false
    el.onkeydown = (e) => {
      backspacePressed = e.which === 8 || e.which === 46 || false
    }

    el.onkeyup = (e) => {
      backspacePressed = e.which === 8 || e.which === 46 || false
    }

    el.oninput = () => {
      const auxValue = el.value ? el.value.replace(/[^0-9]/g, '') : ''
      if (backspacePressed && auxValue === '00') {
        if (typeof opt.emptyValue === 'number') {
          el.value = opt.emptyValue.toFixed(2)
        } else if (
          opt.emptyValue !== null &&
          opt.emptyValue !== '' &&
          !isNaN(opt.emptyValue)
        ) {
          const number = parseFloat(opt.emptyValue)
          el.value = number.toFixed(2)
        } else {
          el.value = opt.emptyValue
        }
      }
      let positionFromEnd = el.value.length - el.selectionEnd
      el.value = format(el.value, opt)
      positionFromEnd = Math.max(positionFromEnd, opt.suffix.length) // right
      positionFromEnd = el.value.length - positionFromEnd
      positionFromEnd = Math.max(positionFromEnd, opt.prefix.length + 1) // left
      setCursor(el, positionFromEnd)
      el.dispatchEvent(event('change')) // v-model.lazy
    }

    el.onfocus = () => {
      setCursor(el, el.value.length - opt.suffix.length)
    }

    el.oninput()
    el.dispatchEvent(event('input')) // force format after initialization
  },
}

export default MoneyDirective
