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
 * @param target
 */
export async function navigate(target: PageDetail | string): Promise<void> {
  const state: any = store.getState()
  if (!state) return
  let route: PageDetail = state.route?.pages?.find(
    (page: PageDetail) => page.route === target
  )

  if (!route) {
    console.warn(
      `Couldn't find target route (${target}), move back to home route`
    )
    navigateToHome()
    return
  }

  if (!route.imported) {
    await route.importer()
    switchToImported(route.route)
  }

  store.dispatch({ type: NAVIGATE, ...route })
}

export function navigateToHome(): void {
  const state = store.getState() as Record<string, any>
  const homeRoute: PageDetail = state.route.pages.find(
    (page: PageDetail) => page.route === state.route.homeRoute
  )
  store.dispatch({ type: NAVIGATE, ...homeRoute })
}

export function switchToImported(route: string): void {
  store.dispatch({ type: SWITCH_TO_IMPORTED, route })
}
