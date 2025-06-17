import { routes } from './index.js'
import MODULES, { allModules } from '../models/modules'
import { MetaComponent, MenuRoot } from '../models/meta-component.js'

const menusRoot = [new MenuRoot('users', 'Usuários', 'fa-solid fa-users')]

let itens = []
if (routes && routes.length) {
  const components = routes[0].children || []
  for (let i = 0; i < components.length; i++) {
    if (components[i].meta && components[i].meta instanceof MetaComponent) {
      const item = {
        name: components[i].name,
        path: components[i].path.startsWith('/')
          ? components[i].path
          : `/${components[i].path}`,
        label: components[i].meta?.label ?? '',
        icon: components[i].meta?.icon ?? '',
        module: components[i].meta?.module ?? '',
        showInDrawer: components[i].meta?.showInDrawer ?? true,
        requiresAuth: components[i].meta?.requiresAuth ?? true,
        layoutClean: components[i].meta?.layoutClean ?? false,
        nameMenuRoot: components[i].meta?.nameMenuRoot ?? '',
        subtitle: components[i].meta?.subtitle ?? '',
      }
      itens = [...itens, item]
    }
  }
}

const findMenusRootByName = (name) => {
  return menusRoot.find((rootItem) => rootItem.name === name)
}

const parsedItensDrawer = (modules = [MODULES.DEFAULT]) => {
  if (modules.includes('*')) modules = allModules
  const roots = itens
    .filter((item, index, array) => {
      return (
        array.findIndex((object) => {
          return (
            object.nameMenuRoot &&
            object.nameMenuRoot === item.nameMenuRoot &&
            modules.includes(object.module)
          )
        }) === index
      )
    })
    .map(({ nameMenuRoot }) => {
      return findMenusRootByName(nameMenuRoot)
    })
  for (let i = 0; i < roots.length; i++) {
    roots[i].children = itens
      .filter((item) => {
        return (
          item.nameMenuRoot === roots[i].name &&
          item.showInDrawer &&
          modules.includes(item.module)
        )
      })
      .map(({ name, label, path, icon, subtitle, nameMenuRoot }) => {
        return {
          name,
          label,
          path,
          icon,
          subtitle,
          nameMenuRoot,
        }
      })
  }
  const others = itens.filter((item) => {
    return !item.root && item.showInDrawer && modules.includes(item.module)
  })
  return [...others, ...roots.filter((root) => root.children.length > 0)]
}

const filteredNavItens = () => {
  return itens.filter((item) => item.showInDrawer)
}

const filteredLayoutClean = () => {
  return itens.filter((item) => item.layoutClean)
}

const filterItensByRoute = (pathRoute) => {
  return itens.find((route) => route.path === pathRoute)
}

export default {
  itens,
  parsedItensDrawer,
  filteredNavItens,
  filteredLayoutClean,
  filterItensByRoute,
}

export {
  itens,
  parsedItensDrawer,
  filteredNavItens,
  filteredLayoutClean,
  filterItensByRoute,
}
