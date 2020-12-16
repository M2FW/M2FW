import { PageDetail } from '../../interfaces'
import { store } from '@m2fw/redux-manager'

export const SET_HOME_ROUTE: string = 'SET_HOME_ROUTE'
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
  const state: any = store.getState()
  if (!state) return

  targetURL = targetURL.replace(/(^\/|\/$)/g, '')

  let route: PageDetail = state.route?.pages?.find((page: PageDetail) =>
    checkURLMatching(page, targetURL)
  )

  if (!route) {
    console.warn(
      `Couldn't find page properly by passed target URL (${targetURL}), move back to home route`
    )
    navigateToHome()
    return
  }

  if (!route.imported) {
    await route.importer()
    switchToImported(route.route)
  }

  store.dispatch({ type: NAVIGATE, ...route, route: targetURL })
}

export function navigateToHome(): void {
  const state = store.getState() as Record<string, any>
  const homeRoute: PageDetail = state.route.pages.find(
    (page: PageDetail) => page.route === state.route.homeRoute
  )
  navigate(homeRoute.route)
}

export function switchToImported(route: string): void {
  store.dispatch({ type: SWITCH_TO_IMPORTED, route })
}

function checkURLMatching({ route }: PageDetail, targetURL: string): boolean {
  const splitRoute: string[] = route.split('/')
  const splitTargetURL: string[] = targetURL.split('/')

  if (splitRoute.length !== splitTargetURL.length) return false

  let staticPartIndexes: number[] = []
  splitRoute.forEach((route: string, idx: number) => {
    if (!/^:/.test(route)) staticPartIndexes.push(idx)
  })

  return staticPartIndexes.every(
    (staticPartIdx: number) =>
      splitRoute[staticPartIdx] === splitTargetURL[staticPartIdx]
  )
}
