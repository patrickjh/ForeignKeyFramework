import assertUrl from '../../utils/asserts/assertUrl.js'

/**
 * The UrlChangedEvent is designed to be emitted when the url hash or url search params change.
 */
export default class UrlChangedEvent extends CustomEvent {
  static EVENT_NAME = 'urlchanged'

  /**
   * The constructor
   * @param {URL} oldUrl The old url
   * @param {URL} newUrl The new url
   */
  constructor(oldUrl, newUrl) {
    super(UrlChangedEvent.EVENT_NAME, { detail: { oldUrl, newUrl } })
    assertUrl(oldUrl)
    assertUrl(newUrl)
    if (oldUrl.toString() === newUrl.toString()) throw new Error('should not match')
  }

  /**
   * Gets the old url from the details
   * @returns {URL} The url
   */
  get oldUrl() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return assertUrl(this.detail.oldUrl)
  }

  /**
   * Cannot set the old url on UrlChangedEvent
   * @param {unknown} value any value
   * @returns {never} Never returns
   */
  set oldUrl(value) {
    throw new Error('cannot set oldUrl on UrlChangedEvent. Received ' + String(value))
  }

  /**
   * Gets the new url
   * @returns {URL} The URL
   */
  get newUrl() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return assertUrl(this.detail.newUrl)
  }

  /**
   * Cannot set UrlChangedEvent.newUrl
   * @param {unknown} value The new value
   * @returns {never} Never returns
   */
  set newUrl(value) {
    throw new Error('cannot set newUrl on UrlChangedEvent. Received ' + String(value))
  }
}
