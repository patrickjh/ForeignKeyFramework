/**
 * Checks if the arg is a string. Throws an error if no, returns value if yes.
 * @param {unknown} arg any value
 * @returns {string} Only returns if the arg is a string.
 */
export default function assertString(arg) {
  if (typeof arg === 'string') {
    return arg
  } else {
    throw new Error('arg not string: ' + String(arg))
  }
}
