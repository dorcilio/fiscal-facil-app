import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const Apis = () => import(/* webpackChunkName: "apis" */ './Index.vue')

const route = {
  path: 'apis',
  name: 'apis',
  component: Apis,
  meta: new MetaComponent(
    "API's",
    'fa-solid fa-network-wired',
    MODULES.DEFAULT,
    false,
    true,
    false
  ),
}

export default {
  route,
}
