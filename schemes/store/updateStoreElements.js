import assertHTMLElement from '../../utils/asserts/assertHTMLElement.js'
import ForeignKeyStore from './ForeignKeyStore.js'
import resolveStoreKey from './resolveStoreKey.js'
import scheduleTask from '../../utils/scheduleTask.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import StoreChangedEvent from './StoreChangedEvent.js'
import isVisibleElement from '../../utils/isVisibleElement.js'

let updatePending = false
let /** @type {Set<ForeignKeyStore<unknown>>} */ storesToUpdate = new Set()
/** @type {Map<string, ForeignKeyStore<unknown>>} */ const itemKeysMap = new Map()


/**
 * Handles a StoreChangedEvent by updating elements with related keys in foreignkeys=""
 * @param {Event} e The event
 */
export default function updateStoreElements(e) {
  if (!(e instanceof StoreChangedEvent)) return
  if (!storesToUpdate.has(e.store)) storesToUpdate.add(e.store)
  if (!itemKeysMap.has(e.key)) itemKeysMap.set(e.key, e.store)
  scheduleOneUpdate()
}


/**
 * Schedules one update task at a time. This way we batch updates when a store updates
 * a lot, which improves UX and avoids jitter.
 */
function scheduleOneUpdate() {
  if (updatePending === false) {
    updatePending = true
    scheduleTask(() => { // waits to update so other store modifications can be batched.
      updatePending = false
      storesToUpdate.forEach((store) => { updateOneStore(store) })
    }, 'high')
  }
}

/**
 * Updates elements for one of the stores that has been updated
 * @param {ForeignKeyStore<unknown>} store The store to update for.
 */
function updateOneStore(store) {
  scheduleTask(() => {
    try {
      globalThis.document.querySelectorAll('[foreignkeys*="store:' + store.name + '"]')
        .forEach((element) => { updateStoreElement(store, assertHTMLElement(element)) })
    } catch(e) {
      globalThis.console.error('Problem updating store', e)
    } finally { cleanupStore(store) }
  }, 'high')
}

/**
 * Removes the store from data structures that track which stores and items need updates.
 * @param {ForeignKeyStore<unknown>} store The store we are cleaning up
 */
function cleanupStore(store) {
  storesToUpdate.delete(store)
  itemKeysMap.forEach((value, key) => { if (value.name === store.name) itemKeysMap.delete(key) })
}

/**
 * Updates an element that has a foreignkeys="" attribute to the Store
 * @param {ForeignKeyStore<unknown>} store the store
 * @param {HTMLElement} element the element with the foreign key to the store
 */
function updateStoreElement(store, element) {
  scheduleTask(() => {
    try {
      element.getAttribute('foreignkeys')?.split(' ').forEach((foreignKey) => {
        if (foreignKey.startsWith('store:' + store.name)) dispatchEvent(element, foreignKey)
      })
    } catch(e) { globalThis.console.error('problem updating element', e, store, element) }
  }, isVisibleElement(element) ? 'sync' : 'low')
}

/**
 * Dispatches the ForeignKeyEvent
 * @param {HTMLElement} element The element
 * @param {string} key The key
 */
function dispatchEvent(element, key) {
  scheduleTask(() => {
    const event = new ForeignKeyEvent(key, resolveStoreKey(key))
    const currentKeys = element.getAttribute('foreignkeys')
    if (currentKeys?.includes(key)) element.dispatchEvent(event) // key might be removed on element
  }, isVisibleElement(element) ? 'sync' : 'low')
}

