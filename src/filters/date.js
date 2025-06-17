import { DateTime } from 'luxon'

const date = (value, format = 'dd/MM/yyyy') => {
  return value ? DateTime.fromISO(value).toFormat(format) : ''
}

export default date
