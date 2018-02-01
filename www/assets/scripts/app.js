(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EVENT = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


// Basic modules


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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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


    _createClass(App, [{
        key: 'deleteModules',
        value: function deleteModules(event) {
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
        }

        /**
         * Execute global functions and settings
         * Allows you to initialize global modules only once if you need
         * (ex.: when using Barba.js or SmoothState.js)
         * @return {Object} Self (allows chaining)
         */

    }, {
        key: 'initGlobals',
        value: function initGlobals(firstBlood) {
            (0, _globals2.default)(firstBlood);
            return this;
        }

        /**
         * Find modules and initialize them
         * @param  {Object} event The event being triggered.
         * @return {Object}       Self (allows chaining)
         */

    }, {
        key: 'initModules',
        value: function initModules(event) {
            // Elements with module
            var $moduleEls = [];

            // If first blood, load all modules in the DOM
            // If scoped, render elements with modules
            // If Barba, load modules contained in Barba container
            if (event.firstBlood) {
                $moduleEls = _environment.$document.find('[data-module]');
            } else if (event.$scope instanceof jQuery && event.$scope.length > 0) {
                $moduleEls = event.$scope.find('[data-module]');
            } else if (event.isPjax) {
                $moduleEls = _environment.$pjaxWrapper.find('[data-module]');
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
        }
    }]);

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

},{"./globals":2,"./modules":3,"./utils/array":9,"./utils/environment":11,"./utils/html":12,"./utils/is":13}],2:[function(require,module,exports){
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

    _createClass(_class, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'destroy',
        value: function destroy() {
            if (this.$el) {
                this.$el.removeData('uid');
            }
        }
    }]);

    return _class;
}();

exports.default = _class;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

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

        // Declaration of properties
        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, options));

        console.log('🔨 [module]:constructor - Example');

        return _this;
    }

    _createClass(_class, [{
        key: 'init',
        value: function init() {
            // Set events and such

        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log('❌ [module]:destroy - Example');
            _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), 'destroy', this).call(this);
            this.$el.off('.' + EVENT_NAMESPACE);
        }
    }]);

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":11,"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
    function _class(wrapper) {
        _classCallCheck(this, _class);

        this.wrapper = wrapper;
    }

    _createClass(_class, [{
        key: 'launch',
        value: function launch(e) {
            console.log("---- Launch transition 👊 -----");
        }
    }, {
        key: 'hideView',
        value: function hideView(view) {
            console.log('----- ❌ [VIEW]:remove - ', view.getAttribute('data-template'));
            view.remove();
        }
    }, {
        key: 'displayView',
        value: function displayView(view) {
            console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
            this.wrapper.innerHTML = view.outerHTML;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            console.log("---- destroy transition ❌ -----");
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../utils/environment":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


//List here all of your transitions


var _environment = require('../utils/environment');

var _App = require('../App');

var _DefaultTransition = require('./DefaultTransition');

var _DefaultTransition2 = _interopRequireDefault(_DefaultTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODULE_NAME = 'TransitionManager';
var EVENT_NAMESPACE = _environment.APP_NAME + '.' + MODULE_NAME;

/*

@todo : 

- get data-transition on clicked link -> launch() and add switch(){}
- add goto listener
- add newPageReady functon with google analytics send
- add overrideClass system for all transitions
- add base class manager like old DefaultTransition (dom-is-loaded, dom-is-loading etc..)

*/

var EVENT = {
    GOTO: 'goto.' + EVENT_NAMESPACE
};

var _class = function () {
    function _class() {
        var _this = this;

        _classCallCheck(this, _class);

        // jQuery ondomready
        $(function () {
            _this.load();
        });

        this.transition;

        this.containerClass = '.js-pjax-container';
        this.wrapperId = 'js-pjax-wrapper';
        this.noPjaxRequestClass = 'no-transition';
        this.wrapper = document.getElementById(this.wrapperId);

        this.options = {
            debug: false,
            elements: ['a:not(.' + this.noPjaxRequestClass + ')', 'form[action]'],
            selectors: ['title', '' + this.containerClass],
            switches: {}
        };

        this.options.switches[this.containerClass] = function (oldEl, newEl, options) {
            return _this.switch(oldEl, newEl, options);
        };

        this.pjax = new Pjax(this.options);

        document.addEventListener('pjax:send', function (e) {
            return _this.send(e);
        });
        document.addEventListener('pjax:success', function (e) {
            return _this.success(e);
        });
    }

    _createClass(_class, [{
        key: 'send',
        value: function send(e) {
            console.log("---- Launch request 🙌 -----");

            //by default, but need to be manage by data-transiton on currentTarget
            this.transition = new _DefaultTransition2.default(this.wrapper);

            this.transition.launch();
        }
    }, {
        key: 'switch',
        value: function _switch(oldEl, newEl, options) {

            console.log('---- Next view loaded 👌 -----');

            _environment.$document.triggerHandler({
                type: _App.EVENT.DELETE_SCOPED_MODULES,
                $scope: _environment.$pjaxWrapper
            });

            this.transition.hideView(oldEl);
            this.transition.displayView(newEl);

            _environment.$document.triggerHandler({
                type: _App.EVENT.INIT_SCOPED_MODULES,
                isPjax: true
            });
        }
    }, {
        key: 'success',
        value: function success(e) {
            this.transition.destroy();
        }

        /**
         * DOM is loaded
         *
         * @return {void}
         */

    }, {
        key: 'load',
        value: function load() {
            _environment.$html.addClass('dom-is-loaded');
            _environment.$html.removeClass('dom-is-loading');
            setTimeout(function () {
                _environment.$html.addClass('dom-is-animated');
            }, 1000);
        }
    }]);

    return _class;
}();

exports.default = _class;

},{"../App":1,"../utils/environment":11,"./DefaultTransition":6}],8:[function(require,module,exports){
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
                $scope: _environment.$pjaxWrapper
            });

            this.done();

            var $el = $(this.newContainer);

            // Get the template name of the new container and set it to the DOM
            _environment.$html.attr('data-template', $el.data('template'));

            _environment.$document.triggerHandler({
                type: _App.EVENT.INIT_SCOPED_MODULES,
                isPjax: true
            });

            _environment.$html.addClass('dom-is-loaded').removeClass('dom-is-loading');

            setTimeout(function () {
                _environment.$html.removeClass(overrideClass).addClass('dom-is-animated');
            }, 1000);
        }
    });
}

exports.default = DefaultTransition;

},{"../App":1,"../utils/environment":11}],9:[function(require,module,exports){
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
exports.cloneArray = cloneArray;

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

function cloneArray(array) {
    return JSON.parse(JSON.stringify(array));
}

},{"./is":13}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
var $pjaxWrapper = $('#js-pjax-wrapper');

var isDebug = !!$html.data('debug');

exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;
exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.isDebug = isDebug;
exports.$pjaxWrapper = $pjaxWrapper;

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{"./is":13}],15:[function(require,module,exports){
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

},{"./array":9,"./environment":11,"./is":13}]},{},[1,2,3,4,5,8,7,9,10,11,12,13,14,15])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0V4YW1wbGUuanMiLCJhc3NldHMvc2NyaXB0cy90cmFuc2l0aW9ucy9EZWZhdWx0VHJhbnNpdGlvbi5qcyIsImFzc2V0cy9zY3JpcHRzL3RyYW5zaXRpb25zL1RyYW5zaXRpb25NYW5hZ2VyLmpzIiwiYXNzZXRzL3NjcmlwdHMvdHJhbnNpdGlvbnMvX0RlZmF1bHRUcmFuc2l0aW9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9kZWJvdW5jZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztxakJDQUE7OztBQVNBOzs7QUFSQTs7QUFFQTs7OztBQUVBOztBQUNBOztBQUNBOztBQUdBOztJQUFZLE87Ozs7Ozs7O0FBRVosSUFBTSxjQUFjLEtBQXBCO0FBQ0EsSUFBTSxnREFBaUMsV0FBdkM7O0FBRU8sSUFBTSx3QkFBUTtBQUNqQixtQ0FBNkIsZUFEWjtBQUVqQixnREFBMEMsZUFGekI7QUFHakIsb0RBQThDO0FBSDdCLENBQWQ7O0lBTUQsRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFB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Q0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFdBQVcsYUFBZixFQUE4QjtBQUMxQixjQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUNwQyxjQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgQVBQX05BTUUsICRkb2N1bWVudCwgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vZ2xvYmFscyc7XG5cbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbHMvYXJyYXknO1xuaW1wb3J0IHsgZ2V0Tm9kZURhdGEgfSBmcm9tICcuL3V0aWxzL2h0bWwnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbHMvaXMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNvbnN0IE1PRFVMRV9OQU1FID0gJ0FwcCc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5leHBvcnQgY29uc3QgRVZFTlQgPSB7XG4gICAgSU5JVF9NT0RVTEVTOiBgaW5pdE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBJTklUX1NDT1BFRF9NT0RVTEVTOiBgaW5pdFNjb3BlZE1vZHVsZXMuJHtFVkVOVF9OQU1FU1BBQ0V9YCxcbiAgICBERUxFVEVfU0NPUEVEX01PRFVMRVM6IGBkZWxldGVTY29wZWRNb2R1bGVzLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9NT0RVTEVTLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdEdsb2JhbHMoZXZlbnQuZmlyc3RCbG9vZClcbiAgICAgICAgICAgICAgICAuZGVsZXRlTW9kdWxlcyhldmVudClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkZG9jdW1lbnQub24oRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRNb2R1bGVzKGV2ZW50KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEVWRU5ULkRFTEVURV9TQ09QRURfTU9EVUxFUywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU1vZHVsZXMoZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFsbCBleGlzdGluZyBtb2R1bGVzIG9yIGEgc3BlY2lmaWMgc2NvcGUgb2YgbW9kdWxlc1xuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKGV2ZW50KSB7XG4gICAgICAgIGxldCBkZXN0cm95QWxsID0gdHJ1ZTtcbiAgICAgICAgbGV0IG1vZHVsZUlkcyA9IFtdO1xuXG4gICAgICAgIC8vIENoZWNrIGZvciBzY29wZSBmaXJzdFxuICAgICAgICBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBNb2R1bGVzIHdpdGhpbiBzY29wZVxuICAgICAgICAgICAgY29uc3QgJG1vZHVsZXMgPSBldmVudC4kc2NvcGUuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgICAgICAvLyBEZXRlcm1pbmUgdGhlaXIgdWlkc1xuICAgICAgICAgICAgbW9kdWxlSWRzID0gJC5tYWtlQXJyYXkoJG1vZHVsZXMubWFwKGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRtb2R1bGVzLmVxKGluZGV4KS5kYXRhKCd1aWQnKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgaWYgKG1vZHVsZUlkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZGVzdHJveUFsbCA9IGZhbHNlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExvb3AgbW9kdWxlcyBhbmQgZGVzdHJveWluZyBhbGwgb2YgdGhlbSwgb3Igc3BlY2lmaWMgb25lc1xuICAgICAgICBsZXQgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChkZXN0cm95QWxsIHx8IGFycmF5Q29udGFpbnMobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCkpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVGcm9tQXJyYXkobW9kdWxlSWRzLCB0aGlzLmN1cnJlbnRNb2R1bGVzW2ldLnVpZCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBTZWxmIChhbGxvd3MgY2hhaW5pbmcpXG4gICAgICovXG4gICAgaW5pdEdsb2JhbHMoZmlyc3RCbG9vZCkge1xuICAgICAgICBnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuICAgICAqIEBwYXJhbSAge09iamVjdH0gZXZlbnQgVGhlIGV2ZW50IGJlaW5nIHRyaWdnZXJlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgIFNlbGYgKGFsbG93cyBjaGFpbmluZylcbiAgICAgKi9cbiAgICBpbml0TW9kdWxlcyhldmVudCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICBsZXQgJG1vZHVsZUVscyA9IFtdO1xuXG4gICAgICAgIC8vIElmIGZpcnN0IGJsb29kLCBsb2FkIGFsbCBtb2R1bGVzIGluIHRoZSBET01cbiAgICAgICAgLy8gSWYgc2NvcGVkLCByZW5kZXIgZWxlbWVudHMgd2l0aCBtb2R1bGVzXG4gICAgICAgIC8vIElmIEJhcmJhLCBsb2FkIG1vZHVsZXMgY29udGFpbmVkIGluIEJhcmJhIGNvbnRhaW5lclxuICAgICAgICBpZiAoZXZlbnQuZmlyc3RCbG9vZCkge1xuICAgICAgICAgICAgJG1vZHVsZUVscyA9ICRkb2N1bWVudC5maW5kKCdbZGF0YS1tb2R1bGVdJyk7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQuJHNjb3BlIGluc3RhbmNlb2YgalF1ZXJ5ICYmIGV2ZW50LiRzY29wZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkbW9kdWxlRWxzID0gZXZlbnQuJHNjb3BlLmZpbmQoJ1tkYXRhLW1vZHVsZV0nKTtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC5pc1BqYXgpIHtcbiAgICAgICAgICAgICRtb2R1bGVFbHMgPSAkcGpheFdyYXBwZXIuZmluZCgnW2RhdGEtbW9kdWxlXScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgY29uc3QgZWxzTGVuID0gJG1vZHVsZUVscy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBlbCA9ICRtb2R1bGVFbHNbaV07XG5cbiAgICAgICAgICAgIC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBnZXROb2RlRGF0YShlbCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBqUXVlcnkgZWxlbWVudFxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkbW9kdWxlRWxzLmVxKGkpO1xuXG4gICAgICAgICAgICAvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgICAgICAgICAvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnNwbGl0KC9bLFxcc10rL2cpO1xuXG4gICAgICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUlkZW50c1tqXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlLmluaXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8vIElJRkUgZm9yIGxvYWRpbmcgdGhlIGFwcGxpY2F0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKCkge1xuICAgIG5ldyBBcHAoKTtcbiAgICAkZG9jdW1lbnQudHJpZ2dlckhhbmRsZXIoe1xuICAgICAgICB0eXBlOiBFVkVOVC5JTklUX01PRFVMRVMsXG4gICAgICAgIGZpcnN0Qmxvb2Q6IHRydWVcbiAgICB9KTtcbn0pKCk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgVHJhbnNpdGlvbk1hbmFnZXIgZnJvbSAnLi90cmFuc2l0aW9ucy9UcmFuc2l0aW9uTWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGZpcnN0Qmxvb2QpIHtcbiAgICBzdmc0ZXZlcnlib2R5KCk7XG5cbiAgICBpZiAoZmlyc3RCbG9vZCkge1xuICAgICAgICBjb25zdCB0cmFuc2l0aW9uTWFuYWdlciA9IG5ldyBUcmFuc2l0aW9uTWFuYWdlcigpO1xuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBFeGFtcGxlfSBmcm9tICcuL21vZHVsZXMvRXhhbXBsZSc7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5sZXQgdWlkID0gMDtcblxuLyoqXG4gKiBBYnN0cmFjdCBNb2R1bGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy4kZWwgPSBvcHRpb25zLiRlbCB8fCBudWxsO1xuICAgICAgICB0aGlzLmVsICA9IG9wdGlvbnMuZWwgIHx8IG51bGw7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgYSB1bmlxdWUgbW9kdWxlIGlkZW50aWZpZXJcbiAgICAgICAgdGhpcy51aWQgPSAnbS0nICsgdWlkKys7XG4gICAgICAgIC8vIFVzZSBqUXVlcnkncyBkYXRhIEFQSSB0byBcInN0b3JlIGl0IGluIHRoZSBET01cIlxuICAgICAgICB0aGlzLiRlbC5kYXRhKCd1aWQnLCB0aGlzLnVpZCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHt9XG5cbiAgICBkZXN0cm95KCkge1xuICAgICAgICBpZiAodGhpcy4kZWwpIHtcbiAgICAgICAgICAgIHRoaXMuJGVsLnJlbW92ZURhdGEoJ3VpZCcpXG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuY29uc3QgTU9EVUxFX05BTUUgPSAnRXhhbXBsZSc7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5jb25zdCBFVkVOVCA9IHtcbiAgICBDTElDSzogYGNsaWNrLiR7RVZFTlRfTkFNRVNQQUNFfWBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgLy8gRGVjbGFyYXRpb24gb2YgcHJvcGVydGllc1xuICAgICAgICBjb25zb2xlLmxvZygn8J+UqCBbbW9kdWxlXTpjb25zdHJ1Y3RvciAtIEV4YW1wbGUnKTtcblxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIC8vIFNldCBldmVudHMgYW5kIHN1Y2hcblxuICAgIH1cblxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCfinYwgW21vZHVsZV06ZGVzdHJveSAtIEV4YW1wbGUnKTtcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiRlbC5vZmYoYC4ke0VWRU5UX05BTUVTUEFDRX1gKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3Rvcih3cmFwcGVyKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLndyYXBwZXIgPSB3cmFwcGVyO1xuICAgIH1cblxuICAgIGxhdW5jaChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLSBMYXVuY2ggdHJhbnNpdGlvbiDwn5GKIC0tLS0tXCIpO1xuXG4gICAgfVxuXG4gICAgaGlkZVZpZXcodmlldykge1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0g4p2MIFtWSUVXXTpyZW1vdmUgLSAnLCB2aWV3LmdldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZScpKTtcbiAgICAgICAgdmlldy5yZW1vdmUoKTtcblxuICAgIH1cblxuICAgIGRpc3BsYXlWaWV3KHZpZXcpIHtcbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0tIOKchSBbVklFV106ZGlzcGxheSA6Jywgdmlldy5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKSk7XG4gICAgICAgIHRoaXMud3JhcHBlci5pbm5lckhUTUwgPSB2aWV3Lm91dGVySFRNTDtcbiAgICB9XG5cbiAgICBcbiAgICBkZXN0cm95KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0gZGVzdHJveSB0cmFuc2l0aW9uIOKdjCAtLS0tLVwiKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBBUFBfTkFNRSwgJGRvY3VtZW50LCAkaHRtbCwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuaW1wb3J0IHsgRVZFTlQgYXMgQVBQX0VWRU5UIH0gZnJvbSAnLi4vQXBwJztcblxuLy9MaXN0IGhlcmUgYWxsIG9mIHlvdXIgdHJhbnNpdGlvbnNcbmltcG9ydCBEZWZhdWx0VHJhbnNpdGlvbiBmcm9tICcuL0RlZmF1bHRUcmFuc2l0aW9uJztcblxuXG5jb25zdCBNT0RVTEVfTkFNRSA9ICdUcmFuc2l0aW9uTWFuYWdlcic7XG5jb25zdCBFVkVOVF9OQU1FU1BBQ0UgPSBgJHtBUFBfTkFNRX0uJHtNT0RVTEVfTkFNRX1gO1xuXG5cbi8qXG5cbkB0b2RvIDogXG5cbi0gZ2V0IGRhdGEtdHJhbnNpdGlvbiBvbiBjbGlja2VkIGxpbmsgLT4gbGF1bmNoKCkgYW5kIGFkZCBzd2l0Y2goKXt9XG4tIGFkZCBnb3RvIGxpc3RlbmVyXG4tIGFkZCBuZXdQYWdlUmVhZHkgZnVuY3RvbiB3aXRoIGdvb2dsZSBhbmFseXRpY3Mgc2VuZFxuLSBhZGQgb3ZlcnJpZGVDbGFzcyBzeXN0ZW0gZm9yIGFsbCB0cmFuc2l0aW9uc1xuLSBhZGQgYmFzZSBjbGFzcyBtYW5hZ2VyIGxpa2Ugb2xkIERlZmF1bHRUcmFuc2l0aW9uIChkb20taXMtbG9hZGVkLCBkb20taXMtbG9hZGluZyBldGMuLilcblxuKi9cblxuY29uc3QgRVZFTlQgPSB7XG4gICAgR09UTzogYGdvdG8uJHtFVkVOVF9OQU1FU1BBQ0V9YFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBcblxuICAgICAgICAvLyBqUXVlcnkgb25kb21yZWFkeVxuICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRyYW5zaXRpb247XG5cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY29udGFpbmVyQ2xhc3MgPSAnLmpzLXBqYXgtY29udGFpbmVyJztcbiAgICAgICAgdGhpcy53cmFwcGVySWQgPSAnanMtcGpheC13cmFwcGVyJztcbiAgICAgICAgdGhpcy5ub1BqYXhSZXF1ZXN0Q2xhc3MgPSAnbm8tdHJhbnNpdGlvbic7XG4gICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMud3JhcHBlcklkKTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkZWJ1ZzogZmFsc2UsXG4gICAgICAgICAgICBlbGVtZW50czogW2BhOm5vdCguJHt0aGlzLm5vUGpheFJlcXVlc3RDbGFzc30pYCwnZm9ybVthY3Rpb25dJ10sXG4gICAgICAgICAgICBzZWxlY3RvcnM6IFsndGl0bGUnLGAke3RoaXMuY29udGFpbmVyQ2xhc3N9YF0sXG4gICAgICAgICAgICBzd2l0Y2hlczoge31cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm9wdGlvbnMuc3dpdGNoZXNbdGhpcy5jb250YWluZXJDbGFzc10gPSAob2xkRWwsIG5ld0VsLCBvcHRpb25zKSA9PiB0aGlzLnN3aXRjaChvbGRFbCwgbmV3RWwsIG9wdGlvbnMpXG5cbiAgICAgICAgdGhpcy5wamF4ID0gbmV3IFBqYXgodGhpcy5vcHRpb25zKTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwamF4OnNlbmQnLChlKSA9PiB0aGlzLnNlbmQoZSkpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwamF4OnN1Y2Nlc3MnLChlKSA9PiB0aGlzLnN1Y2Nlc3MoZSkpO1xuICAgIH1cblxuICAgIHNlbmQoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0gTGF1bmNoIHJlcXVlc3Qg8J+ZjCAtLS0tLVwiKTtcblxuICAgICAgICAvL2J5IGRlZmF1bHQsIGJ1dCBuZWVkIHRvIGJlIG1hbmFnZSBieSBkYXRhLXRyYW5zaXRvbiBvbiBjdXJyZW50VGFyZ2V0XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbiA9IG5ldyBEZWZhdWx0VHJhbnNpdGlvbih0aGlzLndyYXBwZXIpO1xuXG4gICAgICAgIHRoaXMudHJhbnNpdGlvbi5sYXVuY2goKTtcbiAgICB9XG5cbiAgICBzd2l0Y2gob2xkRWwsIG5ld0VsLCBvcHRpb25zKSB7XG5cbiAgICAgICAgY29uc29sZS5sb2coJy0tLS0gTmV4dCB2aWV3IGxvYWRlZCDwn5GMIC0tLS0tJyk7XG5cbiAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgIHR5cGU6IEFQUF9FVkVOVC5ERUxFVEVfU0NPUEVEX01PRFVMRVMsXG4gICAgICAgICAgICAkc2NvcGU6ICRwamF4V3JhcHBlclxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnRyYW5zaXRpb24uaGlkZVZpZXcob2xkRWwpO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb24uZGlzcGxheVZpZXcobmV3RWwpO1xuXG4gICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICB0eXBlOiBBUFBfRVZFTlQuSU5JVF9TQ09QRURfTU9EVUxFUyxcbiAgICAgICAgICAgIGlzUGpheDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHN1Y2Nlc3MoZSkge1xuICAgICAgICB0aGlzLnRyYW5zaXRpb24uZGVzdHJveSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERPTSBpcyBsb2FkZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKTtcbiAgICAgICAgJGh0bWwucmVtb3ZlQ2xhc3MoJ2RvbS1pcy1sb2FkaW5nJyk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgJGh0bWwuYWRkQ2xhc3MoJ2RvbS1pcy1hbmltYXRlZCcpO1xuICAgICAgICB9LCAxMDAwKVxuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IEFQUF9OQU1FLCAkZG9jdW1lbnQsICRodG1sLCAkcGpheFdyYXBwZXIgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBFVkVOVCBhcyBBUFBfRVZFTlQgfSBmcm9tICcuLi9BcHAnO1xuXG5mdW5jdGlvbiBEZWZhdWx0VHJhbnNpdGlvbihvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgY29uc3Qgc3RhcnRDYWxsYmFjayA9ICh0eXBlb2Ygb3B0aW9ucy5zdGFydENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSA/IG9wdGlvbnMuc3RhcnRDYWxsYmFjayA6IGZ1bmN0aW9uKCl7fTtcbiAgICBjb25zdCBvdmVycmlkZUNsYXNzID0gKHR5cGVvZiBvcHRpb25zLm92ZXJyaWRlQ2xhc3MgPT09ICdzdHJpbmcnKSA/IG9wdGlvbnMub3ZlcnJpZGVDbGFzcyA6ICcnO1xuXG4gICAgcmV0dXJuIEJhcmJhLkJhc2VUcmFuc2l0aW9uLmV4dGVuZCh7XG4gICAgICAgIHN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRodG1sXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdkb20taXMtbG9hZGVkIGRvbS1pcy1hbmltYXRlZCcpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKGBkb20taXMtbG9hZGluZyAke292ZXJyaWRlQ2xhc3N9YCk7XG5cbiAgICAgICAgICAgIHN0YXJ0Q2FsbGJhY2soKTtcblxuICAgICAgICAgICAgLyogQ2xvc2UgYW55IG92ZXJsYXlzICovXG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFByb21pc2VcbiAgICAgICAgICAgICAgICAgIC5hbGwoW3RoaXMubmV3Q29udGFpbmVyTG9hZGluZ10pXG4gICAgICAgICAgICAgICAgICAudGhlbih0aGlzLmZpbmlzaC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9LFxuICAgICAgICBmaW5pc2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJGRvY3VtZW50LnRyaWdnZXJIYW5kbGVyKHtcbiAgICAgICAgICAgICAgICB0eXBlOiAgIEFQUF9FVkVOVC5ERUxFVEVfU0NPUEVEX01PRFVMRVMsXG4gICAgICAgICAgICAgICAgJHNjb3BlOiAkcGpheFdyYXBwZXJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmRvbmUoKTtcblxuICAgICAgICAgICAgY29uc3QgJGVsID0gJCh0aGlzLm5ld0NvbnRhaW5lcik7XG5cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGVtcGxhdGUgbmFtZSBvZiB0aGUgbmV3IGNvbnRhaW5lciBhbmQgc2V0IGl0IHRvIHRoZSBET01cbiAgICAgICAgICAgICRodG1sLmF0dHIoJ2RhdGEtdGVtcGxhdGUnLCAkZWwuZGF0YSgndGVtcGxhdGUnKSk7XG5cbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VySGFuZGxlcih7XG4gICAgICAgICAgICAgICAgdHlwZTogQVBQX0VWRU5ULklOSVRfU0NPUEVEX01PRFVMRVMsXG4gICAgICAgICAgICAgICAgaXNQamF4OiB0cnVlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2RvbS1pcy1sb2FkZWQnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnZG9tLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgJGh0bWxcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKG92ZXJyaWRlQ2xhc3MpXG4gICAgICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnZG9tLWlzLWFuaW1hdGVkJyk7XG4gICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBEZWZhdWx0VHJhbnNpdGlvbjtcbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG4gICAgaWYgKCBpbmRleCA9PT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnB1c2goIHZhbHVlICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcbiAgICBmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG4gICAgICAgIGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG4gICAgbGV0IGk7XG5cbiAgICBpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaSA9IGEubGVuZ3RoO1xuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICBpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcbiAgICBpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgcmV0dXJuIFsgeCBdO1xuICAgIH1cblxuICAgIGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgcmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuICAgIHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcbiAgICBpZiAoICFhcnJheSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cbiAgICBpZiAoIGluZGV4ICE9PSAtMSApIHtcbiAgICAgICAgYXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG4gICAgY29uc3QgYXJyYXkgPSBbXTtcbiAgICBsZXQgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUFycmF5KCBhcnJheSApIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShhcnJheSkpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gICAgbGV0IHRpbWVvdXQ7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgY29uc3QgbGF0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xufVxuIiwiY29uc3QgQVBQX05BTUUgICAgID0gJ0JvaWxlcnBsYXRlJztcbmNvbnN0IERBVEFfQVBJX0tFWSA9ICcuZGF0YS1hcGknO1xuXG5jb25zdCAkZG9jdW1lbnQgICAgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgICAgICA9ICQod2luZG93KTtcbmNvbnN0ICRodG1sICAgICAgICA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5yZW1vdmVDbGFzcygnaGFzLW5vLWpzJykuYWRkQ2xhc3MoJ2hhcy1qcycpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcbmNvbnN0ICRwamF4V3JhcHBlciAgICAgICA9ICQoJyNqcy1wamF4LXdyYXBwZXInKTtcblxuY29uc3QgaXNEZWJ1ZyAgICAgID0gISEkaHRtbC5kYXRhKCdkZWJ1ZycpO1xuXG5leHBvcnQgeyBBUFBfTkFNRSwgREFUQV9BUElfS0VZLCAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgaXNEZWJ1ZywgJHBqYXhXcmFwcGVyIH07XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcblxuICAgIC8vIFJlZ2V4IFBhdHRlcm5cbiAgICBjb25zdCBwYXR0ZXJuID0gL15kYXRhXFwtKC4rKSQvO1xuXG4gICAgLy8gT3V0cHV0XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1tpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zLlxuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuICAgICAgICAvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cbiAgICAgICAgZGF0YVttYXRjaFsxXV0gPSBnZXREYXRhKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxuY29uc3QgcmJyYWNlID0gL14oPzpcXHtbXFx3XFxXXSpcXH18XFxbW1xcd1xcV10qXFxdKSQvO1xuXG4vKipcbiAqIFBhcnNlIHZhbHVlIHRvIGRhdGEgdHlwZS5cbiAqXG4gKiBAbGluayAgIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvMy4xLjEvc3JjL2RhdGEuanNcbiAqIEBwYXJhbSAge3N0cmluZ30gZGF0YSAtIEEgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge21peGVkfSAgUmV0dXJucyB0aGUgdmFsdWUgaW4gaXRzIG5hdHVyYWwgZGF0YSB0eXBlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGF0YShkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT09ICd0cnVlJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdudWxsJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBPbmx5IGNvbnZlcnQgdG8gYSBudW1iZXIgaWYgaXQgZG9lc24ndCBjaGFuZ2UgdGhlIHN0cmluZ1xuICAgIGlmIChkYXRhID09PSArZGF0YSsnJykge1xuICAgICAgICByZXR1cm4gK2RhdGE7XG4gICAgfVxuXG4gICAgaWYgKHJicmFjZS50ZXN0KCBkYXRhICkpIHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoIGRhdGEgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsImNvbnN0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbmNvbnN0IGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcbiAgICByZXR1cm4gYXJyYXlMaWtlUGF0dGVybi50ZXN0KCB0b1N0cmluZy5jYWxsKCBvYmogKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbCAoIGEsIGIgKSB7XG4gICAgaWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBhID09PSBiO1xufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgyL3ZhbGlkYXRlLW51bWJlcnMtaW4tamF2YXNjcmlwdC1pc251bWVyaWNcbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMgKCB0aGluZyApIHtcbiAgICByZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuICAgIHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcbiAgICBjb25zdCBnZXRUeXBlID0ge307XG4gICAgcmV0dXJuIHRoaW5nICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuL2lzJ1xuXG5sZXQgaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgIGhlYWRlck9mZnNldDogNjAsXG4gICAgc3BlZWQ6IDMwMFxufTtcblxuLyoqXG4gKiBzY3JvbGxUbyBpcyBhIGZ1bmN0aW9uIHRoYXQgc2Nyb2xscyBhIGNvbnRhaW5lciB0byBhbiBlbGVtZW50J3MgcG9zaXRpb24gd2l0aGluIHRoYXQgY29udHJvbGxlclxuICogVXNlcyBqUXVlcnkncyAkLkRlZmVycmVkIHRvIGFsbG93IHVzaW5nIGEgY2FsbGJhY2sgb24gYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAkZWxlbWVudCAgQSBqUXVlcnkgbm9kZVxuICogQHBhcmFtICAge29iamVjdH0gIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAvLyBEcm9wIGV2ZXJ5dGhpbmcgaWYgdGhpcyBhaW4ndCBhIGpRdWVyeSBvYmplY3RcbiAgICBpZiAoJGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkgJiYgJGVsZW1lbnQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIC8vIE1lcmdpbmcgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9KSk7XG5cbiAgICAgICAgLy8gUHJldmVudHMgYWNjdW11bGF0aW9uIG9mIGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlzQW5pbWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNvbnRhaW5lciB0aGF0IHdlJ2xsIGJlIHNjcm9sbGluZ1xuICAgICAgICAgICAgbGV0ICRjb250YWluZXIgPSAkKCdodG1sLCBib2R5Jyk7XG4gICAgICAgICAgICBsZXQgZWxlbWVudE9mZnNldCA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRlc3RpbmcgY29udGFpbmVyIGluIG9wdGlvbnMgZm9yIGpRdWVyeS1uZXNzXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBub3QgdXNpbmcgYSBjdXN0b20gY29udGFpbmVyLCB3ZSB0YWtlIHRoZSB0b3AgZG9jdW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUsIHdlIHVzZSB0aGUgZWxlbWVudHMgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLiRjb250YWluZXIgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuJGNvbnRhaW5lciBpbnN0YW5jZW9mIGpRdWVyeSAmJiBvcHRpb25zLiRjb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSBvcHRpb25zLiRjb250YWluZXI7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAndW5kZWZpbmVkJyAmJiBpc051bWVyaWMob3B0aW9ucy5zY3JvbGxUb3ApICYmIG9wdGlvbnMuc2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG9wdGlvbnMuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZcKge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAkZWxlbWVudC5wb3NpdGlvbigpLnRvcCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNOdW1lcmljKG9wdGlvbnMuc2Nyb2xsVG9wKSAmJiBvcHRpb25zLnNjcm9sbFRvcCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBvcHRpb25zLnNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2XCoHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wIC0gb3B0aW9ucy5oZWFkZXJPZmZzZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9wXG4gICAgICAgICAgICB9LCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmVhc2luZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pcyc7XG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCBmaW5kQnlLZXlWYWx1ZSwgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG4gICAgaGlkZGVuOiBbXSxcbiAgICB2aXNpYmxlOiBbXVxufTtcblxuY29uc3QgQUNUSU9OUyA9IFtcbiAgICAnYWRkQ2FsbGJhY2snLFxuICAgICdyZW1vdmVDYWxsYmFjaydcbl07XG5cbmNvbnN0IFNUQVRFUyA9IFtcbiAgICAndmlzaWJsZScsXG4gICAgJ2hpZGRlbidcbl07XG5cbmNvbnN0IFBSRUZJWCA9ICd2LSc7XG5cbmxldCBVVUlEID0gMDtcblxuLy8gTWFpbiBldmVudFxuJGRvY3VtZW50Lm9uKCd2aXNpYmlsaXR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9uRG9jdW1lbnRDaGFuZ2UoJ3Zpc2libGUnKTtcbiAgICB9XG59KTtcblxuLyoqXG4gKiBBZGQgYSBjYWxsYmFja1xuICogQHBhcmFtIHtzdHJpbmd9ICAgc3RhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJuIHtzdHJpbmd9ICBpZGVudFxuICovXG5mdW5jdGlvbiBhZGRDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8ICcnO1xuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaWRlbnQgPSBQUkVGSVggKyBVVUlEKys7XG5cbiAgICBDQUxMQkFDS1Nbc3RhdGVdLnB1c2goe1xuICAgICAgICBpZGVudDogaWRlbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGlkZW50O1xufVxuXG4vKipcbiAqIFJlbW92ZSBhIGNhbGxiYWNrXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICAgaWRlbnQgIFVuaXF1ZSBpZGVudGlmaWVyXG4gKiBAcmV0dXJuIHtib29sZWFufSAgICAgICAgIElmIG9wZXJhdGlvbiB3YXMgYSBzdWNjZXNzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBpZGVudCA9IG9wdGlvbnMuaWRlbnQgfHwgJyc7XG5cbiAgICBpZiAodHlwZW9mKGlkZW50KSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWRlbnQgPT09ICcnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTmVlZCBpZGVudCB0byByZW1vdmUgY2FsbGJhY2snKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IGZpbmRCeUtleVZhbHVlKENBTExCQUNLU1tzdGF0ZV0sICdpZGVudCcsIGlkZW50KVswXTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGlkZW50KVxuICAgIC8vIGNvbnNvbGUubG9nKENBTExCQUNLU1tzdGF0ZV0pXG5cbiAgICBpZiAodHlwZW9mKGluZGV4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVtb3ZlRnJvbUFycmF5KENBTExCQUNLU1tzdGF0ZV0sIGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBXaGVuIGRvY3VtZW50IHN0YXRlIGNoYW5nZXMsIHRyaWdnZXIgY2FsbGJhY2tzXG4gKiBAcGFyYW0gIHtzdHJpbmd9ICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqL1xuZnVuY3Rpb24gb25Eb2N1bWVudENoYW5nZSAoc3RhdGUpIHtcbiAgICBsZXQgY2FsbGJhY2tBcnJheSA9IENBTExCQUNLU1tzdGF0ZV07XG4gICAgbGV0IGkgPSAwO1xuICAgIGxldCBsZW4gPSBjYWxsYmFja0FycmF5Lmxlbmd0aDtcblxuICAgIGZvciAoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2FsbGJhY2tBcnJheVtpXS5jYWxsYmFjaygpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgZmFjaW5nIEFQSSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBjYWxsYmFja3NcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAgICAgICAgICBvcHRpb25zICBPcHRpb25zXG4gKiBAcmV0dXJuICB7Ym9vbGVhbnxpbnRlZ2VyfSAgICAgICAgICAgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjYWxsYmFjayBvciBib29sZWFuIGluZGljYXRpbmcgc3VjY2VzcyBvciBmYWlsdXJlXG4gKi9cbmZ1bmN0aW9uIHZpc2liaWxpdHlBcGkgKG9wdGlvbnMpIHtcbiAgICBsZXQgYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gfHwgJyc7XG4gICAgbGV0IHN0YXRlID0gb3B0aW9ucy5zdGF0ZSB8fCAnJztcbiAgICBsZXQgcmV0O1xuXG4gICAgLy8gVHlwZSBhbmQgdmFsdWUgY2hlY2tpbmdcbiAgICBpZiAoIWFycmF5Q29udGFpbnMoQUNUSU9OUywgYWN0aW9uKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0FjdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICghYXJyYXlDb250YWlucyhTVEFURVMsIHN0YXRlKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ1N0YXRlIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBAdG9kbyBNYWdpYyBjYWxsIGZ1bmN0aW9uIHBsc1xuICAgIGlmIChhY3Rpb24gPT09ICdhZGRDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gYWRkQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSAncmVtb3ZlQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IHJlbW92ZUNhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyB2aXNpYmlsaXR5QXBpIH07XG4iXX0=
