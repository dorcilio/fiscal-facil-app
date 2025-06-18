import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const RegistrationPage = () =>
  import(/* webpackChunkName: "registrationPage" */ './RegistrationPage.vue')

const route = {
  path: 'registration',
  name: 'registration',
  component: RegistrationPage,
  meta: new MetaComponent('Cadastro', '', MODULES.DEFAULT, false, false, true),
}

export default {
  route,
}
