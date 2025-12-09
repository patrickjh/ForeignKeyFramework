import setupInputScheme from './schemes/input/setupInputScheme.js'
import setupClickScheme from './schemes/click/setupClickScheme.js'
import ForeignKeyList from './elements/foreign-key-list/ForeignKeyList.js'
import ForeignKeyPage from './elements/foreign-key-page/ForeignKeyPage.js'
import setupUrlScheme from './schemes/url/setupUrlScheme.js'
import setupStoreScheme from './schemes/store/setupStoreScheme.js'

let setupComplete = false

/**
 * Sets up the foreign key framework
 */
export default function setupForeignKeyFramework() {
  if (!setupComplete) {
    try {
      actualSetupCode()
      setupComplete = true
    } catch(e) {
      globalThis.console.error('Error setting up Foreign Key Framework ', e)
    }
  }
}

/**
 * The actual setup code
 */
function actualSetupCode() {
  globalThis.console.log('starting Foreign Key Framework setup')
  setupSchemes()
  registerElements()
  globalThis.console.log('Foreign Key Framework setup success')
}

/**
 * Sets up the custom elements
 */
function registerElements() {
  globalThis.customElements.define(ForeignKeyList.TAG_NAME, ForeignKeyList)
  globalThis.customElements.define(ForeignKeyPage.TAG_NAME, ForeignKeyPage)
}

/**
 * Sets up all the event code like event emitters and event handlers.
 */
function setupSchemes() {
  setupUrlScheme()
  setupInputScheme()
  setupClickScheme()
  setupStoreScheme()
}
