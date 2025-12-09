import { registerScheme } from '../../utils/getDataForKey.js'
import ForeignKeyStore from './ForeignKeyStore.js'
import resolveStoreKey from './resolveStoreKey.js'

/**
 * Sets up the code to enable the store: scheme that works with ForeignKeyStore subclasses
 */
export default function setupStoreScheme() {
  registerScheme('store:', resolveStoreKey)
  if (!('stores' in globalThis.window)) {
    // @ts-expect-error stores does not exist because we are adding it.
    globalThis.window.stores = {
      getStore: (/** @type {string} */name) => ForeignKeyStore.getStore(name)
    }
  }
  globalThis.console.log('Setup store: scheme for ForeignKeyFramework')
}
