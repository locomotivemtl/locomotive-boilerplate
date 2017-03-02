(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

var _html = require('./utils/html');

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _is = require('./utils/is');

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


// Global functions and tools


// Basic modules


var App = function () {
    function App() {
        var _this = this;

        _classCallCheck(this, App);

        this.modules = modules;
        this.currentModules = [];

        _environment.$document.on('initModules.App', function (event) {
            _this.initGlobals(event.firstBlood).deleteModules().initModules(event);
        });

        _environment.$document.on('initScopedModules.App', function (event) {
            _this.initModules(event);
        });
    }

    /**
     * Destroy all existing modules
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.deleteModules = function deleteModules() {
        // Loop modules
        var i = this.currentModules.length;

        // Destroy all modules
        while (i--) {
            this.currentModules[i].destroy();
            this.currentModules.splice(i);
        }

        return this;
    };

    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.initGlobals = function initGlobals(firstBlood) {
        (0, _globals2.default)(firstBlood);
        return this;
    };

    /**
     * Find modules and initialize them
     * @param  {Object} event The event being triggered.
     * @return {Object}       Self (allows chaining)
     */


    App.prototype.initModules = function initModules(event) {
        // Elements with module
        var moduleEls = void 0;

        // If first blood, load all modules in the DOM
        // If scoped, render elements with modules
        // If not, load modules contained in Barba container
        if (event.firstBlood) {
            moduleEls = document.querySelectorAll('[data-module]');
        } else if (typeof event.scope !== 'undefined' && (0, _is.isFunction)(event.scope.querySelectorAll)) {
            moduleEls = event.scope.querySelectorAll('[data-module]');
        } else {
            moduleEls = document.getElementById('js-barba-wrapper').querySelectorAll('[data-module]');
        }

        // Loop through elements
        var i = 0;
        var elsLen = moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            var el = moduleEls[i];

            // All data- attributes considered as options
            var options = (0, _html.getNodeData)(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $(el);

            // Module does exist at this point
            var attr = options.module;

            // Splitting modules found in the data-attribute
            var moduleIdents = attr.split(/,\s*|\s+/g);

            // Loop modules
            var j = 0;
            var modulesLen = moduleIdents.length;

            for (; j < modulesLen; j++) {
                var moduleAttr = moduleIdents[j];

                if (typeof this.modules[moduleAttr] === 'function') {
                    var module = new this.modules[moduleAttr](options);
                    this.currentModules.push(module);
                }
            }
        }

        return this;
    };

    return App;
}();

// IIFE for loading the application
// ==========================================================================


(function () {
    new App();
    _environment.$document.triggerHandler({
        type: 'initModules.App',
        firstBlood: true
    });
})();

},{"./globals":2,"./modules":3,"./utils/environment":8,"./utils/html":9,"./utils/is":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (firstBlood) {
    svg4everybody();

    if (firstBlood) {
        var transitionManager = new _TransitionManager2.default();
    }
};

var _TransitionManager = require('./transitions/TransitionManager');

var _TransitionManager2 = _interopRequireDefault(_TransitionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./transitions/TransitionManager":6}],3:[function(require,module,exports){
/* jshint esnext: true */
"use strict";

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* jshint esnext: true */
var uid = 0;

/**
 * Abstract Module
 */

var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.$el = options.$el || null;
        this.el = options.el || null;

        // Generate a unique module identifier
        this.uid = 'm-' + uid++;
    }

    _class.prototype.destroy = function destroy() {
        if (this.$el) {
            this.$el.off();
        }
    };

    return _class;
}();

exports.default = _class;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

function DefaultTransition(options) {
    options = options || {};
    var startCallback = typeof options.startCallback === 'function' ? options.startCallback : function () {};
    var overrideClass = typeof options.overrideClass === 'string' ? options.overrideClass : '';

    return Barba.BaseTransition.extend({
        start: function start() {
            var _this = this;

            _environment.$html.removeClass('dom-is-loaded dom-is-animated').addClass('dom-is-loading ' + overrideClass);

            startCallback();

            /* Close any overlays */

            setTimeout(function () {
                Promise.all([_this.newContainerLoading]).then(_this.finish.bind(_this));
            }, 1000);
        },
        finish: function finish() {
            this.done();

            var $el = $(this.newContainer);

            // Get the template name of the new container and set it to the DOM
            _environment.$html.attr('data-template', $el.data('template'));

            _environment.$document.triggerHandler({
                type: 'initModules.App',
                firstBlood: false
            });

            _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

            setTimeout(function () {
                _environment.$html.removeClass(overrideClass).addClass('dom-is-animated');
            }, 1000);
        }
    });
} /* jshint esnext: true */
exports.default = DefaultTransition;

},{"../utils/environment":8}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _DefaultTransition = require('./DefaultTransition');

var _DefaultTransition2 = _interopRequireDefault(_DefaultTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


var _class = function () {
    function _class() {
        var _this = this;

        _classCallCheck(this, _class);

        var clickedLink = undefined;
        var transition = '';

        // jQuery ondomready
        $(function () {
            _this.load();
        });

        _environment.$document.on('goTo.PageTransitionManager', function (event) {
            if (!window.history.pushState) {
                window.location = event.options.location;
            } else {
                transition = event.options.transition;
                Barba.Pjax.goTo(event.options.location);
            }
        });

        // Define different page transitions
        Barba.Pjax.getTransition = function () {
            transition = clickedLink instanceof Node ? clickedLink.getAttribute('data-transition') : typeof transition === 'string' ? transition : '';

            var TransitionObject = void 0;

            switch (transition) {
                default:
                    TransitionObject = (0, _DefaultTransition2.default)();
            }

            clickedLink = undefined;
            transition = '';

            return TransitionObject;
        };

        Barba.Dispatcher.on('linkClicked', function (currentStatus, oldStatus, container) {
            clickedLink = currentStatus;
        });

        Barba.Dispatcher.on('newPageReady', function (currentStatus, prevStatus, container, currentHTML) {
            // Fetch any inline script elements.
            var scripts = container.querySelectorAll('script.js-inline');

            if (scripts instanceof window.NodeList) {
                var i = 0;
                var len = scripts.length;
                for (; i < len; i++) {
                    eval(scripts[i].innerHTML);
                }
            }

            /**
             * Execute any third party features.
             */

            // Google Analytics
            if (window.ga && !_environment.isDebug) {
                ga('send', 'pageview');
            }
        });

        Barba.Pjax.Dom.containerClass = 'js-barba-container';
        Barba.Pjax.Dom.wrapperId = 'js-barba-wrapper';

        Barba.Pjax.start();
    }

    /**
     * DOM is loaded
     *
     * @return {void}
     */


    _class.prototype.load = function load() {
        _environment.$html.addClass('dom-is-loaded');
        _environment.$html.removeClass('dom-is-loading');
        setTimeout(function () {
            _environment.$html.addClass('dom-is-animated');
        }, 1000);
    };

    return _class;
}();

exports.default = _class;

},{"../utils/environment":8,"./DefaultTransition":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addToArray = addToArray;
exports.arrayContains = arrayContains;
exports.arrayContentsMatch = arrayContentsMatch;
exports.ensureArray = ensureArray;
exports.lastItem = lastItem;
exports.removeFromArray = removeFromArray;
exports.toArray = toArray;
exports.findByKeyValue = findByKeyValue;

var _is = require('./is');

function addToArray(array, value) {
    var index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    }
}

function arrayContains(array, value) {
    for (var i = 0, c = array.length; i < c; i++) {
        if (array[i] == value) {
            return true;
        }
    }

    return false;
}

function arrayContentsMatch(a, b) {
    var i = void 0;

    if (!(0, _is.isArray)(a) || !(0, _is.isArray)(b)) {
        return false;
    }

    if (a.length !== b.length) {
        return false;
    }

    i = a.length;
    while (i--) {
        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function ensureArray(x) {
    if (typeof x === 'string') {
        return [x];
    }

    if (x === undefined) {
        return [];
    }

    return x;
}

function lastItem(array) {
    return array[array.length - 1];
}

function removeFromArray(array, member) {
    if (!array) {
        return;
    }

    var index = array.indexOf(member);

    if (index !== -1) {
        array.splice(index, 1);
    }
}

function toArray(arrayLike) {
    var array = [];
    var i = arrayLike.length;
    while (i--) {
        array[i] = arrayLike[i];
    }

    return array;
}

function findByKeyValue(array, key, value) {
    return array.filter(function (obj) {
        return obj[key] === value;
    });
}

},{"./is":10}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var APP_NAME = 'boilerplate';
var DATA_API_KEY = '.data-api';

var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement);
var $body = $(document.body);

var isDebug = !!$html.data('debug');

exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.escapeHtml = escapeHtml;
exports.unescapeHtml = unescapeHtml;
exports.getNodeData = getNodeData;
exports.getData = getData;
/**
 * @see  https://github.com/ractivejs/ractive/blob/dev/src/utils/html.js
 */
function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Prepare HTML content that contains mustache characters for use with Ractive
 * @param  {string} str
 * @return {string}
 */
function unescapeHtml(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/**
 * Get element data attributes
 * @param   {DOMElement}  node
 * @return  {Array}       data
 */
function getNodeData(node) {
    // All attributes
    var attributes = node.attributes;

    // Regex Pattern
    var pattern = /^data\-(.+)$/;

    // Output
    var data = {};

    for (var i in attributes) {
        if (!attributes[i]) {
            continue;
        }

        // Attributes name (ex: data-module)
        var name = attributes[i].name;

        // This happens.
        if (!name) {
            continue;
        }

        var match = name.match(pattern);
        if (!match) {
            continue;
        }

        // If this throws an error, you have some
        // serious problems in your HTML.
        data[match[1]] = getData(node.getAttribute(name));
    }

    return data;
}

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;

/**
 * Parse value to data type.
 *
 * @link   https://github.com/jquery/jquery/blob/3.1.1/src/data.js
 * @param  {string} data - A value to convert.
 * @return {mixed}  Returns the value in its natural data type.
 */
function getData(data) {
    if (data === 'true') {
        return true;
    }

    if (data === 'false') {
        return false;
    }

    if (data === 'null') {
        return null;
    }

    // Only convert to a number if it doesn't change the string
    if (data === +data + '') {
        return +data;
    }

    if (rbrace.test(data)) {
        return JSON.parse(data);
    }

    return data;
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isArray = isArray;
exports.isArrayLike = isArrayLike;
exports.isEqual = isEqual;
exports.isNumeric = isNumeric;
exports.isObject = isObject;
exports.isFunction = isFunction;
var toString = Object.prototype.toString;
var arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

// thanks, http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/
function isArray(thing) {
    return toString.call(thing) === '[object Array]';
}

function isArrayLike(obj) {
    return arrayLikePattern.test(toString.call(obj));
}

function isEqual(a, b) {
    if (a === null && b === null) {
        return true;
    }

    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object') {
        return false;
    }

    return a === b;
}

// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
function isNumeric(thing) {
    return !isNaN(parseFloat(thing)) && isFinite(thing);
}

function isObject(thing) {
    return thing && toString.call(thing) === '[object Object]';
}

function isFunction(thing) {
    var getType = {};
    return thing && getType.toString.call(thing) === '[object Function]';
}

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollTo = scrollTo;

var _is = require('./is');

var isAnimating = false; /* jshint esnext: true */


var defaults = {
    easing: 'swing',
    headerOffset: 60,
    speed: 300
};

/**
 * scrollTo is a function that scrolls a container to an element's position within that controller
 * Uses jQuery's $.Deferred to allow using a callback on animation completion
 * @param   {object}  $element  A jQuery node
 * @param   {object}  options
 */
function scrollTo($element, options) {
    var deferred = $.Deferred();

    // Drop everything if this ain't a jQuery object
    if ($element instanceof jQuery && $element.length > 0) {

        // Merging options
        options = $.extend({}, defaults, typeof options !== 'undefined' ? options : {});

        // Prevents accumulation of animations
        if (isAnimating === false) {
            isAnimating = true;

            // Default container that we'll be scrolling
            var $container = $('html, body');
            var elementOffset = 0;

            // Testing container in options for jQuery-ness
            // If we're not using a custom container, we take the top document offset
            // If we are, we use the elements position relative to the container
            if (typeof options.$container !== 'undefined' && options.$container instanceof jQuery && options.$container.length > 0) {
                $container = options.$container;

                if (typeof options.scrollTop !== 'undefined' && (0, _is.isNumeric)(options.scrollTop) && options.scrollTop !== 0) {
                    scrollTop = options.scrollTop;
                } else {
                    scrollTop = $element.position().top - options.headerOffset;
                }
            } else {
                if (typeof options.scrollTop !== 'undefined' && (0, _is.isNumeric)(options.scrollTop) && options.scrollTop !== 0) {
                    scrollTop = options.scrollTop;
                } else {
                    scrollTop = $element.offset().top - options.headerOffset;
                }
            }

            $container.animate({
                scrollTop: scrollTop
            }, options.speed, options.easing, function () {
                isAnimating = false;
                deferred.resolve();
            });
        }
    }

    return deferred.promise();
}

},{"./is":10}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.visibilityApi = undefined;

var _is = require('./is');

var _array = require('./array');

var _environment = require('./environment');

var CALLBACKS = {
    hidden: [],
    visible: []
}; /* jshint esnext: true */


var ACTIONS = ['addCallback', 'removeCallback'];

var STATES = ['visible', 'hidden'];

var PREFIX = 'v-';

var UUID = 0;

// Main event
_environment.$document.on('visibilitychange', function (event) {
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
function addCallback(state, options) {
    var callback = options.callback || '';

    if (!(0, _is.isFunction)(callback)) {
        console.warn('Callback is not a function');
        return false;
    }

    var ident = PREFIX + UUID++;

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
function removeCallback(state, options) {
    var ident = options.ident || '';

    if (typeof ident === 'undefined' || ident === '') {
        console.warn('Need ident to remove callback');
        return false;
    }

    var index = (0, _array.findByKeyValue)(CALLBACKS[state], 'ident', ident)[0];

    // console.log(ident)
    // console.log(CALLBACKS[state])

    if (typeof index !== 'undefined') {
        (0, _array.removeFromArray)(CALLBACKS[state], index);
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
function onDocumentChange(state) {
    var callbackArray = CALLBACKS[state];
    var i = 0;
    var len = callbackArray.length;

    for (; i < len; i++) {
        callbackArray[i].callback();
    }
}

/**
 * Public facing API for adding and removing callbacks
 * @param   {object}           options  Options
 * @return  {boolean|integer}           Unique identifier for the callback or boolean indicating success or failure
 */
function visibilityApi(options) {
    var action = options.action || '';
    var state = options.state || '';
    var ret = void 0;

    // Type and value checking
    if (!(0, _array.arrayContains)(ACTIONS, action)) {
        console.warn('Action does not exist');
        return false;
    }
    if (!(0, _array.arrayContains)(STATES, state)) {
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

exports.visibilityApi = visibilityApi;

},{"./array":7,"./environment":8,"./is":10}]},{},[1,2,3,4,5,6,7,8,9,10,11,12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9lbnZpcm9ubWVudC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2h0bWwuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9pcy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL3Njcm9sbFRvLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBQ0E7O0FBR0E7Ozs7QUFDQTs7QUFHQTs7SUFBWSxPOzs7Ozs7MEpBVFo7OztBQUlBOzs7QUFJQTs7O0lBR00sRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwrQkFBVSxFQUFWLENBQWEsaUJBQWIsRUFBZ0MsVUFBQyxLQUFELEVBQVc7QUFDdkMsa0JBQUssV0FBTCxDQUFpQixNQUFNLFVBQXZCLEVBQ0ssYUFETCxHQUVLLFdBRkwsQ0FFaUIsS0FGakI7QUFHSCxTQUpEOztBQU1BLCtCQUFVLEVBQVYsQ0FBYSx1QkFBYixFQUFzQyxVQUFDLEtBQUQsRUFBVztBQUM3QyxrQkFBSyxXQUFMLENBQWlCLEtBQWpCO0FBQ0gsU0FGRDtBQUdIOztBQUVEOzs7Ozs7a0JB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QUFTLGFBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDN0IsUUFBSSxTQUFTLFFBQVEsTUFBUixJQUFrQixFQUEvQjtBQUNBLFFBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7QUFDQSxRQUFJLFlBQUo7O0FBRUE7QUFDQSxRQUFJLENBQUMsMEJBQWMsT0FBZCxFQUF1QixNQUF2QixDQUFMLEVBQXFDO0FBQ2pDLGdCQUFRLElBQVIsQ0FBYSx1QkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIO0FBQ0QsUUFBSSxDQUFDLDBCQUFjLE1BQWQsRUFBc0IsS0FBdEIsQ0FBTCxFQUFtQztBQUMvQixnQkFBUSxJQUFSLENBQWEsc0JBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDs7QUFFRDtBQUNBLFFBQUksV0FBVyxhQUFmLEVBQThCO0FBQzFCLGNBQU0sWUFBWSxLQUFaLEVBQW1CLE9BQW5CLENBQU47QUFDSCxLQUZELE1BRU8sSUFBSSxXQUFXLGdCQUFmLEVBQWlDO0FBQ3BDLGNBQU0sZUFBZSxLQUFmLEVBQXNCLE9BQXRCLENBQU47QUFDSDs7QUFFRCxXQUFPLEdBQVA7QUFDSDs7UUFFUSxhLEdBQUEsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQgfSBmcm9tICcuL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcblxuLy8gR2xvYmFsIGZ1bmN0aW9ucyBhbmQgdG9vbHNcbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlscy9pcyc7XG5cbi8vIEJhc2ljIG1vZHVsZXNcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY2xhc3MgQXBwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignaW5pdE1vZHVsZXMuQXBwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRHbG9iYWxzKGV2ZW50LmZpcnN0Qmxvb2QpXG4gICAgICAgICAgICAgICAgLmRlbGV0ZU1vZHVsZXMoKVxuICAgICAgICAgICAgICAgIC5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignaW5pdFNjb3BlZE1vZHVsZXMuQXBwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbGwgZXhpc3RpbmcgbW9kdWxlc1xuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKCkge1xuICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgbGV0IGkgPSB0aGlzLmN1cnJlbnRNb2R1bGVzLmxlbmd0aDtcblxuICAgICAgICAvLyBEZXN0cm95IGFsbCBtb2R1bGVzXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgZ2xvYmFscyhmaXJzdEJsb29kKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdE1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgLy8gRWxlbWVudHMgd2l0aCBtb2R1bGVcbiAgICAgICAgbGV0IG1vZHVsZUVscztcblxuICAgICAgICAvLyBJZiBmaXJzdCBibG9vZCwgbG9hZCBhbGwgbW9kdWxlcyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIElmIHNjb3BlZCwgcmVuZGVyIGVsZW1lbnRzIHdpdGggbW9kdWxlc1xuICAgICAgICAvLyBJZiBub3QsIGxvYWQgbW9kdWxlcyBjb250YWluZWQgaW4gQmFyYmEgY29udGFpbmVyXG4gICAgICAgIGlmIChldmVudC5maXJzdEJsb29kKSB7XG4gICAgICAgICAgICBtb2R1bGVFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGV2ZW50LnNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBpc0Z1bmN0aW9uKGV2ZW50LnNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwpKSB7XG4gICAgICAgICAgICBtb2R1bGVFbHMgPSBldmVudC5zY29wZS5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtb2R1bGVFbHMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanMtYmFyYmEtd3JhcHBlcicpLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGNvbnN0IGVsc0xlbiA9IG1vZHVsZUVscy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBlbCA9IG1vZHVsZUVsc1tpXTtcblxuICAgICAgICAgICAgLy8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGdldE5vZGVEYXRhKGVsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWw7XG4gICAgICAgICAgICBvcHRpb25zLiRlbCA9ICQoZWwpO1xuXG4gICAgICAgICAgICAvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgICAgICAgICAvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnNwbGl0KC8sXFxzKnxcXHMrL2cpO1xuXG4gICAgICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUlkZW50c1tqXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8vIElJRkUgZm9yIGxvYWRpbmcgdGhlIGFwcGxpY2F0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKCkge1xuICAgIG5ldyBBcHAoKTtcbiAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICB0eXBlOiAnaW5pdE1vZHVsZXMuQXBwJyxcbiAgICAgICAgZmlyc3RCbG9vZDogdHJ1ZVxuICAgIH0pO1xufSkoKTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBUcmFuc2l0aW9uTWFuYWdlciBmcm9tICcuL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZmlyc3RCbG9vZCkge1xuICAgIHN2ZzRldmVyeWJvZHkoKTtcblxuICAgIGlmIChmaXJzdEJsb29kKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYW5hZ2VyID0gbmV3IFRyYW5zaXRpb25NYW5hZ2VyKCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xubGV0IHVpZCA9IDA7XG5cbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWwgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5lbCAgPSBvcHRpb25zLmVsICB8fCBudWxsO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG1vZHVsZSBpZGVudGlmaWVyXG4gICAgICAgIHRoaXMudWlkID0gJ20tJyArIHVpZCsrO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5vZmYoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJGh0bWwgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmZ1bmN0aW9uIERlZmF1bHRUcmFuc2l0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBzdGFydENhbGxiYWNrID0gKHR5cGVvZiBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicpID8gb3B0aW9ucy5zdGFydENhbGxiYWNrIDogZnVuY3Rpb24oKXt9O1xuICAgIGNvbnN0IG92ZXJyaWRlQ2xhc3MgPSAodHlwZW9mIG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5vdmVycmlkZUNsYXNzIDogJyc7XG5cbiAgICByZXR1cm4gQmFyYmEuQmFzZVRyYW5zaXRpb24uZXh0ZW5kKHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkZWQgZG9tLWlzLWFuaW1hdGVkJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoYGRvbS1pcy1sb2FkaW5nICR7b3ZlcnJpZGVDbGFzc31gKTtcblxuICAgICAgICAgICAgc3RhcnRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICAvKiBDbG9zZSBhbnkgb3ZlcmxheXMgKi9cblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgLmFsbChbdGhpcy5uZXdDb250YWluZXJMb2FkaW5nXSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHRoaXMuZmluaXNoLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbmlzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLmRvbmUoKTtcblxuICAgICAgICAgICAgY29uc3QgJGVsID0gJCh0aGlzLm5ld0NvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGVtcGxhdGUgbmFtZSBvZiB0aGUgbmV3IGNvbnRhaW5lciBhbmQgc2V0IGl0IHRvIHRoZSBET01cbiAgICAgICAgICAgICRodG1sLmF0dHIoJ2RhdGEtdGVtcGxhdGUnLCAkZWwuZGF0YSgndGVtcGxhdGUnKSk7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2luaXRNb2R1bGVzLkFwcCcsXG4gICAgICAgICAgICAgICAgZmlyc3RCbG9vZDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRUcmFuc2l0aW9uO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZyB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuaW1wb3J0IERlZmF1bHRUcmFuc2l0aW9uIGZyb20gJy4vRGVmYXVsdFRyYW5zaXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignZ29Uby5QYWdlVHJhbnNpdGlvbk1hbmFnZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZXZlbnQub3B0aW9ucy5sb2NhdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbiA9IGV2ZW50Lm9wdGlvbnMudHJhbnNpdGlvbjtcbiAgICAgICAgICAgICAgICBCYXJiYS5QamF4LmdvVG8oZXZlbnQub3B0aW9ucy5sb2NhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmluZSBkaWZmZXJlbnQgcGFnZSB0cmFuc2l0aW9uc1xuICAgICAgICBCYXJiYS5QamF4LmdldFRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAoY2xpY2tlZExpbmsgaW5zdGFuY2VvZiBOb2RlKSA/IGNsaWNrZWRMaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgOiAodHlwZW9mIHRyYW5zaXRpb24gPT09ICdzdHJpbmcnID8gdHJhbnNpdGlvbiA6ICcnKTtcblxuICAgICAgICAgICAgbGV0IFRyYW5zaXRpb25PYmplY3Q7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIFRyYW5zaXRpb25PYmplY3QgPSBEZWZhdWx0VHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25PYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCdsaW5rQ2xpY2tlZCcsIChjdXJyZW50U3RhdHVzLCBvbGRTdGF0dXMsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgICAgICAgY2xpY2tlZExpbmsgPSBjdXJyZW50U3RhdHVzO1xuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCduZXdQYWdlUmVhZHknLCAoY3VycmVudFN0YXR1cywgcHJldlN0YXR1cywgY29udGFpbmVyLCBjdXJyZW50SFRNTCkgPT4ge1xuICAgICAgICAgICAgLy8gRmV0Y2ggYW55IGlubGluZSBzY3JpcHQgZWxlbWVudHMuXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdC5qcy1pbmxpbmUnKTtcblxuICAgICAgICAgICAgaWYgKHNjcmlwdHMgaW5zdGFuY2VvZiB3aW5kb3cuTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHNjcmlwdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4ZWN1dGUgYW55IHRoaXJkIHBhcnR5IGZlYXR1cmVzLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZSBBbmFseXRpY3NcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2EgJiYgIWlzRGVidWcpIHtcbiAgICAgICAgICAgICAgICBnYSgnc2VuZCcsICdwYWdldmlldycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5QamF4LkRvbS5jb250YWluZXJDbGFzcyA9ICdqcy1iYXJiYS1jb250YWluZXInO1xuICAgICAgICBCYXJiYS5QamF4LkRvbS53cmFwcGVySWQgPSAnanMtYmFyYmEtd3JhcHBlcic7XG5cbiAgICAgICAgQmFyYmEuUGpheC5zdGFydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERPTSBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCAxMDAwKVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG4gICAgaWYgKCBpbmRleCA9PT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnB1c2goIHZhbHVlICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG4gICAgICAgIGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG4gICAgbGV0IGk7XG5cbiAgICBpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcbiAgICBpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIFsgeCBdO1xuICAgIH1cblxuICAgIGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuICAgIHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcbiAgICBpZiAoICFhcnJheSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cbiAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBsZXQgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG4iLCJjb25zdCBBUFBfTkFNRSAgICAgPSAnYm9pbGVycGxhdGUnO1xuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG5cbmNvbnN0ICRkb2N1bWVudCAgICA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyAgICAgID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcblxuY29uc3QgaXNEZWJ1ZyAgICAgID0gISEkaHRtbC5kYXRhKCdkZWJ1ZycpO1xuXG5leHBvcnQgeyBBUFBfTkFNRSwgREFUQV9BUElfS0VZLCAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgaXNEZWJ1ZyB9O1xuIiwiLyoqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vcmFjdGl2ZWpzL3JhY3RpdmUvYmxvYi9kZXYvc3JjL3V0aWxzL2h0bWwuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBIVE1MIGNvbnRlbnQgdGhhdCBjb250YWlucyBtdXN0YWNoZSBjaGFyYWN0ZXJzIGZvciB1c2Ugd2l0aCBSYWN0aXZlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG4vKipcbiAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBub2RlXG4gKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICAvLyBBbGwgYXR0cmlidXRlc1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgY29uc3QgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuICAgIC8vIE91dHB1dFxuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG4gICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucy5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcbiAgICAgICAgLy8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG4gICAgICAgIGRhdGFbbWF0Y2hbMV1dID0gZ2V0RGF0YShub2RlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBQYXJzZSB2YWx1ZSB0byBkYXRhIHR5cGUuXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzMuMS4xL3NyYy9kYXRhLmpzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgLSBBIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHttaXhlZH0gIFJldHVybnMgdGhlIHZhbHVlIGluIGl0cyBuYXR1cmFsIGRhdGEgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcbiAgICBpZiAoZGF0YSA9PT0gK2RhdGErJycpIHtcbiAgICAgICAgcmV0dXJuICtkYXRhO1xuICAgIH1cblxuICAgIGlmIChyYnJhY2UudGVzdCggZGF0YSApKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJjb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5jb25zdCBhcnJheUxpa2VQYXR0ZXJuID0gL15cXFtvYmplY3QgKD86QXJyYXl8RmlsZUxpc3QpXFxdJC87XG5cbi8vIHRoYW5rcywgaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vaW5zdGFuY2VvZi1jb25zaWRlcmVkLWhhcm1mdWwtb3ItaG93LXRvLXdyaXRlLWEtcm9idXN0LWlzYXJyYXkvXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAoIHRoaW5nICkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG4gICAgcmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuICAgIGlmICggYSA9PT0gbnVsbCAmJiBiID09PSBudWxsICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICFpc05hTiggcGFyc2VGbG9hdCggdGhpbmcgKSApICYmIGlzRmluaXRlKCB0aGluZyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QgKCB0aGluZyApIHtcbiAgICByZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG4gICAgY29uc3QgZ2V0VHlwZSA9IHt9O1xuICAgIHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi9pcydcblxubGV0IGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICBoZWFkZXJPZmZzZXQ6IDYwLFxuICAgIHNwZWVkOiAzMDBcbn07XG5cbi8qKlxuICogc2Nyb2xsVG8gaXMgYSBmdW5jdGlvbiB0aGF0IHNjcm9sbHMgYSBjb250YWluZXIgdG8gYW4gZWxlbWVudCdzIHBvc2l0aW9uIHdpdGhpbiB0aGF0IGNvbnRyb2xsZXJcbiAqIFVzZXMgalF1ZXJ5J3MgJC5EZWZlcnJlZCB0byBhbGxvdyB1c2luZyBhIGNhbGxiYWNrIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgJGVsZW1lbnQgIEEgalF1ZXJ5IG5vZGVcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICBvcHRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbygkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgLy8gRHJvcCBldmVyeXRoaW5nIGlmIHRoaXMgYWluJ3QgYSBqUXVlcnkgb2JqZWN0XG4gICAgaWYgKCRlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5ICYmICRlbGVtZW50Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAvLyBNZXJnaW5nIG9wdGlvbnNcbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fSkpO1xuXG4gICAgICAgIC8vIFByZXZlbnRzIGFjY3VtdWxhdGlvbiBvZiBhbmltYXRpb25zXG4gICAgICAgIGlmIChpc0FuaW1hdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjb250YWluZXIgdGhhdCB3ZSdsbCBiZSBzY3JvbGxpbmdcbiAgICAgICAgICAgIGxldCAkY29udGFpbmVyID0gJCgnaHRtbCwgYm9keScpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAvLyBUZXN0aW5nIGNvbnRhaW5lciBpbiBvcHRpb25zIGZvciBqUXVlcnktbmVzc1xuICAgICAgICAgICAgLy8gSWYgd2UncmUgbm90IHVzaW5nIGEgY3VzdG9tIGNvbnRhaW5lciwgd2UgdGFrZSB0aGUgdG9wIGRvY3VtZW50IG9mZnNldFxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlLCB3ZSB1c2UgdGhlIGVsZW1lbnRzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy4kY29udGFpbmVyICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLiRjb250YWluZXIgaW5zdGFuY2VvZiBqUXVlcnkgJiYgb3B0aW9ucy4kY29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gb3B0aW9ucy4kY29udGFpbmVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQucG9zaXRpb24oKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICAgICAgfSwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5lYXNpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuICAgIGhpZGRlbjogW10sXG4gICAgdmlzaWJsZTogW11cbn07XG5cbmNvbnN0IEFDVElPTlMgPSBbXG4gICAgJ2FkZENhbGxiYWNrJyxcbiAgICAncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG4gICAgJ3Zpc2libGUnLFxuICAgICdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCAnJztcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG4gICAgQ0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcbiAgICAgICAgaWRlbnQ6IGlkZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9KTtcblxuICAgIHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgaWRlbnQgPSBvcHRpb25zLmlkZW50IHx8ICcnO1xuXG4gICAgaWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05lZWQgaWRlbnQgdG8gcmVtb3ZlIGNhbGxiYWNrJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpZGVudClcbiAgICAvLyBjb25zb2xlLmxvZyhDQUxMQkFDS1Nbc3RhdGVdKVxuXG4gICAgaWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlbW92ZUZyb21BcnJheShDQUxMQkFDS1Nbc3RhdGVdLCBpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG4gICAgbGV0IGNhbGxiYWNrQXJyYXkgPSBDQUxMQkFDS1Nbc3RhdGVdO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHVibGljIGZhY2luZyBBUEkgZm9yIGFkZGluZyBhbmQgcmVtb3ZpbmcgY2FsbGJhY2tzXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgICAgICAgICAgb3B0aW9ucyAgT3B0aW9uc1xuICogQHJldHVybiAge2Jvb2xlYW58aW50ZWdlcn0gICAgICAgICAgIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY2FsbGJhY2sgb3IgYm9vbGVhbiBpbmRpY2F0aW5nIHN1Y2Nlc3Mgb3IgZmFpbHVyZVxuICovXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXBpIChvcHRpb25zKSB7XG4gICAgbGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuICAgIGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG4gICAgbGV0IHJldDtcblxuICAgIC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcbiAgICBpZiAoYWN0aW9uID09PSAnYWRkQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUNhbGxiYWNrJykge1xuICAgICAgICByZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
