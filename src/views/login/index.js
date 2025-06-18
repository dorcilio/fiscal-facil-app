import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const LoginPage = () =>
  import(/* webpackChunkName: "loginPage" */ './LoginPage.vue')

const route = {
  path: 'login',
  name: 'login',
  component: LoginPage,
  meta: new MetaComponent('Login', '', MODULES.DEFAULT, false, false, true),
}

export default {
  route,
}
