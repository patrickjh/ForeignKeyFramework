import assertHTMLElement from '../../utils/asserts/assertHTMLElement.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import isVisibleElement from '../../utils/isVisibleElement.js'
import scheduleTask from '../../utils/scheduleTask.js'
import UrlChangedEvent from './UrlChangedEvent.js'

/**
 * Sets up a handler for the UrlChangedEvent that searches for linked elements and updates them.
 */
export default function setupEventHandler() {
  globalThis.addEventListener(UrlChangedEvent.EVENT_NAME, (event) => {
    if (event instanceof UrlChangedEvent) try {
      syncHashUpdate(event)
      syncChangedParams(getChangedParams(event))
    } finally {
      scheduleTask(() => globalThis.dispatchEvent(new CustomEvent('urlchangehandled')), 'high')
    }
  })
}

/**
 * Hash changes first and synchronously
 * @param {UrlChangedEvent} event The event
 */
function syncHashUpdate(event) {
  if (event.oldUrl.hash !== event.newUrl.hash) {
    globalThis.document.querySelectorAll('[foreignkeys~="url:hash"]').forEach((element) => {
      try {
        const data = event.newUrl.hash.replace(/^#/, '')
        assertHTMLElement(element).dispatchEvent(new ForeignKeyEvent('url:hash', data))
      } catch(e) { globalThis.console.error('Problem updating hash keys', e) }
    })
  }
}

/**
 * Figures out which params have changed
 * @param {UrlChangedEvent} event The url changed event
 * @returns {Array<{paramName: string, newValue: string}>} The changed params
 */
function getChangedParams(event) {
  const changedParams = []
  for (const [paramName, newValue] of event.newUrl.searchParams) {
    const oldValue = event.oldUrl.searchParams.get(paramName)
    if (oldValue !== newValue) changedParams.push({ paramName, newValue })
  }
  return changedParams
}

/**
 * Updates DOM for changed array params. Visible elements updated first and synchronously
 * hidden elements updated asynchronously.
 * @param {Array<{paramName: string, newValue: string}>} changedParams The changed params
 */
function syncChangedParams(changedParams) {
  for (const { newValue, paramName } of changedParams) {
    const selector = '[foreignkeys~="url:' + paramName + '"]'
    const elements = globalThis.document.querySelectorAll(selector)
    dispatchVisibleSync(elements, new ForeignKeyEvent('url:' + paramName, newValue))
  }
}

/**
 * Dispatches the ForeignKeyEvent on the elements with url: keys, visible elements first
 * @param {Iterable<Element>} elements The elements
 * @param {ForeignKeyEvent} event The event
 */
function dispatchVisibleSync(elements, event) {
  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue
    scheduleTask(() => {
      if (element.getAttribute('foreignkeys')?.includes(event.key)) element.dispatchEvent(event)
    }, isVisibleElement(element) ? 'sync' : 'low')
  }
}
