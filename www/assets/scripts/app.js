(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

var _globals = require('./globals');

var _globals2 = _interopRequireDefault(_globals);

var _array = require('./utils/array');

var _html = require('./utils/html');

var _is = require('./utils/is');

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


// Basic modules


var App = function () {
    function App() {
        var _this = this;

        _classCallCheck(this, App);

        this.modules = modules;
        this.currentModules = [];

        _environment.$document.on('initModules.App', function (event) {
            _this.initGlobals(event.firstBlood).deleteModules(event).initModules(event);
        });

        _environment.$document.on('initScopedModules.App', function (event) {
            _this.initModules(event);
        });

        _environment.$document.on('deleteScopedModules.App', function (event) {
            _this.deleteModules(event);
        });
    }

    /**
     * Destroy all existing modules or a specific scope of modules
     * @param  {Object} event The event being triggered.
     * @return {Object}       Self (allows chaining)
     */


    App.prototype.deleteModules = function deleteModules(event) {
        var destroyAll = true;
        var moduleIds = [];

        // Check for scope first
        if (event.$scope instanceof jQuery && event.$scope.length > 0) {
            // Modules within scope
            var $modules = event.$scope.find('[data-module]');

            // Determine their uids
            moduleIds = $.makeArray($modules.map(function (index) {
                return $modules.eq(index).data('uid');
            }));

            if (moduleIds.length > 0) {
                destroyAll = false;
            }
        }

        // Loop modules and destroying all of them, or specific ones
        var i = this.currentModules.length;

        while (i--) {
            if (destroyAll || (0, _array.arrayContains)(moduleIds, this.currentModules[i].uid)) {
                (0, _array.removeFromArray)(moduleIds, this.currentModules[i].uid);
                this.currentModules[i].destroy();
                this.currentModules.splice(i);
            }
        }

        return this;
    };

    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return {Object} Self (allows chaining)
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
        var $moduleEls = [];

        // If first blood, load all modules in the DOM
        // If scoped, render elements with modules
        // If Barba, load modules contained in Barba container
        if (event.firstBlood) {
            $moduleEls = _environment.$document.find('[data-module]');
        } else if (event.$scope instanceof jQuery && event.$scope.length > 0) {
            $moduleEls = event.$scope.find('[data-module]');
        } else if (event.isBarba) {
            $moduleEls = $('#js-barba-wrapper').find('[data-module]');
        }

        // Loop through elements
        var i = 0;
        var elsLen = $moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            var el = $moduleEls[i];

            // All data- attributes considered as options
            var options = (0, _html.getNodeData)(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $moduleEls.eq(i);

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
                    module.init();
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

},{"./globals":2,"./modules":3,"./utils/array":7,"./utils/environment":8,"./utils/html":9,"./utils/is":10}],2:[function(require,module,exports){
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
        // Use jQuery's data API to "store it in the DOM"
        this.$el.data('uid', this.uid);
    }

    _class.prototype.init = function init() {};

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
                isBarba: true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9lbnZpcm9ubWVudC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2h0bWwuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9pcy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL3Njcm9sbFRvLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBRUE7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFHQTs7SUFBWSxPOzs7Ozs7MEpBVlo7OztBQVNBOzs7SUFHTSxHO0FBQ0YsbUJBQWM7QUFBQTs7QUFBQTs7QUFDVixhQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLEVBQXRCOztBQUVBLCtCQUFVLEVBQVYsQ0FBYSxpQkFBYixFQUFnQyxVQUFDLEtBQUQsRUFBVztBQUN2QyxrQkFBSyxXQUFMLENBQWlCLE1BQU0sVUFBdkIsRUFDSyxhQURMLENBQ21CLEtBRG5CLEVBRUssV0FGTCxDQUVpQixLQUZqQjtBQUdILFNBSkQ7O0FBTUEsK0JBQVUsRUFBVixDQUFhLHVCQUFiLEVBQXNDLFVBQUMsS0FBRCxFQUFXO0FBQzdDLGtCQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxTQUZEOztBQUlBLCtC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RUFBdUIsTUFBdkIsQ0FBTCxFQUFxQztBQUNqQyxnQkFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNELFFBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFdBQVcsYUFBZixFQUE4QjtBQUMxQixjQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUNwQyxjQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50IH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5cbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMvaXMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oJ2luaXRNb2R1bGVzLkFwcCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0R2xvYmFscyhldmVudC5maXJzdEJsb29kKVxuICAgICAgICAgICAgICAgIC5kZWxldGVNb2R1bGVzKGV2ZW50KVxuICAgICAgICAgICAgICAgIC5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignaW5pdFNjb3BlZE1vZHVsZXMuQXBwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKCdkZWxldGVTY29wZWRNb2R1bGVzLkFwcCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbGwgZXhpc3RpbmcgbW9kdWxlcyBvciBhIHNwZWNpZmljIHNjb3BlIG9mIG1vZHVsZXNcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgZGVsZXRlTW9kdWxlcyhldmVudCkge1xuICAgICAgICBsZXQgZGVzdHJveUFsbCA9IHRydWU7XG4gICAgICAgIGxldCBtb2R1bGVJZHMgPSBbXTtcblxuICAgICAgICAvLyBDaGVjayBmb3Igc2NvcGUgZmlyc3RcbiAgICAgICAgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gTW9kdWxlcyB3aXRoaW4gc2NvcGVcbiAgICAgICAgICAgIGNvbnN0ICRtb2R1bGVzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZWlyIHVpZHNcbiAgICAgICAgICAgIG1vZHVsZUlkcyA9ICQubWFrZUFycmF5KCRtb2R1bGVzLm1hcChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkbW9kdWxlcy5lcShpbmRleCkuZGF0YSgndWlkJyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGlmIChtb2R1bGVJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3lBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgbW9kdWxlcyBhbmQgZGVzdHJveWluZyBhbGwgb2YgdGhlbSwgb3Igc3BlY2lmaWMgb25lc1xuICAgICAgICBsZXQgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChkZXN0cm95QWxsIHx8IGFycmF5Q29udGFpbnMobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tQXJyYXkobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdEdsb2JhbHMoZmlyc3RCbG9vZCkge1xuICAgICAgICBnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0TW9kdWxlcyhldmVudCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICBsZXQgJG1vZHVsZUVscyA9IFtdO1xuXG4gICAgICAgIC8vIElmIGZpcnN0IGJsb29kLCBsb2FkIGFsbCBtb2R1bGVzIGluIHRoZSBET01cbiAgICAgICAgLy8gSWYgc2NvcGVkLCByZW5kZXIgZWxlbWVudHMgd2l0aCBtb2R1bGVzXG4gICAgICAgIC8vIElmIEJhcmJhLCBsb2FkIG1vZHVsZXMgY29udGFpbmVkIGluIEJhcmJhIGNvbnRhaW5lclxuICAgICAgICBpZiAoZXZlbnQuZmlyc3RCbG9vZCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRkb2N1bWVudC5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5pc0JhcmJhKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gJCgnI2pzLWJhcmJhLXdyYXBwZXInKS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWxlbWVudHNcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBjb25zdCBlbHNMZW4gPSAkbW9kdWxlRWxzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudFxuICAgICAgICAgICAgbGV0IGVsID0gJG1vZHVsZUVsc1tpXTtcblxuICAgICAgICAgICAgLy8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGdldE5vZGVEYXRhKGVsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWw7XG4gICAgICAgICAgICBvcHRpb25zLiRlbCA9ICRtb2R1bGVFbHMuZXEoaSk7XG5cbiAgICAgICAgICAgIC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICAgICAgICAgIC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuICAgICAgICAgICAgbGV0IG1vZHVsZUlkZW50cyA9IGF0dHIuc3BsaXQoLyxcXHMqfFxccysvZyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXNMZW4gPSBtb2R1bGVJZGVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKDsgaiA8IG1vZHVsZXNMZW47IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLy8gSUlGRSBmb3IgbG9hZGluZyB0aGUgYXBwbGljYXRpb25cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4oZnVuY3Rpb24oKSB7XG4gICAgbmV3IEFwcCgpO1xuICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgIHR5cGU6ICdpbml0TW9kdWxlcy5BcHAnLFxuICAgICAgICBmaXJzdEJsb29kOiB0cnVlXG4gICAgfSk7XG59KSgpO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IFRyYW5zaXRpb25NYW5hZ2VyIGZyb20gJy4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbk1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaXJzdEJsb29kKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xuXG4gICAgaWYgKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hbmFnZXIgPSBuZXcgVHJhbnNpdGlvbk1hbmFnZXIoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5sZXQgdWlkID0gMDtcblxuLyoqXG4gKiBBYnN0cmFjdCBNb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3NcbntcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKVxuICAgIHtcbiAgICAgICAgdGhpcy4kZWwgPSBvcHRpb25zLiRlbCB8fCBudWxsO1xuICAgICAgICB0aGlzLmVsICA9IG9wdGlvbnMuZWwgIHx8IG51bGw7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgbW9kdWxlIGlkZW50aWZpZXJcbiAgICAgICAgdGhpcy51aWQgPSAnbS0nICsgdWlkKys7XG4gICAgICAgIC8vIFVzZSBqUXVlcnkncyBkYXRhIEFQSSB0byBcInN0b3JlIGl0IGluIHRoZSBET01cIlxuICAgICAgICB0aGlzLiRlbC5kYXRhKCd1aWQnLCB0aGlzLnVpZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHt9XG5cbiAgICBkZXN0cm95KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLiRlbCkge1xuICAgICAgICAgICAgdGhpcy4kZWwub2ZmKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQsICRodG1sIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5mdW5jdGlvbiBEZWZhdWx0VHJhbnNpdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3Qgc3RhcnRDYWxsYmFjayA9ICh0eXBlb2Ygb3B0aW9ucy5zdGFydENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSA/IG9wdGlvbnMuc3RhcnRDYWxsYmFjayA6IGZ1bmN0aW9uKCl7fTtcbiAgICBjb25zdCBvdmVycmlkZUNsYXNzID0gKHR5cGVvZiBvcHRpb25zLm92ZXJyaWRlQ2xhc3MgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA6ICcnO1xuXG4gICAgcmV0dXJuIEJhcmJhLkJhc2VUcmFuc2l0aW9uLmV4dGVuZCh7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodG1sXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGVkIGRvbS1pcy1hbmltYXRlZCcpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKGBkb20taXMtbG9hZGluZyAke292ZXJyaWRlQ2xhc3N9YCk7XG5cbiAgICAgICAgICAgIHN0YXJ0Q2FsbGJhY2soKTtcblxuICAgICAgICAgICAgLyogQ2xvc2UgYW55IG92ZXJsYXlzICovXG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFByb21pc2VcbiAgICAgICAgICAgICAgICAgIC5hbGwoW3RoaXMubmV3Q29udGFpbmVyTG9hZGluZ10pXG4gICAgICAgICAgICAgICAgICAudGhlbih0aGlzLmZpbmlzaC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9LFxuICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5kb25lKCk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRlbCA9ICQodGhpcy5uZXdDb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRlbXBsYXRlIG5hbWUgb2YgdGhlIG5ldyBjb250YWluZXIgYW5kIHNldCBpdCB0byB0aGUgRE9NXG4gICAgICAgICAgICAkaHRtbC5hdHRyKCdkYXRhLXRlbXBsYXRlJywgJGVsLmRhdGEoJ3RlbXBsYXRlJykpO1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdpbml0TW9kdWxlcy5BcHAnLFxuICAgICAgICAgICAgICAgIGlzQmFyYmE6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRUcmFuc2l0aW9uO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZyB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuaW1wb3J0IERlZmF1bHRUcmFuc2l0aW9uIGZyb20gJy4vRGVmYXVsdFRyYW5zaXRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignZ29Uby5QYWdlVHJhbnNpdGlvbk1hbmFnZXInLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZXZlbnQub3B0aW9ucy5sb2NhdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbiA9IGV2ZW50Lm9wdGlvbnMudHJhbnNpdGlvbjtcbiAgICAgICAgICAgICAgICBCYXJiYS5QamF4LmdvVG8oZXZlbnQub3B0aW9ucy5sb2NhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmluZSBkaWZmZXJlbnQgcGFnZSB0cmFuc2l0aW9uc1xuICAgICAgICBCYXJiYS5QamF4LmdldFRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAoY2xpY2tlZExpbmsgaW5zdGFuY2VvZiBOb2RlKSA/IGNsaWNrZWRMaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgOiAodHlwZW9mIHRyYW5zaXRpb24gPT09ICdzdHJpbmcnID8gdHJhbnNpdGlvbiA6ICcnKTtcblxuICAgICAgICAgICAgbGV0IFRyYW5zaXRpb25PYmplY3Q7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIFRyYW5zaXRpb25PYmplY3QgPSBEZWZhdWx0VHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25PYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCdsaW5rQ2xpY2tlZCcsIChjdXJyZW50U3RhdHVzLCBvbGRTdGF0dXMsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgICAgICAgY2xpY2tlZExpbmsgPSBjdXJyZW50U3RhdHVzO1xuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCduZXdQYWdlUmVhZHknLCAoY3VycmVudFN0YXR1cywgcHJldlN0YXR1cywgY29udGFpbmVyLCBjdXJyZW50SFRNTCkgPT4ge1xuICAgICAgICAgICAgLy8gRmV0Y2ggYW55IGlubGluZSBzY3JpcHQgZWxlbWVudHMuXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdC5qcy1pbmxpbmUnKTtcblxuICAgICAgICAgICAgaWYgKHNjcmlwdHMgaW5zdGFuY2VvZiB3aW5kb3cuTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHNjcmlwdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4ZWN1dGUgYW55IHRoaXJkIHBhcnR5IGZlYXR1cmVzLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZSBBbmFseXRpY3NcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2EgJiYgIWlzRGVidWcpIHtcbiAgICAgICAgICAgICAgICBnYSgnc2VuZCcsICdwYWdldmlldycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5QamF4LkRvbS5jb250YWluZXJDbGFzcyA9ICdqcy1iYXJiYS1jb250YWluZXInO1xuICAgICAgICBCYXJiYS5QamF4LkRvbS53cmFwcGVySWQgPSAnanMtYmFyYmEtd3JhcHBlcic7XG5cbiAgICAgICAgQmFyYmEuUGpheC5zdGFydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERPTSBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCAxMDAwKVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG4gICAgaWYgKCBpbmRleCA9PT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnB1c2goIHZhbHVlICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG4gICAgICAgIGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG4gICAgbGV0IGk7XG5cbiAgICBpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcbiAgICBpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIFsgeCBdO1xuICAgIH1cblxuICAgIGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuICAgIHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcbiAgICBpZiAoICFhcnJheSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cbiAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBsZXQgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG4iLCJjb25zdCBBUFBfTkFNRSAgICAgPSAnYm9pbGVycGxhdGUnO1xuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG5cbmNvbnN0ICRkb2N1bWVudCAgICA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyAgICAgID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcblxuY29uc3QgaXNEZWJ1ZyAgICAgID0gISEkaHRtbC5kYXRhKCdkZWJ1ZycpO1xuXG5leHBvcnQgeyBBUFBfTkFNRSwgREFUQV9BUElfS0VZLCAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgaXNEZWJ1ZyB9O1xuIiwiLyoqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vcmFjdGl2ZWpzL3JhY3RpdmUvYmxvYi9kZXYvc3JjL3V0aWxzL2h0bWwuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBIVE1MIGNvbnRlbnQgdGhhdCBjb250YWlucyBtdXN0YWNoZSBjaGFyYWN0ZXJzIGZvciB1c2Ugd2l0aCBSYWN0aXZlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG4vKipcbiAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBub2RlXG4gKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICAvLyBBbGwgYXR0cmlidXRlc1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgY29uc3QgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuICAgIC8vIE91dHB1dFxuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG4gICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucy5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcbiAgICAgICAgLy8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG4gICAgICAgIGRhdGFbbWF0Y2hbMV1dID0gZ2V0RGF0YShub2RlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBQYXJzZSB2YWx1ZSB0byBkYXRhIHR5cGUuXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzMuMS4xL3NyYy9kYXRhLmpzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgLSBBIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHttaXhlZH0gIFJldHVybnMgdGhlIHZhbHVlIGluIGl0cyBuYXR1cmFsIGRhdGEgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcbiAgICBpZiAoZGF0YSA9PT0gK2RhdGErJycpIHtcbiAgICAgICAgcmV0dXJuICtkYXRhO1xuICAgIH1cblxuICAgIGlmIChyYnJhY2UudGVzdCggZGF0YSApKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJjb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5jb25zdCBhcnJheUxpa2VQYXR0ZXJuID0gL15cXFtvYmplY3QgKD86QXJyYXl8RmlsZUxpc3QpXFxdJC87XG5cbi8vIHRoYW5rcywgaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vaW5zdGFuY2VvZi1jb25zaWRlcmVkLWhhcm1mdWwtb3ItaG93LXRvLXdyaXRlLWEtcm9idXN0LWlzYXJyYXkvXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAoIHRoaW5nICkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG4gICAgcmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuICAgIGlmICggYSA9PT0gbnVsbCAmJiBiID09PSBudWxsICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICFpc05hTiggcGFyc2VGbG9hdCggdGhpbmcgKSApICYmIGlzRmluaXRlKCB0aGluZyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QgKCB0aGluZyApIHtcbiAgICByZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG4gICAgY29uc3QgZ2V0VHlwZSA9IHt9O1xuICAgIHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi9pcydcblxubGV0IGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICBoZWFkZXJPZmZzZXQ6IDYwLFxuICAgIHNwZWVkOiAzMDBcbn07XG5cbi8qKlxuICogc2Nyb2xsVG8gaXMgYSBmdW5jdGlvbiB0aGF0IHNjcm9sbHMgYSBjb250YWluZXIgdG8gYW4gZWxlbWVudCdzIHBvc2l0aW9uIHdpdGhpbiB0aGF0IGNvbnRyb2xsZXJcbiAqIFVzZXMgalF1ZXJ5J3MgJC5EZWZlcnJlZCB0byBhbGxvdyB1c2luZyBhIGNhbGxiYWNrIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgJGVsZW1lbnQgIEEgalF1ZXJ5IG5vZGVcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICBvcHRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbygkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgLy8gRHJvcCBldmVyeXRoaW5nIGlmIHRoaXMgYWluJ3QgYSBqUXVlcnkgb2JqZWN0XG4gICAgaWYgKCRlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5ICYmICRlbGVtZW50Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAvLyBNZXJnaW5nIG9wdGlvbnNcbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fSkpO1xuXG4gICAgICAgIC8vIFByZXZlbnRzIGFjY3VtdWxhdGlvbiBvZiBhbmltYXRpb25zXG4gICAgICAgIGlmIChpc0FuaW1hdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjb250YWluZXIgdGhhdCB3ZSdsbCBiZSBzY3JvbGxpbmdcbiAgICAgICAgICAgIGxldCAkY29udGFpbmVyID0gJCgnaHRtbCwgYm9keScpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAvLyBUZXN0aW5nIGNvbnRhaW5lciBpbiBvcHRpb25zIGZvciBqUXVlcnktbmVzc1xuICAgICAgICAgICAgLy8gSWYgd2UncmUgbm90IHVzaW5nIGEgY3VzdG9tIGNvbnRhaW5lciwgd2UgdGFrZSB0aGUgdG9wIGRvY3VtZW50IG9mZnNldFxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlLCB3ZSB1c2UgdGhlIGVsZW1lbnRzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy4kY29udGFpbmVyICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLiRjb250YWluZXIgaW5zdGFuY2VvZiBqUXVlcnkgJiYgb3B0aW9ucy4kY29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gb3B0aW9ucy4kY29udGFpbmVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQucG9zaXRpb24oKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICAgICAgfSwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5lYXNpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuICAgIGhpZGRlbjogW10sXG4gICAgdmlzaWJsZTogW11cbn07XG5cbmNvbnN0IEFDVElPTlMgPSBbXG4gICAgJ2FkZENhbGxiYWNrJyxcbiAgICAncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG4gICAgJ3Zpc2libGUnLFxuICAgICdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCAnJztcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG4gICAgQ0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcbiAgICAgICAgaWRlbnQ6IGlkZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9KTtcblxuICAgIHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgaWRlbnQgPSBvcHRpb25zLmlkZW50IHx8ICcnO1xuXG4gICAgaWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05lZWQgaWRlbnQgdG8gcmVtb3ZlIGNhbGxiYWNrJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpZGVudClcbiAgICAvLyBjb25zb2xlLmxvZyhDQUxMQkFDS1Nbc3RhdGVdKVxuXG4gICAgaWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlbW92ZUZyb21BcnJheShDQUxMQkFDS1Nbc3RhdGVdLCBpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG4gICAgbGV0IGNhbGxiYWNrQXJyYXkgPSBDQUxMQkFDS1Nbc3RhdGVdO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHVibGljIGZhY2luZyBBUEkgZm9yIGFkZGluZyBhbmQgcmVtb3ZpbmcgY2FsbGJhY2tzXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgICAgICAgICAgb3B0aW9ucyAgT3B0aW9uc1xuICogQHJldHVybiAge2Jvb2xlYW58aW50ZWdlcn0gICAgICAgICAgIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY2FsbGJhY2sgb3IgYm9vbGVhbiBpbmRpY2F0aW5nIHN1Y2Nlc3Mgb3IgZmFpbHVyZVxuICovXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXBpIChvcHRpb25zKSB7XG4gICAgbGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuICAgIGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG4gICAgbGV0IHJldDtcblxuICAgIC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcbiAgICBpZiAoYWN0aW9uID09PSAnYWRkQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUNhbGxiYWNrJykge1xuICAgICAgICByZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
