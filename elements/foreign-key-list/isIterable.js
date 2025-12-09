/**
 * Returns true if the object is iterable
 * @param {unknown} object any object
 * @returns {object is Iterable<unknown>} If the object is Iterable
 */
export default function isIterable(object) {
  if (object === null || !object) return false
  // @ts-expect-error Something weird about index types but it's fine.
  return typeof object[Symbol.iterator] === 'function'
}
