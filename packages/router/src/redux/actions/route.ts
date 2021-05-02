import { PageDetail, RouteState } from '../../interfaces'

import { store } from '@m2fw/redux-manager'

export const SET_HOME_ROUTE: string = 'SET_HOME_ROUTE'
export const SET_404_ROUTE: string = 'SET_404_ROUTE'
export const SET_IMPORTED_HANDLER: string = 'SET_IMPORTED_HANDLER'
export const ADD_PAGES: string = 'ADD_PAGES'
export const REPLACE_PAGES: string = 'REPLACE_PAGES'
export const NAVIGATE: string = 'NAVIGATE'
export const SWITCH_TO_IMPORTED: string = 'SWITCH_TO_IMPORTED'

export function setHomeRoute(homeRoute: string): void {
  store.dispatch({ type: SET_HOME_ROUTE, homeRoute })
}

export function set404Route(notFoundRoute: string): void {
  store.dispatch({ type: SET_404_ROUTE, notFoundRoute })
}

/**
 * @description Dispatch action to add single page or pages into current state.
 *
 * @param pages
 * @returns void
 */
export function addPages(pages: PageDetail | PageDetail[]): void {
  store.dispatch({ type: ADD_PAGES, pages })
}

export function replacePages(pages: PageDetail | PageDetail[]): void {
  store.dispatch({ type: REPLACE_PAGES, pages })
}

/**
 * @description Dispatch action to update current state for indicating current title, route and element of page.
 *
 * @param targetURL
 */
export async function navigate(targetURL: string): Promise<void> {
  const state: { route: RouteState } = store.getState() as { route: RouteState }
  if (!state) return

  targetURL = targetURL.replace(/(^\/|\/$)/g, '')
  const [targetPath] = targetURL.split('?')

  let route: PageDetail | undefined = state.route?.pages?.find((page: PageDetail) => checkURLMatching(page, targetPath))
  if (route?.route === state.route.route && route.imported) return

  const importedHandler: ((route: PageDetail) => any) | undefined = state.route.importedHandler

  if (!route) {
    console.warn(`Couldn't find page properly by passed target URL (${targetPath}), move back to home route`)

    if (state.route?.notFoundRoute) {
      navigateToNotFound()
    } else {
      navigateToHome()
    }

    return
  }

  if (!route.imported) {
    switchToImported(route.route)
    await route.importer()
    if (importedHandler) importedHandler(route)
  }

  store.dispatch({ type: NAVIGATE, title: route.title, route: targetURL })
}

export function navigateToHome(): void {
  const state = store.getState() as Record<string, any>
  const homeRoute: PageDetail = state.route.pages.find((page: PageDetail) => page.route === state.route.homeRoute)
  navigate(homeRoute.route)
}

export function navigateToNotFound(): void {
  const state = store.getState() as Record<string, any>
  const notFoundRoute: PageDetail = state.route.pages.find(
    (page: PageDetail) => page.route === state.route.notFoundRoute
  )
  navigate(notFoundRoute.route)
}

export function switchToImported(route: string): void {
  store.dispatch({ type: SWITCH_TO_IMPORTED, route })
}

export function setImportedHandler(importedHandler: (page: PageDetail) => any): void {
  store.dispatch({ type: SET_IMPORTED_HANDLER, importedHandler })
}

function checkURLMatching({ route }: PageDetail, targetURL: string): boolean {
  const splitRoute: string[] = route.split('/')
  const splitTargetURL: string[] = targetURL.split('/')

  if (splitRoute.length !== splitTargetURL.length) return false

  let staticPartIndexes: number[] = []
  splitRoute.forEach((route: string, idx: number) => {
    if (!/^:/.test(route)) staticPartIndexes.push(idx)
  })

  return staticPartIndexes.every((staticPartIdx: number) => splitRoute[staticPartIdx] === splitTargetURL[staticPartIdx])
}
