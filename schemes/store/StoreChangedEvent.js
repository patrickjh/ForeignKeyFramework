import assertStore from '../../utils/asserts/assertStore.js'
import assertString from '../../utils/asserts/assertString.js'
import ForeignKeyStore from './ForeignKeyStore.js'

/**
 * @typedef {{store: ForeignKeyStore<unknown>, key: string, value: unknown}} StoreCustomEventArgs
 * @augments CustomEvent<StoreCustomEventArgs>
 */
export default class StoreChangedEvent extends CustomEvent {
  static EVENT_NAME = 'storechanged'

  /**
   * Creates a StoreChangedEvent representing when a key / value pair changes in a Store
   * @param {ForeignKeyStore<unknown>} store The Store that was changed
   * @param {string} key The key of the data in the Store that was changed.
   * @param {unknown} value The value that was changed.
   */
  constructor(store, key, value) {
    super(StoreChangedEvent.EVENT_NAME, { detail: { store, key, value } })
    assertStore(store)
    assertString(key)
    if (value !== null) store.assertType(value)
  }

  /**
   * The Store subclass that changed
   * @returns {ForeignKeyStore<unknown>} The store
   */
  get store() {
    return assertStore(this.detail.store)
  }

  set store(value) {
    throw new Error('Cannot set StoreChangedEvent.store. Received: ' + JSON.stringify(value))
  }

  /**
   * The key that changed
   * @returns {string} The key
   */
  get key() {
    return assertString(this.detail.key)
  }

  set key(key) {
    throw new Error('Cannot set StoreChangedEvent.key. Received: ' + JSON.stringify(key))
  }

  /**
   * The value that changed
   * @returns {unknown} The value
   */
  get value() {
    if (this.detail.value !== null) {
      return assertStore(this.detail.store).assertType(this.detail.value)
    } else {
      return null
    }
  }

  set value(newValue) {
    throw new Error('Cannot set StoreChangedEvent.value. Received: ' + JSON.stringify(newValue))
  }
}
