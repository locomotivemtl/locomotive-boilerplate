/**
 * Debounce function
 * @param {function}    callback
 * @param {number}      delay in ms
 * @return {function}   callback
 */

const debounce = (callback, delay) => {
    let timeoutId = null

    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            callback.apply(null, args)
        }, delay)
    }
}

export default debounce
