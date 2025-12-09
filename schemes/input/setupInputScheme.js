import { registerScheme } from '../../utils/getDataForKey.js'
import updateElementsWithKey from '../../utils/updateElementsWithKey.js'
import resolveInputKey from './resolveInputKey.js'

/**
 * Sets up framework code to support the 'input:' scheme.
 * This scheme listens for 'input' events which bubble up.
 * When an event is received, this updates elements whose foreign key matches "input:{{elementId}}"
 */
export default function setupInputScheme() {
  registerScheme('input:', resolveInputKey)
  globalThis.addEventListener('input', (e) => {
    if (e.target instanceof HTMLInputElement && e.target.id) {
      updateElementsWithKey('input:' + e.target.id)
    }
  })
  globalThis.console.log('Setup input: scheme for Foreign Key Framework')
}
