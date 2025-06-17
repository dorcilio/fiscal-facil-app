import { DateTime } from 'luxon'

const timeStampNow = (value) => {
  return value
    ? DateTime.fromISO(value).setLocale('pt-br').toRelative({ unit: 'days' })
    : ''
}

export default timeStampNow
