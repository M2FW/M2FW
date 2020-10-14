export interface PageInfoInterface {
  title?: string
  route: string
  activated?: boolean
}
export interface RouteStateInterface extends PageInfoInterface {
  homeRoute: string
  pages: PageDetailInterface[]
}

export interface PageDetailInterface extends PageInfoInterface {
  imported?: boolean
  tagName: string
  importer: Function
}
