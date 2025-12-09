import assertHTMLElement from './asserts/assertHTMLElement.js'
import getDataForKey from './getDataForKey.js'
import ForeignKeyEvent from './ForeignKeyEvent.js'

/**
 * Emits a 'foreignkey' ForeignKeyEvent on elements that have the given foreign key
 * @param {string} key The key
 */
export default function updateElementsWithKey(key) {
  const data = getDataForKey(key) // get data once
  globalThis.document.querySelectorAll('[foreignkeys~="' + key + '"]').forEach((element) => {
    try {
      assertHTMLElement(element).dispatchEvent(new ForeignKeyEvent(key, data))
    } catch(e) {
      globalThis.console.error('error updating: ', e, ' key: ', key, 'element: ', element)
    }
  })
}
