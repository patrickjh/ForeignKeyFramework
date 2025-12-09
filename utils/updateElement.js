import ForeignKeyEvent from './ForeignKeyEvent.js'
import getDataForKey from './getDataForKey.js'

/**
 * Updates an element to match the current values of its foreign key data
 * @param {HTMLElement | null} element The element
 * Having it be HTMLElement | null makes this work nicely with getElementById() and
 * other methods that might return HTMLElement | null
 */
export default function updateElement(element) {
  if (!element) return
  const foreignKeys = element.getAttribute('foreignkeys')
  if (foreignKeys) {
    foreignKeys.split(' ').forEach((key) => {
      element.dispatchEvent(new ForeignKeyEvent(key, getDataForKey(key)))
    })
  }
}
