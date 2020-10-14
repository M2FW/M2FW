import { Store } from '@m2fw/redux-manager'
import { MenuItemInterface, MenuTreeStateInterface } from '../../interfaces'
import { SET_CURRENT_MENU, SET_MENUS } from '../actions/menuTree'

const INITIAL_STATE: MenuTreeStateInterface = {
  menus: [],
  navigator: () => {},
}

export const menuTree = (
  state: Record<string, any> = INITIAL_STATE,
  action: MenuTreeStateInterface & { type: string }
): any => {
  switch (action.type) {
    case SET_CURRENT_MENU:
      return {
        ...state,
        currentMenu: action.currentMenu,
      }

    case SET_MENUS:
      return {
        ...state,
        menus: action.menus,
      }

    default:
      return state
  }
}

export function setCurrentMenu(
  store: Store,
  currentMenu: MenuItemInterface
): void {
  store.dispatch({ type: SET_CURRENT_MENU, currentMenu })
}

export function setMenus(store: Store, menus: MenuItemInterface[]): void {
  store.dispatch({ type: SET_MENUS, menus })
}
