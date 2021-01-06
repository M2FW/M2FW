export interface PageInfo {
  title?: string
  route: string
  activated?: boolean
}
export interface RouteState extends PageInfo {
  homeRoute: string
  pages: PageDetail[]
  importedHandler?: (page: PageDetail) => any
}

export interface PageDetail extends PageInfo {
  imported?: boolean
  tagName: string
  importer: Function
}
