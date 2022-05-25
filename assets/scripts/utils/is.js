const toString = Object.prototype.toString;


/**
 * Check if two values are equal
 * @param {?}           a   - first value
 * @param {?}           b   - second value
 * @return {boolean}    true if element both elements are equals
 */

const isEqual = (a, b) => (typeof a === 'object' || typeof b === 'object') ? false : a === b


/**
 * Check if argument is a number
 * @param {?number}     x   - element to check
 * @return {boolean}    true if element is a number
 */

const isNumeric = x => !isNaN(x) && !isNaN(parseFloat(x))


/**
 * Check if argument is an object
 * @param {?object}     x   - element to check
 * @return {boolean}    true if element is an object
 */

const isObject = x => (x && toString.call(x) === '[object Object]')


/**
 * Check if argument is function
 * @param {?function}   x   - element to check
 * @return {boolean}    true if element is a function
 */

const isFunction = x => x instanceof Function


export {
    isEqual,
    isNumeric,
    isObject,
    isFunction
}
