const toString = Object.prototype.toString;
const arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

/**
 * Check if argument is an array
 * @param {?array}      x   - element to check
 * @return {boolean}    true if element is an array
 */

const isArray = x => toString.call(x) === '[object Array]'


/**
 * Check if argument is an array like
 * @param {array|object}    x   - element to check
 * @return {boolean}        true if element is an array like
 */

const isArrayLike = x => arrayLikePattern.test(toString.call(x))


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


// Export
export {
    isArray,
    isArrayLike,
    isEqual,
    isNumeric,
    isObject,
    isFunction
}
