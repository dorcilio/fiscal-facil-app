import { notifyWarning } from '../plugins'
import { useUserStore } from '../stores/user'

/**
 * Atualiza o título da página com base na rota atual.
 * Tenta usar o label definido na rota, caso contrário, usa o nome da rota.
 * Se nenhuma dessas opções for possível, usa o título padrão.
 * @param {VueRouter.NavigationGuard} route - Rota atual
 */
function updatePageTitle(route) {
  const defaultTitle = 'Fiscal Fácil'

  if (route.meta && route.meta.label) {
    document.title = `${route.meta.label} - ${defaultTitle}`
  } else {
    // Fallback: usar o nome da rota ou título padrão
    const routeName = route.name
      ? route.name.charAt(0).toUpperCase() + route.name.slice(1)
      : ''
    document.title = routeName ? `${routeName} - ${defaultTitle}` : defaultTitle
  }
}

const beforeEach = (to, from, next) => {
  updatePageTitle(to)
  const userStore = useUserStore()
  if (to.meta?.requiresAuth && !userStore.isLoggedIn) {
    notifyWarning('Você deve estar logado para acessar esse módulo')
    next({ path: '/login' })
  } else {
    if (
      userStore.getModulesByUser.includes(to.meta?.module ?? '') ||
      userStore.getModulesByUser.includes('*')
    ) {
      next()
    } else {
      notifyWarning('Você não tem permissão para acessar esse módulo')
      next({ path: '/' })
    }
  }
}

export default beforeEach
