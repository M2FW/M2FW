import { CLOSE_DIALOG, CLOSE_DIALOG_ALL, OPEN_DIALOG } from '../actions'
import { Dialog, DialogState } from '../../interfaces/dialog-state'

import { v4 } from 'uuid'

const INITIAL_STATE: DialogState = {
  enableBackdrop: true,
  dialogs: [],
}

export const dialog = (state: DialogState = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case OPEN_DIALOG:
      action.dialog.id = v4()
      state.dialogs.push(action.dialog)
      return state

    case CLOSE_DIALOG:
      state.dialogs = state.dialogs.filter(
        (dialog: Dialog) => dialog.id !== action.dialog.id
      )
      return state
      break

    case CLOSE_DIALOG_ALL:
      state.dialogs = []
      break

    default:
      return state
  }
}
