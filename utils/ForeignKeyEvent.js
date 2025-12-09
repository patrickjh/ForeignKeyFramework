/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import assertString from './asserts/assertString.js'
import splitSchemeAndValue from './splitSchemeAndValue.js'

/**
 * @template [T=unknown]
 */
export default class ForeignKeyEvent extends CustomEvent {
  static EVENT_NAME = /** @type {const} */ ('foreignkey')

  /**
   * Constructor for ForeignKeyEvent
   * we freeze the data so one event handler cannot change the data for future event handlers
   * if you want to change the data, change the data at the source and cause a new
   * ForeignKeyEvent to be emitted with the new data.
   * @param {string} key The key that has changed
   * @param {unknown} value The value for that key
   */
  constructor(key, value) {
    const { scheme } = splitSchemeAndValue(key)
    if (!['url:', 'store:', 'click:', 'input:'].includes(scheme)) throw new Error('unknown scheme')
    super(ForeignKeyEvent.EVENT_NAME, { detail: Object.freeze({
      key: assertString(key),
      value: value
    }) })
  }

  /**
   * The value that has changed
   * @returns {T} The value
   */
  get value() {
    return this.detail.value
  }

  set value(value) {
    throw new Error('Cannot set ForeignKeyEvent.value. Received ' + String(value))
  }

  /**
   * The key for the value that has changed
   * @returns {string} the key
   */
  get key() {
    return this.detail.key
  }

  set key(key) {
    throw new Error('Cannot set ForeignKeyEvent.key. Received ' + key)
  }
}
