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
            } else {
                return this;
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
            $moduleEls = _environment.$barba.find('[data-module]');
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
        this.$el.off('.' + EVENT_NAMESPACE);
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
            _environment.$document.triggerHandler({
                type: _App.EVENT.DELETE_SCOPED_MODULES,
                $scope: _environment.$barba
            });

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
var $barba = $('#js-barba-wrapper');

var isDebug = !!$html.data('debug');

exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;
exports.$barba = $barba;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0NBOztBQUVBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBR0E7O0lBQVksTzs7Ozs7OzBKQVZaOzs7QUFTQTs7O0FBR0EsSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFGekI7QUFHakIsb0RBQThDO0FBSDdCLENBQWQ7O0lBTUQsRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwrQkFBVSxFQUFWLENBQWEsTUFBTSxZQUFuQixF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QVUsS0FBVixDQUFwQjtBQUNBLFFBQUksSUFBSSxDQUFSO0FBQ0EsUUFBSSxNQUFNLGNBQWMsTUFBeEI7O0FBRUEsV0FBTyxJQUFJLEdBQVgsRUFBZ0IsR0FBaEIsRUFBcUI7QUFDakIsc0JBQWMsQ0FBZCxFQUFpQixRQUFqQjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7O0FBS0EsU0FBUyxhQUFULENBQXdCLE9BQXhCLEVBQWlDO0FBQzdCLFFBQUksU0FBUyxRQUFRLE1BQVIsSUFBa0IsRUFBL0I7QUFDQSxRQUFJLFFBQVEsUUFBUSxLQUFSLElBQWlCLEVBQTdCO0FBQ0EsUUFBSSxZQUFKOztBQUVBO0FBQ0EsUUFBSSxDQUFDLDBCQUFjLE9BQWQsRUFBdUIsTUFBdkIsQ0FBTCxFQUFxQztBQUNqQyxnQkFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNELFFBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFdBQVcsYUFBZixFQUE4QjtBQUMxQixjQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUNwQyxjQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGJhcmJhIH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5cbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMvaXMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0FwcCc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5leHBvcnQgY29uc3QgRVZFTlQgPSB7XG4gICAgSU5JVF9NT0RVTEVTOiBgaW5pdE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBJTklUX1NDT1BFRF9NT0RVTEVTOiBgaW5pdFNjb3BlZE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBERUxFVEVfU0NPUEVEX01PRFVMRVM6IGBkZWxldGVTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoZXZlbnQuZmlyc3RCbG9vZClcbiAgICAgICAgICAgICAgICAuZGVsZXRlTW9kdWxlcyhldmVudClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFsbCBleGlzdGluZyBtb2R1bGVzIG9yIGEgc3BlY2lmaWMgc2NvcGUgb2YgbW9kdWxlc1xuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIGxldCBkZXN0cm95QWxsID0gdHJ1ZTtcbiAgICAgICAgbGV0IG1vZHVsZUlkcyA9IFtdO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBzY29wZSBmaXJzdFxuICAgICAgICBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBNb2R1bGVzIHdpdGhpbiBzY29wZVxuICAgICAgICAgICAgY29uc3QgJG1vZHVsZXMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlaXIgdWlkc1xuICAgICAgICAgICAgbW9kdWxlSWRzID0gJC5tYWtlQXJyYXkoJG1vZHVsZXMubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRtb2R1bGVzLmVxKGluZGV4KS5kYXRhKCd1aWQnKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaWYgKG1vZHVsZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZGVzdHJveUFsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgbW9kdWxlcyBhbmQgZGVzdHJveWluZyBhbGwgb2YgdGhlbSwgb3Igc3BlY2lmaWMgb25lc1xuICAgICAgICBsZXQgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChkZXN0cm95QWxsIHx8IGFycmF5Q29udGFpbnMobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tQXJyYXkobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdEdsb2JhbHMoZmlyc3RCbG9vZCkge1xuICAgICAgICBnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0TW9kdWxlcyhldmVudCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICBsZXQgJG1vZHVsZUVscyA9IFtdO1xuXG4gICAgICAgIC8vIElmIGZpcnN0IGJsb29kLCBsb2FkIGFsbCBtb2R1bGVzIGluIHRoZSBET01cbiAgICAgICAgLy8gSWYgc2NvcGVkLCByZW5kZXIgZWxlbWVudHMgd2l0aCBtb2R1bGVzXG4gICAgICAgIC8vIElmIEJhcmJhLCBsb2FkIG1vZHVsZXMgY29udGFpbmVkIGluIEJhcmJhIGNvbnRhaW5lclxuICAgICAgICBpZiAoZXZlbnQuZmlyc3RCbG9vZCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRkb2N1bWVudC5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5pc0JhcmJhKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gJGJhcmJhLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGNvbnN0IGVsc0xlbiA9ICRtb2R1bGVFbHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgZWwgPSAkbW9kdWxlRWxzW2ldO1xuXG4gICAgICAgICAgICAvLyBBbGwgZGF0YS0gYXR0cmlidXRlcyBjb25zaWRlcmVkIGFzIG9wdGlvbnNcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0gZ2V0Tm9kZURhdGEoZWwpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgPSBlbDtcbiAgICAgICAgICAgIG9wdGlvbnMuJGVsID0gJG1vZHVsZUVscy5lcShpKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5zcGxpdCgvWyxcXHNdKy9nKTtcblxuICAgICAgICAgICAgLy8gTG9vcCBtb2R1bGVzXG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICBsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZS5pbml0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG4vLyBJSUZFIGZvciBsb2FkaW5nIHRoZSBhcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbihmdW5jdGlvbigpIHtcbiAgICBuZXcgQXBwKCk7XG4gICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgdHlwZTogRVZFTlQuSU5JVF9NT0RVTEVTLFxuICAgICAgICBmaXJzdEJsb29kOiB0cnVlXG4gICAgfSk7XG59KSgpO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IFRyYW5zaXRpb25NYW5hZ2VyIGZyb20gJy4vdHJhbnNpdGlvbnMvVHJhbnNpdGlvbk1hbmFnZXInO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmaXJzdEJsb29kKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xuXG4gICAgaWYgKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbk1hbmFnZXIgPSBuZXcgVHJhbnNpdGlvbk1hbmFnZXIoKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQge2RlZmF1bHQgYXMgRXhhbXBsZX0gZnJvbSAnLi9tb2R1bGVzL0V4YW1wbGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xubGV0IHVpZCA9IDA7XG5cbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWwgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5lbCAgPSBvcHRpb25zLmVsICB8fCBudWxsO1xuXG4gICAgICAgIC8vIEdlbmVyYXRlIGEgdW5pcXVlIG1vZHVsZSBpZGVudGlmaWVyXG4gICAgICAgIHRoaXMudWlkID0gJ20tJyArIHVpZCsrO1xuICAgICAgICAvLyBVc2UgalF1ZXJ5J3MgZGF0YSBBUEkgdG8gXCJzdG9yZSBpdCBpbiB0aGUgRE9NXCJcbiAgICAgICAgdGhpcy4kZWwuZGF0YSgndWlkJywgdGhpcy51aWQpO1xuICAgIH1cblxuICAgIGluaXQoKSB7fVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVEYXRhKCd1aWQnKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0V4YW1wbGUnO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuY29uc3QgRVZFTlQgPSB7XG4gICAgQ0xJQ0s6IGBjbGljay4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIERlY2xhcmF0aW9uIG9mIHByb3BlcnRpZXNcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBTZXQgZXZlbnRzIGFuZCBzdWNoXG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRlbC5vZmYoYC4ke0VWRU5UX05BTUVTUEFDRX1gKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgJGJhcmJhIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgRVZFTlQgYXMgQVBQX0VWRU5UIH0gZnJvbSAnLi4vQXBwJztcblxuZnVuY3Rpb24gRGVmYXVsdFRyYW5zaXRpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHN0YXJ0Q2FsbGJhY2sgPSAodHlwZW9mIG9wdGlvbnMuc3RhcnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgPyBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgOiBmdW5jdGlvbigpe307XG4gICAgY29uc3Qgb3ZlcnJpZGVDbGFzcyA9ICh0eXBlb2Ygb3B0aW9ucy5vdmVycmlkZUNsYXNzID09PSAnc3RyaW5nJykgPyBvcHRpb25zLm92ZXJyaWRlQ2xhc3MgOiAnJztcblxuICAgIHJldHVybiBCYXJiYS5CYXNlVHJhbnNpdGlvbi5leHRlbmQoe1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRlZCBkb20taXMtYW5pbWF0ZWQnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhgZG9tLWlzLWxvYWRpbmcgJHtvdmVycmlkZUNsYXNzfWApO1xuXG4gICAgICAgICAgICBzdGFydENhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIC8qIENsb3NlIGFueSBvdmVybGF5cyAqL1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBQcm9taXNlXG4gICAgICAgICAgICAgICAgICAuYWxsKFt0aGlzLm5ld0NvbnRhaW5lckxvYWRpbmddKVxuICAgICAgICAgICAgICAgICAgLnRoZW4odGhpcy5maW5pc2guYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmluaXNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgdHlwZTogICBBUFBfRVZFTlQuREVMRVRFX1NDT1BFRF9NT0RVTEVTLFxuICAgICAgICAgICAgICAgICRzY29wZTogJGJhcmJhXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5kb25lKCk7XG5cbiAgICAgICAgICAgIGNvbnN0ICRlbCA9ICQodGhpcy5uZXdDb250YWluZXIpO1xuXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRlbXBsYXRlIG5hbWUgb2YgdGhlIG5ldyBjb250YWluZXIgYW5kIHNldCBpdCB0byB0aGUgRE9NXG4gICAgICAgICAgICAkaHRtbC5hdHRyKCdkYXRhLXRlbXBsYXRlJywgJGVsLmRhdGEoJ3RlbXBsYXRlJykpO1xuXG4gICAgICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgICAgIHR5cGU6IEFQUF9FVkVOVC5JTklUX01PRFVMRVMsXG4gICAgICAgICAgICAgICAgaXNCYXJiYTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICRodG1sXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdkb20taXMtbG9hZGVkJylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICRodG1sXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcyhvdmVycmlkZUNsYXNzKVxuICAgICAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdFRyYW5zaXRpb247XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZyB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuaW1wb3J0IERlZmF1bHRUcmFuc2l0aW9uIGZyb20gJy4vRGVmYXVsdFRyYW5zaXRpb24nO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdUcmFuc2l0aW9uTWFuYWdlcic7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBHT1RPOiBgZ290by4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGxldCBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgbGV0IHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5HT1RPLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uID0gZXZlbnQub3B0aW9ucy5sb2NhdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbiA9IGV2ZW50Lm9wdGlvbnMudHJhbnNpdGlvbjtcbiAgICAgICAgICAgICAgICBCYXJiYS5QamF4LmdvVG8oZXZlbnQub3B0aW9ucy5sb2NhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIERlZmluZSBkaWZmZXJlbnQgcGFnZSB0cmFuc2l0aW9uc1xuICAgICAgICBCYXJiYS5QamF4LmdldFRyYW5zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAoY2xpY2tlZExpbmsgaW5zdGFuY2VvZiBOb2RlKSA/IGNsaWNrZWRMaW5rLmdldEF0dHJpYnV0ZSgnZGF0YS10cmFuc2l0aW9uJykgOiAodHlwZW9mIHRyYW5zaXRpb24gPT09ICdzdHJpbmcnID8gdHJhbnNpdGlvbiA6ICcnKTtcblxuICAgICAgICAgICAgbGV0IFRyYW5zaXRpb25PYmplY3Q7XG5cbiAgICAgICAgICAgIHN3aXRjaCAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIFRyYW5zaXRpb25PYmplY3QgPSBEZWZhdWx0VHJhbnNpdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjbGlja2VkTGluayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSAnJztcblxuICAgICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25PYmplY3Q7XG4gICAgICAgIH1cblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCdsaW5rQ2xpY2tlZCcsIChIVE1MRWxlbWVudCwgTW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgY2xpY2tlZExpbmsgPSBIVE1MRWxlbWVudDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgQmFyYmEuRGlzcGF0Y2hlci5vbignbmV3UGFnZVJlYWR5JywgKGN1cnJlbnRTdGF0dXMsIHByZXZTdGF0dXMsIGNvbnRhaW5lciwgY3VycmVudEhUTUwpID0+IHtcbiAgICAgICAgICAgIC8vIEZldGNoIGFueSBpbmxpbmUgc2NyaXB0IGVsZW1lbnRzLlxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHQuanMtaW5saW5lJyk7XG5cbiAgICAgICAgICAgIGlmIChzY3JpcHRzIGluc3RhbmNlb2Ygd2luZG93Lk5vZGVMaXN0KSB7XG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBsZW4gPSBzY3JpcHRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2YWwoc2NyaXB0c1tpXS5pbm5lckhUTUwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBFeGVjdXRlIGFueSB0aGlyZCBwYXJ0eSBmZWF0dXJlcy5cbiAgICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICAvLyBHb29nbGUgQW5hbHl0aWNzXG4gICAgICAgICAgICBpZiAod2luZG93LmdhICYmICFpc0RlYnVnKSB7XG4gICAgICAgICAgICAgICAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgQmFyYmEuUGpheC5Eb20uY29udGFpbmVyQ2xhc3MgPSAnanMtYmFyYmEtY29udGFpbmVyJztcbiAgICAgICAgQmFyYmEuUGpheC5Eb20ud3JhcHBlcklkID0gJ2pzLWJhcmJhLXdyYXBwZXInO1xuXG4gICAgICAgIEJhcmJhLlBqYXguc3RhcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBET00gaXMgbG9hZGVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvYWQoKSB7XG4gICAgICAgICRodG1sLmFkZENsYXNzKCdkb20taXMtbG9hZGVkJyk7XG4gICAgICAgICRodG1sLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICRodG1sLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgfSwgMTAwMClcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0FycmF5ICggYXJyYXksIHZhbHVlICkge1xuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggdmFsdWUgKTtcblxuICAgIGlmICggaW5kZXggPT09IC0xICkge1xuICAgICAgICBhcnJheS5wdXNoKCB2YWx1ZSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGFpbnMgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBjID0gYXJyYXkubGVuZ3RoOyBpIDwgYzsgaSsrICkge1xuICAgICAgICBpZiAoIGFycmF5W2ldID09IHZhbHVlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRlbnRzTWF0Y2ggKCBhLCBiICkge1xuICAgIGxldCBpO1xuXG4gICAgaWYgKCAhaXNBcnJheSggYSApIHx8ICFpc0FycmF5KCBiICkgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIGEubGVuZ3RoICE9PSBiLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGkgPSBhLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgaWYgKCBhW2ldICE9PSBiW2ldICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVBcnJheSAoIHggKSB7XG4gICAgaWYgKCB0eXBlb2YgeCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiBbIHggXTtcbiAgICB9XG5cbiAgICBpZiAoIHggPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEl0ZW0gKCBhcnJheSApIHtcbiAgICByZXR1cm4gYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21BcnJheSAoIGFycmF5LCBtZW1iZXIgKSB7XG4gICAgaWYgKCAhYXJyYXkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIG1lbWJlciApO1xuXG4gICAgaWYgKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnNwbGljZSggaW5kZXgsIDEgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5ICggYXJyYXlMaWtlICkge1xuICAgIGNvbnN0IGFycmF5ID0gW107XG4gICAgbGV0IGkgPSBhcnJheUxpa2UubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBhcnJheVtpXSA9IGFycmF5TGlrZVtpXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnlLZXlWYWx1ZSggYXJyYXksIGtleSwgdmFsdWUgKSB7XG4gICAgcmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiggb2JqICkge1xuICAgICAgICByZXR1cm4gb2JqW2tleV0gPT09IHZhbHVlO1xuICAgIH0pO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgbGV0IHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xufVxuIiwiY29uc3QgQVBQX05BTUUgICAgID0gJ0JvaWxlcnBsYXRlJztcbmNvbnN0IERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknO1xuXG5jb25zdCAkZG9jdW1lbnQgICAgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgICAgICA9ICQod2luZG93KTtcbmNvbnN0ICRodG1sICAgICAgICA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnaGFzLW5vLWpzJykuYWRkQ2xhc3MoJ2hhcy1qcycpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcbmNvbnN0ICRiYXJiYSAgICAgICA9ICQoJyNqcy1iYXJiYS13cmFwcGVyJyk7XG5cbmNvbnN0IGlzRGVidWcgICAgICA9ICEhJGh0bWwuZGF0YSgnZGVidWcnKTtcblxuZXhwb3J0IHsgQVBQX05BTUUsIERBVEFfQVBJX0tFWSwgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHksIGlzRGVidWcsICRiYXJiYSB9O1xuIiwiLyoqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vcmFjdGl2ZWpzL3JhY3RpdmUvYmxvYi9kZXYvc3JjL3V0aWxzL2h0bWwuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBIVE1MIGNvbnRlbnQgdGhhdCBjb250YWlucyBtdXN0YWNoZSBjaGFyYWN0ZXJzIGZvciB1c2Ugd2l0aCBSYWN0aXZlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG4vKipcbiAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBub2RlXG4gKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICAvLyBBbGwgYXR0cmlidXRlc1xuICAgIGNvbnN0IGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgY29uc3QgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuICAgIC8vIE91dHB1dFxuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG4gICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucy5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcbiAgICAgICAgLy8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG4gICAgICAgIGRhdGFbbWF0Y2hbMV1dID0gZ2V0RGF0YShub2RlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbmNvbnN0IHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBQYXJzZSB2YWx1ZSB0byBkYXRhIHR5cGUuXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzMuMS4xL3NyYy9kYXRhLmpzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgLSBBIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHttaXhlZH0gIFJldHVybnMgdGhlIHZhbHVlIGluIGl0cyBuYXR1cmFsIGRhdGEgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcbiAgICBpZiAoZGF0YSA9PT0gK2RhdGErJycpIHtcbiAgICAgICAgcmV0dXJuICtkYXRhO1xuICAgIH1cblxuICAgIGlmIChyYnJhY2UudGVzdCggZGF0YSApKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJjb25zdCB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5jb25zdCBhcnJheUxpa2VQYXR0ZXJuID0gL15cXFtvYmplY3QgKD86QXJyYXl8RmlsZUxpc3QpXFxdJC87XG5cbi8vIHRoYW5rcywgaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vaW5zdGFuY2VvZi1jb25zaWRlcmVkLWhhcm1mdWwtb3ItaG93LXRvLXdyaXRlLWEtcm9idXN0LWlzYXJyYXkvXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAoIHRoaW5nICkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG4gICAgcmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuICAgIGlmICggYSA9PT0gbnVsbCAmJiBiID09PSBudWxsICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICFpc05hTiggcGFyc2VGbG9hdCggdGhpbmcgKSApICYmIGlzRmluaXRlKCB0aGluZyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QgKCB0aGluZyApIHtcbiAgICByZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG4gICAgY29uc3QgZ2V0VHlwZSA9IHt9O1xuICAgIHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi9pcydcblxubGV0IGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICBoZWFkZXJPZmZzZXQ6IDYwLFxuICAgIHNwZWVkOiAzMDBcbn07XG5cbi8qKlxuICogc2Nyb2xsVG8gaXMgYSBmdW5jdGlvbiB0aGF0IHNjcm9sbHMgYSBjb250YWluZXIgdG8gYW4gZWxlbWVudCdzIHBvc2l0aW9uIHdpdGhpbiB0aGF0IGNvbnRyb2xsZXJcbiAqIFVzZXMgalF1ZXJ5J3MgJC5EZWZlcnJlZCB0byBhbGxvdyB1c2luZyBhIGNhbGxiYWNrIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgJGVsZW1lbnQgIEEgalF1ZXJ5IG5vZGVcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICBvcHRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbygkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgLy8gRHJvcCBldmVyeXRoaW5nIGlmIHRoaXMgYWluJ3QgYSBqUXVlcnkgb2JqZWN0XG4gICAgaWYgKCRlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5ICYmICRlbGVtZW50Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAvLyBNZXJnaW5nIG9wdGlvbnNcbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fSkpO1xuXG4gICAgICAgIC8vIFByZXZlbnRzIGFjY3VtdWxhdGlvbiBvZiBhbmltYXRpb25zXG4gICAgICAgIGlmIChpc0FuaW1hdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjb250YWluZXIgdGhhdCB3ZSdsbCBiZSBzY3JvbGxpbmdcbiAgICAgICAgICAgIGxldCAkY29udGFpbmVyID0gJCgnaHRtbCwgYm9keScpO1xuICAgICAgICAgICAgbGV0IGVsZW1lbnRPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAvLyBUZXN0aW5nIGNvbnRhaW5lciBpbiBvcHRpb25zIGZvciBqUXVlcnktbmVzc1xuICAgICAgICAgICAgLy8gSWYgd2UncmUgbm90IHVzaW5nIGEgY3VzdG9tIGNvbnRhaW5lciwgd2UgdGFrZSB0aGUgdG9wIGRvY3VtZW50IG9mZnNldFxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlLCB3ZSB1c2UgdGhlIGVsZW1lbnRzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy4kY29udGFpbmVyICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLiRjb250YWluZXIgaW5zdGFuY2VvZiBqUXVlcnkgJiYgb3B0aW9ucy4kY29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gb3B0aW9ucy4kY29udGFpbmVyO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQucG9zaXRpb24oKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHNjcm9sbFRvcFxuICAgICAgICAgICAgfSwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5lYXNpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuICAgIGhpZGRlbjogW10sXG4gICAgdmlzaWJsZTogW11cbn07XG5cbmNvbnN0IEFDVElPTlMgPSBbXG4gICAgJ2FkZENhbGxiYWNrJyxcbiAgICAncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG4gICAgJ3Zpc2libGUnLFxuICAgICdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCAnJztcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG4gICAgQ0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcbiAgICAgICAgaWRlbnQ6IGlkZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9KTtcblxuICAgIHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgaWRlbnQgPSBvcHRpb25zLmlkZW50IHx8ICcnO1xuXG4gICAgaWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05lZWQgaWRlbnQgdG8gcmVtb3ZlIGNhbGxiYWNrJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpZGVudClcbiAgICAvLyBjb25zb2xlLmxvZyhDQUxMQkFDS1Nbc3RhdGVdKVxuXG4gICAgaWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlbW92ZUZyb21BcnJheShDQUxMQkFDS1Nbc3RhdGVdLCBpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG4gICAgbGV0IGNhbGxiYWNrQXJyYXkgPSBDQUxMQkFDS1Nbc3RhdGVdO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHVibGljIGZhY2luZyBBUEkgZm9yIGFkZGluZyBhbmQgcmVtb3ZpbmcgY2FsbGJhY2tzXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgICAgICAgICAgb3B0aW9ucyAgT3B0aW9uc1xuICogQHJldHVybiAge2Jvb2xlYW58aW50ZWdlcn0gICAgICAgICAgIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY2FsbGJhY2sgb3IgYm9vbGVhbiBpbmRpY2F0aW5nIHN1Y2Nlc3Mgb3IgZmFpbHVyZVxuICovXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXBpIChvcHRpb25zKSB7XG4gICAgbGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuICAgIGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG4gICAgbGV0IHJldDtcblxuICAgIC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcbiAgICBpZiAoYWN0aW9uID09PSAnYWRkQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUNhbGxiYWNrJykge1xuICAgICAgICByZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
