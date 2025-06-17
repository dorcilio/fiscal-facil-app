import quasarLang from 'quasar/lang/pt-BR.js'
import quasarIconSet from 'quasar/icon-set/fontawesome-v6'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import {
  Notify,
  Loading,
  LoadingBar,
  BottomSheet,
  AddressbarColor,
  AppFullscreen,
  Dialog,
} from 'quasar'

// Import Quasar CSS
import 'quasar/src/css/index.sass'
import './styles/quasar.scss'

// Needed only for iOS PWAs
if (
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
  !window.MSStream &&
  window.navigator.standalone
) {
  import(/* webpackChunkName: "fastclick"  */ '@quasar/fastclick')
}

// To be used on app.use(Quasar, { ... })
export default {
  config: {
    notify: {
      timeout: 5000,
      position: 'top-right',
      classes: 'text-bold',
      textColor: 'white',
      actions: [{ icon: 'fas fa-times', color: 'white' }],
    },
  },
  plugins: {
    Notify,
    Loading,
    LoadingBar,
    BottomSheet,
    AddressbarColor,
    AppFullscreen,
    Dialog,
  },
  lang: quasarLang,
  iconSet: quasarIconSet,
}
