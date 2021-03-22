import { HotKeyMapper } from '../interfaces'

/**
 * @description Mapped object for action and keys by default
 */
const DEFAULT_KEY_MAP: HotKeyMapper = {
  TOGGLE_EDITING: ['Enter'],
  CANCEL_EDITING: ['Escape'],
  MOVE_FOCUSING: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  MOVE_FOCUSING_UP: ['ArrowUp'],
  MOVE_FOCUSING_DOWN: ['ArrowDown'],
  MOVE_FOCUSING_LEFT: ['ArrowLeft'],
  MOVE_FOCUSING_RIGHT: ['ArrowRight'],
  SELECT_ROW: ['Space'],
  DELETE_ROW: ['Delete'],
}

export enum KeyActions {
  TOGGLE_EDITING = 'TOGGLE_EDITING',
  CANCEL_EDITING = 'CANCEL_EDITING',
  MOVE_FOCUSING = 'MOVE_FOCUSING',
  MOVE_FOCUSING_LEFT = 'MOVE_FOCUSING_LEFT',
  MOVE_FOCUSING_RIGHT = 'MOVE_FOCUSING_RIGHT',
  MOVE_FOCUSING_UP = 'MOVE_FOCUSING_UP',
  MOVE_FOCUSING_DOWN = 'MOVE_FOCUSING_DOWN',
  SELECT_ROW = 'SELECT_ROW',
  DELETE_ROW = 'DELETE_ROW',
}

/**
 * @description Every section of checking logic for valid key for specific action is pressed or not  is done by this function
 *
 * @param key key code, ex: Enter, ArrowUp, Space, Delete
 * @param action Key Action list which is can be used in table component.
 * @param keyMap Mapped object for checking current provided key is invloved in key map for provided action
 *
 * @returns {Boolean} Whether the key is involved in for the action by configured keyMap
 */
export function keyMapper(key: string, action: KeyActions, keyMap: HotKeyMapper = DEFAULT_KEY_MAP): boolean {
  return Boolean(keyMap[action].indexOf(key) >= 0)
}
