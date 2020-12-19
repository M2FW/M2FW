import { TemplateResult } from 'lit-element'

export interface Dialog {
  id?: string
  templateRenderer: {
    header?: ((dialog: Dialog) => TemplateResult) | TemplateResult
    content: ((dialog: Dialog) => TemplateResult) | TemplateResult
  }
}

export interface DialogState {
  dialogs: Dialog[]
  enableBackdrop?: boolean
}
