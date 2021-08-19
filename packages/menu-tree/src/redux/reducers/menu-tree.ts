import { MenuItem, MenuTreeState } from '../../interfaces'
import { SET_CURRENT_MENU, SET_MENUS } from '../actions/menu-tree'

import { Store } from '@m2-modules/redux-manager'

const INITIAL_STATE: MenuTreeState = {
  menus: [],
  navigator: () => {},
}

export const menuTree = (state: Record<string, any> = INITIAL_STATE, action: MenuTreeState & { type: string }): any => {
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

export function setCurrentMenu(store: Store, currentMenu: MenuItem): void {
  store.dispatch({ type: SET_CURRENT_MENU, currentMenu })
}

export function setMenus(store: Store, menus: MenuItem[]): void {
  store.dispatch({ type: SET_MENUS, menus })
}
