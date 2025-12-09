/**
 * Checks if the object is a URL. Throws error if not.
 * @param {unknown} object Any object
 * @returns {URL} object as URL
 */
export default function assertUrl(object) {
  if (object instanceof URL) {
    return object
  } else {
    throw new Error('object is not URL: ' + String(object))
  }
}
