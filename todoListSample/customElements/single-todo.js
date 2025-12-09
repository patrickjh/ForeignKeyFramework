import ForeignKeyElement from '../../elements/utils/ForeignKeyElement.js'
import ForeignKeyEvent from '../../utils/ForeignKeyEvent.js'
import todoStore from '../TodoStore.js'

export default class SingleTodo extends ForeignKeyElement {
  static TAG_NAME = 'single-todo'
  /** @type {import('../TodoTypedef.js').Todo | null} @private */ todo = null

  /** @override */
  template = `
    <div class="data">
      <h3>Todo:</h3>
      <p class="todotext"></p>
    </div>
    <div class="data">
      <h3>State:</h3>
      <p class="todostate"></p>
    </div>
   <div class="data">
      <h3>Time created:</h3>
      <p class="todocreated"></p>
    </div>
    <div class="buttons">
      <button class="done">Mark Done</button>
      <button class="delete">Delete Todo</button>
    </div>
  `

  /** @override */
  init() {
    this.getElementOrThrow('.done').addEventListener('click', () => { this.doneClicked() })
    this.getElementOrThrow('.delete').addEventListener('click', () => { this.deleteClicked() })
  }

  /** @override */
  onforeignkey(/** @type {ForeignKeyEvent} */e) {
    if (todoStore.isTodo(e.value)) {
      this.todo = e.value
      this.updateState()
      this.updateText()
      this.updateTime()
    }
  }

  doneClicked() {
    if (this.todo) todoStore.markDone(this.todo.id)
  }

  deleteClicked() {
    if (this.todo && todoStore.has(this.todo.id)) {
      todoStore.set(this.todo.id, null)
    }
  }

  updateState() {
    if (this.todo) this.getElementOrThrow('.todostate').innerText = this.todo.state
    else this.getElementOrThrow('.todostate').innerText = ''
  }

  updateText() {
    if (this.todo) this.getElementOrThrow('.todotext').innerText = this.todo.todo
    else this.getElementOrThrow('.todotext').innerText = ''
  }

  updateTime() {
    if (this.todo) {
      const todoTimeString = this.todo.created.toTimeString()
      this.getElementOrThrow('.todocreated').innerText = todoTimeString
    } else this.getElementOrThrow('.todocreated').innerText = ''
  }
}
