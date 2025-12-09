import splitSchemeAndValue from '../../utils/splitSchemeAndValue.js'

/**
 * Gets data for a key that has scheme click:
 * @param {string} key the Key
 * @returns {HTMLElement | null} the related data
 */
export default function resolveClickKey(key) {
  const { scheme, value } = splitSchemeAndValue(key)
  if (scheme !== 'click:') throw new Error('not click: scheme ' + key)
  return globalThis.document.getElementById(value)
}
