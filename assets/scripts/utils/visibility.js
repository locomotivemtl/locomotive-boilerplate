import { isFunction } from './is';
import { arrayContains, findByKeyValue, removeFromArray } from './array';
import { $document, $window, $html, $body } from './environment';

const CALLBACKS = {
    hidden: [],
    visible: []
};

const ACTIONS = [
    'addCallback',
    'removeCallback'
];

const STATES = [
    'visible',
    'hidden'
];

const PREFIX = 'v-';

let UUID = 0;

// Main event
$document.on('visibilitychange', function(event) {
    if (document.hidden) {
        onDocumentChange('hidden');
    } else {
        onDocumentChange('visible');
    }
});

/**
 * Add a callback
 * @param {string}   state
 * @param {function} callback
 * @return {string}  ident
 */
function addCallback (state, options) {
    let callback = options.callback || '';

    if (!isFunction(callback)) {
        console.warn('Callback is not a function');
        return false;
    }

    let ident = PREFIX + UUID++;

    CALLBACKS[state].push({
        ident: ident,
        callback: callback
    });

    return ident;
}

/**
 * Remove a callback
 * @param  {string}   state  Visible or hidden
 * @param  {string}   ident  Unique identifier
 * @return {boolean}         If operation was a success
 */
function removeCallback (state, options) {
    let ident = options.ident || '';

    if (typeof(ident) === 'undefined' || ident === '') {
        console.warn('Need ident to remove callback');
        return false;
    }

    let index = findByKeyValue(CALLBACKS[state], 'ident', ident)[0];

    // console.log(ident)
    // console.log(CALLBACKS[state])

    if (typeof(index) !== 'undefined') {
        removeFromArray(CALLBACKS[state], index);
        return true;
    } else {
        console.warn('Callback could not be found');
        return false;
    }
}

/**
 * When document state changes, trigger callbacks
 * @param  {string}  state  Visible or hidden
 */
function onDocumentChange (state) {
    let callbackArray = CALLBACKS[state];
    let i = 0;
    let len = callbackArray.length;

    for (; i < len; i++) {
        callbackArray[i].callback();
    }
}

/**
 * Public facing API for adding and removing callbacks
 * @param   {object}           options  Options
 * @return  {boolean|integer}           Unique identifier for the callback or boolean indicating success or failure
 */
function visibilityApi (options) {
    let action = options.action || '';
    let state = options.state || '';
    let ret;

    // Type and value checking
    if (!arrayContains(ACTIONS, action)) {
        console.warn('Action does not exist');
        return false;
    }
    if (!arrayContains(STATES, state)) {
        console.warn('State does not exist');
        return false;
    }

    // @todo Magic call function pls
    if (action === 'addCallback') {
        ret = addCallback(state, options);
    } else if (action === 'removeCallback') {
        ret = removeCallback(state, options);
    }

    return ret;
}

export { visibilityApi };
