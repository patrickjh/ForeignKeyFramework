import splitSchemeAndValue from './splitSchemeAndValue.js'

/** @type {Map<string, (key: string)=> unknown>} */
const schemesAndFunctions = new Map()

/**
 * Gets the data for a key that was in a foreignkeys="" attribute
 * @param {string} key The key that was in foreignkeys=""
 * @returns {unknown} The data, which could have many types.
 */
export default function getDataForKey(key) {
  const { scheme } = splitSchemeAndValue(key)
  const resolveFunction = schemesAndFunctions.get(scheme)
  if (resolveFunction) return resolveFunction(key)
  else throw new Error('missing resolve function for key ' + key)
}

/**
 * Registers a scheme and resolve function. The resolve function will be called when we get
 * keys with the specified string. Resolve function gets passed the whole key.
 * @param {string} scheme the scheme like url:
 * @param {(key: string) => unknown} resolveFunction the function to resolve keys of that scheme.
 */
export function registerScheme(scheme, resolveFunction) {
  if (!(/^[a-zA-Z]+:$/).test(scheme)) throw new Error('invalid scheme' + scheme)
  if (schemesAndFunctions.has(scheme)) throw new Error('scheme already registered ' + scheme)
  schemesAndFunctions.set(scheme, resolveFunction)
}
