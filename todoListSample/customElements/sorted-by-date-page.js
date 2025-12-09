import ForeignKeyElement from '../../elements/utils/ForeignKeyElement.js'

export default class SortedByDatePage extends ForeignKeyElement {
  static TAG_NAME = 'sorted-by-date-page'

  /** @override */
  template = `
  <foreign-key-page hash="sortedByDate">
    <foreign-key-list
      element="single-todo"
      foreignkeys="store:todos.sortedByDate">
    </foreign-key-list>
  </foreign-key-page>
  `
}
