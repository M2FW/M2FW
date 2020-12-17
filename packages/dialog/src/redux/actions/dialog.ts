import { Dialog } from '../../interfaces/dialog-state'
import { store } from '@m2fw/redux-manager'

export const OPEN_DIALOG = 'OPEN_DIALOG'
export const CLOSE_DIALOG = 'CLOSE_DIALOG'
export const CLOSE_DIALOG_ALL = 'CLOSE_DIALOG_ALL'

export function openDialog(dialog: Dialog) {
  store.dispatch({ type: OPEN_DIALOG, dialog })
}

export function closeDialog(dialog: Dialog) {
  store.dispatch({ type: CLOSE_DIALOG, dialog })
}

export function closeDialogAll() {
  store.dispatch({ type: CLOSE_DIALOG_ALL })
}
