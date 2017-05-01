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
        type: 'initModules.App',
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

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


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
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":4}],6:[function(require,module,exports){
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

},{"../utils/environment":10}],7:[function(require,module,exports){
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

        Barba.Dispatcher.on('linkClicked', function (HTMLElement) {
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
        });

        Barba.Dispatcher.on('transitionCompleted', function (currentStatus, prevStatus) {
            //Update google analytics viewing page with changeUrlTracker (autotrack)
            if (!_environment.isDebug) {
                ga('send', 'pageview');
            }
        });

        Barba.Pjax.Dom.containerClass = 'js-barba-container';
        Barba.Pjax.Dom.wrapperId = 'js-barba-wrapper';

        Barba.Pjax.start();
    }

    /**
     * Init Google Analytics and init plugin(s) of autotrack
     *
     * @return {void}
     */


    _class.prototype.initAutotrack = function initAutotrack() {
        ga('create', 'UA-XXXXXXXX-X', 'auto');
        ga('require', 'urlChangeTracker');
        ga('send', 'pageview');
    };

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

        if (!_environment.isDebug) {
            //Init autotrack - google analytics
            this.initAutotrack();
        }
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
var APP_NAME = 'boilerplate';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFFQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUdBOztJQUFZLE87Ozs7OzswSkFWWjs7O0FBU0E7OztJQUdNLEc7QUFDRixtQkFBYztBQUFBOztBQUFBOztBQUNWLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLGNBQUwsR0FBc0IsRUFBdEI7O0FBRUEsK0JBQVUsRUFBVixDQUFhLGlCQUFiLEVBQWdDLFVBQUMsS0FBRCxFQUFXO0FBQ3ZDLGtCQUFLLFdBQUwsQ0FBaUIsTUFBTSxVQUF2QixFQUNLLGFBREwsQ0FDbUIsS0FEbkIsRUFFSyxXQUZMLENBRWlCLEtBRmpCO0FBR0gsU0FKRDs7QUFNQSwrQkFBVSxFQUFWLENBQWEsdUJB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QUNBLFFBQUksQ0FBQywwQkFBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUwsRUFBcUM7QUFDakMsZ0JBQVEsSUFBUixDQUFhLHVCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFDRCxRQUFJLENBQUMsMEJBQWMsTUFBZCxFQUFzQixLQUF0QixDQUFMLEVBQW1DO0FBQy9CLGdCQUFRLElBQVIsQ0FBYSxzQkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIOztBQUVEO0FBQ0EsUUFBSSxXQUFXLGFBQWYsRUFBOEI7QUFDMUIsY0FBTSxZQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBTjtBQUNILEtBRkQsTUFFTyxJQUFJLFdBQVcsZ0JBQWYsRUFBaUM7QUFDcEMsY0FBTSxlQUFlLEtBQWYsRUFBc0IsT0FBdEIsQ0FBTjtBQUNIOztBQUVELFdBQU8sR0FBUDtBQUNIOztRQUVRLGEsR0FBQSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCB9IGZyb20gJy4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5pbXBvcnQgZ2xvYmFscyBmcm9tICcuL2dsb2JhbHMnO1xuXG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL3V0aWxzL2FycmF5JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWxzL2lzJztcblxuLy8gQmFzaWMgbW9kdWxlc1xuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnO1xuXG5jbGFzcyBBcHAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKCdpbml0TW9kdWxlcy5BcHAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoZXZlbnQuZmlyc3RCbG9vZClcbiAgICAgICAgICAgICAgICAuZGVsZXRlTW9kdWxlcyhldmVudClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oJ2luaXRTY29wZWRNb2R1bGVzLkFwcCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0TW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignZGVsZXRlU2NvcGVkTW9kdWxlcy5BcHAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlTW9kdWxlcyhldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERlc3Ryb3kgYWxsIGV4aXN0aW5nIG1vZHVsZXMgb3IgYSBzcGVjaWZpYyBzY29wZSBvZiBtb2R1bGVzXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBldmVudCBUaGUgZXZlbnQgYmVpbmcgdHJpZ2dlcmVkLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGRlbGV0ZU1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgbGV0IGRlc3Ryb3lBbGwgPSB0cnVlO1xuICAgICAgICBsZXQgbW9kdWxlSWRzID0gW107XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIHNjb3BlIGZpcnN0XG4gICAgICAgIGlmIChldmVudC4kc2NvcGUgaW5zdGFuY2VvZiBqUXVlcnkgJiYgZXZlbnQuJHNjb3BlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIE1vZHVsZXMgd2l0aGluIHNjb3BlXG4gICAgICAgICAgICBjb25zdCAkbW9kdWxlcyA9IGV2ZW50LiRzY29wZS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG5cbiAgICAgICAgICAgIC8vIERldGVybWluZSB0aGVpciB1aWRzXG4gICAgICAgICAgICBtb2R1bGVJZHMgPSAkLm1ha2VBcnJheSgkbW9kdWxlcy5tYXAoZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJG1vZHVsZXMuZXEoaW5kZXgpLmRhdGEoJ3VpZCcpO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICBpZiAobW9kdWxlSWRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBkZXN0cm95QWxsID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBMb29wIG1vZHVsZXMgYW5kIGRlc3Ryb3lpbmcgYWxsIG9mIHRoZW0sIG9yIHNwZWNpZmljIG9uZXNcbiAgICAgICAgbGV0IGkgPSB0aGlzLmN1cnJlbnRNb2R1bGVzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAoZGVzdHJveUFsbCB8fCBhcnJheUNvbnRhaW5zKG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpKSB7XG4gICAgICAgICAgICAgICAgcmVtb3ZlRnJvbUFycmF5KG1vZHVsZUlkcywgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS51aWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMuc3BsaWNlKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuICAgICAqIEFsbG93cyB5b3UgdG8gaW5pdGlhbGl6ZSBnbG9iYWwgbW9kdWxlcyBvbmx5IG9uY2UgaWYgeW91IG5lZWRcbiAgICAgKiAoZXguOiB3aGVuIHVzaW5nIEJhcmJhLmpzIG9yIFNtb290aFN0YXRlLmpzKVxuICAgICAqIEByZXR1cm4ge09iamVjdH0gU2VsZiAoYWxsb3dzIGNoYWluaW5nKVxuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgZ2xvYmFscyhmaXJzdEJsb29kKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IGV2ZW50IFRoZSBldmVudCBiZWluZyB0cmlnZ2VyZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSAgICAgICBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdE1vZHVsZXMoZXZlbnQpIHtcbiAgICAgICAgLy8gRWxlbWVudHMgd2l0aCBtb2R1bGVcbiAgICAgICAgbGV0ICRtb2R1bGVFbHMgPSBbXTtcblxuICAgICAgICAvLyBJZiBmaXJzdCBibG9vZCwgbG9hZCBhbGwgbW9kdWxlcyBpbiB0aGUgRE9NXG4gICAgICAgIC8vIElmIHNjb3BlZCwgcmVuZGVyIGVsZW1lbnRzIHdpdGggbW9kdWxlc1xuICAgICAgICAvLyBJZiBCYXJiYSwgbG9hZCBtb2R1bGVzIGNvbnRhaW5lZCBpbiBCYXJiYSBjb250YWluZXJcbiAgICAgICAgaWYgKGV2ZW50LmZpcnN0Qmxvb2QpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkZG9jdW1lbnQuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LiRzY29wZSBpbnN0YW5jZW9mIGpRdWVyeSAmJiBldmVudC4kc2NvcGUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9IGV2ZW50LiRzY29wZS5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuaXNCYXJiYSkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICQoJyNqcy1iYXJiYS13cmFwcGVyJykuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgY29uc3QgZWxzTGVuID0gJG1vZHVsZUVscy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBlbCA9ICRtb2R1bGVFbHNbaV07XG5cbiAgICAgICAgICAgIC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBnZXROb2RlRGF0YShlbCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBqUXVlcnkgZWxlbWVudFxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkbW9kdWxlRWxzLmVxKGkpO1xuXG4gICAgICAgICAgICAvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgICAgICAgICAvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnNwbGl0KC8sXFxzKnxcXHMrL2cpO1xuXG4gICAgICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUlkZW50c1tqXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8vIElJRkUgZm9yIGxvYWRpbmcgdGhlIGFwcGxpY2F0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKCkge1xuICAgIG5ldyBBcHAoKTtcbiAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICB0eXBlOiAnaW5pdE1vZHVsZXMuQXBwJyxcbiAgICAgICAgZmlyc3RCbG9vZDogdHJ1ZVxuICAgIH0pO1xufSkoKTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBUcmFuc2l0aW9uTWFuYWdlciBmcm9tICcuL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZmlyc3RCbG9vZCkge1xuICAgIHN2ZzRldmVyeWJvZHkoKTtcblxuICAgIGlmIChmaXJzdEJsb29kKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25NYW5hZ2VyID0gbmV3IFRyYW5zaXRpb25NYW5hZ2VyKCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IHtkZWZhdWx0IGFzIEV4YW1wbGV9IGZyb20gJy4vbW9kdWxlcy9FeGFtcGxlJztcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmxldCB1aWQgPSAwO1xuXG4vKipcbiAqIEFic3RyYWN0IE1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzc1xue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXG4gICAge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZWwgID0gb3B0aW9ucy5lbCAgfHwgbnVsbDtcblxuICAgICAgICAvLyBHZW5lcmF0ZSBhIHVuaXF1ZSBtb2R1bGUgaWRlbnRpZmllclxuICAgICAgICB0aGlzLnVpZCA9ICdtLScgKyB1aWQrKztcbiAgICAgICAgLy8gVXNlIGpRdWVyeSdzIGRhdGEgQVBJIHRvIFwic3RvcmUgaXQgaW4gdGhlIERPTVwiXG4gICAgICAgIHRoaXMuJGVsLmRhdGEoJ3VpZCcsIHRoaXMudWlkKTtcbiAgICB9XG5cbiAgICBpbml0KCkge31cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5yZW1vdmVEYXRhKCd1aWQnKVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIC8vIERlY2xhcmF0aW9uIG9mIHByb3BlcnRpZXNcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICAvLyBTZXQgZXZlbnRzIGFuZCBzdWNoXG4gICAgfVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICBzdXBlci5kZXN0cm95KCk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkaHRtbCB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuZnVuY3Rpb24gRGVmYXVsdFRyYW5zaXRpb24ob3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IHN0YXJ0Q2FsbGJhY2sgPSAodHlwZW9mIG9wdGlvbnMuc3RhcnRDYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgPyBvcHRpb25zLnN0YXJ0Q2FsbGJhY2sgOiBmdW5jdGlvbigpe307XG4gICAgY29uc3Qgb3ZlcnJpZGVDbGFzcyA9ICh0eXBlb2Ygb3B0aW9ucy5vdmVycmlkZUNsYXNzID09PSAnc3RyaW5nJykgPyBvcHRpb25zLm92ZXJyaWRlQ2xhc3MgOiAnJztcblxuICAgIHJldHVybiBCYXJiYS5CYXNlVHJhbnNpdGlvbi5leHRlbmQoe1xuICAgICAgICBzdGFydDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkaHRtbFxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRlZCBkb20taXMtYW5pbWF0ZWQnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyhgZG9tLWlzLWxvYWRpbmcgJHtvdmVycmlkZUNsYXNzfWApO1xuXG4gICAgICAgICAgICBzdGFydENhbGxiYWNrKCk7XG5cbiAgICAgICAgICAgIC8qIENsb3NlIGFueSBvdmVybGF5cyAqL1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBQcm9taXNlXG4gICAgICAgICAgICAgICAgICAuYWxsKFt0aGlzLm5ld0NvbnRhaW5lckxvYWRpbmddKVxuICAgICAgICAgICAgICAgICAgLnRoZW4odGhpcy5maW5pc2guYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmluaXNoOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuZG9uZSgpO1xuXG4gICAgICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMubmV3Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0ZW1wbGF0ZSBuYW1lIG9mIHRoZSBuZXcgY29udGFpbmVyIGFuZCBzZXQgaXQgdG8gdGhlIERPTVxuICAgICAgICAgICAgJGh0bWwuYXR0cignZGF0YS10ZW1wbGF0ZScsICRlbC5kYXRhKCd0ZW1wbGF0ZScpKTtcblxuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaW5pdE1vZHVsZXMuQXBwJyxcbiAgICAgICAgICAgICAgICBpc0JhcmJhOiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG92ZXJyaWRlQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWFuaW1hdGVkJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0VHJhbnNpdGlvbjtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJGh0bWwsIGlzRGVidWcgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBEZWZhdWx0VHJhbnNpdGlvbiBmcm9tICcuL0RlZmF1bHRUcmFuc2l0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBsZXQgY2xpY2tlZExpbmsgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCB0cmFuc2l0aW9uID0gJyc7XG5cbiAgICAgICAgLy8galF1ZXJ5IG9uZG9tcmVhZHlcbiAgICAgICAgJCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKCdnb1RvLlBhZ2VUcmFuc2l0aW9uTWFuYWdlcicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24gPSBldmVudC5vcHRpb25zLmxvY2F0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uID0gZXZlbnQub3B0aW9ucy50cmFuc2l0aW9uO1xuICAgICAgICAgICAgICAgIEJhcmJhLlBqYXguZ29UbyhldmVudC5vcHRpb25zLmxvY2F0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gRGVmaW5lIGRpZmZlcmVudCBwYWdlIHRyYW5zaXRpb25zXG4gICAgICAgIEJhcmJhLlBqYXguZ2V0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IChjbGlja2VkTGluayBpbnN0YW5jZW9mIE5vZGUpID8gY2xpY2tlZExpbmsuZ2V0QXR0cmlidXRlKCdkYXRhLXRyYW5zaXRpb24nKSA6ICh0eXBlb2YgdHJhbnNpdGlvbiA9PT0gJ3N0cmluZycgPyB0cmFuc2l0aW9uIDogJycpO1xuXG4gICAgICAgICAgICBsZXQgVHJhbnNpdGlvbk9iamVjdDtcblxuICAgICAgICAgICAgc3dpdGNoICh0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgVHJhbnNpdGlvbk9iamVjdCA9IERlZmF1bHRUcmFuc2l0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsaWNrZWRMaW5rID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdHJhbnNpdGlvbiA9ICcnO1xuXG4gICAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvbk9iamVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgIEJhcmJhLkRpc3BhdGNoZXIub24oJ2xpbmtDbGlja2VkJywgKEhUTUxFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBjbGlja2VkTGluayA9IEhUTUxFbGVtZW50O1xuICAgICAgICB9KTtcblxuICAgICAgICBCYXJiYS5EaXNwYXRjaGVyLm9uKCduZXdQYWdlUmVhZHknLCAoY3VycmVudFN0YXR1cywgcHJldlN0YXR1cywgY29udGFpbmVyLCBjdXJyZW50SFRNTCkgPT4ge1xuICAgICAgICAgICAgLy8gRmV0Y2ggYW55IGlubGluZSBzY3JpcHQgZWxlbWVudHMuXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdC5qcy1pbmxpbmUnKTtcblxuICAgICAgICAgICAgaWYgKHNjcmlwdHMgaW5zdGFuY2VvZiB3aW5kb3cuTm9kZUxpc3QpIHtcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICAgICAgbGV0IGxlbiA9IHNjcmlwdHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZXZhbChzY3JpcHRzW2ldLmlubmVySFRNTCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIEV4ZWN1dGUgYW55IHRoaXJkIHBhcnR5IGZlYXR1cmVzLlxuICAgICAgICAgICAgICovXG4gICAgICAgIH0pO1xuXG4gICAgICAgIEJhcmJhLkRpc3BhdGNoZXIub24oJ3RyYW5zaXRpb25Db21wbGV0ZWQnLCAoY3VycmVudFN0YXR1cywgcHJldlN0YXR1cykgPT4ge1xuICAgICAgICAgICAgLy9VcGRhdGUgZ29vZ2xlIGFuYWx5dGljcyB2aWV3aW5nIHBhZ2Ugd2l0aCBjaGFuZ2VVcmxUcmFja2VyIChhdXRvdHJhY2spXG4gICAgICAgICAgICBpZighaXNEZWJ1Zyl7XG4gICAgICAgICAgICAgICAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgQmFyYmEuUGpheC5Eb20uY29udGFpbmVyQ2xhc3MgPSAnanMtYmFyYmEtY29udGFpbmVyJztcbiAgICAgICAgQmFyYmEuUGpheC5Eb20ud3JhcHBlcklkID0gJ2pzLWJhcmJhLXdyYXBwZXInO1xuXG4gICAgICAgIEJhcmJhLlBqYXguc3RhcnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IEdvb2dsZSBBbmFseXRpY3MgYW5kIGluaXQgcGx1Z2luKHMpIG9mIGF1dG90cmFja1xuICAgICAqXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBpbml0QXV0b3RyYWNrKCl7XG4gICAgICAgZ2EoJ2NyZWF0ZScsICdVQS1YWFhYWFhYWC1YJywgJ2F1dG8nKTtcbiAgICAgICBnYSgncmVxdWlyZScsICd1cmxDaGFuZ2VUcmFja2VyJyk7XG4gICAgICAgZ2EoJ3NlbmQnLCAncGFnZXZpZXcnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBET00gaXMgbG9hZGVkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvYWQoKSB7XG4gICAgICAgICRodG1sLmFkZENsYXNzKCdkb20taXMtbG9hZGVkJyk7XG4gICAgICAgICRodG1sLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGluZycpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICRodG1sLmFkZENsYXNzKCdkb20taXMtYW5pbWF0ZWQnKTtcbiAgICAgICAgfSwgMTAwMCk7XG5cbiAgICAgICAgaWYoIWlzRGVidWcpe1xuICAgICAgICAgICAgLy9Jbml0IGF1dG90cmFjayAtIGdvb2dsZSBhbmFseXRpY3NcbiAgICAgICAgICAgIHRoaXMuaW5pdEF1dG90cmFjaygpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9BcnJheSAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIHZhbHVlICk7XG5cbiAgICBpZiAoIGluZGV4ID09PSAtMSApIHtcbiAgICAgICAgYXJyYXkucHVzaCggdmFsdWUgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuICAgIGZvciAoIGxldCBpID0gMCwgYyA9IGFycmF5Lmxlbmd0aDsgaSA8IGM7IGkrKyApIHtcbiAgICAgICAgaWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250ZW50c01hdGNoICggYSwgYiApIHtcbiAgICBsZXQgaTtcblxuICAgIGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBhLmxlbmd0aCAhPT0gYi5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpID0gYS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGlmICggYVtpXSAhPT0gYltpXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuICAgIGlmICggdHlwZW9mIHggPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4gWyB4IF07XG4gICAgfVxuXG4gICAgaWYgKCB4ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG4gICAgcmV0dXJuIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tQXJyYXkgKCBhcnJheSwgbWVtYmVyICkge1xuICAgIGlmICggIWFycmF5ICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICBhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheSAoIGFycmF5TGlrZSApIHtcbiAgICBjb25zdCBhcnJheSA9IFtdO1xuICAgIGxldCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJ5S2V5VmFsdWUoIGFycmF5LCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldID09PSB2YWx1ZTtcbiAgICB9KTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZ1bmMsIHdhaXQsIGltbWVkaWF0ZSkge1xuICAgIGxldCB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgIGNvbnN0IGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghaW1tZWRpYXRlKSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcbiAgICAgICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbn1cbiIsImNvbnN0IEFQUF9OQU1FICAgICA9ICdib2lsZXJwbGF0ZSc7XG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJztcblxuY29uc3QgJGRvY3VtZW50ICAgID0gJChkb2N1bWVudCk7XG5jb25zdCAkd2luZG93ICAgICAgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCAgICAgICAgPSAkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkucmVtb3ZlQ2xhc3MoJ2hhcy1uby1qcycpLmFkZENsYXNzKCdoYXMtanMnKTtcbmNvbnN0ICRib2R5ICAgICAgICA9ICQoZG9jdW1lbnQuYm9keSk7XG5cbmNvbnN0IGlzRGVidWcgICAgICA9ICEhJGh0bWwuZGF0YSgnZGVidWcnKTtcblxuZXhwb3J0IHsgQVBQX05BTUUsIERBVEFfQVBJX0tFWSwgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHksIGlzRGVidWcgfTtcbiIsIi8qKlxuICogQHNlZSAgaHR0cHM6Ly9naXRodWIuY29tL3JhY3RpdmVqcy9yYWN0aXZlL2Jsb2IvZGV2L3NyYy91dGlscy9odG1sLmpzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyYvZywgJyZhbXA7JylcbiAgICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xufVxuXG4vKipcbiAqIFByZXBhcmUgSFRNTCBjb250ZW50IHRoYXQgY29udGFpbnMgbXVzdGFjaGUgY2hhcmFjdGVycyBmb3IgdXNlIHdpdGggUmFjdGl2ZVxuICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mbHQ7L2csICc8JylcbiAgICAgICAgLnJlcGxhY2UoLyZndDsvZywgJz4nKVxuICAgICAgICAucmVwbGFjZSgvJmFtcDsvZywgJyYnKTtcbn1cblxuLyoqXG4gKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHtET01FbGVtZW50fSAgbm9kZVxuICogQHJldHVybiAge0FycmF5fSAgICAgICBkYXRhXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROb2RlRGF0YShub2RlKSB7XG4gICAgLy8gQWxsIGF0dHJpYnV0ZXNcbiAgICBjb25zdCBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gUmVnZXggUGF0dGVyblxuICAgIGNvbnN0IHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICBmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgaWYgKCFhdHRyaWJ1dGVzW2ldKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuICAgICAgICBsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuICAgICAgICAvLyBUaGlzIGhhcHBlbnMuXG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuICAgICAgICBpZiAoIW1hdGNoKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG4gICAgICAgIC8vIHNlcmlvdXMgcHJvYmxlbXMgaW4geW91ciBIVE1MLlxuICAgICAgICBkYXRhW21hdGNoWzFdXSA9IGdldERhdGEobm9kZS5nZXRBdHRyaWJ1dGUobmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5jb25zdCByYnJhY2UgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC87XG5cbi8qKlxuICogUGFyc2UgdmFsdWUgdG8gZGF0YSB0eXBlLlxuICpcbiAqIEBsaW5rICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8zLjEuMS9zcmMvZGF0YS5qc1xuICogQHBhcmFtICB7c3RyaW5nfSBkYXRhIC0gQSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7bWl4ZWR9ICBSZXR1cm5zIHRoZSB2YWx1ZSBpbiBpdHMgbmF0dXJhbCBkYXRhIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE9ubHkgY29udmVydCB0byBhIG51bWJlciBpZiBpdCBkb2Vzbid0IGNoYW5nZSB0aGUgc3RyaW5nXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhKycnKSB7XG4gICAgICAgIHJldHVybiArZGF0YTtcbiAgICB9XG5cbiAgICBpZiAocmJyYWNlLnRlc3QoIGRhdGEgKSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSggZGF0YSApO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwiY29uc3QgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuY29uc3QgYXJyYXlMaWtlUGF0dGVybiA9IC9eXFxbb2JqZWN0ICg/OkFycmF5fEZpbGVMaXN0KVxcXSQvO1xuXG4vLyB0aGFua3MsIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2luc3RhbmNlb2YtY29uc2lkZXJlZC1oYXJtZnVsLW9yLWhvdy10by13cml0ZS1hLXJvYnVzdC1pc2FycmF5L1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKCB0aGluZyApIHtcbiAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXlMaWtlICggb2JqICkge1xuICAgIHJldHVybiBhcnJheUxpa2VQYXR0ZXJuLnRlc3QoIHRvU3RyaW5nLmNhbGwoIG9iaiApICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VxdWFsICggYSwgYiApIHtcbiAgICBpZiAoIGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgYSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIGIgPT09ICdvYmplY3QnICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgPT09IGI7XG59XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODIvdmFsaWRhdGUtbnVtYmVycy1pbi1qYXZhc2NyaXB0LWlzbnVtZXJpY1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyAoIHRoaW5nICkge1xuICAgIHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQoIHRoaW5nICkgKSAmJiBpc0Zpbml0ZSggdGhpbmcgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICggdGhpbmcgJiYgdG9TdHJpbmcuY2FsbCggdGhpbmcgKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRnVuY3Rpb24oIHRoaW5nICkge1xuICAgIGNvbnN0IGdldFR5cGUgPSB7fTtcbiAgICByZXR1cm4gdGhpbmcgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKHRoaW5nKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4vaXMnXG5cbmxldCBpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5jb25zdCBkZWZhdWx0cyA9IHtcbiAgICBlYXNpbmc6ICdzd2luZycsXG4gICAgaGVhZGVyT2Zmc2V0OiA2MCxcbiAgICBzcGVlZDogMzAwXG59O1xuXG4vKipcbiAqIHNjcm9sbFRvIGlzIGEgZnVuY3Rpb24gdGhhdCBzY3JvbGxzIGEgY29udGFpbmVyIHRvIGFuIGVsZW1lbnQncyBwb3NpdGlvbiB3aXRoaW4gdGhhdCBjb250cm9sbGVyXG4gKiBVc2VzIGpRdWVyeSdzICQuRGVmZXJyZWQgdG8gYWxsb3cgdXNpbmcgYSBjYWxsYmFjayBvbiBhbmltYXRpb24gY29tcGxldGlvblxuICogQHBhcmFtICAge29iamVjdH0gICRlbGVtZW50ICBBIGpRdWVyeSBub2RlXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG8oJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgIC8vIERyb3AgZXZlcnl0aGluZyBpZiB0aGlzIGFpbid0IGEgalF1ZXJ5IG9iamVjdFxuICAgIGlmICgkZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkZWxlbWVudC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgLy8gTWVyZ2luZyBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge30pKTtcblxuICAgICAgICAvLyBQcmV2ZW50cyBhY2N1bXVsYXRpb24gb2YgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaXNBbmltYXRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY29udGFpbmVyIHRoYXQgd2UnbGwgYmUgc2Nyb2xsaW5nXG4gICAgICAgICAgICBsZXQgJGNvbnRhaW5lciA9ICQoJ2h0bWwsIGJvZHknKTtcbiAgICAgICAgICAgIGxldCBlbGVtZW50T2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgLy8gVGVzdGluZyBjb250YWluZXIgaW4gb3B0aW9ucyBmb3IgalF1ZXJ5LW5lc3NcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCB1c2luZyBhIGN1c3RvbSBjb250YWluZXIsIHdlIHRha2UgdGhlIHRvcCBkb2N1bWVudCBvZmZzZXRcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSwgd2UgdXNlIHRoZSBlbGVtZW50cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuJGNvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy4kY29udGFpbmVyIGluc3RhbmNlb2YgalF1ZXJ5ICYmIG9wdGlvbnMuJGNvbnRhaW5lci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9IG9wdGlvbnMuJGNvbnRhaW5lcjtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zY3JvbGxUb3AgIT09ICd1bmRlZmluZWQnICYmIGlzTnVtZXJpYyhvcHRpb25zLnNjcm9sbFRvcCkgJiYgb3B0aW9ucy5zY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gb3B0aW9ucy5zY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfSBlbHNlwqB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICRlbGVtZW50LnBvc2l0aW9uKCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5vZmZzZXQoKS50b3AgLSBvcHRpb25zLmhlYWRlck9mZnNldDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb3BcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuZWFzaW5nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzJztcbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIGZpbmRCeUtleVZhbHVlLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL2FycmF5JztcbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IENBTExCQUNLUyA9IHtcbiAgICBoaWRkZW46IFtdLFxuICAgIHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuICAgICdhZGRDYWxsYmFjaycsXG4gICAgJ3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuICAgICd2aXNpYmxlJyxcbiAgICAnaGlkZGVuJ1xuXTtcblxuY29uc3QgUFJFRklYID0gJ3YtJztcblxubGV0IFVVSUQgPSAwO1xuXG4vLyBNYWluIGV2ZW50XG4kZG9jdW1lbnQub24oJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgndmlzaWJsZScpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpZGVudCA9IFBSRUZJWCArIFVVSUQrKztcblxuICAgIENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG4gICAgICAgIGlkZW50OiBpZGVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSk7XG5cbiAgICByZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuICAgIGlmICh0eXBlb2YoaWRlbnQpID09PSAndW5kZWZpbmVkJyB8fCBpZGVudCA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gZmluZEJ5S2V5VmFsdWUoQ0FMTEJBQ0tTW3N0YXRlXSwgJ2lkZW50JywgaWRlbnQpWzBdO1xuXG4gICAgLy8gY29uc29sZS5sb2coaWRlbnQpXG4gICAgLy8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuICAgIGlmICh0eXBlb2YoaW5kZXgpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuICAgIGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuICAgIGxldCBhY3Rpb24gPSBvcHRpb25zLmFjdGlvbiB8fCAnJztcbiAgICBsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuICAgIGxldCByZXQ7XG5cbiAgICAvLyBUeXBlIGFuZCB2YWx1ZSBjaGVja2luZ1xuICAgIGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQWN0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU3RhdGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG4gICAgaWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuICAgICAgICByZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCB7IHZpc2liaWxpdHlBcGkgfTtcbiJdfQ==
