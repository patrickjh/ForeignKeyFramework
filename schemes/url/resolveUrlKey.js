import splitSchemeAndValue from '../../utils/splitSchemeAndValue.js'

/**
 * Gets data for a key that starts with scheme url:
 * @param {string} key the key
 * @returns {string | null} the related data
 */
export default function resolveUrlKey(key) {
  const { scheme, value } = splitSchemeAndValue(key)
  if (scheme !== 'url:') throw new Error('not url: scheme ' + key)
  if (value === 'hash') return new URL(globalThis.location.href).hash.replace(/^#/, '')
  else return new URL(globalThis.location.href).searchParams.get(value)
}
