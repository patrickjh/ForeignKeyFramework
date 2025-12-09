/**
 * Convenience method to navigate to a hash in a way that works with ForeignKeyPage.
 * copies params from current url. Set a param to null to delete that param.
 * Pass null as urlParams arg to delete all params.
 * Uses history.replaceState().
 * @param {string} hash The hash to go to
 * @param {{[key:string]: string | null} | null} [urlParams] The url params to use.
 */
export default function replaceWithHash(hash, urlParams) {
  if (!(/^#?[a-zA-Z]+$/).test(hash)) throw new Error('invalid hash: ' + hash)
  const urlToChange = new URL(globalThis.location.href)
  if (urlParams !== undefined) handleParamsArg(urlToChange, urlParams)
  urlToChange.hash = hash
  globalThis.history.replaceState(null, '', urlToChange)
}

/**
 * Handles the url params arg
 * @param {URL} url the url we are changing
 * @param {{[key:string]: string | null} | null} urlParams the url params to change
 */
function handleParamsArg(url, urlParams) {
  if (urlParams === null) url.search = ''
  else for (const [key, value] of Object.entries(urlParams)) {
    if (value !== null) url.searchParams.set(key, value)
    if (value === null) url.searchParams.delete(key)
  }
}

