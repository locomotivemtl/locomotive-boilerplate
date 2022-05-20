/**
 * Clamp value
 * @param {number}  min - start value
 * @param {number}  max - end value
 * @param {number}  a   - alpha value
 * @return {number} clamped value
 */

const clamp = (min = 0, max = 1, a) => Math.min(max, Math.max(min, a))


/**
 * Calculate lerp
 * @param {number}  x   - start value
 * @param {number}  y   - end value
 * @param {number}  a   - alpha value
 * @return {number} lerp value
 */

const lerp = (x, y, a) => x * (1 - a) + y * a


/**
 * Calculate inverted lerp
 * @param {number}  x   - start value
 * @param {number}  y   - end value
 * @param {number}  a   - alpha value
 * @return {number} inverted lerp value
 */

const invlerp = (x, y, a) => clamp((v - x)/(a - x))


// Export
export {
    clamp,
    lerp,
    invlerp
}
