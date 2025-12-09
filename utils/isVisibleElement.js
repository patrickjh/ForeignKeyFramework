import assertHTMLElement from './asserts/assertHTMLElement.js'

/**
 * Checks if the arg is an HTMLElement that is visible or not.
 * Using this function establishes a framework wide concept of when an element is visible.
 * @param {unknown} element the element
 * @returns {boolean} true if visible, false otherwise
 */
export default function isVisibleElement(element) {
  const asElement = assertHTMLElement(element)
  return asElement.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
}
