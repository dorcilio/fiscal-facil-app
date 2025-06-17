import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const Register = () => import(/* webpackChunkName: "register" */ './Index.vue')

const route = {
  path: 'register',
  name: 'register',
  component: Register,
  meta: new MetaComponent('Cadastro', '', MODULES.DEFAULT, false, false, true),
}

export default {
  route,
}
