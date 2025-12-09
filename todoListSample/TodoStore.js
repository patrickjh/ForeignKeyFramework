import ForeignKeyStore from '../schemes/store/ForeignKeyStore.js'

/**
 * @import { Todo } from './TodoTypedef.js'
 */

/** @augments ForeignKeyStore<Todo> */
class TodoStore extends ForeignKeyStore {
  constructor() { super('todos') }

  currentId = 0

  /**
   * Checks the type
   * @param {unknown} object the object
   * @returns {Todo} a Todo
   * @override
   */
  assertType(object) {
    if (this.isTodo(object)) return object
    else throw new Error('not Todo: ' + String(object))
  }

  /**
   * Type checks the object as a todo
   * @param {unknown} object Any object
   * @returns {object is Todo} true if the object is a todo
   */
  isTodo(object) {
    if (typeof object !== 'object' || object === null) return false
    return 'state' in object && typeof object.state === 'string' &&
      'todo' in object && typeof object.todo === 'string' &&
      'id' in object && typeof object.id === 'string' &&
      'created' in object && object.created instanceof Date
  }

  /**
   * Creates a new Todo from a todo string
   * @param {string} todo The string of what to do
   */
  saveNewTodo(todo) {
    const newTodo = {
      todo: todo,
      state: 'in progress',
      created: new Date(),
      id: String(this.currentId++)
    }
    this.set(newTodo.id, newTodo)
  }

  /**
   * TodoStore helper method to mark the to do done
   * @param {string} key the key of the todo
   */
  markDone(key) {
    const value = this.get(key)
    value.state = 'done'
    this.set(key, value)
  }

  sortedByDate() {
    return this.getAll().sort((a, b) => { return a.created > b.created ? -1 : 1 })
  }

  sortedAlphabetically() {
    return this.getAll().sort((a, b) => { return a.todo < b.todo ? -1 : 1 })
  }

  matchingTodoQueryParam() {
    const queryParam = new URL(globalThis.location.href).searchParams.get('todo')
    if (!queryParam) return []
    return this.getAll().filter((todo) => todo.todo.includes(queryParam))
  }
}

const todoStore = new TodoStore()
export default todoStore
