import { debounce } from './tickers'

CUSTOM_EVENT_LISTENERS = []

/**
 * Check if element is Window
 * @param  {DOMElement} $el - Element to check
 * @return {boolean}    True if window
 */

const isWindow = $el => $el === window


/**
 * Check if element is a DOM element
 * @param  {DOMElement} $el - Element to check
 * @return {boolean}    True if dom element
 */

const isDomElement = $el => ($el instanceof Element || $el instanceof HTMLDocument || $el instanceof HTMLDocument)


/**
 * Check if element is Window or DOM element
 * @param  {Element}    $el - Element to check
 * @return {boolean}    True if window or DOM element
 */

const isValidElement = $el => (isWindow($el) || isDomElement($el))


/**
 * Check if element already has the event attached
 * @param  {Element}    $el     - Element where the event is attached
 * @param  {String}     event   - The event name
 * @return {Boolean}    True if the event is already attached to the element
 */

const customEventIsDefined = ($el, event) => CUSTOM_EVENT_LISTENERS.findIndex(e => e.$el === $el && e.event === event) > -1


/**
 * Add custom event to event storage
 * @param  {Element}    $el     - Element where the event is attached
 * @param  {String}     event   - The event name
 * @return {void}
 */

const addCustomEvent = ($el, event) => {
    if(!customEventIsDefined($el, event)) {
        CUSTOM_EVENT_LISTENERS.push({
            $el,
            event
        })
    }
}


/**
 * Create a sarting event for the event triggered
 * @param  {Element}    $el     - Element to bind the event to
 * @param  {object}     event   - The triggered event's name
 * @return {void}
 */

const addStartEvent = ($el, event, delay = 200) => {

    const eventName = `${event}Start`

    // Check element
    if(!isValidElement($el)) {
        console.warn(`[addStartEvent:${eventName}]: Wrong parameter '${el}'. The parameter must be document, window or a DOM element`)
        return
    }

    // Check if event already exists
    if(customEventIsDefined($el, eventName)) {
        console.log(`[addStartEvent:${eventName}]: Already exists for '${el}' element`)
        return
    }

    // Register element and event
    addCustomEvent($el, eventName)

    // Create event
    const startEvent = new CustomEvent(eventName)
    $el.addEventListener(event, debounce(() => {
        $el.dispatchEvent(startEvent)
    }, delay, true))
}

/**
 * Create an ending event for the event triggered
 * @param  {Element}    $el     - Element to bind the event to
 * @param  {object}     event   - The triggered event's name
 * @return {void}
 */

const addEndEvent = ($el, event, delay = 200) => {

    const eventName = `${event}End`

    // Check element
    if(!isValidElement($el)) {
        console.warn(`[addEndEvent:${eventName}]: Wrong parameter '${el}'. The parameter must be document, window or a DOM element`)
        return
    }

    // Check if event already exists
    if(customEventIsDefined($el, eventName)) {
        console.log(`[addEndEvent:${eventName}]: Already exists for '${el}' element`)
        return
    }

    // Register element and event
    addCustomEvent($el, eventName)

    // Create event
    const endEvent = new CustomEvent(eventName)
    $el.addEventListener(event, debounce(() => {
        $el.dispatchEvent(endEvent)
    }, delay))
}


/**
 * Add scrollUp event to element (window by default)
 * @param  {Element} $el - Element to bind the event to
 * @return {void}
 */

const addScrollUpEvent = ($el = window) => {

    // Check element
    if(!isValidElement($el)) {
        console.warn(`[addScrollUpEvent]: Wrong parameter '${el}'. The parameter must be window or a DOM element`)
        return
    }

    let scrollTop = $el.scrollTop
    let previousScrollTop = scrollTop
    let direction = 0
    const scrollUp = new CustomEvent('scrollUp')
    const scrollProperty = isWindow($el) ? 'scrollY' : 'scrollTop'

    $el.addEventListener('scroll', e => {
        scrollTop = $el[scrollProperty]

        // Scroll up
        if(scrollTop < previousScrollTop && direction > -1) {
            $el.dispatchEvent(scrollUp)
            direction = -1

        // Scroll down
        } else if(scrollTop > previousScrollTop && direction < 1) {
            direction = 1
        }

        previousScrollTop = scrollTop
    })
}


/**
 * Add scrollDown event to element (window by default)
 * @param  {Element} $el - Element to bind the event to
 * @return {void}
 */

const addScrollDownEvent = ($el = window) => {

    // Check element
    if(!isValidElement($el)) {
        console.warn(`[addScrollDownEvent]: Wrong parameter '${el}'. The parameter must be window or a DOM element`)
        return
    }

    let scrollTop = $el.scrollTop
    let previousScrollTop = scrollTop
    let direction = 0
    const scrollDown = new CustomEvent('scrollDown')
    const scrollProperty = isWindow($el) ? 'scrollY' : 'scrollTop'

    $el.addEventListener('scroll', e => {
        scrollTop = $el[scrollProperty]

        // Scroll up
        if(scrollTop < previousScrollTop && direction > -1) {
            direction = -1

        // Scroll down
        } else if(scrollTop > previousScrollTop && direction < 1) {
            $el.dispatchEvent(scrollDown)
            direction = 1
        }

        previousScrollTop = scrollTop
    })
}

export {
    addStartEvent,
    addEndEvent,
    addScrollUpEvent,
    addScrollDownEvent,
}
