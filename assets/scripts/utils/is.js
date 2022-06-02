/**
 * Check if argument is an object
 * @param {?object}     x   - elemet to check
 * @return {boolean}    true if element is an object
 */

const isObject = x => (x && typeof x === 'object')


/**
 * Check if argument is function
 * @param {?function}   x   - element to check
 * @return {boolean}    true if element is a function
 */

const isFunction = x => x instanceof Function


export {
    isObject,
    isFunction
}
