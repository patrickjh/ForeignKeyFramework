import ForeignKeyElement from '../../elements/utils/ForeignKeyElement.js'

export default class FilterByQueryParamPage extends ForeignKeyElement {
  static TAG_NAME = 'filter-by-query-param-page'

  /** @override */
  template = `
    <foreign-key-page hash="queryParamFilter">
      <h2>List of to dos that match todo= query param</h2>
      <h3>
        Change the todo= query param using this input and watch the list update
        to only show todos that have that string in the todo.
      </h3>
      <input type="text" id="urlparaminput">
      <foreign-key-list
        element="single-todo"
        foreignkeys="store:todos.matchingTodoQueryParam url:todo">
      </foreign-key-list>
    </foreign-key-page>
  `

  /** @override */
  init() {
    this.getElementOrThrow('#urlparaminput').addEventListener('input', (e) => {
      if (e.target instanceof HTMLInputElement) this.changeUrlParamToMatchValue(e.target)
    })
  }

  /**
   * Changes the todo= url param to match the value="" from the <input> element
   * @param {HTMLInputElement} inputElement The <input> element
   */
  changeUrlParamToMatchValue(inputElement) {
    const newUrl = new URL(globalThis.location.href)
    newUrl.searchParams.set('todo', inputElement.value)
    globalThis.history.pushState(null, '', newUrl)
  }
}
