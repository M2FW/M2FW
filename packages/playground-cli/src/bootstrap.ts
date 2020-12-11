console.log('Start bootstrapping')

console.log('Bootstrapping is done.')

import('./playground-app').then(() => {
  console.log(`playground-cli is launched! (Powered by M2FW)`)
})
