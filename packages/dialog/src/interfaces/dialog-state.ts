import { html as DialogHtml, TemplateResult } from 'lit-element'

export interface Dialog {
  id?: string
  templateRenderer: {
    header?: (html: typeof DialogHtml, dialog: Dialog) => TemplateResult
    content: (html: typeof DialogHtml, dialog: Dialog) => TemplateResult
  }
}

export interface DialogState {
  dialogs: Dialog[]
  enableBackdrop?: boolean
}
