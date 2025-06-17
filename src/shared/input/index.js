const setCursor = (el, position) => {
  const setSelectionRange = () => {
    el.setSelectionRange(position, position)
  }
  if (el === document.activeElement) {
    setSelectionRange()
    setTimeout(setSelectionRange, 1) // Android Fix
  }
}

// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#The_old-fashioned_way
const event = (name) => {
  const evt = document.createEvent('Event')
  evt.initEvent(name, true, true)
  return evt
}

const unaccent = (value) => {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

const capitalize = (value) => {
  return value
    .toLowerCase()
    .split(' ')
    .map(
      (value) =>
        `${value.charAt(0).toUpperCase()}${value.substring(1).toLowerCase()}`
    )
    .join(' ')
}

export { setCursor, event, unaccent, capitalize }
