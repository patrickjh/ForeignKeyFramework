/**
 * Convenience method to navigate to a hash in a way that works with ForeignKeyPage.
 * copies params from current url - set a param to null to delete that param.
 * Set urlParams arg to null to remove all url params.
 * uses history.pushState().
 * @param {string} hash The hash to go to
 * @param {{[key:string]: string | null} | null} [urlParams] The url params to use
 * as an object with the keys being the name and the value being the value.
 */
export default function goToHash(hash, urlParams) {
  if (!(/^#?[a-zA-Z]+$/).test(hash)) throw new Error('invalid hash: ' + hash)
  const urlToChange = new URL(globalThis.location.href)
  if (urlParams !== undefined) handleParamsArg(urlToChange, urlParams)
  urlToChange.hash = hash
  globalThis.history.pushState(null, '', urlToChange)
}

/**
 * Handles adding the url params arg into the new url
 * @param {URL} url The new url
 * @param {{[key:string]: string | null} | null} urlParams The url params arg
 */
function handleParamsArg(url, urlParams) {
  if (urlParams === null) url.search = ''
  else for (const [key, value] of Object.entries(urlParams)) {
    if (value !== null) url.searchParams.set(key, value)
    if (value === null) url.searchParams.delete(key)
  }
}
