(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVENT = undefined;

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


var MODULE_NAME = 'App';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = exports.EVENT = {
    INIT_MODULES: 'initModules.' + EVENT_NAMESPACE,
    INIT_SCOPED_MODULES: 'initScopedModules.' + EVENT_NAMESPACE,
    DELETE_SCOPED_MODULES: 'deleteScopedModules.' + EVENT_NAMESPACE
};

var App = function () {
    function App() {
        var _this = this;

        _classCallCheck(this, App);

        this.modules = modules;
        this.currentModules = [];

        _environment.$document.on(EVENT.INIT_MODULES, function (event) {
            _this.initGlobals(event.firstBlood).deleteModules(event).initModules(event);
        });

        _environment.$document.on(EVENT.INIT_SCOPED_MODULES, function (event) {
            _this.initModules(event);
        });

        _environment.$document.on(EVENT.DELETE_SCOPED_MODULES, function (event) {
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
            var moduleIdents = attr.split(/[,\s]+/g);

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
        type: EVENT.INIT_MODULES,
        firstBlood: true
    });
})();

},{"./globals":2,"./modules":3,"./utils/array":8,"./utils/environment":10,"./utils/html":11,"./utils/is":12}],2:[function(require,module,exports){
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

},{"./transitions/TransitionManager":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Example = require('./modules/Example');

Object.defineProperty(exports, 'Example', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Example).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Example":5}],4:[function(require,module,exports){
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
            this.$el.removeData('uid');
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

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var MODULE_NAME = 'Example';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    CLICK: 'click.' + EVENT_NAMESPACE
};

var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        // Declaration of properties
    }

    _class.prototype.init = function init() {
        // Set events and such
    };

    _class.prototype.destroy = function destroy() {
        _AbstractModule.prototype.destroy.call(this);
        this.$el.off(EVENT_NAMESPACE);
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":10,"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _App = require('../App');

/* jshint esnext: true */


function DefaultTransition(options) {
    options = options || {};
    var startCallback = typeof options.startCallback === 'function' ? options.startCallback : function () {};
    var overrideClass = typeof options.overrideClass === 'string' ? options.overrideClass : '';

    console.log(EVENT);

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
                type: _App.EVENT.INIT_MODULES,
                isBarba: true
            });

            _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

            setTimeout(function () {
                _environment.$html.removeClass(overrideClass).addClass('dom-is-animated');
            }, 1000);
        }
    });
}

exports.default = DefaultTransition;

},{"../App":1,"../utils/environment":10}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

var _DefaultTransition = require('./DefaultTransition');

var _DefaultTransition2 = _interopRequireDefault(_DefaultTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


var MODULE_NAME = 'TransitionManager';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

var EVENT = {
    GOTO: 'goto.' + EVENT_NAMESPACE
};

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

        _environment.$document.on(EVENT.GOTO, function (event) {
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

        Barba.Dispatcher.on('linkClicked', function (HTMLElement, MouseEvent) {
            clickedLink = HTMLElement;
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

},{"../utils/environment":10,"./DefaultTransition":6}],8:[function(require,module,exports){
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

},{"./is":12}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (func, wait, immediate) {
    var timeout = void 0;
    return function () {
        var context = this;
        var args = arguments;
        var later = function later() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var APP_NAME = 'Boilerplate';
var DATA_API_KEY = '.data-api';

var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement).removeClass('has-no-js').addClass('has-js');
var $body = $(document.body);

var isDebug = !!$html.data('debug');

exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

},{}],13:[function(require,module,exports){
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

},{"./is":12}],14:[function(require,module,exports){
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

},{"./array":8,"./environment":10,"./is":12}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0NBOztBQUVBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBR0E7O0lBQVksTzs7Ozs7Ozs7Ozs7O0FBRVosSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFGekI7QUFHakIsb0RBQThDO0FBSDdCLENBQWQ7O0lBTUQsRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwrQkFBVSxFQUFWLENBQWEsTUFBTSxZQUFuQixFQUFpQyxVQUFD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YyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7OztBQUdELFFBQUksV0FBVyxhQUFmLEVBQThCO0FBQzFCLGNBQU0sWUFBWSxLQUFaLEVBQW1CLE9BQW5CLENBQU47QUFDSCxLQUZELE1BRU8sSUFBSSxXQUFXLGdCQUFmLEVBQWlDO0FBQ3BDLGNBQU0sZUFBZSxLQUFmLEVBQXNCLE9BQXRCLENBQU47QUFDSDs7QUFFRCxXQUFPLEdBQVA7QUFDSDs7UUFFUSxhLEdBQUEsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50IH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5cbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMvaXMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0FwcCc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5leHBvcnQgY29uc3QgRVZFTlQgPSB7XG4gICAgSU5JVF9NT0RVTEVTOiBgaW5pdE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBJTklUX1NDT1BFRF9NT0RVTEVTOiBgaW5pdFNjb3BlZE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBERUxFVEVfU0NPUEVEX01PRFVMRVM6IGBkZWxldGVTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoZXZlbnQuZmlyc3RCbG9vZClcbiAgICAgICAgICAgICAgICAuZGVsZXRlTW9kdWxlcyhldmVudClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFsbCBleGlzdGluZyBtb2R1bGVzIG9yIGEgc3BlY2lmaWMgc2NvcGUgb2YgbW9kdWxlc1xuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIGxldCBkZXN0cm95QWxsID0gdHJ1ZTtcbiAgICAgICAgbGV0IG1vZHVsZUlkcyA9IFtdO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBzY29wZSBmaXJzdFxuICAgICAgICBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBNb2R1bGVzIHdpdGhpbiBzY29wZVxuICAgICAgICAgICAgY29uc3QgJG1vZHVsZXMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlaXIgdWlkc1xuICAgICAgICAgICAgbW9kdWxlSWRzID0gJC5tYWtlQXJyYXkoJG1vZHVsZXMubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRtb2R1bGVzLmVxKGluZGV4KS5kYXRhKCd1aWQnKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaWYgKG1vZHVsZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZGVzdHJveUFsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCBtb2R1bGVzIGFuZCBkZXN0cm95aW5nIGFsbCBvZiB0aGVtLCBvciBzcGVjaWZpYyBvbmVzXG4gICAgICAgIGxldCBpID0gdGhpcy5jdXJyZW50TW9kdWxlcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgaWYgKGRlc3Ryb3lBbGwgfHwgYXJyYXlDb250YWlucyhtb2R1bGVJZHMsIHRoaXMuY3VycmVudE1vZHVsZXNbaV0udWlkKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZUZyb21BcnJheShtb2R1bGVJZHMsIHRoaXMuY3VycmVudE1vZHVsZXNbaV0udWlkKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnNwbGljZShpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgZ2xvYmFsIGZ1bmN0aW9ucyBhbmQgc2V0dGluZ3NcbiAgICAgKiBBbGxvd3MgeW91IHRvIGluaXRpYWxpemUgZ2xvYmFsIG1vZHVsZXMgb25seSBvbmNlIGlmIHlvdSBuZWVkXG4gICAgICogKGV4Ljogd2hlbiB1c2luZyBCYXJiYS5qcyBvciBTbW9vdGhTdGF0ZS5qcylcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0R2xvYmFscyhmaXJzdEJsb29kKSB7XG4gICAgICAgIGdsb2JhbHMoZmlyc3RCbG9vZCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCBUaGUgZXZlbnQgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGluaXRNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIC8vIEVsZW1lbnRzIHdpdGggbW9kdWxlXG4gICAgICAgIGxldCAkbW9kdWxlRWxzID0gW107XG5cbiAgICAgICAgLy8gSWYgZmlyc3QgYmxvb2QsIGxvYWQgYWxsIG1vZHVsZXMgaW4gdGhlIERPTVxuICAgICAgICAvLyBJZiBzY29wZWQsIHJlbmRlciBlbGVtZW50cyB3aXRoIG1vZHVsZXNcbiAgICAgICAgLy8gSWYgQmFyYmEsIGxvYWQgbW9kdWxlcyBjb250YWluZWQgaW4gQmFyYmEgY29udGFpbmVyXG4gICAgICAgIGlmIChldmVudC5maXJzdEJsb29kKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gJGRvY3VtZW50LmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC4kc2NvcGUgaW5zdGFuY2VvZiBqUXVlcnkgJiYgZXZlbnQuJHNjb3BlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LmlzQmFyYmEpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkKCcjanMtYmFyYmEtd3JhcHBlcicpLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGNvbnN0IGVsc0xlbiA9ICRtb2R1bGVFbHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgZWwgPSAkbW9kdWxlRWxzW2ldO1xuXG4gICAgICAgICAgICAvLyBBbGwgZGF0YS0gYXR0cmlidXRlcyBjb25zaWRlcmVkIGFzIG9wdGlvbnNcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0gZ2V0Tm9kZURhdGEoZWwpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbDtcbiAgICAgICAgICAgIG9wdGlvbnMuJGVsID0gJG1vZHVsZUVscy5lcShpKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5zcGxpdCgvWyxcXHNdKy9nKTtcblxuICAgICAgICAgICAgLy8gTG9vcCBtb2R1bGVzXG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICBsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG4vLyBJSUZFIGZvciBsb2FkaW5nIHRoZSBhcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbihmdW5jdGlvbigpIHtcbiAgICBuZXcgQXBwKCk7XG4gICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgdHlwZTogRVZFTlQuSU5JVF9NT0RVTEVTLFxuICAgICAgICBmaXJzdEJsb29kOiB0cnVlXG4gICAgfSk7XG59KSgpO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IFRyYW5zaXRpb25NYW5hZ2VyIGZyb20gJy4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbk1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaXJzdEJsb29kKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xuXG4gICAgaWYgKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hbmFnZXIgPSBuZXcgVHJhbnNpdGlvbk1hbmFnZXIoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQge2RlZmF1bHQgYXMgRXhhbXBsZX0gZnJvbSAnLi9tb2R1bGVzL0V4YW1wbGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xubGV0IHVpZCA9IDA7XG5cbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWwgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5lbCAgPSBvcHRpb25zLmVsICB8fCBudWxsO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG1vZHVsZSBpZGVudGlmaWVyXG4gICAgICAgIHRoaXMudWlkID0gJ20tJyArIHVpZCsrO1xuICAgICAgICAvLyBVc2UgalF1ZXJ5J3MgZGF0YSBBUEkgdG8gXCJzdG9yZSBpdCBpbiB0aGUgRE9NXCJcbiAgICAgICAgdGhpcy4kZWwuZGF0YSgndWlkJywgdGhpcy51aWQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7fVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICBpZiAodGhpcy4kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZURhdGEoJ3VpZCcpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnRXhhbXBsZSc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBDTElDSzogYGNsaWNrLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gRGVjbGFyYXRpb24gb2YgcHJvcGVydGllc1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFNldCBldmVudHMgYW5kIHN1Y2hcbiAgICB9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuJGVsLm9mZihFVkVOVF9OQU1FU1BBQ0UpO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRodG1sIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgRVZFTlQgYXMgQVBQX0VWRU5UIH0gZnJvbSAnLi4vQXBwJztcblxuZnVuY3Rpb24gRGVmYXVsdFRyYW5zaXRpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHN0YXJ0Q2FsbGJhY2sgPSAodHlwZW9mIG9wdGlvbnMuc3RhcnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgPyBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgOiBmdW5jdGlvbigpe307XG4gICAgY29uc3Qgb3ZlcnJpZGVDbGFzcyA9ICh0eXBlb2Ygb3B0aW9ucy5vdmVycmlkZUNsYXNzID09PSAnc3RyaW5nJykgPyBvcHRpb25zLm92ZXJyaWRlQ2xhc3MgOiAnJztcblxuICAgIGNvbnNvbGUubG9nKEVWRU5UKTtcblxuICAgIHJldHVybiBCYXJiYS5CYXNlVHJhbnNpdGlvbi5leHRlbmQoe1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRlZCBkb20taXMtYW5pbWF0ZWQnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhgZG9tLWlzLWxvYWRpbmcgJHtvdmVycmlkZUNsYXNzfWApO1xuXG4gICAgICAgICAgICBzdGFydENhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIC8qIENsb3NlIGFueSBvdmVybGF5cyAqL1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBQcm9taXNlXG4gICAgICAgICAgICAgICAgICAuYWxsKFt0aGlzLm5ld0NvbnRhaW5lckxvYWRpbmddKVxuICAgICAgICAgICAgICAgICAgLnRoZW4odGhpcy5maW5pc2guYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmluaXNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZG9uZSgpO1xuXG4gICAgICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMubmV3Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0ZW1wbGF0ZSBuYW1lIG9mIHRoZSBuZXcgY29udGFpbmVyIGFuZCBzZXQgaXQgdG8gdGhlIERPTVxuICAgICAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsICRlbC5kYXRhKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBUFBfRVZFTlQuSU5JVF9NT0RVTEVTLFxuICAgICAgICAgICAgICAgIGlzQmFyYmE6IHRydWVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3Mob3ZlcnJpZGVDbGFzcylcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlZmF1bHRUcmFuc2l0aW9uO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsIGlzRGVidWcgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBEZWZhdWx0VHJhbnNpdGlvbiBmcm9tICcuL0RlZmF1bHRUcmFuc2l0aW9uJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnVHJhbnNpdGlvbk1hbmFnZXInO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuY29uc3QgRVZFTlQgPSB7XG4gICAgR09UTzogYGdvdG8uJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgY2xpY2tlZExpbmsgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gJyc7XG5cbiAgICAgICAgLy8galF1ZXJ5IG9uZG9tcmVhZHlcbiAgICAgICAgJCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKVxuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuR09UTywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IGV2ZW50Lm9wdGlvbnMubG9jYXRpb247XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb24gPSBldmVudC5vcHRpb25zLnRyYW5zaXRpb247XG4gICAgICAgICAgICAgICAgQmFyYmEuUGpheC5nb1RvKGV2ZW50Lm9wdGlvbnMubG9jYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBEZWZpbmUgZGlmZmVyZW50IHBhZ2UgdHJhbnNpdGlvbnNcbiAgICAgICAgQmFyYmEuUGpheC5nZXRUcmFuc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uID0gKGNsaWNrZWRMaW5rIGluc3RhbmNlb2YgTm9kZSkgPyBjbGlja2VkTGluay5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHJhbnNpdGlvbicpIDogKHR5cGVvZiB0cmFuc2l0aW9uID09PSAnc3RyaW5nJyA/IHRyYW5zaXRpb24gOiAnJyk7XG5cbiAgICAgICAgICAgIGxldCBUcmFuc2l0aW9uT2JqZWN0O1xuXG4gICAgICAgICAgICBzd2l0Y2ggKHRyYW5zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBUcmFuc2l0aW9uT2JqZWN0ID0gRGVmYXVsdFRyYW5zaXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2xpY2tlZExpbmsgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uID0gJyc7XG5cbiAgICAgICAgICAgIHJldHVybiBUcmFuc2l0aW9uT2JqZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgQmFyYmEuRGlzcGF0Y2hlci5vbignbGlua0NsaWNrZWQnLCAoSFRNTEVsZW1lbnQsIE1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNsaWNrZWRMaW5rID0gSFRNTEVsZW1lbnQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJhcmJhLkRpc3BhdGNoZXIub24oJ25ld1BhZ2VSZWFkeScsIChjdXJyZW50U3RhdHVzLCBwcmV2U3RhdHVzLCBjb250YWluZXIsIGN1cnJlbnRIVE1MKSA9PiB7XG4gICAgICAgICAgICAvLyBGZXRjaCBhbnkgaW5saW5lIHNjcmlwdCBlbGVtZW50cy5cbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0LmpzLWlubGluZScpO1xuXG4gICAgICAgICAgICBpZiAoc2NyaXB0cyBpbnN0YW5jZW9mIHdpbmRvdy5Ob2RlTGlzdCkge1xuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgICAgICAgICBsZXQgbGVuID0gc2NyaXB0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBldmFsKHNjcmlwdHNbaV0uaW5uZXJIVE1MKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogRXhlY3V0ZSBhbnkgdGhpcmQgcGFydHkgZmVhdHVyZXMuXG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgLy8gR29vZ2xlIEFuYWx5dGljc1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5nYSAmJiAhaXNEZWJ1Zykge1xuICAgICAgICAgICAgICAgIGdhKCdzZW5kJywgJ3BhZ2V2aWV3Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJhcmJhLlBqYXguRG9tLmNvbnRhaW5lckNsYXNzID0gJ2pzLWJhcmJhLWNvbnRhaW5lcic7XG4gICAgICAgIEJhcmJhLlBqYXguRG9tLndyYXBwZXJJZCA9ICdqcy1iYXJiYS13cmFwcGVyJztcblxuICAgICAgICBCYXJiYS5QamF4LnN0YXJ0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRE9NIGlzIGxvYWRlZFxuICAgICAqXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBsb2FkKCkge1xuICAgICAgICAkaHRtbC5hZGRDbGFzcygnZG9tLWlzLWxvYWRlZCcpO1xuICAgICAgICAkaHRtbC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAkaHRtbC5hZGRDbGFzcygnZG9tLWlzLWFuaW1hdGVkJyk7XG4gICAgICAgIH0sIDEwMDApXG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9BcnJheSAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIHZhbHVlICk7XG5cbiAgICBpZiAoIGluZGV4ID09PSAtMSApIHtcbiAgICAgICAgYXJyYXkucHVzaCggdmFsdWUgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuICAgIGZvciAoIGxldCBpID0gMCwgYyA9IGFycmF5Lmxlbmd0aDsgaSA8IGM7IGkrKyApIHtcbiAgICAgICAgaWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250ZW50c01hdGNoICggYSwgYiApIHtcbiAgICBsZXQgaTtcblxuICAgIGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBhLmxlbmd0aCAhPT0gYi5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpID0gYS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGlmICggYVtpXSAhPT0gYltpXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuICAgIGlmICggdHlwZW9mIHggPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4gWyB4IF07XG4gICAgfVxuXG4gICAgaWYgKCB4ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG4gICAgcmV0dXJuIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tQXJyYXkgKCBhcnJheSwgbWVtYmVyICkge1xuICAgIGlmICggIWFycmF5ICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICBhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheSAoIGFycmF5TGlrZSApIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGxldCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJ5S2V5VmFsdWUoIGFycmF5LCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldID09PSB2YWx1ZTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbn1cbiIsImNvbnN0IEFQUF9OQU1FICAgICA9ICdCb2lsZXJwbGF0ZSc7XG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJztcblxuY29uc3QgJGRvY3VtZW50ICAgID0gJChkb2N1bWVudCk7XG5jb25zdCAkd2luZG93ICAgICAgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCAgICAgICAgPSAkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2hhcy1uby1qcycpLmFkZENsYXNzKCdoYXMtanMnKTtcbmNvbnN0ICRib2R5ICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSk7XG5cbmNvbnN0IGlzRGVidWcgICAgICA9ICEhJGh0bWwuZGF0YSgnZGVidWcnKTtcblxuZXhwb3J0IHsgQVBQX05BTUUsIERBVEFfQVBJX0tFWSwgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHksIGlzRGVidWcgfTtcbiIsIi8qKlxuICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL3JhY3RpdmVqcy9yYWN0aXZlL2Jsb2IvZGV2L3NyYy91dGlscy9odG1sLmpzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xufVxuXG4vKipcbiAqIFByZXBhcmUgSFRNTCBjb250ZW50IHRoYXQgY29udGFpbnMgbXVzdGFjaGUgY2hhcmFjdGVycyBmb3IgdXNlIHdpdGggUmFjdGl2ZVxuICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgJz4nKVxuICAgICAgICAucmVwbGFjZSgvJmFtcDsvZywgJyYnKTtcbn1cblxuLyoqXG4gKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHtET01FbGVtZW50fSAgbm9kZVxuICogQHJldHVybiAge0FycmF5fSAgICAgICBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlRGF0YShub2RlKSB7XG4gICAgLy8gQWxsIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gUmVnZXggUGF0dGVyblxuICAgIGNvbnN0IHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICBmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2ldKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMuXG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG4gICAgICAgIC8vIHNlcmlvdXMgcHJvYmxlbXMgaW4geW91ciBIVE1MLlxuICAgICAgICBkYXRhW21hdGNoWzFdXSA9IGdldERhdGEobm9kZS5nZXRBdHRyaWJ1dGUobmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5jb25zdCByYnJhY2UgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC87XG5cbi8qKlxuICogUGFyc2UgdmFsdWUgdG8gZGF0YSB0eXBlLlxuICpcbiAqIEBsaW5rICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8zLjEuMS9zcmMvZGF0YS5qc1xuICogQHBhcmFtICB7c3RyaW5nfSBkYXRhIC0gQSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7bWl4ZWR9ICBSZXR1cm5zIHRoZSB2YWx1ZSBpbiBpdHMgbmF0dXJhbCBkYXRhIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE9ubHkgY29udmVydCB0byBhIG51bWJlciBpZiBpdCBkb2Vzbid0IGNoYW5nZSB0aGUgc3RyaW5nXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhKycnKSB7XG4gICAgICAgIHJldHVybiArZGF0YTtcbiAgICB9XG5cbiAgICBpZiAocmJyYWNlLnRlc3QoIGRhdGEgKSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSggZGF0YSApO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwiY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgYXJyYXlMaWtlUGF0dGVybiA9IC9eXFxbb2JqZWN0ICg/OkFycmF5fEZpbGVMaXN0KVxcXSQvO1xuXG4vLyB0aGFua3MsIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2luc3RhbmNlb2YtY29uc2lkZXJlZC1oYXJtZnVsLW9yLWhvdy10by13cml0ZS1hLXJvYnVzdC1pc2FycmF5L1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKCB0aGluZyApIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlICggb2JqICkge1xuICAgIHJldHVybiBhcnJheUxpa2VQYXR0ZXJuLnRlc3QoIHRvU3RyaW5nLmNhbGwoIG9iaiApICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VxdWFsICggYSwgYiApIHtcbiAgICBpZiAoIGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgYSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgPT09ICdvYmplY3QnICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgPT09IGI7XG59XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODIvdmFsaWRhdGUtbnVtYmVycy1pbi1qYXZhc2NyaXB0LWlzbnVtZXJpY1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyAoIHRoaW5nICkge1xuICAgIHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQoIHRoaW5nICkgKSAmJiBpc0Zpbml0ZSggdGhpbmcgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICggdGhpbmcgJiYgdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oIHRoaW5nICkge1xuICAgIGNvbnN0IGdldFR5cGUgPSB7fTtcbiAgICByZXR1cm4gdGhpbmcgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKHRoaW5nKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4vaXMnXG5cbmxldCBpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgICBlYXNpbmc6ICdzd2luZycsXG4gICAgaGVhZGVyT2Zmc2V0OiA2MCxcbiAgICBzcGVlZDogMzAwXG59O1xuXG4vKipcbiAqIHNjcm9sbFRvIGlzIGEgZnVuY3Rpb24gdGhhdCBzY3JvbGxzIGEgY29udGFpbmVyIHRvIGFuIGVsZW1lbnQncyBwb3NpdGlvbiB3aXRoaW4gdGhhdCBjb250cm9sbGVyXG4gKiBVc2VzIGpRdWVyeSdzICQuRGVmZXJyZWQgdG8gYWxsb3cgdXNpbmcgYSBjYWxsYmFjayBvbiBhbmltYXRpb24gY29tcGxldGlvblxuICogQHBhcmFtICAge29iamVjdH0gICRlbGVtZW50ICBBIGpRdWVyeSBub2RlXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG8oJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgIC8vIERyb3AgZXZlcnl0aGluZyBpZiB0aGlzIGFpbid0IGEgalF1ZXJ5IG9iamVjdFxuICAgIGlmICgkZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkZWxlbWVudC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgLy8gTWVyZ2luZyBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge30pKTtcblxuICAgICAgICAvLyBQcmV2ZW50cyBhY2N1bXVsYXRpb24gb2YgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaXNBbmltYXRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY29udGFpbmVyIHRoYXQgd2UnbGwgYmUgc2Nyb2xsaW5nXG4gICAgICAgICAgICBsZXQgJGNvbnRhaW5lciA9ICQoJ2h0bWwsIGJvZHknKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50T2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgLy8gVGVzdGluZyBjb250YWluZXIgaW4gb3B0aW9ucyBmb3IgalF1ZXJ5LW5lc3NcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCB1c2luZyBhIGN1c3RvbSBjb250YWluZXIsIHdlIHRha2UgdGhlIHRvcCBkb2N1bWVudCBvZmZzZXRcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSwgd2UgdXNlIHRoZSBlbGVtZW50cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuJGNvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy4kY29udGFpbmVyIGluc3RhbmNlb2YgalF1ZXJ5ICYmIG9wdGlvbnMuJGNvbnRhaW5lci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9IG9wdGlvbnMuJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50LnBvc2l0aW9uKCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5vZmZzZXQoKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuZWFzaW5nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzJztcbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIGZpbmRCeUtleVZhbHVlLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL2FycmF5JztcbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IENBTExCQUNLUyA9IHtcbiAgICBoaWRkZW46IFtdLFxuICAgIHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuICAgICdhZGRDYWxsYmFjaycsXG4gICAgJ3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuICAgICd2aXNpYmxlJyxcbiAgICAnaGlkZGVuJ1xuXTtcblxuY29uc3QgUFJFRklYID0gJ3YtJztcblxubGV0IFVVSUQgPSAwO1xuXG4vLyBNYWluIGV2ZW50XG4kZG9jdW1lbnQub24oJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgndmlzaWJsZScpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpZGVudCA9IFBSRUZJWCArIFVVSUQrKztcblxuICAgIENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG4gICAgICAgIGlkZW50OiBpZGVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSk7XG5cbiAgICByZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuICAgIGlmICh0eXBlb2YoaWRlbnQpID09PSAndW5kZWZpbmVkJyB8fCBpZGVudCA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gZmluZEJ5S2V5VmFsdWUoQ0FMTEJBQ0tTW3N0YXRlXSwgJ2lkZW50JywgaWRlbnQpWzBdO1xuXG4gICAgLy8gY29uc29sZS5sb2coaWRlbnQpXG4gICAgLy8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuICAgIGlmICh0eXBlb2YoaW5kZXgpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuICAgIGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuICAgIGxldCBhY3Rpb24gPSBvcHRpb25zLmFjdGlvbiB8fCAnJztcbiAgICBsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuICAgIGxldCByZXQ7XG5cbiAgICAvLyBUeXBlIGFuZCB2YWx1ZSBjaGVja2luZ1xuICAgIGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQWN0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU3RhdGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG4gICAgaWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuICAgICAgICByZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCB7IHZpc2liaWxpdHlBcGkgfTtcbiJdfQ==
