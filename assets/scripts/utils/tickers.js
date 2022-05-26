/**
 * Debounce function: fire the callback before/after the action has finished for the defined amount of time
 * @param {function}    callback    - callback function
 * @param {number}      delay       - waiting time in milisecond
 * @param {boolean}     immediate   - triggers before or after delay
 * @return {function}   callback
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
