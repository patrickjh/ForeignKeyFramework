/* eslint-disable max-lines */
import ForeignKeyElement from './ForeignKeyElement.js'

/**
 * Implements DOMTokenList for the foreignkeys="" attribute to use with ForeignKeyElement
 * As of 6/2025 this class is not unit tested yet so I might've gotten something wrong.
 * Also as of 6/2025 this does not do indexing by number and so typescript is complaining
 * @implements {DOMTokenList}
 */
// @ts-expect-error Does not index by number so typescript complains
export default class ForeignKeyDOMTokenList {
  /**
   * The ForeignKeyElement this list is for
   * @type {ForeignKeyElement}
   * @private
   */
  element

  constructor(/** @type {ForeignKeyElement}*/element) {
    this.element = element
  }

  /**
   * Gets the foreign keys as an array of strings
   * @returns {Array<string>} The split up attribute value
   * @private
   */
  getForeignKeys() {
    const attributeValue = this.element.getAttribute('foreignkeys')
    if (attributeValue) return attributeValue.split(' ')
    else return []
  }

  // eslint-disable-next-line accessor-pairs
  get length() { return this.getForeignKeys().length }

  get value() { return this.element.getAttribute('foreignkeys') ?? '' }

  set value(value) { this.element.setAttribute('foreignkeys', value) }

  item(/** @type {unknown} */ index) {
    const asNumber = Number(index)
    if (globalThis.isNaN(asNumber)) throw new TypeError('Not a number')
    if (asNumber > this.getForeignKeys().length) return null
    return this.getForeignKeys()[asNumber]
  }

  contains(/** @type {string} */ token) {
    return this.getForeignKeys().includes(token)
  }

  add(/** @type {Array<string>} */ ...tokens) {
    tokens.forEach((token) => { this.validateToken(token) })
    this.value = this.getForeignKeys().concat(tokens).join(' ')
  }

  remove(/** @type {Array<string>} */...tokens) {
    let currentTokens = this.getForeignKeys()
    tokens.forEach((token) => {
      currentTokens = currentTokens.filter((currentToken) => currentToken !== token)
    })
    this.value = currentTokens.join(' ')
  }

  replace(/** @type {string} */ oldToken, /** @type {string} */ newToken) {
    this.validateToken(oldToken)
    this.validateToken(newToken)
    const currentTokens = this.getForeignKeys()
    const tokenIndex = currentTokens.indexOf(oldToken)
    if (tokenIndex === -1) return false
    currentTokens[tokenIndex] = newToken
    this.value = currentTokens.join(' ')
    return true
  }

  supports(/** @type {string} */token) {
    return token !== ''
  }

  /**
   * See DOMTokenList.toggle(token, force) documentation
   * @param {string} token The token to toggle
   * @param {boolean} [force] The force param
   * @returns {boolean} If the value exists in list after operation
   */
  toggle(token, force) {
    this.validateToken(token)
    const currentTokens = this.getForeignKeys()
    if (force === false || force === undefined && currentTokens.includes(token)) this.remove(token)
    if (force === true || force === undefined && !currentTokens.includes(token)) this.add(token)
    this.value = currentTokens.join(' ')
    return currentTokens.includes(token)
  }

  /**
   * Makes sure the token is valid
   * @param {string} token the token to validate
   * @private
   */
  validateToken(token) {
    if (token.includes(' ')) throw new DOMException('no spaces allowed', 'InvalidCharacterError')
    if (token === '') throw new DOMException('no empty strings', 'SyntaxError')
  }

  entries() {
    return this.getForeignKeys().entries()
  }

  /**
   * See DOMTokenList.forEach()
   * @param {(currentValue: string, currentIndex: number, listObj: DOMTokenList) => void} callback
   * The Callback
   * @param {unknown} [thisArg] The this arg
   */
  forEach(callback, thisArg) {
    // @ts-expect-error ForeignKeyDOMTokenList does not index by number so typescript complains
    this.getForeignKeys().forEach((value, index) => { callback(value, index, this) }, thisArg)
  }

  keys() {
    return this.getForeignKeys().keys()
  }

  toString() {
    return this.value
  }

  values() {
    return this.getForeignKeys().values()
  }

  [Symbol.iterator]() {
    return this.getForeignKeys()[Symbol.iterator]()
  }
}
