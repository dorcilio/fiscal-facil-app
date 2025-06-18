import defaults from './option'

const format = (input, opt = defaults) => {
  if (input === '' || input === null || input === undefined) {
    return opt.emptyValue
  }

  if (typeof input === 'number') {
    input = input.toFixed(fixed(opt.precision))
  }
  const negative = input.indexOf('-') >= 0 ? '-' : ''

  const numbers = onlyNumbers(input)
  const currency = numbersToCurrency(numbers, opt.precision)
  const parts = toStr(currency).split('.')
  let integer = parts[0]
  const decimal = parts[1]
  integer = addThousandSeparator(integer, opt.thousands)
  return (
    opt.prefix +
    negative +
    joinIntegerAndDecimal(integer, decimal, opt.decimal) +
    opt.suffix
  )
}

const unformat = (input, opt = defaults) => {
  if (input === '' || input === null || input === undefined) {
    return opt.emptyValue
  }
  const negative = input.indexOf('-') >= 0 ? -1 : 1
  const numbers = onlyNumbers(input)
  const currency = numbersToCurrency(numbers, opt.precision)
  return parseFloat(currency) * negative
}

const onlyNumbers = (input) => {
  return toStr(input).replace(/\D+/g, '') || '0'
}

// Uncaught RangeError: toFixed() digits argument must be between 0 and 20 at Number.toFixed
const fixed = (precision) => {
  return between(0, precision, 20)
}

const between = (min, n, max) => {
  return Math.max(min, Math.min(n, max))
}

const numbersToCurrency = (numbers, precision) => {
  const exp = Math.pow(10, precision)
  const float = parseFloat(numbers) / exp
  return float.toFixed(fixed(precision))
}

const addThousandSeparator = (integer, separator) => {
  return integer.replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
}

// const currencyToIntegerAndDecimal = (float) => {
//   return toStr(float).split('.')
// }

const joinIntegerAndDecimal = (integer, decimal, separator) => {
  return decimal ? integer + separator + decimal : integer
}

const toStr = (value) => {
  return value ? value.toString() : ''
}

export { format, unformat }
