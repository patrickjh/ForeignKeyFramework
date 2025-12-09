import assertHTMLElement from '../../utils/asserts/assertHTMLElement.js'
import getDataForKey from '../../utils/getDataForKey.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import ForeignKeyDOMTokenList from './ForeignKeyDOMTokenList.js'

export default class ForeignKeyElement extends HTMLElement {
  static observedAttributes = ['foreignkeys']

  /**
   * The template property holds html that will be set to innerHTML of your custom element
   * during the connected callback. Override template and put the HTML you want in your
   * ForeignKeyElement here.
   */
  template = ''
  foreignkeys = new ForeignKeyDOMTokenList(this)

  /**
   * A convenience property that stores the most recently received ForeignKeyEvent
   * @type {ForeignKeyEvent | undefined}
   * @protected
   */
  mostRecentEvent

  connectedCallback() {
    if (this.template) this.innerHTML = this.template
    this.addEventListener('foreignkey', (e) => {
      if (e instanceof ForeignKeyEvent) {
        this.mostRecentEvent = e
        this.onforeignkey(e)
      }
    })
    this.init()
  }

  /**
   * Handler for the 'foreignkey' event as part of ForeignKeyFramework. Gets passed a
   * ForeignKeyEvent object. Similar to other HTMLElement listener functions like onclick(e)
   * @param {ForeignKeyEvent} e the event
   */
  // @ts-expect-error unused param in empty method causes typescript error
  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onforeignkey(e) {}

  /**
   * init() is a ForeignKeyElement helper functions.
   * init() is called during the connectedCallback() after some other setup stuff happens.
   * Use this for one time setup of your ForeignKeyElement subclasses
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  init() {}

  /**
   * This is a nice little helper method on ForeignKeyElement.
   * getElementOrThrow(selector) runs this.querySelector() with the passed in arg.
   * Will throw if this.querySelector() returns null. Will throw
   * if the result of this.querySelector() is not an HTMLElement.
   * Gets rid of type checks and null checks for elements you know are present.
   * @param {string} selector The string to pass to this.querySelector()
   * @returns {HTMLElement} the element
   */
  getElementOrThrow(selector) {
    try {
      return assertHTMLElement(this.querySelector(selector))
    } catch(e) {
      throw new Error('Problem getting element with selector ' + selector + String(e))
    }
  }

  /**
   * Waits for a child with the given selector. waits for 10 seconds.
   * @param {string} selector The selector to look for
   * @returns {Promise<HTMLElement>} A Promise that finds the element or rejects
   */
  waitForSelector(selector) {
    return new Promise((resolve, reject) => {
      const interval = globalThis.setInterval(() => {
        const /** @type {unknown} */ element = this.querySelector(selector)
        if (element instanceof HTMLElement) resolve(element); globalThis.clearInterval(interval)
      }, 1000)
      globalThis.setTimeout(() => { globalThis.clearInterval(interval) }, 10000)
      globalThis.setTimeout(() => { reject(new Error('timed out')) }, 10000)
    })
  }

  attributeChangedCallback() {
    const foreignKeys = this.getAttribute('foreignkeys')
    if (foreignKeys) {
      foreignKeys.split(' ').filter((maybeKey) => (/^[a-zA-Z]+:/).test(maybeKey)).forEach((key) => {
        try {
          this.dispatchEvent(new ForeignKeyEvent(key, getDataForKey(key)))
        } catch(e) { globalThis.console.error(e) }
      })
    }
  }
}
