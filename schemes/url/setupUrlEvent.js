import UrlChangedEvent from './UrlChangedEvent.js'

/**
 * Sets up to emit the UrlChangedEvent when url changes.
 */
export default function setupUrlEvent() {
  let oldUrlString = globalThis.location.toString()
  globalThis.setInterval(() => {
    const newUrlString = globalThis.location.toString()
    if (newUrlString !== oldUrlString) {
      globalThis.dispatchEvent(new UrlChangedEvent(new URL(oldUrlString), new URL(newUrlString)))
      oldUrlString = newUrlString
    }
  }, 100)
}
