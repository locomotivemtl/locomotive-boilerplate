/**
 * Creates a debounced function.
 *
 * A debounced function delays invoking `callback` until after
 * `delay` milliseconds have elapsed since the last time the
 * debounced function was invoked.
 *
 * Useful for behaviour that should only happen _before_ or
 * _after_ an event has stopped occurring.
 *
 * @template {function} T
 *
 * @param  {T}       callback    - The function to debounce.
 * @param  {number}  delay       - The number of milliseconds to wait.
 * @param  {boolean} [immediate] -
 *     If `true`, `callback` is invoked before `delay`.
 *     If `false`, `callback` is invoked after `delay`.
 * @return {function<T>} The new debounced function.
 */

const debounce = (callback, delay, immediate = false) => {
    let timeout = null

    return (...args) => {
        clearTimeout(timeout)

        const later = () => {
            timeout = null
            if (!immediate) {
                callback(...args)
            }
        }

        if (immediate && !timeout) {
            callback(...args)
        }

        timeout = setTimeout(later, delay)
    }
}


/**
 * Throttle function: fire the callback while the action is being performed for the defined iteration time
 * @param {function}    callback    - callback function
 * @param {number}      delay       - waiting time in milisecond
 * @return {function}   callback
 */

const throttle = (callback, delay) => {
    let timeout = false

    return (...args) => {
        if (!timeout) {
            timeout = true

            callback(...args)

            setTimeout(() => {
                timeout = false
            }, delay)
        }
    }
}


export {
    debounce,
    throttle
}
