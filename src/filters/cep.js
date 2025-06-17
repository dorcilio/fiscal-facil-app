const cep = (value) => {
  if (value && value.length === 8) {
    value = value.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3')
  }
  return value
}

export default cep
