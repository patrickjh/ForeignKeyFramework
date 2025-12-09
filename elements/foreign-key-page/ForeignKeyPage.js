import ForeignKeyElement from '../utils/ForeignKeyElement.js'

export default class ForeignKeyPage extends ForeignKeyElement {
  static TAG_NAME = 'foreign-key-page'
  /** @override */static observedAttributes = ['hash']

  savedScrollY = 0

  /** @type {'visible' | 'hidden' } */
  pageState = 'hidden'

  /** @override */
  init() {
    this.style.display = 'none'
    this.foreignkeys.add('url:hash')
    this.onforeignkey()
    if (this.pageState === 'hidden') this.savedScrollY = 0
  }

  /** @override */
  onforeignkey() {
    const hashAttribute = this.getAttribute('hash')
    const currentHash = globalThis.location.hash.replace('#', '')
    if (hashAttribute === currentHash && this.pageState === 'hidden') this.showPage()
    if (hashAttribute !== currentHash && this.pageState === 'visible') this.hidePage()
  }

  showPage() {
    this.style.display = 'block'
    this.pageState = 'visible'
    globalThis.window.scroll({
      top: this.savedScrollY,
      behavior: 'instant'
    })
  }

  hidePage() {
    this.savedScrollY = globalThis.window.scrollY
    this.style.display = 'none'
    this.pageState = 'hidden'
  }
}
