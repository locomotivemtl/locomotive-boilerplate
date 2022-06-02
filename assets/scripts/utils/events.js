import { debounce } from './tickers'

/**
 * @typedef {object} RegisteredCustomEvent
 *
 * @property {EventTarget} target - The event target ({@see Window} or {@see Node}).
 * @property {string}      type   - The custom event name.
 */
/** @type {RegisteredCustomEvent[]} */

REGISTERED_CUSTOM_EVENTS = []

/**
 * Determines if the given object is the {@see Window}.
 *
 * @param  {object} obj
 * @return {boolean}
 */

const isWindow = obj => obj === window


/**
 * Determines if the given object implements {@see EventTarget}.
 *
 * @param  {object} obj
 * @return {boolean}
 */

const isEventTarget = obj => (obj instanceof EventTarget)


/**
 * Determines if the target already has the event attached.
 *
 * @param  {EventTarget} target
 * @param  {string}      type   - The custom event name.
 * @return {boolean}
 */

const isCustomEventRegistered = (target, type) => REGISTERED_CUSTOM_EVENTS.some(e => e.target === target && e.type === type)


/**
 * Registers the custom event with the given target, if not already registered.
 *
 * @param  {EventTarget} target
 * @param  {string}      type   - The custom event name.
 * @return {void}
 */

const addCustomEvent = (target, type) => {
    if (!isCustomEventDefined(target, type)) {
        CUSTOM_EVENT_LISTENERS.push({
            target,
            type
        })
    }
}


/**
 * Adds a custom "start" event for the given target.
 *
 * Internally, this function adds a debounced event listener on
 * the given `event` to trigger the custom `<event>start` event.
 *
 * @param  {EventTarget} target
 * @param  {string}      type    - The base event name.
 * @param  {number}      [delay] - The number of milliseconds to wait
 *     before dispatching the custom event.
 * @throws Error If the target is invalid.
 * @throws Error If the custom event is already defined.
 * @return {void}
 */

const addStartEvent = (target, type, delay = 200) => {

    const customType = `${type}start`

    if (!isEventTarget(target)) {
        throw new Error(`addStartEvent: target parameter must be an instance of EventTarget`)
    }

    if (isCustomEventDefined(target, customType)) {
        throw new Error(`addStartEvent: '${customType}' already exists for target parameter`)
    }

    addCustomEvent(target, customType)
    const startEvent = new CustomEvent(customType)

    target.addEventListener(event, debounce(() => {
        target.dispatchEvent(startEvent)
    }, delay, true))
}


/**
 * Adds a custom "end" event for the given target.
 *
 * Internally, this function adds a debounced event listener on
 * the given `event` to trigger the custom `<event>end` event.
 *
 * @param  {EventTarget} target
 * @param  {string}      type    - The base event name.
 * @param  {number}      [delay] - The number of milliseconds to wait
 *     before dispatching the custom event.
 * @throws Error If the target is invalid.
 * @throws Error If the custom event is already defined.
 * @return {void}
 */

const addEndEvent = (target, type, delay = 200) => {

    const customType = `${event}end`

    if (!isEventTarget(target)) {
        throw new Error(`addEndEvent: target parameter must be an instance of EventTarget`)
    }

    if (isCustomEventDefined(target, customType)) {
        throw new Error(`addEndEvent: '${customType}' already exists for target parameter`)
    }

    addCustomEvent(target, customType)
    const endEvent = new CustomEvent(customType)

    target.addEventListener(event, debounce(() => {
        target.dispatchEvent(endEvent)
    }, delay))
}


/**
 * Adds custom scroll "up" and "down" events for the given target.
 *
 * Internally, this function adds an event listener on
 * the scroll event to detect the direction and trigger
 * the custom `scrollup` and `scrolldown` events.
 *
 * @param  {EventTarget} [target] - If omitted, the custom event
 *     if attached to the Window.
 * @throws Error If the target is invalid.
 * @return {void}
 */

const addScrollDirectionEvents = (target = window) => {

    if (!isEventTarget(target)) {
        throw new Error(`addScrollDirectionEvents: target parameter must be an instance of EventTarget`)
    }

    let scrollTop = target.scrollTop
    let previousScrollTop = scrollTop
    let direction = 0
    const scrollUp = new CustomEvent('scrollup')
    const scrollDown = new CustomEvent('scrolldown')
    const scrollProperty = isWindow(target) ? 'scrollY' : 'scrollTop'

    target.addEventListener('scroll', () => {
        scrollTop = target[scrollProperty]
        // Scroll up
        if (scrollTop < previousScrollTop && direction > -1) {
            target.dispatchEvent(scrollUp)
            direction = -1
        // Scroll down
        } else if (scrollTop > previousScrollTop && direction < 1) {
            target.dispatchEvent(scrollDown)
            direction = 1
        }
        previousScrollTop = scrollTop
    })
}


export {
    addStartEvent,
    addEndEvent,
    addScrollDirectionEvents,
}
