export interface MenuTreeState {
  menus: MenuItem[]
  extended?: MenuItem[]
  currentMenu?: MenuItem
  navigator: () => any
}

export interface MenuItem {
  text: string
  routing: string
  menus?: MenuItem[]
}

export interface AccessKeyMapper {
  routing: string
  text: string
  subMenus: string
}
