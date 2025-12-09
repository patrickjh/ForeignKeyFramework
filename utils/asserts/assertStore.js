import ForeignKeyStore from '../../schemes/store/ForeignKeyStore.js'

/**
 * Checks if the object is a Store subclass or not. Throws if not.
 * @param {unknown} store An object that might or might not be a Store
 * @returns {ForeignKeyStore<unknown>} The object typed as a Store
 */
export default function assertStore(store) {
  if (store instanceof ForeignKeyStore) {
    return store
  } else {
    throw new Error('object not store: ' + String(store))
  }
}
