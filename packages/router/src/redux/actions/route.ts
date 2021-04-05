import { PageDetail, RouteState } from '../../interfaces'

import { store } from '@m2fw/redux-manager'

export const SET_HOME_ROUTE: string = 'SET_HOME_ROUTE'
export const SET_IMPORTED_HANDLER: string = 'SET_IMPORTED_HANDLER'
export const ADD_PAGES: string = 'ADD_PAGES'
export const NAVIGATE: string = 'NAVIGATE'
export const SWITCH_TO_IMPORTED: string = 'SWITCH_TO_IMPORTED'

export function setHomeRoute(homeRoute: string): void {
  store.dispatch({ type: SET_HOME_ROUTE, homeRoute })
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

/**
 * @description Dispatch action to update current state for indicating current title, route and element of page.
 *
 * @param targetURL
 */
export async function navigate(targetURL: string): Promise<void> {
  const state: { route: RouteState } = store.getState() as { route: RouteState }
  if (!state) return

  targetURL = targetURL.replace(/(^\/|\/$)/g, '')
  const [targetPath, search] = targetURL.split('?')

  let route: PageDetail | undefined = state.route?.pages?.find((page: PageDetail) => checkURLMatching(page, targetPath))
  if (route?.route === state.route.route && route.imported) return

  const importedHandler: ((route: PageDetail) => any) | undefined = state.route.importedHandler

  if (!route) {
    console.warn(`Couldn't find page properly by passed target URL (${targetPath}), move back to home route`)
    navigateToHome()
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
