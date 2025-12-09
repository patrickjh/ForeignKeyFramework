import assertString from '../../utils/asserts/assertString.js'
import StoreChangedEvent from './StoreChangedEvent.js'
import updateStoreElements from './updateStoreElements.js'

/** @type {Map<string, ForeignKeyStore<unknown>>} */ const allStores = new Map()

/**
 * ForeignKeyStore is a basic class in the ForeignKeyFramework. Emits StoreChangedEvent on change.
 * @template T
 */
// eslint-disable-next-line @stylistic/padded-blocks
export default class ForeignKeyStore extends EventTarget {

  /**
   * Gets a Store by name
   * @param {string} name the name
   * @returns {ForeignKeyStore<unknown> | undefined} The Store
   */
  static getStore(name) { return allStores.get(name) }

  /** @type {string} */ name

  /**
   * The Map that holds the data. Each Store has its own Map that holds data for that store.
   * @type {Map<string, T>}
   * @protected
   */
  map = new Map()

  /**
   * Creates a Store. Subclasses will call this with their per subclass unique Store name.
   * @param {string} name The Store name, like 'todos'
   * @protected
   */
  constructor(name) {
    super()
    if (!(/^[a-zA-Z]+$/).test(name)) throw new Error('invalid Store name: ' + name)
    if (allStores.has(name)) throw new Error('Store ' + name + ' exists')
    this.name = name
    allStores.set(name, this)
    this.addEventListener(StoreChangedEvent.EVENT_NAME, (e) => { updateStoreElements(e) })
  }

  /**
   * checks if an object matches the generic type T of this ForeignKeyStore.
   * Subclass implementation should throw if object is wrong type.
   * @param {unknown} object A random object
   * @returns {T} the object, now typed checked and ready to use ForeignKeyStore code.
   * @abstract
   */
  assertType(object) { throw new Error('subclass missing assertType(). Got: ' + String(object)) }

  /**
   * Gets all the records for this Store synchronously. Key for each object added as property _key.
   * @returns {Array<T & { _key: string }>} An Array with all the data returned synchronously.
   */
  getAll() {
    return Array.from(this.map.entries()).map(([key, value]) => {
      return { _key: 'store:' + this.name + '/' + key, ...this.assertType(value) }
    })
  }

  /**
   * Synchronously returns the value for a key. Throws if missing.
   * @param {string} key The key of the data in the store
   * @returns {T & {_key: string}} The value returned synchronously
   */
  get(key) {
    if (!this.has(key)) throw new Error('no value with key' + key)
    return {
      _key: 'store:' + this.name + '/' + key,
      ...this.assertType(this.map.get(key))
    }
  }

  /**
   * Checks if item exists in the store
   * @param {string} key The key
   * @returns {boolean} If an object exists in the store for the key
   */
  has(key) {
    return this.map.has(key)
  }

  /**
   * Sets a key / value pair in this Store. Pass null as the value to delete
   * @param {string} key The string key
   * @param {T | null} value The value
   * @returns {void} resolves when the set() operation completes.
   */
  set(key, value) {
    assertString(key)
    key = key.replace(new RegExp('^store:' + this.name + '/'), '')
    if (value === null) this.map.delete(key)
    if (value !== null) this.map.set(key, this.assertType(value))
    this.dispatchEvent(new StoreChangedEvent(this, key, value))
  }
}
