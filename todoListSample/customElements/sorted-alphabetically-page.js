import ForeignKeyElement from '../../elements/utils/ForeignKeyElement.js'

export default class SortedAlphabeticallyPage extends ForeignKeyElement {
  static TAG_NAME = 'sorted-alphabetically-page'

  /** @override */
  template = `
  <foreign-key-page hash="sortedAlphabetically">
    <foreign-key-list
      element="single-todo"
      foreignkeys="store:todos.sortedAlphabetically">
    </foreign-key-list>
  </foreign-key-page>
  `
}
