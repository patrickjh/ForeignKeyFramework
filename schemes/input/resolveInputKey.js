import splitSchemeAndValue from '../../utils/splitSchemeAndValue.js'

/**
 * Resolves a key with scheme input:
 * @param {string} key the key
 * @returns {HTMLElement | null} the data for the key
 */
export default function resolveInputKey(key) {
  const { scheme, value } = splitSchemeAndValue(key)
  if (scheme !== 'input:') throw new Error('not input: scheme ' + key)
  return globalThis.document.getElementById(value)
}
