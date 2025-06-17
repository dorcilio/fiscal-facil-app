const arrayEquals = (a, b) => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

const toDateBR = (dateUS) => {
  return dateUS ? dateUS.split('-').reverse().join('/') : dateUS
}

const fixPhoneBR = (phone = '') => {
  if (phone.length === 10) {
    if (phone.charAt(2) === '9' || phone.charAt(2) === '8') {
      return `${phone.substring(0, 2)}9$${phone.substring(2)}`
    }
  }
  return phone
}

const extractFileNameContentDisposition = (attachmentValue) => {
  const match = attachmentValue.match(
    /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/
  )
  return match && match.length > 1 ? match[1] : match[0]
}

const downloadFile = (blob, fileName) => {
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    const a = document.createElement('a')
    document.body.appendChild(a)
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = fileName
    a.click()
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 1)
  }
}

const formatBytes = (bytes, casaDecimal = 2) => {
  if (!+bytes) return '0 Bytes'
  const c = 0 > casaDecimal ? 0 : casaDecimal,
    d = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, d)).toFixed(c))} ${['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]}`
}

const wrapCsvValue = (val, formatFn, row) => {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  arrayEquals,
  toDateBR,
  fixPhoneBR,
  extractFileNameContentDisposition,
  downloadFile,
  formatBytes,
  wrapCsvValue,
}

export {
  arrayEquals,
  toDateBR,
  fixPhoneBR,
  extractFileNameContentDisposition,
  downloadFile,
  formatBytes,
  wrapCsvValue,
}
