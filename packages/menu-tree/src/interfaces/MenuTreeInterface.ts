export interface MenuTreeStateInterface {
  menus: MenuItemInterface[]
  extended?: MenuItemInterface[]
  currentMenu?: MenuItemInterface
  navigator: Function
}

export interface MenuItemInterface {
  text: string
  routing: string
  menus?: MenuItemInterface[]
}

export interface AccessKeyMapperInterface {
  routing: string
  text: string
  subMenus: string
}
