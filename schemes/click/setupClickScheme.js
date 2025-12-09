import { registerScheme } from '../../utils/getDataForKey.js'
import updateElementsWithKey from '../../utils/updateElementsWithKey.js'
import resolveClickKey from './resolveClickKey.js'

/**
 * Sets up a global handler for the 'click' event which then updates elements
 * with a foreignkeys="click:{{the id or class of the clicked element}}". This way when one
 * element is clicked some other element can react.
 */
export default function setupClickScheme() {
  registerScheme('click:', resolveClickKey)
  setupClickHandler()
  globalThis.console.log('Setup click: scheme for Foreign Key Framework')
}

/**
 * Sets up the event handler for the global 'click' event that enables the click: key.
 */
function setupClickHandler() {
  globalThis.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.id) {
      updateElementsWithKey('click:' + event.target.id)
      for (const cssClass of event.target.classList) {
        updateElementsWithKey('click:' + cssClass)
      }
    }
  })
}
