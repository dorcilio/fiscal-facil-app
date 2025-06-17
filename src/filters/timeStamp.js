import { DateTime } from 'luxon'

const timeStamp = (value, format = 'dd/MM/yyyy HH:mm:ss') => {
  return value ? DateTime.fromISO(value).toFormat(format) : ''
}

export default timeStamp
