import {
  lazyReducerEnhancer,
  LazyStore,
} from 'pwa-helpers/lazy-reducer-enhancer'
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Store,
} from 'redux'
import reduxThunk from 'redux-thunk'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

const devCompose = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose

const store: Store<unknown, Action<any>> & LazyStore = createStore(
  (state, _action) => state,
  devCompose(lazyReducerEnhancer(combineReducers), applyMiddleware(reduxThunk))
)

export { store, Store, LazyStore }
