import { Notify } from 'quasar'

const sendMessage = ({
  color = 'positive',
  icon,
  message,
  multiLine = false,
  html = false,
  caption,
  progress = true,
  timeout = 5000,
  position = 'top-right',
  error,
}) => {
  if (error) {
    console.error(error)
  }
  const iconDef =
    icon ||
    (color === 'positive'
      ? 'fas fa-check'
      : color === 'negative' || color === 'warning'
        ? 'fas fa-exclamation-triangle'
        : '')
  const captionDef =
    caption ||
    (color === 'negative' ? 'Tente novamente ou procure o suporte!' : '')
  Notify.create({
    message: message,
    multiLine,
    html,
    caption: captionDef,
    progress: progress,
    timeout: timeout,
    icon: iconDef,
    color: color,
    position: position,
  })
}

export { sendMessage }

export default sendMessage
