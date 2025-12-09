/** @type {Array<() => void>} */ const highPriorityTasks = []
/** @type {Array<() => void>} */ const lowPriorityTasks = []

/**
 * Schedules a task to run as part of the browser task queue. Lets new high priority tasks pre-empt
 * old tasks while still returning control to the browser frequently to enable smooth rendering.
 * @param {() => void} task A task to run
 * @param {"high" | "low" | "sync"} priority The priority to run the task.
 * "high" or "low" priority schedules a call to setTimeout(). In that call to setTimeout()
 * this pulls and runs one task from the queue before using setTimeout() again to return control to
 * the browser. The queue of "high" priority tasks must be empty before any "low" priority
 * tasks run. This way the browser has lots of chances to render and we can pre-empt
 * previously scheduled tasks. "sync" tasks run right away within a try / catch block that logs
 * errors so tasks with errors do not affect other tasks. "sync" is just a convenience for
 * developers using scheduleTask() where the same task might be async or sync.
 */
export default function scheduleTask(task, priority) {
  if (!['high', 'low', 'sync'].includes(priority)) throw new Error('invalid priority ' + priority)
  if (!(task instanceof Function)) throw new Error('invalid task' + JSON.stringify(task))
  if (priority === 'sync') runTaskSynchronously(task)
  else {
    if (priority === 'high') highPriorityTasks.push(task)
    if (priority === 'low') lowPriorityTasks.push(task)
    handleTasksRecursively()
  }
}


/**
 * Runs a task synchronously
 * @param {() => void} task The task to run
 */
function runTaskSynchronously(task) {
  try {
    task()
  } catch(e) {
    globalThis.console.error('problem running task', e)
  }
}

let timeoutScheduled = false

/**
 * Starts processing to handle tasks recursively
 */
function handleTasksRecursively() {
  if (timeoutScheduled === false) {
    timeoutScheduled = true
    globalThis.setTimeout(() => {
      timeoutScheduled = false
      if (highPriorityTasks.length + lowPriorityTasks.length > 1) handleTasksRecursively()
      handleOneTask()
    })
  }
}

/**
 * Handles one task before returning control to browser.
 */
function handleOneTask() {
  const highPriorityTask = highPriorityTasks.shift()
  if (highPriorityTask) highPriorityTask()
  else {
    const lowPriorityTask = lowPriorityTasks.shift()
    if (lowPriorityTask) lowPriorityTask()
    else throw new Error('No high priority or low priority tasks for scheduleTask()')
  }
}
