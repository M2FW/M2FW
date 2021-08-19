import { addPages, route } from '@m2-modules/router'

import { dialog } from '@m2-modules/dialog'
import { store } from '@m2-modules/redux-manager'

store.addReducers({
  route: route as any,
  dialog: dialog as any,
})

const pages = [
  {
    title: 'Demo Page',
    tagName: 'demo-page',
    route: 'demos',
    importer: async () => console.log('detail loaded'),
  },
]
addPages(pages)

import('./playground-app').then(() => {
  console.log(`playground-cli is launched! (Powered by M2 Modules)`)
})
