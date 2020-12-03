import { ButtonType } from '../enums/ButtonType'
import { TableData } from './TableData'

export interface TableButton {
  type: ButtonType
  options: IconButtonOptions | TextButtonOptions
}

export interface ButtonOptionHandlers {
  click?: (record: TableData) => void | any
  dblclick?: (record: TableData) => void | any
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
