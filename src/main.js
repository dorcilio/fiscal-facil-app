import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-options'
import router from './router/index'
import filters from './filters/index'
import {
  MoneyDirective,
  UpperCaseDirective,
  CapitalizeDirective,
  UnaccentDirective,
  UnaccentUpperCaseDirective,
  NumericDirective,
} from './directives/index'
import PContainer from './components/PContainer.vue'

// Assumes your root component is App.vue
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.component('PContainer', PContainer)

app.config.globalProperties.$filters = filters
app.directive('money', MoneyDirective)
app.directive('upper-case', UpperCaseDirective)
app.directive('capitalize', CapitalizeDirective)
app.directive('unaccent', UnaccentDirective)
app.directive('unaccent-upper-case', UnaccentUpperCaseDirective)
app.directive('numeric', NumericDirective)

app.use(router)
app.use(pinia)
app.use(Quasar, quasarUserOptions)

// Assumes you have a <div id="app"></div> in your index.html
app.mount('#app')
