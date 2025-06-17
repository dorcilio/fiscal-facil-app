import { createRouter, createWebHashHistory } from 'vue-router'
import beforeEach from './beforeEach'
// Components routes
import Dashboard from '../views/dashboard'
import Login from '../views/login'
import Register from '../views/register'

// Layouts
const PLayout = () =>
  import(/* webpackChunkName: "pLayout" */ '../components/layout/PLayout.vue')
const ErrorNotFound = () =>
  import(
    /* webpackChunkName: "errorNotFound" */ '../components/layout/ErrorNotFound.vue'
  )

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: PLayout,
    children: [Dashboard.route, Login.route, Register.route],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
router.beforeEach(beforeEach)

export default router

export { router, routes }
