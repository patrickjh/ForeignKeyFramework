/**
 * Confirms the object is an HTMLElement.
 * @param {unknown} object any object
 * @returns {HTMLElement} confirmed HTMLElement
 */
export default function assertHTMLElement(object) {
  if (object instanceof HTMLElement) {
    return object
  } else {
    throw new Error('Not HTMLElement')
  }
}
