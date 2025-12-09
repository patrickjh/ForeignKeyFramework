import assertHTMLElement from '../../utils/asserts/assertHTMLElement.js'
import getDataForKey from '../../utils/getDataForKey.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import isIterable from './isIterable.js'
import scheduleTask from '../../utils/scheduleTask.js'
import ForeignKeyElement from '../utils/ForeignKeyElement.js'

export default class ForeignKeyList extends ForeignKeyElement {
  static TAG_NAME = 'foreign-key-list'
  elementName = ''
  /** @type {HTMLElement | undefined} */listInProgress

  /** @override */
  connectedCallback() {
    const elementName = this.getAttribute('element')
    if (!elementName) throw new Error('no element="" on <foreign-key-list>')
    this.elementName = elementName
    super.connectedCallback()
  }

  /** @override */
  onforeignkey() {
    if (globalThis.customElements.get(this.elementName)) {
      if (globalThis.document.readyState === 'complete') this.render()
      else globalThis.addEventListener('load', () => { this.render() })
    } else {
      void globalThis.customElements.whenDefined(this.elementName).finally(() => { this.render() })
    }
  }

  /**
   * Renders updated contents of the list by replacing this element with an updated clone.
   */
  render() {
    const newList = this.setupNewList()
    const visible = this.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })
    const priority = visible ? 'sync' : 'low'
    for (const item of this.getQueryData()) {
      scheduleTask(() => { if (newList.isConnected) this.renderOneItem(item, newList) }, priority)
    }
    scheduleTask(() => { if (newList.isConnected) this.showNewList(newList) }, priority)
  }

  /**
   * Sets up the new list element that will replace this element in the DOM.
   * @returns {HTMLElement} The new list element
   */
  setupNewList() {
    const newList = assertHTMLElement(this.cloneNode())
    newList.style.display = 'none'
    if (this.listInProgress) this.listInProgress.remove()
    this.listInProgress = newList
    this.after(newList)
    return newList
  }

  /**
   * Adds one data item to the list
   * @param {{_key?: string}} item The data to render in an element on the list
   * @param {HTMLElement} newList The new list
   */
  renderOneItem(item, newList) {
    if (!item._key) throw new Error('item for <foreign-key-list> missing _key string field')
    const event = new ForeignKeyEvent(item._key, item)
    const customElement = globalThis.document.createElement(this.elementName)
    newList.appendChild(customElement)
    customElement.dispatchEvent(event)
    customElement.querySelectorAll('*').forEach((child) => {
      if (child instanceof HTMLElement) child.dispatchEvent(event)
    })
  }

  /**
   * Shows the new list and removes the old list.
   * @param {HTMLElement} newList The new list
   */
  showNewList(newList) {
    newList.style.display = 'block'
    this.remove()
    this.listInProgress = undefined
  }

  /**
   * Gets the data for the first query style key in foreignkeys=""
   * @returns {Array<{_key?: string}>} The data to render
   */
  getQueryData() {
    const queryKey = Array.from(this.foreignkeys).find((key) => key.startsWith('store:'))
    if (!queryKey) throw new Error('could not find query key on <foreign-key-list>')
    const data = /** @type {Array<{_key?: string}>} */ (getDataForKey(queryKey))
    if (!isIterable(data)) throw new Error('data for <foreign-key-list> was not Iterable')
    return Array.from(data)
  }
}
