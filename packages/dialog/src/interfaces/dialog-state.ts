import { TemplateResult } from 'lit-element'

export interface Dialog {
  id?: string
  template: {
    header?: TemplateResult
    content?: TemplateResult
  }
}

export interface DialogState {
  dialogs: Dialog[]
}
