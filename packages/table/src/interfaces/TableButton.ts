import { ButtonType } from '../enums/button-type'
import { TableData } from './TableData'

export interface TableButton {
  type: ButtonType
  options: IconButtonOptions | TextButtonOptions
}

export interface ButtonOptionHandlers {
  click?: ({ record, rowIdx }: { record: any; rowIdx: number }) => void | any
  dblclick?: ({ record, rowIdx }: { record: any; rowIdx: number }) => void | any
}

export interface ButtonOptions {
  handlers?: ButtonOptionHandlers
}

type IconRenderFunctionType = (record?: TableData) => HTMLElement

export interface IconButtonOptions extends ButtonOptions {
  icon: IconRenderFunctionType | string
}

type TextRenderFunctionType = (record?: TableData) => string
export interface TextButtonOptions extends ButtonOptions {
  text: TextRenderFunctionType | string
}
