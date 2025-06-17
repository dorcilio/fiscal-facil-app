const fone = (value) => {
  if (value && value.length === 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  } else if (value && value.length === 11) {
    value = value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2$3-$4')
  }
  return value
}

export default fone
