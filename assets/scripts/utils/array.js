import { isArray } from './is'


/**
 * Add item of array if doesn't exist
 * @param {array}       array   - array of items
 * @param {?string}     value   - value to add to the array
 * @return {void}
 */

const addToArray = (array, value) => {
    if (array.indexOf(value) === -1) {
        array.push(value)
    }
}


/**
 * Check if array contains a value
 * @param {array}       array   - array of items
 * @param {?string}     value   - value to find in the array
 * @return {boolean}    true if array contains value
 */

const arrayContains = (array, value) => array.find(item => item === value)


/**
 * Compare two arrays and see if their content match
 * @param {array}       a   - first array of items
 * @param {array}       b   - second array of items
 * @return {boolean}    true if both arrays are the same
 */

const arrayContentsMatch = (a, b) => a.length === b.length && a.every((v, i) => v === b[i])


/**
 * Get last item of the given array
 * @param {array}       array   - array of items
 * @return {?string}    the last value of the array
 */

const lastItemOfArray = array => array[array.length - 1]


/**
 * Remove specific value from array
 * @param {array}       array   - array of items
 * @param {?string}     value   - value to remove from the array
 * @return {void}
 */

const removeFromArray = (array, value) => {
    if (!array) {
        return
    }

    const index = array.indexOf(value)
    if (index !== -1) {
        array.splice(index, 1)
    }
}


/**
 * Convert array like to array
 * @param {array}   arrayLike   - array like to convert
 * @return {array}  array converted
 */

const toArray = arrayLike => {
    const array = []
    let i = arrayLike.length
    while (i--) {
        array[i] = arrayLike[i]
    }

    return array
}


/**
 * Find item in array by key value
 * @param {array}   array   - array to search
 * @param {string}  key     - object key
 * @param {string}  value   - vlaue to find
 * @return {string} value
 */

const findByKeyValue = (array, key, value) => array.filter(obj => obj[key] === value)


/**
 * Clone an array
 * @param {array}   array   - array to clone
 * @return {array}  cloned array
 */

const cloneArray = array => JSON.parse(JSON.stringify(array))


/**
 * Shuffles array in place. ES6 version
 * @param {array}   array   - array containing the items
 * @return {array}  shuffled array
 */

const shuffleArray = array => array.sort(() => 0.5 - Math.random())


// Export
export {
    addToArray,
    arrayContains,
    arrayContentsMatch,
    ensureArray,
    lastItemOfArray,
    removeFromArray,
    toArray,
    findByKeyValue,
    cloneArray,
    shuffleArray
}
