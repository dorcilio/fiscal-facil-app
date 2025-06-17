import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const Login = () => import(/* webpackChunkName: "login" */ './Index.vue')

const route = {
  path: 'login',
  name: 'login',
  component: Login,
  meta: new MetaComponent('Login', '', MODULES.DEFAULT, false, false, true),
}

export default {
  route,
}
