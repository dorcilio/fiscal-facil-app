const decimal = (value, suffix = '', prefix = '') => {
  if (value && !isNaN(parseFloat(value)) && isFinite(value)) {
    if (prefix && suffix) {
      return `${prefix} ${parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        style: 'decimal',
      })} ${suffix}`
    } else if (prefix) {
      return `${prefix} ${parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        style: 'decimal',
      })}`
    } else if (suffix) {
      return `${parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        style: 'decimal',
      })} ${suffix}`
    } else {
      return parseFloat(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        style: 'decimal',
      })
    }
  } else {
    return value
  }
}

export default decimal
