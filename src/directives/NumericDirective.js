const NumericDirective = {
  twoWay: true,
  mounted: function (el) {
    const handlerInput = (e) => {
      const hasNumberRgx = /^[0-9]*$/
      const numberRgx = /[^0-9]/g
      if (!hasNumberRgx.test(e.target.value)) {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        e.target.value = e.target.value.replace(numberRgx, '')
        e.target.setSelectionRange(start, end)
        e.target.dispatchEvent(new CustomEvent('input'))
      }
    }
    el.addEventListener('input', handlerInput)
  },
}

export default NumericDirective
