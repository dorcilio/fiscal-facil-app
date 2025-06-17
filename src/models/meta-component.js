import MODULES from './modules'

class MenuRoot {
  /**
   * Creates a new MenuRoot instance.
   *
   * @param {string} name - A unique name for the MenuRoot, required.
   * @param {string} label - The label for the MenuRoot, required.
   * @param {string} [icon=''] - An optional icon for the MenuRoot.
   * @param {string} [subtitle=''] - An optional subtitle for the MenuRoot.
   */
  constructor(name, label, icon = '', subtitle = '') {
    if (!name) throw new Error('You must provide a name for the MenuRoot')
    if (!label) throw new Error('You must provide a label for the Component')
    this.name = name
    this.label = label
    this.icon = icon
    this.subtitle = subtitle
    this.children = []
  }
}

class MetaComponent {
  /**
   * Constructs a new MetaComponent instance.
   *
   * @param {string} label - The label for the component, required.
   * @param {string} [icon=''] - The icon associated with the component.
   * @param {string} [module=MODULES.DEFAULT] - The module to which the component belongs.
   * @param {boolean} [showInDrawer=true] - Indicates if the component should be shown in the drawer.
   * @param {boolean} [requiresAuth=true] - Indicates if the component requires authentication.
   * @param {boolean} [layoutClean=false] - Indicates if the component has a clean layout.
   * @param {string} [nameMenuRoot=''] - The name of the menu root associated with the component.
   * @param {string} [subtitle=''] - The subtitle of the component.
   *
   * @throws {Error} If the label is not provided.
   */
  constructor(
    label,
    icon = '',
    module = MODULES.DEFAULT,
    showInDrawer = true,
    requiresAuth = true,
    layoutClean = false,
    nameMenuRoot = '',
    subtitle = ''
  ) {
    if (!label) throw new Error('You must provide a label for the Component')
    this.label = label
    this.icon = icon
    this.module = module
    this.showInDrawer = showInDrawer
    this.requiresAuth = requiresAuth
    this.layoutClean = layoutClean
    this.nameMenuRoot = nameMenuRoot
    this.subtitle = subtitle
  }

  /**
   * Verifies if the current module matches the provided module.
   *
   * @param {string} [module=MODULES.DEFAULT] - The module to check.
   * @returns {boolean} True if the module matches, false otherwise.
   */
  checkModule(module = MODULES.DEFAULT) {
    return this.module === module
  }

  /**
   * Checks if the module associated with the component belongs to the provided modules.
   *
   * @param {string[]} [modules=[]] - An array of modules to check.
   * @returns {boolean} True if the module belongs to the array, false otherwise.
   */
  containsModule(modules = []) {
    return modules.includes(this.module)
  }
}

export default MetaComponent

export { MetaComponent, MenuRoot }
