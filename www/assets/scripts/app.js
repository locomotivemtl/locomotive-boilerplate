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
                type: _App.EVENT.INIT_SCOPED_MODULES,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0NBOztBQUVBOzs7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBR0E7O0lBQVksTzs7Ozs7OzBKQVZaOzs7QUFTQTs7O0FBR0EsSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFGekI7QUFHakIsb0RBQThDO0FBSDdCLENBQWQ7O0lBTUQsRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwrQkFBVSxFQUFWLENBQWEsTUFBTSxZQUFuQixFQUFpQyxVQUFDLEtBQUQsRUFBVztBQUN4QyxrQkFBSyxXQUFMLENBQWlCLE1BQU0sVUFBdkIsRUFDSyxhQURMLENBQ21CLEtBRG5CLEVBRUssV0FGTCxDQUVpQixLQUZqQjtBQUdILFNBSkQ7O0FBTUEsK0JBQVUsRUFBVixDQUFhLE1BQU0sbUJBQW5CLEVBQXdDLFVBQUMsS0FBRCxFQUFXO0FBQy9DLGtCQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxTQUZEOztBQUlBLCtCQUFVLEVBQVYsQ0FBYSxNQUFNLHFCQUFuQixFQUEwQyxVQUFDLEtBQUQsRUFBVztBQUNqRCxrQkFBSyxhQUFMLENBQW1CLEtBQW5CO0FBQ0gsU0FGRDtBQUdIOztBQUVEOzs7Ozs7O2tCQUtBLGEsMEJBQWMsSyxFQUFPO0FBQ2pCLFlBQUksYUFBYSxJQUFqQjtBQUNBLFlBQUksWUFBWSxFQUFoQjs7QUFFQTtBQUNBLFlBQUksTUFBTSxNQUFOLFlBQXdCLE1BQXhCLElBQWtDLE1BQU0sTUFBTixDQUFhLE1BQWIsR0FBc0IsQ0FBNUQsRUFBK0Q7QUFDM0Q7QUFDQSxnQkFBTSxXQUFXLE1BQU0sTUFBTixDQUFhLElBQWIsQ0FBa0IsZUFBbEIsQ0FBakI7O0FBRUE7QUFDQSx3QkFBWSxFQUFFLFNBQUYsQ0FBWSxTQUFTLEdBQVQsQ0FBYSxVQUFTLEtBQVQsRUFBZ0I7QUFDakQsdUJBQU8sU0FBUyxFQUFULENBQVksS0FBWixFQUFtQixJQUFuQixDQUF3QixLQUF4QixDQUFQO0FBQ0gsYUFGdUIsQ0FBWixDQUFaOztBQUlBLGdCQUFJLFVBQVUsTUFBVixHQUFtQixDQUF2QixFQUEwQjtBQUN0Qiw2QkFBYSxLQUFiO0FBQ0gsYUFGRCxNQUVPO0FBQ0gsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRUQ7QUFDQSxZQUFJLElBQUksS0FBSyxjQUFMLENBQW9CLE1BQTVCOztBQUVBLGVBQU8sR0FBUCxFQUFZO0FBQ1IsZ0JBQUksY0FBYywwQkFBYyxTQUFkLEVBQXlCLEtBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixHQUFoRCxDQUFsQixFQUF3RTtBQUNwRSw0Q0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLEdBQWxEO0FBQ0EscUJBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixPQUF2QjtBQUNBLHFCQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsQ0FBM0I7QUFDSDtBQUNKOztBQUVELGVBQU8sSUFBUDtBQUNILEs7O0FBRUQ7Ozs7Ozs7O2tCQU1BLFcsd0JBQVksVSxFQUFZO0FBQ3BCLCtCQUFRLFVBQVI7QUFDQSxlQUFPLElBQVA7QUFDSCxLOztBQUVEOzs7Ozs7O2tCQUtBLFcsd0JBQVksSyxFQUFPO0FBQ2Y7QUFDQSxZQUFJLGFBQWEsRUFBakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSSxNQUFNLFVBQVYsRUFBc0I7QUFDbEIseUJBQWEsdUJBQVUsSUFBVixDQUFlLGVBQWYsQ0FBYjtBQUNILFNBRkQsTUFFTyxJQUFJLE1BQU0sTUFBTixZQUF3QixNQUF4QixJQUFrQyxNQUFNLE1BQU4sQ0FBYSxNQUFiLEdBQXNCLENBQTVELEVBQStEO0FBQ2xFLHlCQUFhLE1BQU0sTUFBTixDQUFhLElBQWIsQ0FBa0IsZUFBbEIsQ0FBYjtBQUNILFNBRk0sTUFFQSxJQUFJLE1BQU0sT0FBVixFQUFtQjtBQUN0Qix5QkFBYSxvQkFBTyxJQUFQLENBQVksZUFBWixDQUFiO0FBQ0g7O0FBRUQ7QUFDQSxZQUFJLElBQUksQ0FBUjtBQUNBLFlBQU0sU0FBUyxXQUFXLE1BQTFCOztBQUVBLGVBQU8sSUFBSSxNQUFYLEVBQW1CLEdBQW5CLEVBQXdCOztBQUVwQjtBQUNBLGdCQUFJLEtBQUssV0FBVyxDQUFYLENBQVQ7O0FBRUE7QUFDQSxnQkFBSSxVQUFVLHVCQUFZLEVBQVosQ0FBZDs7QUFFQTtBQUNBLG9CQUFRLEVBQVIsR0FBYSxFQUFiO0FBQ0Esb0JBQVEsR0FBUixHQUFjLFdBQVcsRUFBWCxDQUFjLENBQWQsQ0FBZDs7QUFFQTtBQUNBLGdCQUFJLE9BQU8sUUFBUSxNQUFuQjs7QUFFQTtBQUNBLGdCQUFJLGVBQWUsS0FBSyxLQUFMLENBQVcsU0FBWCxDQUFuQjs7QUFFQTtBQUNBLGdCQUFJLElBQUksQ0FBUjtBQUNBLGdCQUFJLGFBQWEsYUFBYSxNQUE5Qjs7QUFFQSxtQkFBTyxJQUFJLFVBQVgsRUFBdUIsR0FBdkIsRUFBNEI7QUFDeEIsb0JBQUksYUFBYSxhQUFhLENBQWIsQ0FBakI7O0FBRUEsb0JBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQVAsS0FBb0MsVUFBeEMsRUFBb0Q7QUFDaEQsd0JBQUksU0FBUyxJQUFJLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBSixDQUE2QixPQUE3QixDQUFiO0FBQ0EseUJBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixNQUF6QjtBQUNBLDJCQUFPLElBQVA7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsZUFBTyxJQUFQO0FBQ0gsSzs7Ozs7QUFHTDtBQUNBOzs7QUFDQSxDQUFDLFlBQVc7QUFDUixRQUFJLEdBQUo7QUFDQSwyQkFBVSxjQUFWLENBQXlCO0FBQ3JCLGNBQU0sTUFBTSxZQURTO0FBRXJCLG9CQUFZO0FBRlMsS0FBekI7QUFJSCxDQU5EOzs7Ozs7Ozs7a0JDeEplLFVBQVMsVUFBVCxFQUFxQjtBQUNoQzs7QUFFQSxRQUFJLFVBQUosRUFBZ0I7QUFDWixZQUFNLG9CQUFvQixpQ0FBMUI7QUFDSDtBQUNKLEM7O0FBUkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0Q0NBUSxPOzs7Ozs7Ozs7Ozs7Ozs7QUNEUjtBQUNBLElBQUksTUFBTSxDQUFWOztBQUVBOzs7OztBQUlJLG9CQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFDakIsYUFBSyxHQUFMLEdBQVcsUUFBUSxHQUFSLElBQWUsSUFBMUI7QUFDQSxhQUFLLEVBQUwsR0FBVyxRQUFRLEVBQVIsSUFBZSxJQUExQjs7QUFFQTtBQUNBLGFBQUssR0FBTCxHQUFXLE9BQU8sS0FBbEI7QUFDQTtBQUNBLGFBQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLEtBQUssR0FBMUI7QUFDSDs7cUJBRUQsSSxtQkFBTyxDQUFFLEM7O3FCQUVULE8sc0JBQVU7QUFDTixZQUFJLEtBQUssR0FBVCxFQUFjO0FBQ1YsaUJBQUssR0FBTCxDQUFTLFVBQVQsQ0FBb0IsS0FBcEI7QUFDSDtBQUNKLEs7Ozs7Ozs7Ozs7Ozs7O0FDdEJMOztBQUNBOzs7Ozs7Ozs7OytlQUZBOzs7QUFJQSxJQUFNLGNBQWMsU0FBcEI7QUFDQSxJQUFNLGdEQUFpQyxXQUF2Qzs7QUFFQSxJQUFNLFFBQVE7QUFDVixzQkFBZ0I7QUFETixDQUFkOzs7OztBQUtJLG9CQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxnREFDakIsMkJBQU0sT0FBTixDQURpQjs7QUFHakI7QUFDSDs7cUJBRUQsSSxtQkFBTztBQUNIO0FBQ0gsSzs7cUJBRUQsTyxzQkFBVTtBQUNOLGtDQUFNLE9BQU47QUFDQSxhQUFLLEdBQUwsQ0FBUyxHQUFULE9BQWlCLGVBQWpCO0FBQ0gsSzs7Ozs7Ozs7Ozs7Ozs7QUN4Qkw7O0FBQ0E7O0FBRkE7QUFJQSxTQUFTLGlCQUFULENBQTJCLE9BQTNCLEVBQW9DO0FBQ2hDLGNBQVUsV0FBVyxFQUFyQjtBQUNBLFFBQU0sZ0JBQWlCLE9BQU8sUUFBUSxhQUFmLEtBQWlDLFVBQWxDLEdBQWdELFFBQVEsYUFBeEQsR0FBd0UsWUFBVSxDQUFFLENBQTFHO0FBQ0EsUUFBTSxnQkFBaUIsT0FBTyxRQUFRLGFBQWYsS0FBaUMsUUFBbEMsR0FBOEMsUUFBUSxhQUF0RCxHQUFzRSxFQUE1Rjs7QUFFQSxXQUFPLE1BQU0sY0FBTixDQUFxQixNQUFyQixDQUE0QjtBQUMvQixlQUFPLGlCQUFXO0FBQUE7O0FBQ2QsK0JBQ0ssV0FETCxDQUNpQiwrQkFEakIsRUFFSyxRQUZMLHFCQUVnQyxhQUZoQzs7QUFJQTs7QUFFQTs7QUFFQSx1QkFBVyxZQUFNO0FBQ2Isd0JBQ0csR0FESCxDQUNPLENBQUMsTUFBSyxtQkFBTixDQURQLEVBRUcsSUFGSCxDQUVRLE1BQUssTUFBTCxDQUFZLElBQVosT0FGUjtBQUdILGFBSkQsRUFJRyxJQUpIO0FBS0gsU0FmOEI7QUFnQi9CLGdCQUFRLGtCQUFXO0FBQ2YsbUNBQVUsY0FBVixDQUF5QjtBQUNyQixzQkFBUSxXQUFVLHFCQURHO0FBRXJCO0FBRnFCLGFBQXpCOztBQUtBLGlCQUFLLElBQUw7O0FBRUEsZ0JBQU0sTUFBTSxFQUFFLEtBQUssWUFBUCxDQUFaOztBQUVBO0FBQ0EsK0JBQU0sSUFBTixDQUFXLGVBQVgsRUFBNEIsSUFBSSxJQUFKLENBQVMsVUFBVCxDQUE1Qjs7QUFFQSxtQ0FBVSxjQUFWLENBQXlCO0FBQ3JCLHNCQUFNLFdBQVUsbUJBREs7QUFFckIseUJBQVM7QUFGWSxhQUF6Qjs7QUFLQSwrQkFDSyxRQURMLENBQ2MsZUFEZCxFQUVLLFdBRkwsQ0FFaUIsZ0JBRmpCOztBQUlBLHVCQUFXLFlBQU07QUFDYixtQ0FDSyxXQURMLENBQ2lCLGFBRGpCLEVBRUssUUFGTCxDQUVjLGlCQUZkO0FBR0gsYUFKRCxFQUlHLElBSkg7QUFLSDtBQTNDOEIsS0FBNUIsQ0FBUDtBQTZDSDs7a0JBRWMsaUI7Ozs7Ozs7OztBQ3ZEZjs7QUFFQTs7Ozs7OzBKQUhBOzs7QUFLQSxJQUFNLGNBQWMsbUJBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRUEsSUFBTSxRQUFRO0FBQ1Ysb0JBQWM7QUFESixDQUFkOzs7QUFLSSxzQkFBYztBQUFBOztBQUFBOztBQUNWLFlBQUksY0FBYyxTQUFsQjtBQUNBLFlBQUksYUFBYSxFQUFqQjs7QUFFQTtBQUNBLFVBQUUsWUFBTTtBQUNKLGtCQUFLLElBQUw7QUFDSCxTQUZEOztBQUlBLCtCQUFVLEVBQVYsQ0FBYSxNQUFNLElBQW5CLEVBQXlCLFVBQUMsS0FBRCxFQUFXO0FBQ2hDLGdCQUFJLENBQUMsT0FBTyxPQUFQLENBQWUsU0FBcEIsRUFBK0I7QUFDM0IsdUJBQU8sUUFBUCxHQUFrQixNQUFNLE9BQU4sQ0FBYyxRQUFoQztBQUNILGFBRkQsTUFFTztBQUNILDZCQUFhLE1BQU0sT0FBTixDQUFjLFVBQTNCO0FBQ0Esc0JBQU0sSUFBTixDQUFXLElBQVgsQ0FBZ0IsTUFBTSxPQUFOLENBQWMsUUFBOUI7QUFDSDtBQUNKLFNBUEQ7O0FBU0E7QUFDQSxjQUFNLElBQU4sQ0FBVyxhQUFYLEdBQTJCLFlBQVc7QUFDbEMseUJBQWMsdUJBQXVCLElBQXhCLEdBQWdDLFlBQVksWUFBWixDQUF5QixpQkFBekIsQ0FBaEMsR0FBK0UsT0FBTyxVQUFQLEtBQXNCLFFBQXRCLEdBQWlDLFVBQWpDLEdBQThDLEVBQTFJOztBQUVBLGdCQUFJLHlCQUFKOztBQUVBLG9CQUFRLFVBQVI7QUFDSTtBQUNJLHVDQUFtQixrQ0FBbkI7QUFGUjs7QUFLQSwwQkFBYyxTQUFkO0FBQ0EseUJBQWEsRUFBYjs7QUFFQSxtQkFBTyxnQkFBUDtBQUNILFNBZEQ7O0FBZ0JBLGNBQU0sVUFBTixDQUFpQixFQUFqQixDQUFvQixhQUFwQixFQUFtQyxVQUFDLFdBQUQsRUFBYyxVQUFkLEVBQTZCO0FBQzVELDBCQUFjLFdBQWQ7QUFDSCxTQUZEOztBQUlBLGNBQU0sVUFBTixDQUFpQixFQUFqQixDQUFvQixjQUFwQixFQUFvQyxVQUFDLGFBQUQsRUFBZ0IsVUFBaEIsRUFBNEIsU0FBNUIsRUFBdUMsV0FBdkMsRUFBdUQ7QUFDdkY7QUFDQSxnQkFBTSxVQUFVLFVBQVUsZ0JBQVYsQ0FBMkIsa0JBQTNCLENBQWhCOztBQUVBLGdCQUFJLG1CQUFtQixPQUFPLFFBQTlCLEVBQXdDO0FBQ3BDLG9CQUFJLElBQUksQ0FBUjtBQUNBLG9CQUFJLE1BQU0sUUFBUSxNQUFsQjtBQUNBLHVCQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNqQix5QkFBSyxRQUFRLENBQVIsRUFBVyxTQUFoQjtBQUNIO0FBQ0o7O0FBRUQ7Ozs7QUFJQTtBQUNBLGdCQUFJLE9BQU8sRUFBUCxJQUFhLHFCQUFqQixFQUEyQjtBQUN2QixtQkFBRyxNQUFILEVBQVcsVUFBWDtBQUNIO0FBQ0osU0FwQkQ7O0FBc0JBLGNBQU0sSUFBTixDQUFXLEdBQVgsQ0FBZSxjQUFmLEdBQWdDLG9CQUFoQztBQUNBLGNBQU0sSUFBTixDQUFXLEdBQVgsQ0FBZSxTQUFmLEdBQTJCLGtCQUEzQjs7QUFFQSxjQUFNLElBQU4sQ0FBVyxLQUFYO0FBQ0g7O0FBRUQ7Ozs7Ozs7cUJBS0EsSSxtQkFBTztBQUNILDJCQUFNLFFBQU4sQ0FBZSxlQUFmO0FBQ0EsMkJBQU0sV0FBTixDQUFrQixnQkFBbEI7QUFDQSxtQkFBVyxZQUFNO0FBQ2IsK0JBQU0sUUFBTixDQUFlLGlCQUFmO0FBQ0gsU0FGRCxFQUVHLElBRkg7QUFHSCxLOzs7Ozs7Ozs7Ozs7O1FDekZXLFUsR0FBQSxVO1FBUUEsYSxHQUFBLGE7UUFVQSxrQixHQUFBLGtCO1FBcUJBLFcsR0FBQSxXO1FBWUEsUSxHQUFBLFE7UUFJQSxlLEdBQUEsZTtRQVlBLE8sR0FBQSxPO1FBVUEsYyxHQUFBLGM7O0FBL0VoQjs7QUFFTyxTQUFTLFVBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsS0FBN0IsRUFBcUM7QUFDeEMsUUFBTSxRQUFRLE1BQU0sT0FBTixDQUFlLEtBQWYsQ0FBZDs7QUFFQSxRQUFLLFVBQVUsQ0FBQyxDQUFoQixFQUFvQjtBQUNoQixjQUFNLElBQU4sQ0FBWSxLQUFaO0FBQ0g7QUFDSjs7QUFFTSxTQUFTLGFBQVQsQ0FBeUIsS0FBekIsRUFBZ0MsS0FBaEMsRUFBd0M7QUFDM0MsU0FBTSxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksTUFBTSxNQUEzQixFQUFtQyxJQUFJLENBQXZDLEVBQTBDLEdBQTFDLEVBQWdEO0FBQzVDLFlBQUssTUFBTSxDQUFOLEtBQVksS0FBakIsRUFBeUI7QUFDckIsbUJBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRUQsV0FBTyxLQUFQO0FBQ0g7O0FBRU0sU0FBUyxrQkFBVCxDQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFxQztBQUN4QyxRQUFJLFVBQUo7O0FBRUEsUUFBSyxDQUFDLGlCQUFTLENBQVQsQ0FBRCxJQUFpQixDQUFDLGlCQUFTLENBQVQsQ0FBdkIsRUFBc0M7QUFDbEMsZUFBTyxLQUFQO0FBQ0g7O0FBRUQsUUFBSyxFQUFFLE1BQUYsS0FBYSxFQUFFLE1BQXBCLEVBQTZCO0FBQ3pCLGVBQU8sS0FBUDtBQUNIOztBQUVELFFBQUksRUFBRSxNQUFOO0FBQ0EsV0FBUSxHQUFSLEVBQWM7QUFDVixZQUFLLEVBQUUsQ0FBRixNQUFTLEVBQUUsQ0FBRixDQUFkLEVBQXFCO0FBQ2pCLG1CQUFPLEtBQVA7QUFDSDtBQUNKOztBQUVELFdBQU8sSUFBUDtBQUNIOztBQUVNLFNBQVMsV0FBVCxDQUF1QixDQUF2QixFQUEyQjtBQUM5QixRQUFLLE9BQU8sQ0FBUCxLQUFhLFFBQWxCLEVBQTZCO0FBQ3pCLGVBQU8sQ0FBRSxDQUFGLENBQVA7QUFDSDs7QUFFRCxRQUFLLE1BQU0sU0FBWCxFQUF1QjtBQUNuQixlQUFPLEVBQVA7QUFDSDs7QUFFRCxXQUFPLENBQVA7QUFDSDs7QUFFTSxTQUFTLFFBQVQsQ0FBb0IsS0FBcEIsRUFBNEI7QUFDL0IsV0FBTyxNQUFPLE1BQU0sTUFBTixHQUFlLENBQXRCLENBQVA7QUFDSDs7QUFFTSxTQUFTLGVBQVQsQ0FBMkIsS0FBM0IsRUFBa0MsTUFBbEMsRUFBMkM7QUFDOUMsUUFBSyxDQUFDLEtBQU4sRUFBYztBQUNWO0FBQ0g7O0FBRUQsUUFBTSxRQUFRLE1BQU0sT0FBTixDQUFlLE1BQWYsQ0FBZDs7QUFFQSxRQUFLLFVBQVUsQ0FBQyxDQUFoQixFQUFvQjtBQUNoQixjQUFNLE1BQU4sQ0FBYyxLQUFkLEVBQXFCLENBQXJCO0FBQ0g7QUFDSjs7QUFFTSxTQUFTLE9BQVQsQ0FBbUIsU0FBbkIsRUFBK0I7QUFDbEMsUUFBTSxRQUFRLEVBQWQ7QUFDQSxRQUFJLElBQUksVUFBVSxNQUFsQjtBQUNBLFdBQVEsR0FBUixFQUFjO0FBQ1YsY0FBTSxDQUFOLElBQVcsVUFBVSxDQUFWLENBQVg7QUFDSDs7QUFFRCxXQUFPLEtBQVA7QUFDSDs7QUFFTSxTQUFTLGNBQVQsQ0FBeUIsS0FBekIsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNkM7QUFDaEQsV0FBTyxNQUFNLE1BQU4sQ0FBYSxVQUFVLEdBQVYsRUFBZ0I7QUFDaEMsZUFBTyxJQUFJLEdBQUosTUFBYSxLQUFwQjtBQUNILEtBRk0sQ0FBUDtBQUdIOzs7Ozs7Ozs7a0JDbkZjLFVBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsU0FBckIsRUFBZ0M7QUFDM0MsUUFBSSxnQkFBSjtBQUNBLFdBQU8sWUFBVztBQUNkLFlBQU0sVUFBVSxJQUFoQjtBQUNBLFlBQU0sT0FBTyxTQUFiO0FBQ0EsWUFBTSxRQUFRLFNBQVIsS0FBUSxHQUFXO0FBQ3JCLHNCQUFVLElBQVY7QUFDQSxnQkFBSSxDQUFDLFNBQUwsRUFBZ0IsS0FBSyxLQUFMLENBQVcsT0FBWCxFQUFvQixJQUFwQjtBQUNuQixTQUhEO0FBSUEsWUFBTSxVQUFVLGFBQWEsQ0FBQyxPQUE5QjtBQUNBLHFCQUFhLE9BQWI7QUFDQSxrQkFBVSxXQUFXLEtBQVgsRUFBa0IsSUFBbEIsQ0FBVjtBQUNBLFlBQUksT0FBSixFQUFhLEtBQUssS0FBTCxDQUFXLE9BQVgsRUFBb0IsSUFBcEI7QUFDaEIsS0FYRDtBQVlILEM7Ozs7Ozs7O0FDZEQsSUFBTSxXQUFlLGFBQXJCO0FBQ0EsSUFBTSxlQUFlLFdBQXJCOztBQUVBLElBQU0sWUFBZSxFQUFFLFFBQUYsQ0FBckI7QUFDQSxJQUFNLFVBQWUsRUFBRSxNQUFGLENBQXJCO0FBQ0EsSUFBTSxRQUFlLEVBQUUsU0FBUyxlQUFYLEVBQTRCLFdBQTVCLENBQXdDLFdBQXhDLEVBQXFELFFBQXJELENBQThELFFBQTlELENBQXJCO0FBQ0EsSUFBTSxRQUFlLEVBQUUsU0FBUyxJQUFYLENBQXJCO0FBQ0EsSUFBTSxTQUFlLEVBQUUsbUJBQUYsQ0FBckI7O0FBRUEsSUFBTSxVQUFlLENBQUMsQ0FBQyxNQUFNLElBQU4sQ0FBVyxPQUFYLENBQXZCOztRQUVTLFEsR0FBQSxRO1FBQVUsWSxHQUFBLFk7UUFBYyxTLEdBQUEsUztRQUFXLE8sR0FBQSxPO1FBQVMsSyxHQUFBLEs7UUFBTyxLLEdBQUEsSztRQUFPLE8sR0FBQSxPO1FBQVMsTSxHQUFBLE07Ozs7Ozs7O1FDUjVELFUsR0FBQSxVO1FBWUEsWSxHQUFBLFk7UUFZQSxXLEdBQUEsVztRQTZDQSxPLEdBQUEsTztBQXhFaEI7OztBQUdPLFNBQVMsVUFBVCxDQUFvQixHQUFwQixFQUF5QjtBQUM1QixXQUFPLElBQ0YsT0FERSxDQUNNLElBRE4sRUFDWSxPQURaLEVBRUYsT0FGRSxDQUVNLElBRk4sRUFFWSxNQUZaLEVBR0YsT0FIRSxDQUdNLElBSE4sRUFHWSxNQUhaLENBQVA7QUFJSDs7QUFFRDs7Ozs7QUFLTyxTQUFTLFlBQVQsQ0FBc0IsR0FBdEIsRUFBMkI7QUFDOUIsV0FBTyxJQUNGLE9BREUsQ0FDTSxPQUROLEVBQ2UsR0FEZixFQUVGLE9BRkUsQ0FFTSxPQUZOLEVBRWUsR0FGZixFQUdGLE9BSEUsQ0FHTSxRQUhOLEVBR2dCLEdBSGhCLENBQVA7QUFJSDs7QUFFRDs7Ozs7QUFLTyxTQUFTLFdBQVQsQ0FBcUIsSUFBckIsRUFBMkI7QUFDOUI7QUFDQSxRQUFNLGFBQWEsS0FBSyxVQUF4Qjs7QUFFQTtBQUNBLFFBQU0sVUFBVSxjQUFoQjs7QUFFQTtBQUNBLFFBQU0sT0FBTyxFQUFiOztBQUVBLFNBQUssSUFBSSxDQUFULElBQWMsVUFBZCxFQUEwQjtBQUN0QixZQUFJLENBQUMsV0FBVyxDQUFYLENBQUwsRUFBb0I7QUFDaEI7QUFDSDs7QUFFRDtBQUNBLFlBQUksT0FBTyxXQUFXLENBQVgsRUFBYyxJQUF6Qjs7QUFFQTtBQUNBLFlBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUDtBQUNIOztBQUVELFlBQUksUUFBUSxLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQVo7QUFDQSxZQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1I7QUFDSDs7QUFFRDtBQUNBO0FBQ0EsYUFBSyxNQUFNLENBQU4sQ0FBTCxJQUFpQixRQUFRLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUFSLENBQWpCO0FBQ0g7O0FBRUQsV0FBTyxJQUFQO0FBQ0g7O0FBRUQsSUFBTSxTQUFTLCtCQUFmOztBQUVBOzs7Ozs7O0FBT08sU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCO0FBQzFCLFFBQUksU0FBUyxNQUFiLEVBQXFCO0FBQ2pCLGVBQU8sSUFBUDtBQUNIOztBQUVELFFBQUksU0FBUyxPQUFiLEVBQXNCO0FBQ2xCLGVBQU8sS0FBUDtBQUNIOztBQUVELFFBQUksU0FBUyxNQUFiLEVBQXFCO0FBQ2pCLGVBQU8sSUFBUDtBQUNIOztBQUVEO0FBQ0EsUUFBSSxTQUFTLENBQUMsSUFBRCxHQUFNLEVBQW5CLEVBQXVCO0FBQ25CLGVBQU8sQ0FBQyxJQUFSO0FBQ0g7O0FBRUQsUUFBSSxPQUFPLElBQVAsQ0FBYSxJQUFiLENBQUosRUFBeUI7QUFDckIsZUFBTyxLQUFLLEtBQUwsQ0FBWSxJQUFaLENBQVA7QUFDSDs7QUFFRCxXQUFPLElBQVA7QUFDSDs7Ozs7Ozs7Ozs7UUMzRmUsTyxHQUFBLE87UUFJQSxXLEdBQUEsVztRQUlBLE8sR0FBQSxPO1FBYUEsUyxHQUFBLFM7UUFJQSxRLEdBQUEsUTtRQUlBLFUsR0FBQSxVO0FBakNoQixJQUFNLFdBQVcsT0FBTyxTQUFQLENBQWlCLFFBQWxDO0FBQ0EsSUFBTSxtQkFBbUIsaUNBQXpCOztBQUVBO0FBQ08sU0FBUyxPQUFULENBQW1CLEtBQW5CLEVBQTJCO0FBQzlCLFdBQU8sU0FBUyxJQUFULENBQWUsS0FBZixNQUEyQixnQkFBbEM7QUFDSDs7QUFFTSxTQUFTLFdBQVQsQ0FBdUIsR0FBdkIsRUFBNkI7QUFDaEMsV0FBTyxpQkFBaUIsSUFBakIsQ0FBdUIsU0FBUyxJQUFULENBQWUsR0FBZixDQUF2QixDQUFQO0FBQ0g7O0FBRU0sU0FBUyxPQUFULENBQW1CLENBQW5CLEVBQXNCLENBQXRCLEVBQTBCO0FBQzdCLFFBQUssTUFBTSxJQUFOLElBQWMsTUFBTSxJQUF6QixFQUFnQztBQUM1QixlQUFPLElBQVA7QUFDSDs7QUFFRCxRQUFLLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBYixJQUF5QixRQUFPLENBQVAseUNBQU8sQ0FBUCxPQUFhLFFBQTNDLEVBQXNEO0FBQ2xELGVBQU8sS0FBUDtBQUNIOztBQUVELFdBQU8sTUFBTSxDQUFiO0FBQ0g7O0FBRUQ7QUFDTyxTQUFTLFNBQVQsQ0FBcUIsS0FBckIsRUFBNkI7QUFDaEMsV0FBTyxDQUFDLE1BQU8sV0FBWSxLQUFaLENBQVAsQ0FBRCxJQUFpQyxTQUFVLEtBQVYsQ0FBeEM7QUFDSDs7QUFFTSxTQUFTLFFBQVQsQ0FBb0IsS0FBcEIsRUFBNEI7QUFDL0IsV0FBUyxTQUFTLFNBQVMsSUFBVCxDQUFlLEtBQWYsTUFBMkIsaUJBQTdDO0FBQ0g7O0FBRU0sU0FBUyxVQUFULENBQXFCLEtBQXJCLEVBQTZCO0FBQ2hDLFFBQU0sVUFBVSxFQUFoQjtBQUNBLFdBQU8sU0FBUyxRQUFRLFFBQVIsQ0FBaUIsSUFBakIsQ0FBc0IsS0FBdEIsTUFBaUMsbUJBQWpEO0FBQ0g7Ozs7Ozs7O1FDbkJlLFEsR0FBQSxROztBQWhCaEI7O0FBRUEsSUFBSSxjQUFjLEtBQWxCLEMsQ0FIQTs7O0FBS0EsSUFBTSxXQUFXO0FBQ2IsWUFBUSxPQURLO0FBRWIsa0JBQWMsRUFGRDtBQUdiLFdBQU87QUFITSxDQUFqQjs7QUFNQTs7Ozs7O0FBTU8sU0FBUyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLE9BQTVCLEVBQXFDO0FBQ3hDLFFBQU0sV0FBVyxFQUFFLFFBQUYsRUFBakI7O0FBRUE7QUFDQSxRQUFJLG9CQUFvQixNQUFwQixJQUE4QixTQUFTLE1BQVQsR0FBa0IsQ0FBcEQsRUFBdUQ7O0FBRW5EO0FBQ0Esa0JBQVUsRUFBRSxNQUFGLENBQVMsRUFBVCxFQUFhLFFBQWIsRUFBd0IsT0FBTyxPQUFQLEtBQW1CLFdBQW5CLEdBQWlDLE9BQWpDLEdBQTJDLEVBQW5FLENBQVY7O0FBRUE7QUFDQSxZQUFJLGdCQUFnQixLQUFwQixFQUEyQjtBQUN2QiwwQkFBYyxJQUFkOztBQUVBO0FBQ0EsZ0JBQUksYUFBYSxFQUFFLFlBQUYsQ0FBakI7QUFDQSxnQkFBSSxnQkFBZ0IsQ0FBcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQUksT0FBTyxRQUFRLFVBQWYsS0FBOEIsV0FBOUIsSUFBNkMsUUFBUSxVQUFSLFlBQThCLE1BQTNFLElBQXFGLFFBQVEsVUFBUixDQUFtQixNQUFuQixHQUE0QixDQUFySCxFQUF3SDtBQUNwSCw2QkFBYSxRQUFRLFVBQXJCOztBQUVBLG9CQUFJLE9BQU8sUUFBUSxTQUFmLEtBQTZCLFdBQTdCLElBQTRDLG1CQUFVLFFBQVEsU0FBbEIsQ0FBNUMsSUFBNEUsUUFBUSxTQUFSLEtBQXNCLENBQXRHLEVBQXlHO0FBQ3JHLGdDQUFZLFFBQVEsU0FBcEI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsZ0NBQVksU0FBUyxRQUFULEdBQW9CLEdBQXBCLEdBQTBCLFFBQVEsWUFBOUM7QUFDSDtBQUNKLGFBUkQsTUFRTztBQUNILG9CQUFJLE9BQU8sUUFBUSxTQUFmLEtBQTZCLFdBQTdCLElBQTRDLG1CQUFVLFFBQVEsU0FBbEIsQ0FBNUMsSUFBNEUsUUFBUSxTQUFSLEtBQXNCLENBQXRHLEVBQXlHO0FBQ3JHLGdDQUFZLFFBQVEsU0FBcEI7QUFDSCxpQkFGRCxNQUVPO0FBQ0gsZ0NBQVksU0FBUyxNQUFULEdBQWtCLEdBQWxCLEdBQXdCLFFBQVEsWUFBNUM7QUFDSDtBQUNKOztBQUVELHVCQUFXLE9BQVgsQ0FBbUI7QUFDZiwyQkFBVztBQURJLGFBQW5CLEVBRUcsUUFBUSxLQUZYLEVBRWtCLFFBQVEsTUFGMUIsRUFFa0MsWUFBVztBQUN6Qyw4QkFBYyxLQUFkO0FBQ0EseUJBQVMsT0FBVDtBQUNILGFBTEQ7QUFNSDtBQUNKOztBQUVELFdBQU8sU0FBUyxPQUFULEVBQVA7QUFDSDs7Ozs7Ozs7OztBQzlERDs7QUFDQTs7QUFDQTs7QUFFQSxJQUFNLFlBQVk7QUFDZCxZQUFRLEVBRE07QUFFZCxhQUFTO0FBRkssQ0FBbEIsQyxDQUxBOzs7QUFVQSxJQUFNLFVBQVUsQ0FDWixhQURZLEVBRVosZ0JBRlksQ0FBaEI7O0FBS0EsSUFBTSxTQUFTLENBQ1gsU0FEVyxFQUVYLFFBRlcsQ0FBZjs7QUFLQSxJQUFNLFNBQVMsSUFBZjs7QUFFQSxJQUFJLE9BQU8sQ0FBWDs7QUFFQTtBQUNBLHVCQUFVLEVBQVYsQ0FBYSxrQkFBYixFQUFpQyxVQUFTLEtBQVQsRUFBZ0I7QUFDN0MsUUFBSSxTQUFTLE1BQWIsRUFBcUI7QUFDakIseUJBQWlCLFFBQWpCO0FBQ0gsS0FGRCxNQUVPO0FBQ0gseUJBQWlCLFNBQWpCO0FBQ0g7QUFDSixDQU5EOztBQVFBOzs7Ozs7QUFNQSxTQUFTLFdBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsT0FBN0IsRUFBc0M7QUFDbEMsUUFBSSxXQUFXLFFBQVEsUUFBUixJQUFvQixFQUFuQzs7QUFFQSxRQUFJLENBQUMsb0JBQVcsUUFBWCxDQUFMLEVBQTJCO0FBQ3ZCLGdCQUFRLElBQVIsQ0FBYSw0QkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIOztBQUVELFFBQUksUUFBUSxTQUFTLE1BQXJCOztBQUVBLGNBQVUsS0FBVixFQUFpQixJQUFqQixDQUFzQjtBQUNsQixlQUFPLEtBRFc7QUFFbEIsa0JBQVU7QUFGUSxLQUF0Qjs7QUFLQSxXQUFPLEtBQVA7QUFDSDs7QUFFRDs7Ozs7O0FBTUEsU0FBUyxjQUFULENBQXlCLEtBQXpCLEVBQWdDLE9BQWhDLEVBQXlDO0FBQ3JDLFFBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7O0FBRUEsUUFBSSxPQUFPLEtBQVAsS0FBa0IsV0FBbEIsSUFBaUMsVUFBVSxFQUEvQyxFQUFtRDtBQUMvQyxnQkFBUSxJQUFSLENBQWEsK0JBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDs7QUFFRCxRQUFJLFFBQVEsMkJBQWUsVUFBVSxLQUFWLENBQWYsRUFBaUMsT0FBakMsRUFBMEMsS0FBMUMsRUFBaUQsQ0FBakQsQ0FBWjs7QUFFQTtBQUNBOztBQUVBLFFBQUksT0FBTyxLQUFQLEtBQWtCLFdBQXRCLEVBQW1DO0FBQy9CLG9DQUFnQixVQUFVLEtBQVYsQ0FBaEIsRUFBa0MsS0FBbEM7QUFDQSxlQUFPLElBQVA7QUFDSCxLQUhELE1BR087QUFDSCxnQkFBUSxJQUFSLENBQWEsNkJBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNKOztBQUVEOzs7O0FBSUEsU0FBUyxnQkFBVCxDQUEyQixLQUEzQixFQUFrQztBQUM5QixRQUFJLGdCQUFnQixVQUFVLEtBQVYsQ0FBcEI7QUFDQSxRQUFJLElBQUksQ0FBUjtBQUNBLFFBQUksTUFBTSxjQUFjLE1BQXhCOztBQUVBLFdBQU8sSUFBSSxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCO0FBQ2pCLHNCQUFjLENBQWQsRUFBaUIsUUFBakI7QUFDSDtBQUNKOztBQUVEOzs7OztBQUtBLFNBQVMsYUFBVCxDQUF3QixPQUF4QixFQUFpQztBQUM3QixRQUFJLFNBQVMsUUFBUSxNQUFSLElBQWtCLEVBQS9CO0FBQ0EsUUFBSSxRQUFRLFFBQVEsS0FBUixJQUFpQixFQUE3QjtBQUNBLFFBQUksWUFBSjs7QUFFQTtBQUNBLFFBQUksQ0FBQywwQkFBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUwsRUFBcUM7QUFDakMsZ0JBQVEsSUFBUixDQUFhLHVCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUMsMEJBQWMsTUFBZCxFQUFzQixLQUF0QixDQUFMLEVBQW1DO0FBQy9CLGdCQUFRLElBQVIsQ0FBYSxzQkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIOztBQUVEO0FBQ0EsUUFBSSxXQUFXLGFBQWYsRUFBOEI7QUFDMUIsY0FBTSxZQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBTjtBQUNILEtBRkQsTUFFTyxJQUFJLFdBQVcsZ0JBQWYsRUFBaUM7QUFDcEMsY0FBTSxlQUFlLEtBQWYsRUFBc0IsT0FBdEIsQ0FBTjtBQUNIOztBQUVELFdBQU8sR0FBUDtBQUNIOztRQUVRLGEsR0FBQSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRiYXJiYSB9IGZyb20gJy4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgZ2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xuXG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL3V0aWxzL2FycmF5JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWxzL2lzJztcblxuLy8gQmFzaWMgbW9kdWxlc1xuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdBcHAnO1xuY29uc3QgRVZFTlRfTkFNRVNQQUNFID0gYCR7QVBQX05BTUV9LiR7TU9EVUxFX05BTUV9YDtcblxuZXhwb3J0IGNvbnN0IEVWRU5UID0ge1xuICAgIElOSVRfTU9EVUxFUzogYGluaXRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgSU5JVF9TQ09QRURfTU9EVUxFUzogYGluaXRTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWAsXG4gICAgREVMRVRFX1NDT1BFRF9NT0RVTEVTOiBgZGVsZXRlU2NvcGVkTW9kdWxlcy4ke0VWRU5UX05BTUVTUEFDRX1gXG59O1xuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULklOSVRfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRHbG9iYWxzKGV2ZW50LmZpcnN0Qmxvb2QpXG4gICAgICAgICAgICAgICAgLmRlbGV0ZU1vZHVsZXMoZXZlbnQpXG4gICAgICAgICAgICAgICAgLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULklOSVRfU0NPUEVEX01PRFVMRVMsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFVkVOVC5ERUxFVEVfU0NPUEVEX01PRFVMRVMsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kZWxldGVNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbGwgZXhpc3RpbmcgbW9kdWxlcyBvciBhIHNwZWNpZmljIHNjb3BlIG9mIG1vZHVsZXNcbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgZGVsZXRlTW9kdWxlcyhldmVudCkge1xuICAgICAgICBsZXQgZGVzdHJveUFsbCA9IHRydWU7XG4gICAgICAgIGxldCBtb2R1bGVJZHMgPSBbXTtcblxuICAgICAgICAvLyBDaGVjayBmb3Igc2NvcGUgZmlyc3RcbiAgICAgICAgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gTW9kdWxlcyB3aXRoaW4gc2NvcGVcbiAgICAgICAgICAgIGNvbnN0ICRtb2R1bGVzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcblxuICAgICAgICAgICAgLy8gRGV0ZXJtaW5lIHRoZWlyIHVpZHNcbiAgICAgICAgICAgIG1vZHVsZUlkcyA9ICQubWFrZUFycmF5KCRtb2R1bGVzLm1hcChmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkbW9kdWxlcy5lcShpbmRleCkuZGF0YSgndWlkJyk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgICAgIGlmIChtb2R1bGVJZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGRlc3Ryb3lBbGwgPSBmYWxzZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIG1vZHVsZXMgYW5kIGRlc3Ryb3lpbmcgYWxsIG9mIHRoZW0sIG9yIHNwZWNpZmljIG9uZXNcbiAgICAgICAgbGV0IGkgPSB0aGlzLmN1cnJlbnRNb2R1bGVzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoZGVzdHJveUFsbCB8fCBhcnJheUNvbnRhaW5zKG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbUFycmF5KG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMuc3BsaWNlKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuICAgICAqIEFsbG93cyB5b3UgdG8gaW5pdGlhbGl6ZSBnbG9iYWwgbW9kdWxlcyBvbmx5IG9uY2UgaWYgeW91IG5lZWRcbiAgICAgKiAoZXguOiB3aGVuIHVzaW5nIEJhcmJhLmpzIG9yIFNtb290aFN0YXRlLmpzKVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgZ2xvYmFscyhmaXJzdEJsb29kKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdE1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgLy8gRWxlbWVudHMgd2l0aCBtb2R1bGVcbiAgICAgICAgbGV0ICRtb2R1bGVFbHMgPSBbXTtcblxuICAgICAgICAvLyBJZiBmaXJzdCBibG9vZCwgbG9hZCBhbGwgbW9kdWxlcyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIElmIHNjb3BlZCwgcmVuZGVyIGVsZW1lbnRzIHdpdGggbW9kdWxlc1xuICAgICAgICAvLyBJZiBCYXJiYSwgbG9hZCBtb2R1bGVzIGNvbnRhaW5lZCBpbiBCYXJiYSBjb250YWluZXJcbiAgICAgICAgaWYgKGV2ZW50LmZpcnN0Qmxvb2QpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkZG9jdW1lbnQuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9IGV2ZW50LiRzY29wZS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaXNCYXJiYSkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRiYXJiYS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWxlbWVudHNcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICBjb25zdCBlbHNMZW4gPSAkbW9kdWxlRWxzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudFxuICAgICAgICAgICAgbGV0IGVsID0gJG1vZHVsZUVsc1tpXTtcblxuICAgICAgICAgICAgLy8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGdldE5vZGVEYXRhKGVsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG4gICAgICAgICAgICBvcHRpb25zLmVsID0gZWw7XG4gICAgICAgICAgICBvcHRpb25zLiRlbCA9ICRtb2R1bGVFbHMuZXEoaSk7XG5cbiAgICAgICAgICAgIC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcbiAgICAgICAgICAgIGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cbiAgICAgICAgICAgIC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuICAgICAgICAgICAgbGV0IG1vZHVsZUlkZW50cyA9IGF0dHIuc3BsaXQoL1ssXFxzXSsvZyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXNMZW4gPSBtb2R1bGVJZGVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKDsgaiA8IG1vZHVsZXNMZW47IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGUuaW5pdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLy8gSUlGRSBmb3IgbG9hZGluZyB0aGUgYXBwbGljYXRpb25cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4oZnVuY3Rpb24oKSB7XG4gICAgbmV3IEFwcCgpO1xuICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgIHR5cGU6IEVWRU5ULklOSVRfTU9EVUxFUyxcbiAgICAgICAgZmlyc3RCbG9vZDogdHJ1ZVxuICAgIH0pO1xufSkoKTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBUcmFuc2l0aW9uTWFuYWdlciBmcm9tICcuL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZmlyc3RCbG9vZCkge1xuICAgIHN2ZzRldmVyeWJvZHkoKTtcblxuICAgIGlmIChmaXJzdEJsb29kKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYW5hZ2VyID0gbmV3IFRyYW5zaXRpb25NYW5hZ2VyKCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IHtkZWZhdWx0IGFzIEV4YW1wbGV9IGZyb20gJy4vbW9kdWxlcy9FeGFtcGxlJztcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmxldCB1aWQgPSAwO1xuXG4vKipcbiAqIEFic3RyYWN0IE1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZWwgID0gb3B0aW9ucy5lbCAgfHwgbnVsbDtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBtb2R1bGUgaWRlbnRpZmllclxuICAgICAgICB0aGlzLnVpZCA9ICdtLScgKyB1aWQrKztcbiAgICAgICAgLy8gVXNlIGpRdWVyeSdzIGRhdGEgQVBJIHRvIFwic3RvcmUgaXQgaW4gdGhlIERPTVwiXG4gICAgICAgIHRoaXMuJGVsLmRhdGEoJ3VpZCcsIHRoaXMudWlkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge31cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGlmICh0aGlzLiRlbCkge1xuICAgICAgICAgICAgdGhpcy4kZWwucmVtb3ZlRGF0YSgndWlkJylcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdFeGFtcGxlJztcbmNvbnN0IEVWRU5UX05BTUVTUEFDRSA9IGAke0FQUF9OQU1FfS4ke01PRFVMRV9OQU1FfWA7XG5cbmNvbnN0IEVWRU5UID0ge1xuICAgIENMSUNLOiBgY2xpY2suJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICAvLyBEZWNsYXJhdGlvbiBvZiBwcm9wZXJ0aWVzXG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgLy8gU2V0IGV2ZW50cyBhbmQgc3VjaFxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kZWwub2ZmKGAuJHtFVkVOVF9OQU1FU1BBQ0V9YCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJGh0bWwsICRiYXJiYSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IEVWRU5UIGFzIEFQUF9FVkVOVCB9IGZyb20gJy4uL0FwcCc7XG5cbmZ1bmN0aW9uIERlZmF1bHRUcmFuc2l0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBjb25zdCBzdGFydENhbGxiYWNrID0gKHR5cGVvZiBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgPT09ICdmdW5jdGlvbicpID8gb3B0aW9ucy5zdGFydENhbGxiYWNrIDogZnVuY3Rpb24oKXt9O1xuICAgIGNvbnN0IG92ZXJyaWRlQ2xhc3MgPSAodHlwZW9mIG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA9PT0gJ3N0cmluZycpID8gb3B0aW9ucy5vdmVycmlkZUNsYXNzIDogJyc7XG5cbiAgICByZXR1cm4gQmFyYmEuQmFzZVRyYW5zaXRpb24uZXh0ZW5kKHtcbiAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkZWQgZG9tLWlzLWFuaW1hdGVkJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoYGRvbS1pcy1sb2FkaW5nICR7b3ZlcnJpZGVDbGFzc31gKTtcblxuICAgICAgICAgICAgc3RhcnRDYWxsYmFjaygpO1xuXG4gICAgICAgICAgICAvKiBDbG9zZSBhbnkgb3ZlcmxheXMgKi9cblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgLmFsbChbdGhpcy5uZXdDb250YWluZXJMb2FkaW5nXSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHRoaXMuZmluaXNoLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGZpbmlzaDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICAgQVBQX0VWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICAgICAkc2NvcGU6ICRiYXJiYVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZG9uZSgpO1xuXG4gICAgICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMubmV3Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0ZW1wbGF0ZSBuYW1lIG9mIHRoZSBuZXcgY29udGFpbmVyIGFuZCBzZXQgaXQgdG8gdGhlIERPTVxuICAgICAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsICRlbC5kYXRhKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBBUFBfRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgICAgICBpc0JhcmJhOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG92ZXJyaWRlQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWFuaW1hdGVkJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0VHJhbnNpdGlvbjtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRodG1sLCBpc0RlYnVnIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgRGVmYXVsdFRyYW5zaXRpb24gZnJvbSAnLi9EZWZhdWx0VHJhbnNpdGlvbic7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ1RyYW5zaXRpb25NYW5hZ2VyJztcbmNvbnN0IEVWRU5UX05BTUVTUEFDRSA9IGAke0FQUF9OQU1FfS4ke01PRFVMRV9OQU1FfWA7XG5cbmNvbnN0IEVWRU5UID0ge1xuICAgIEdPVE86IGBnb3RvLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgbGV0IGNsaWNrZWRMaW5rID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgdHJhbnNpdGlvbiA9ICcnO1xuXG4gICAgICAgIC8vIGpRdWVyeSBvbmRvbXJlYWR5XG4gICAgICAgICQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkKClcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULkdPVE8sIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBldmVudC5vcHRpb25zLmxvY2F0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uID0gZXZlbnQub3B0aW9ucy50cmFuc2l0aW9uO1xuICAgICAgICAgICAgICAgIEJhcmJhLlBqYXguZ29UbyhldmVudC5vcHRpb25zLmxvY2F0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmaW5lIGRpZmZlcmVudCBwYWdlIHRyYW5zaXRpb25zXG4gICAgICAgIEJhcmJhLlBqYXguZ2V0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IChjbGlja2VkTGluayBpbnN0YW5jZW9mIE5vZGUpID8gY2xpY2tlZExpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zaXRpb24nKSA6ICh0eXBlb2YgdHJhbnNpdGlvbiA9PT0gJ3N0cmluZycgPyB0cmFuc2l0aW9uIDogJycpO1xuXG4gICAgICAgICAgICBsZXQgVHJhbnNpdGlvbk9iamVjdDtcblxuICAgICAgICAgICAgc3dpdGNoICh0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgVHJhbnNpdGlvbk9iamVjdCA9IERlZmF1bHRUcmFuc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaWNrZWRMaW5rID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdHJhbnNpdGlvbiA9ICcnO1xuXG4gICAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvbk9iamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIEJhcmJhLkRpc3BhdGNoZXIub24oJ2xpbmtDbGlja2VkJywgKEhUTUxFbGVtZW50LCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjbGlja2VkTGluayA9IEhUTUxFbGVtZW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCduZXdQYWdlUmVhZHknLCAoY3VycmVudFN0YXR1cywgcHJldlN0YXR1cywgY29udGFpbmVyLCBjdXJyZW50SFRNTCkgPT4ge1xuICAgICAgICAgICAgLy8gRmV0Y2ggYW55IGlubGluZSBzY3JpcHQgZWxlbWVudHMuXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdC5qcy1pbmxpbmUnKTtcblxuICAgICAgICAgICAgaWYgKHNjcmlwdHMgaW5zdGFuY2VvZiB3aW5kb3cuTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHNjcmlwdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4ZWN1dGUgYW55IHRoaXJkIHBhcnR5IGZlYXR1cmVzLlxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIC8vIEdvb2dsZSBBbmFseXRpY3NcbiAgICAgICAgICAgIGlmICh3aW5kb3cuZ2EgJiYgIWlzRGVidWcpIHtcbiAgICAgICAgICAgICAgICBnYSgnc2VuZCcsICdwYWdldmlldycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5QamF4LkRvbS5jb250YWluZXJDbGFzcyA9ICdqcy1iYXJiYS1jb250YWluZXInO1xuICAgICAgICBCYXJiYS5QamF4LkRvbS53cmFwcGVySWQgPSAnanMtYmFyYmEtd3JhcHBlcic7XG5cbiAgICAgICAgQmFyYmEuUGpheC5zdGFydCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERPTSBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCAxMDAwKVxuICAgIH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG4gICAgaWYgKCBpbmRleCA9PT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnB1c2goIHZhbHVlICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG4gICAgICAgIGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG4gICAgbGV0IGk7XG5cbiAgICBpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcbiAgICBpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIFsgeCBdO1xuICAgIH1cblxuICAgIGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuICAgIHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcbiAgICBpZiAoICFhcnJheSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cbiAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBsZXQgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgICBsZXQgdGltZW91dDtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBjb25zdCBsYXRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH07XG59XG4iLCJjb25zdCBBUFBfTkFNRSAgICAgPSAnQm9pbGVycGxhdGUnO1xuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG5cbmNvbnN0ICRkb2N1bWVudCAgICA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyAgICAgID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLnJlbW92ZUNsYXNzKCdoYXMtbm8tanMnKS5hZGRDbGFzcygnaGFzLWpzJyk7XG5jb25zdCAkYm9keSAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpO1xuY29uc3QgJGJhcmJhICAgICAgID0gJCgnI2pzLWJhcmJhLXdyYXBwZXInKTtcblxuY29uc3QgaXNEZWJ1ZyAgICAgID0gISEkaHRtbC5kYXRhKCdkZWJ1ZycpO1xuXG5leHBvcnQgeyBBUFBfTkFNRSwgREFUQV9BUElfS0VZLCAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgaXNEZWJ1ZywgJGJhcmJhIH07XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAgIC8vIFJlZ2V4IFBhdHRlcm5cbiAgICBjb25zdCBwYXR0ZXJuID0gL15kYXRhXFwtKC4rKSQvO1xuXG4gICAgLy8gT3V0cHV0XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1tpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zLlxuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuICAgICAgICAvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cbiAgICAgICAgZGF0YVttYXRjaFsxXV0gPSBnZXREYXRhKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuY29uc3QgcmJyYWNlID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvO1xuXG4vKipcbiAqIFBhcnNlIHZhbHVlIHRvIGRhdGEgdHlwZS5cbiAqXG4gKiBAbGluayAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvMy4xLjEvc3JjL2RhdGEuanNcbiAqIEBwYXJhbSAge3N0cmluZ30gZGF0YSAtIEEgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge21peGVkfSAgUmV0dXJucyB0aGUgdmFsdWUgaW4gaXRzIG5hdHVyYWwgZGF0YSB0eXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdudWxsJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGNvbnZlcnQgdG8gYSBudW1iZXIgaWYgaXQgZG9lc24ndCBjaGFuZ2UgdGhlIHN0cmluZ1xuICAgIGlmIChkYXRhID09PSArZGF0YSsnJykge1xuICAgICAgICByZXR1cm4gK2RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHJicmFjZS50ZXN0KCBkYXRhICkpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsImNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcbiAgICByZXR1cm4gYXJyYXlMaWtlUGF0dGVybi50ZXN0KCB0b1N0cmluZy5jYWxsKCBvYmogKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbCAoIGEsIGIgKSB7XG4gICAgaWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBhID09PSBiO1xufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgyL3ZhbGlkYXRlLW51bWJlcnMtaW4tamF2YXNjcmlwdC1pc251bWVyaWNcbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMgKCB0aGluZyApIHtcbiAgICByZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuICAgIHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcbiAgICBjb25zdCBnZXRUeXBlID0ge307XG4gICAgcmV0dXJuIHRoaW5nICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuL2lzJ1xuXG5sZXQgaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgIGhlYWRlck9mZnNldDogNjAsXG4gICAgc3BlZWQ6IDMwMFxufTtcblxuLyoqXG4gKiBzY3JvbGxUbyBpcyBhIGZ1bmN0aW9uIHRoYXQgc2Nyb2xscyBhIGNvbnRhaW5lciB0byBhbiBlbGVtZW50J3MgcG9zaXRpb24gd2l0aGluIHRoYXQgY29udHJvbGxlclxuICogVXNlcyBqUXVlcnkncyAkLkRlZmVycmVkIHRvIGFsbG93IHVzaW5nIGEgY2FsbGJhY2sgb24gYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAkZWxlbWVudCAgQSBqUXVlcnkgbm9kZVxuICogQHBhcmFtICAge29iamVjdH0gIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAvLyBEcm9wIGV2ZXJ5dGhpbmcgaWYgdGhpcyBhaW4ndCBhIGpRdWVyeSBvYmplY3RcbiAgICBpZiAoJGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkgJiYgJGVsZW1lbnQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIC8vIE1lcmdpbmcgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9KSk7XG5cbiAgICAgICAgLy8gUHJldmVudHMgYWNjdW11bGF0aW9uIG9mIGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlzQW5pbWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNvbnRhaW5lciB0aGF0IHdlJ2xsIGJlIHNjcm9sbGluZ1xuICAgICAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKCdodG1sLCBib2R5Jyk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudE9mZnNldCA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRlc3RpbmcgY29udGFpbmVyIGluIG9wdGlvbnMgZm9yIGpRdWVyeS1uZXNzXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBub3QgdXNpbmcgYSBjdXN0b20gY29udGFpbmVyLCB3ZSB0YWtlIHRoZSB0b3AgZG9jdW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUsIHdlIHVzZSB0aGUgZWxlbWVudHMgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLiRjb250YWluZXIgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuJGNvbnRhaW5lciBpbnN0YW5jZW9mIGpRdWVyeSAmJiBvcHRpb25zLiRjb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSBvcHRpb25zLiRjb250YWluZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5wb3NpdGlvbigpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gICAgICAgICAgICB9LCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmVhc2luZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pcyc7XG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCBmaW5kQnlLZXlWYWx1ZSwgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG4gICAgaGlkZGVuOiBbXSxcbiAgICB2aXNpYmxlOiBbXVxufTtcblxuY29uc3QgQUNUSU9OUyA9IFtcbiAgICAnYWRkQ2FsbGJhY2snLFxuICAgICdyZW1vdmVDYWxsYmFjaydcbl07XG5cbmNvbnN0IFNUQVRFUyA9IFtcbiAgICAndmlzaWJsZScsXG4gICAgJ2hpZGRlbidcbl07XG5cbmNvbnN0IFBSRUZJWCA9ICd2LSc7XG5cbmxldCBVVUlEID0gMDtcblxuLy8gTWFpbiBldmVudFxuJGRvY3VtZW50Lm9uKCd2aXNpYmlsaXR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ3Zpc2libGUnKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBZGQgYSBjYWxsYmFja1xuICogQHBhcmFtIHtzdHJpbmd9ICAgc3RhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICBpZGVudFxuICovXG5mdW5jdGlvbiBhZGRDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8ICcnO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaWRlbnQgPSBQUkVGSVggKyBVVUlEKys7XG5cbiAgICBDQUxMQkFDS1Nbc3RhdGVdLnB1c2goe1xuICAgICAgICBpZGVudDogaWRlbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlkZW50O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgaWRlbnQgIFVuaXF1ZSBpZGVudGlmaWVyXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIElmIG9wZXJhdGlvbiB3YXMgYSBzdWNjZXNzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBpZGVudCA9IG9wdGlvbnMuaWRlbnQgfHwgJyc7XG5cbiAgICBpZiAodHlwZW9mKGlkZW50KSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWRlbnQgPT09ICcnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTmVlZCBpZGVudCB0byByZW1vdmUgY2FsbGJhY2snKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IGZpbmRCeUtleVZhbHVlKENBTExCQUNLU1tzdGF0ZV0sICdpZGVudCcsIGlkZW50KVswXTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlkZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKENBTExCQUNLU1tzdGF0ZV0pXG5cbiAgICBpZiAodHlwZW9mKGluZGV4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVtb3ZlRnJvbUFycmF5KENBTExCQUNLU1tzdGF0ZV0sIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBXaGVuIGRvY3VtZW50IHN0YXRlIGNoYW5nZXMsIHRyaWdnZXIgY2FsbGJhY2tzXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqL1xuZnVuY3Rpb24gb25Eb2N1bWVudENoYW5nZSAoc3RhdGUpIHtcbiAgICBsZXQgY2FsbGJhY2tBcnJheSA9IENBTExCQUNLU1tzdGF0ZV07XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW4gPSBjYWxsYmFja0FycmF5Lmxlbmd0aDtcblxuICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2tBcnJheVtpXS5jYWxsYmFjaygpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgZmFjaW5nIEFQSSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBjYWxsYmFja3NcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAgICAgICAgICBvcHRpb25zICBPcHRpb25zXG4gKiBAcmV0dXJuICB7Ym9vbGVhbnxpbnRlZ2VyfSAgICAgICAgICAgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjYWxsYmFjayBvciBib29sZWFuIGluZGljYXRpbmcgc3VjY2VzcyBvciBmYWlsdXJlXG4gKi9cbmZ1bmN0aW9uIHZpc2liaWxpdHlBcGkgKG9wdGlvbnMpIHtcbiAgICBsZXQgYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gfHwgJyc7XG4gICAgbGV0IHN0YXRlID0gb3B0aW9ucy5zdGF0ZSB8fCAnJztcbiAgICBsZXQgcmV0O1xuXG4gICAgLy8gVHlwZSBhbmQgdmFsdWUgY2hlY2tpbmdcbiAgICBpZiAoIWFycmF5Q29udGFpbnMoQUNUSU9OUywgYWN0aW9uKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0FjdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghYXJyYXlDb250YWlucyhTVEFURVMsIHN0YXRlKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1N0YXRlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBNYWdpYyBjYWxsIGZ1bmN0aW9uIHBsc1xuICAgIGlmIChhY3Rpb24gPT09ICdhZGRDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gYWRkQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAncmVtb3ZlQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IHJlbW92ZUNhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyB2aXNpYmlsaXR5QXBpIH07XG4iXX0=
