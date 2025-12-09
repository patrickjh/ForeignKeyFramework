import splitSchemeAndValue from '../../utils/splitSchemeAndValue.js'
import ForeignKeyStore from './ForeignKeyStore.js'

/**
 * Resolves a key that starts with store:
 * @param {string} key The key starting with store:
 * @returns {unknown} The value from the ForeignKeyStore
 */
export default function resolveStoreKey(key) {
  const { scheme, value } = splitSchemeAndValue(key)
  if (scheme !== 'store:') throw new Error('not store: scheme ' + key)
  if ((/^[a-zA-Z]+\//).test(value)) return handleItemKey(value)
  if ((/^[a-zA-Z]+\./).test(value)) return handleQueryKey(value)
  throw new Error('unknown key style' + key)
}

/**
 * Handles a store: style key with a slash for an individual item like store:todos/abcd
 * @param {string} value The key value like todos/abcd
 * @returns {unknown} The value from the store.
 */
function handleItemKey(value) {
  const [storeName, itemId] = value.split('/')
  if (!itemId) throw new Error('invalid item key ' + value)
  const store = ForeignKeyStore.getStore(storeName)
  if (!store) throw new Error('missing store' + storeName)
  return store.get(itemId)
}

/**
 * Handles a query style key with a period like store:todos.getAll
 * @param {string} value The key value like todos.getAll
 * @returns {unknown} the result of runnig the query on the store
 */
function handleQueryKey(value) {
  const [storeName, queryName] = value.split('.')
  if (!queryName) throw new Error('invalid query style key ' + value)
  const store = ForeignKeyStore.getStore(storeName)
  if (!store) throw new Error(' could not find store with name ' + storeName)
  if (!(queryName in store)) throw new Error('missing query ' + queryName + JSON.stringify(store))
  // @ts-expect-error does not like indexing store but its fine.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return store[queryName]()
}
