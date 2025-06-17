import MetaComponent from '../../models/meta-component'
import MODULES from '../../models/modules'
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ './Index.vue')

const route = {
  path: 'dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: new MetaComponent(
    'Dashboard',
    'fas fa-chart-line',
    MODULES.DEFAULT,
    true,
    true
  ),
}

export default {
  route,
}
