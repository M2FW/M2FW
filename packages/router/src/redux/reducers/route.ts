import { ADD_PAGES, NAVIGATE, REPLACE_PAGES, SET_404_ROUTE, SET_HOME_ROUTE, SET_IMPORTED_HANDLER, SWITCH_TO_IMPORTED } from '../actions/route'
import { PageDetail, RouteState } from '../../interfaces'

const INITIAL_STATE: RouteState = {
  homeRoute: '',
  title: '',
  route: '',
  importedHandler: undefined,
  pages: [],
}

export const route = (state = INITIAL_STATE, action: RouteState & { type: string }) => {
  switch (action.type) {
    case SET_HOME_ROUTE: {
      return {
        ...state,
        homeRoute: action.homeRoute,
      }
    }

    case SET_404_ROUTE: {
      return {
        ...state,
        notFoundRoute: action.notFoundRoute,
      }
    }

    case ADD_PAGES:
      return {
        ...state,
        pages: [...state.pages, ...extractValidPages(state.pages, action.pages)],
      }

    case REPLACE_PAGES:
      return {
        ...state,
        pages: mergePages(state.pages, action.pages)
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
        pages: state.pages.map((page: PageDetail) => {
          if (page.route === action.route) page.imported = true
          return page
        }),
      }

    case SET_IMPORTED_HANDLER:
      if (typeof action.importedHandler !== 'function') throw new Error('Imported handler is not a function')

      return {
        ...state,
        importedHandler: action.importedHandler,
      }

    default:
      return state
  }
}

/**
 * @description Extract out valid page list which is can be added to current state and return it as an array
 *
 * @param {PageDetail[]} currentPages
 * @param {PageDetail[]} newPages
 * @returns IPageDetail[]
 */
function extractValidPages(currentPages: PageDetail[], newPages: PageDetail[] = []): PageDetail[] {
  const currentPageRouters: string[] = currentPages.map((page: PageDetail) => page.route)

  return newPages
    .filter((page: PageDetail) => currentPageRouters.indexOf(page.route) === -1)
    .map((page: PageDetail) => {
      return {
        ...page,
        route: page.route.replace(/(^\/|\/$)/g, ''),
      }
    })
}

function mergePages(currentPages: PageDetail[], newPages: PageDetail[]): PageDetail[] {
  const mergedPages: PageDetail[] = []
  const currentPageMap: Map<string, PageDetail> = new Map()
  currentPages.forEach((pageDetail: PageDetail) => currentPageMap.set(pageDetail.route, pageDetail))

  newPages.forEach((pageDetail: PageDetail) => {
    if(currentPageMap.has(pageDetail.route)) {
      mergedPages.push(currentPageMap.get(pageDetail.route) as PageDetail)
    } else {
      mergedPages.push(pageDetail)
    }
  })

  return mergedPages
}