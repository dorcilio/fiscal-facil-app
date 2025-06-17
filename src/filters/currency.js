const currency = (value, defaultValue = '') => {
  if ((value || value === 0) && !isNaN(parseFloat(value)) && isFinite(value)) {
    return parseFloat(value).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      style: 'currency',
      currency: 'BRL',
    })
  } else {
    return defaultValue
  }
}

export default currency
