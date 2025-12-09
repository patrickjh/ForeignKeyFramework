import assertString from './asserts/assertString.js'

/**
 * Splits a key into a scheme and value. Like splits "input:newTodo" into "input:" and "newTodo"
 * @param {string} schemeAndValue the key
 * @returns { SchemeAndValue } An object representing the scheme and value.
 */
export default function splitSchemeAndValue(schemeAndValue) {
  const schemeRegex = /^[a-zA-Z]+:/
  const regexResults = schemeRegex.exec(schemeAndValue)
  if (!regexResults) throw new Error('no scheme in string: ' + schemeAndValue)
  return {
    scheme: assertString(regexResults[0]).trim(),
    value: assertString(schemeAndValue.replace(schemeRegex, '').trim())
  }
}

/**
 * @typedef SchemeAndValue
 * @property {string} scheme the scheme
 * @property {string} value the value
 */
