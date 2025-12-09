import ForeignKeyElement from '../../elements/utils/ForeignKeyElement.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import todoStore from '../TodoStore.js'

export default class NewTodoPage extends ForeignKeyElement {
  static TAG_NAME = 'new-todo-page'

  /** @override */
  template = `
  <foreign-key-page hash="newTodo">
    <h2>New to do</h2>
    <p class="feedback" foreignkeys="input:newTodoInput"></p>
    <label for="newTodoInput">New Todo</label>
    <input id="newTodoInput" name="todotext" type="text"/>
    <button class="save" foreignkeys="input:newTodoInput" disabled>Save</button>
  </foreign-key-page>
  `

  /** @override */
  init() {
    this.getElementOrThrow('.save').addEventListener('foreignkey', (e) => {
      if (e instanceof ForeignKeyEvent) this.buttonForeignKeyHandler(e)
    })
    this.getElementOrThrow('.save').addEventListener('click', () => { this.saveTodo() })
    this.getElementOrThrow('.feedback').addEventListener('foreignkey', (e) => {
      if (e instanceof ForeignKeyEvent) this.feedbackForeignKeyHandler(e)
    })
    this.getElementOrThrow('input').addEventListener('keyup', (e) => { this.inputKeyupHandler(e) })
  }

  /**
   * Handles foreign key event for the save button.
   * Save button is linked to input element and receives a foreign key
   * event every time the user changes the <input>
   * @param {ForeignKeyEvent} e The foreign key event.
   */
  buttonForeignKeyHandler(e) {
    if (e.value instanceof HTMLInputElement && e.target instanceof HTMLButtonElement) {
      if (e.value.value.length < 10) e.target.disabled = true
      if (e.value.value.length >= 10) e.target.disabled = false
    }
  }

  saveTodo() {
    const inputElement = this.querySelector('#newTodoInput')
    if (inputElement instanceof HTMLInputElement) {
      todoStore.saveNewTodo(inputElement.value)
      inputElement.value = ''
      inputElement.dispatchEvent(new Event('input'))
      globalThis.location.hash = 'sortedByDate' // navigate by hash, easy.
    }
  }

  /**
   * Handles foreign key events for the feedback element.
   * Feedback element is the target of the event
   * Value on the event is the <input> element because that's what the foreign key points to.
   * @param {ForeignKeyEvent} e the event
   */
  feedbackForeignKeyHandler(e) {
    if (e.target instanceof HTMLElement && e.value instanceof HTMLInputElement) {
      e.target.innerText = ''
      if (e.value.value.length > 0 && e.value.value.length < 10) {
        e.target.innerText = 'To do should have at least 10 characters'
      } else if (e.value.value.length >= 10) {
        e.target.innerText = 'Looks good!'
      }
    }
  }

  /**
   * Handles the keyup event for the input element
   * @param {KeyboardEvent} e the keyboard event
   */
  inputKeyupHandler(e) {
    if (e.key === 'Enter') this.saveTodo()
  }
}
