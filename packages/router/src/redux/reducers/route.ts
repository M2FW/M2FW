import { store } from '@m2fw/redux-manager'
import { PageDetailInterface, RouteStateInterface } from '../../interfaces'
import {
  ADD_PAGES,
  NAVIGATE,
  SET_HOME_ROUTE,
  SWITCH_TO_IMPORTED,
} from '../actions/route'

const INITIAL_STATE: RouteStateInterface = {
  homeRoute: '',
  title: '',
  route: undefined,
  pages: [],
}

export const route = (
  state = INITIAL_STATE,
  action: RouteStateInterface & { type: string }
) => {
  switch (action.type) {
    case SET_HOME_ROUTE: {
      return {
        ...state,
        homeRoute: action.homeRoute,
      }
    }

    case ADD_PAGES:
      return {
        ...state,
        pages: [
          ...state.pages,
          ...extractValidPages(state.pages, action.pages),
        ],
      }

    case NAVIGATE:
      return {
        ...state,
        title: action.title,
        route: action.route,
      }

    case SWITCH_TO_IMPORTED:
      return {
        ...state,
        pages: state.pages.map((page: PageDetailInterface) => {
          if (page.route === action.route) page.imported = true
          return page
        }),
      }

    default:
      return state
  }
}
/**
 * @description Extract out valide page list which is can be added to current state and return it as an array
 *
 * @param {PageDetailInterface[]} currentPages
 * @param {PageDetailInterface[]} newPages
 * @returns IPageDetail[]
 */
function extractValidPages(
  currentPages: PageDetailInterface[],
  newPages: PageDetailInterface[] = []
): PageDetailInterface[] {
  const currentPageRouters: string[] = currentPages.map(
    (page: PageDetailInterface) => page.route
  )

  return newPages.filter(
    (page: PageDetailInterface) => currentPageRouters.indexOf(page.route) === -1
  )
}

export function setHomeRoute(homeRoute: string): void {
  store.dispatch({ type: SET_HOME_ROUTE, homeRoute })
}

/**
 * @description Dispatch action to add single page or pages into current state.
 *
 * @param pages
 * @returns void
 */
export function addPages(
  pages: PageDetailInterface | PageDetailInterface[]
): void {
  store.dispatch({ type: ADD_PAGES, pages })
}

/**
 * @description Dispatch action to update current state for indicating current title, route and element of page.
 *
 * @param target
 */
export async function navigate(
  target: PageDetailInterface | string
): Promise<void> {
  const state: any = store.getState()
  let route: PageDetailInterface

  if (typeof target === 'string' && state?.route?.pages?.length) {
    route = state.route.pages.find(
      (page: PageDetailInterface) => page.route === target
    )

    if (!route) {
      console.warn(
        `Couldn't find target route (${target}), move back to home route`
      )
      navigateToHome()
      return
    }
  }

  if (!route.imported) {
    await route.importer()
    switchToImported(route.route)
  }

  store.dispatch({ type: NAVIGATE, ...route })
}

export function navigateToHome(): void {
  const state: Record<string, any> = store.getState()
  const homeRoute: PageDetailInterface = state.route.pages.find(
    (page: PageDetailInterface) => page.route === state.route.homeRoute
  )
  store.dispatch({ type: NAVIGATE, ...homeRoute })
}

export function switchToImported(route: string): void {
  store.dispatch({ type: SWITCH_TO_IMPORTED, route })
}
