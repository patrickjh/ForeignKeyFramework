import setupForeignKeyFramework from '../mainSetupFile.js'
import ForeignKeyEvent from '../utils/ForeignKeyEvent.js'
import updateElement from '../utils/updateElement.js'
import todoStore from './TodoStore.js'
import FilterByQueryParamPage from './customElements/filter-by-query-param-page.js'
import NewTodoPage from './customElements/new-todo-page.js'
import SingleTodo from './customElements/single-todo.js'
import SortedAlphabeticallyPage from './customElements/sorted-alphabetically-page.js'
import SortedByDatePage from './customElements/sorted-by-date-page.js'

setupForeignKeyFramework()

globalThis.customElements.define(SingleTodo.TAG_NAME, SingleTodo)
globalThis.customElements.define(NewTodoPage.TAG_NAME, NewTodoPage)
globalThis.customElements.define(SortedByDatePage.TAG_NAME, SortedByDatePage)
globalThis.customElements.define(SortedAlphabeticallyPage.TAG_NAME, SortedAlphabeticallyPage)
globalThis.customElements.define(FilterByQueryParamPage.TAG_NAME, FilterByQueryParamPage)

globalThis.document.addEventListener('DOMContentLoaded', () => {
  globalThis.setTimeout(() => { todoStore.saveNewTodo('some to do') }, 2000)
  globalThis.setTimeout(() => { todoStore.saveNewTodo('another to do') }, 4000)
  globalThis.setTimeout(() => { todoStore.saveNewTodo('last to do') }, 6000)
})

globalThis.document.getElementById('showhash')?.addEventListener('foreignkey', (e) => {
  if (e instanceof ForeignKeyEvent && e.target instanceof HTMLElement) {
    e.target.innerText = '#' + String(e.value)
  }
})

updateElement(globalThis.document.getElementById('showhash'))
