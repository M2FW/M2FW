import { ButtonType } from '../enums/ButtonType'
import { TableDataInterface } from './TableDataInterface'

export interface TableButtonInterface {
  type: ButtonType
  options: IconButtonOptionsInterface | TextButtonOptionsInterface
}

export interface ButtonOptionHandlersInterface {
  click?: (record: TableDataInterface) => void | any
  dblclick?: (record: TableDataInterface) => void | any
}

export interface ButtonOptionsInterface {
  handlers?: ButtonOptionHandlersInterface
}

type IconRenderFunctionType = (record?: TableDataInterface) => HTMLElement

export interface IconButtonOptionsInterface extends ButtonOptionsInterface {
  icon: IconRenderFunctionType | string
}

type TextRenderFunctionType = (record?: TableDataInterface) => string
export interface TextButtonOptionsInterface extends ButtonOptionsInterface {
  text: TextRenderFunctionType | string
}
