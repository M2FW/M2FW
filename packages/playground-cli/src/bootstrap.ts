import { addPages, route } from '@m2fw/router/src'

import { store } from '@m2fw/redux-manager'

store.addReducers({
  route: route as any,
})

const pages = [
  {
    title: 'Demo Page',
    tagName: 'demo-page',
    route: 'demos/',
    importer: async () => console.log('detail loaded'),
  },
]
addPages(pages)

import('./playground-app').then(() => {
  console.log(`playground-cli is launched! (Powered by M2FW)`)
})
