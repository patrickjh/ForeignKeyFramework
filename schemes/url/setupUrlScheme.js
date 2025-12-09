import { registerScheme } from '../../utils/getDataForKey.js'
import resolveUrlKey from './resolveUrlKey.js'
import setupEventHandler from './setupEventHandler.js'
import setupUrlEvent from './setupUrlEvent.js'

/**
 * Sets up the url: scheme and UrlChangedEvent.
 */
export default function setupUrlScheme() {
  registerScheme('url:', resolveUrlKey)
  setupUrlEvent()
  setupEventHandler()
  globalThis.console.log('setup url: scheme for Foreign Key Framework')
}


