(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _environment = require('./utils/environment');

var _html = require('./utils/html');

var _globals = require('./utils/globals');

var _globals2 = _interopRequireDefault(_globals);

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
            _this.initGlobals(event.firstBlood).deleteModules().initModules();
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
     * @return  {Object}  this  Allows chaining
     */


    App.prototype.initModules = function initModules() {
        // Elements with module
        var moduleEls = document.querySelectorAll('[data-module]');

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
    window.App = new App();
    _environment.$document.trigger({
        type: 'initModules.App',
        firstBlood: true
    });
})();

},{"./modules":3,"./utils/environment":8,"./utils/globals":9,"./utils/html":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollTo = scrollTo;
/* jshint esnext: true */
var isAnimating = false;

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
                elementOffset = $element.position().top;
            } else {
                elementOffset = $element.offset().top;
            }

            $container.animate({
                scrollTop: elementOffset - options.headerOffset
            }, options.speed, options.easing, function () {
                isAnimating = false;
                deferred.resolve();
            });
        }
    }

    return deferred.promise();
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Button = require('./modules/Button');

Object.defineProperty(exports, 'Button', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Button).default;
  }
});

var _Title = require('./modules/Title');

Object.defineProperty(exports, 'Title', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Title).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Button":5,"./modules/Title":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _environment = require('../utils/environment');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


/**
 * Abstract Module
 */
var _class = function () {
    function _class(options) {
        _classCallCheck(this, _class);

        this.$el = options.$el || null;
        this.el = options.el || null;
    }

    _class.prototype.destroy = function destroy() {
        if (this.$el) {
            this.$el.off();
        }
    };

    return _class;
}();

exports.default = _class;

},{"../utils/environment":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _environment = require('../utils/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var DATA_KEY = _environment.APP_NAME + '.button';
var EVENT_KEY = '.' + DATA_KEY;

var Event = {
    CLICK: 'click' + EVENT_KEY
};

/**
 * Button
 */

var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$el.on(Event.CLICK, function (event) {
            _environment.$document.trigger('changeLabel.Title.' + _environment.APP_NAME, [$(event.currentTarget).val()]);
        });
        return _this;
    }

    _class.prototype.destroy = function destroy() {
        this.$el.off(EVENT_KEY);
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":8,"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractModule2 = require('./AbstractModule');

var _AbstractModule3 = _interopRequireDefault(_AbstractModule2);

var _visibility = require('../utils/visibility');

var _environment = require('../utils/environment');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var DATA_KEY = _environment.APP_NAME + '.Title';
var EVENT_KEY = '.' + DATA_KEY;

var Event = {
    CHANGE_LABEL: 'changeLabel' + EVENT_KEY
};

var Selector = {
    LABEL: '.js-label'
};

var _class = function (_AbstractModule) {
    _inherits(_class, _AbstractModule);

    function _class(options) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

        _this.$label = _this.$el.find(Selector.LABEL);

        _environment.$document.on(Event.CHANGE_LABEL, function (event, value) {
            _this.changeLabel(value);
            _this.destroy();
        });

        _this.hiddenCallbackIdent = (0, _visibility.visibilityApi)({
            action: 'addCallback',
            state: 'hidden',
            callback: _this.logHidden
        });

        _this.visibleCallbackIdent = (0, _visibility.visibilityApi)({
            action: 'addCallback',
            state: 'visible',
            callback: _this.logVisible
        });
        return _this;
    }

    _class.prototype.logHidden = function logHidden() {
        console.log('Title is hidden');
    };

    _class.prototype.logVisible = function logVisible() {
        console.log('Title is visible');
    };

    _class.prototype.changeLabel = function changeLabel(value) {
        this.$label.text(value);
    };

    _class.prototype.destroy = function destroy() {
        _environment.$document.off(EVENT_KEY);

        this.$el.off(EVENT_KEY);

        (0, _visibility.visibilityApi)({
            action: 'removeCallback',
            state: 'hidden',
            ident: this.hiddenCallbackIdent
        });

        (0, _visibility.visibilityApi)({
            action: 'removeCallback',
            state: 'visible',
            ident: this.visibleCallbackIdent
        });
    };

    return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/environment":8,"../utils/visibility":12,"./AbstractModule":4}],7:[function(require,module,exports){
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
    var i;

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
    var array = [],
        i = arrayLike.length;
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

},{"./is":11}],8:[function(require,module,exports){
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

exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;
exports.APP_NAME = APP_NAME;
exports.DATA_API_KEY = DATA_API_KEY;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    svg4everybody();
};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
var toString = Object.prototype.toString,
    arrayLikePattern = /^\[object (?:Array|FileList)\]$/;

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

},{}],12:[function(require,module,exports){
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

},{"./array":7,"./environment":8,"./is":11}]},{},[1,2,3,4,5,6,7,8,9,10,11,12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc2Nyb2xsVG8uanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9BYnN0cmFjdE1vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQnV0dG9uLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9UaXRsZS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2FycmF5LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvZW52aXJvbm1lbnQuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9nbG9iYWxzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaHRtbC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7O0FBQ0E7O0FBR0E7Ozs7QUFHQTs7SUFBWSxPOzs7Ozs7MEpBUlo7OztBQUlBOzs7QUFHQTs7O0lBR00sRztBQUNGLG1CQUFjO0FBQUE7O0FBQUE7O0FBQ1YsYUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLGFBQUssY0FBTCxHQUFzQixFQUF0Qjs7QUFFQSwrQkFBVSxFQUFWLENBQWEsaUJBQWIsRUFBZ0MsVUFBQyxLQUFELEVBQVc7QUFDdkMsa0JBQUssV0FBTCxDQUFpQixNQUFNLFVBQXZCLEVBQ0ssYUFETCxHQUVLLFdBRkw7QUFHSCxTQUpEO0FBS0g7O0FBRUQ7Ozs7OztrQkFJQSxhLDRCQUFnQjtBQUNaO0FBQ0EsWUFBSSxJQUFJLEtBQUssY0FBTCxDQUFvQixNQUE1Qjs7QUFFQTtBQUNBLGVBQU8sR0FBUCxFQUFZO0FBQ1IsaUJBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixPQUF2QjtBQUNBLGlCQUFL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UyxRQUFRLE1BQVIsSUFBa0IsRUFBL0I7QUFDQSxRQUFJLFFBQVEsUUFBUSxLQUFSLElBQWlCLEVBQTdCO0FBQ0EsUUFBSSxZQUFKOztBQUVBO0FBQ0EsUUFBSSxDQUFDLDBCQUFjLE9BQWQsRUFBdUIsTUFBdkIsQ0FBTCxFQUFxQztBQUNqQyxnQkFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDtBQUNELFFBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDL0IsZ0JBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7O0FBRUQ7QUFDQSxRQUFJLFdBQVcsYUFBZixFQUE4QjtBQUMxQixjQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0gsS0FGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUNwQyxjQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0g7O0FBRUQsV0FBTyxHQUFQO0FBQ0g7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50IH0gZnJvbSAnLi91dGlscy9lbnZpcm9ubWVudCc7XG5pbXBvcnQgeyBnZXROb2RlRGF0YSB9IGZyb20gJy4vdXRpbHMvaHRtbCc7XG5cbi8vIEdsb2JhbCBmdW5jdGlvbnMgYW5kIHRvb2xzXG5pbXBvcnQgZ2xvYmFscyBmcm9tICcuL3V0aWxzL2dsb2JhbHMnO1xuXG4vLyBCYXNpYyBtb2R1bGVzXG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNsYXNzIEFwcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG4gICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMgPSBbXTtcblxuICAgICAgICAkZG9jdW1lbnQub24oJ2luaXRNb2R1bGVzLkFwcCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pbml0R2xvYmFscyhldmVudC5maXJzdEJsb29kKVxuICAgICAgICAgICAgICAgIC5kZWxldGVNb2R1bGVzKClcbiAgICAgICAgICAgICAgICAuaW5pdE1vZHVsZXMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVzdHJveSBhbGwgZXhpc3RpbmcgbW9kdWxlc1xuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcbiAgICAgKi9cbiAgICBkZWxldGVNb2R1bGVzKCkge1xuICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgdmFyIGkgPSB0aGlzLmN1cnJlbnRNb2R1bGVzLmxlbmd0aDtcblxuICAgICAgICAvLyBEZXN0cm95IGFsbCBtb2R1bGVzXG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGdsb2JhbCBmdW5jdGlvbnMgYW5kIHNldHRpbmdzXG4gICAgICogQWxsb3dzIHlvdSB0byBpbml0aWFsaXplIGdsb2JhbCBtb2R1bGVzIG9ubHkgb25jZSBpZiB5b3UgbmVlZFxuICAgICAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG4gICAgICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuICAgICAqL1xuICAgIGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcbiAgICAgICAgZ2xvYmFscyhmaXJzdEJsb29kKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cbiAgICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgdGhpcyAgQWxsb3dzIGNoYWluaW5nXG4gICAgICovXG4gICAgaW5pdE1vZHVsZXMoKSB7XG4gICAgICAgIC8vIEVsZW1lbnRzIHdpdGggbW9kdWxlXG4gICAgICAgIHZhciBtb2R1bGVFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG5cbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIGVsc0xlbiA9IG1vZHVsZUVscy5sZW5ndGg7XG5cbiAgICAgICAgZm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG4gICAgICAgICAgICAvLyBDdXJyZW50IGVsZW1lbnRcbiAgICAgICAgICAgIGxldCBlbCA9IG1vZHVsZUVsc1tpXTtcblxuICAgICAgICAgICAgLy8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGdldE5vZGVEYXRhKGVsKTtcblxuICAgICAgICAgICAgLy8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG4gICAgICAgICAgICBvcHRpb25zLmVsICA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkKGVsKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5zcGxpdCgvLFxccyp8XFxzKy9nKTtcblxuICAgICAgICAgICAgLy8gTG9vcCBtb2R1bGVzXG4gICAgICAgICAgICBsZXQgaiA9IDA7XG4gICAgICAgICAgICBsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cbiAgICAgICAgICAgIGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuXG4vLyBJSUZFIGZvciBsb2FkaW5nIHRoZSBhcHBsaWNhdGlvblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbihmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cuQXBwID0gbmV3IEFwcCgpO1xuICAgICRkb2N1bWVudC50cmlnZ2VyKHtcbiAgICAgICAgdHlwZTogJ2luaXRNb2R1bGVzLkFwcCcsXG4gICAgICAgIGZpcnN0Qmxvb2Q6IHRydWVcbiAgICB9KTtcbn0pKCk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG52YXIgaXNBbmltYXRpbmcgPSBmYWxzZTtcblxudmFyIGRlZmF1bHRzID0ge1xuICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICBoZWFkZXJPZmZzZXQ6IDYwLFxuICAgIHNwZWVkOiAzMDBcbn07XG5cbi8qKlxuICogc2Nyb2xsVG8gaXMgYSBmdW5jdGlvbiB0aGF0IHNjcm9sbHMgYSBjb250YWluZXIgdG8gYW4gZWxlbWVudCdzIHBvc2l0aW9uIHdpdGhpbiB0aGF0IGNvbnRyb2xsZXJcbiAqIFVzZXMgalF1ZXJ5J3MgJC5EZWZlcnJlZCB0byBhbGxvdyB1c2luZyBhIGNhbGxiYWNrIG9uIGFuaW1hdGlvbiBjb21wbGV0aW9uXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgJGVsZW1lbnQgIEEgalF1ZXJ5IG5vZGVcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICBvcHRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxUbygkZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHZhciBkZWZlcnJlZCA9ICQuRGVmZXJyZWQoKTtcblxuICAgIC8vIERyb3AgZXZlcnl0aGluZyBpZiB0aGlzIGFpbid0IGEgalF1ZXJ5IG9iamVjdFxuICAgIGlmICgkZWxlbWVudCBpbnN0YW5jZW9mIGpRdWVyeSAmJiAkZWxlbWVudC5sZW5ndGggPiAwKSB7XG5cbiAgICAgICAgLy8gTWVyZ2luZyBvcHRpb25zXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdHMsICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zIDoge30pKTtcblxuICAgICAgICAvLyBQcmV2ZW50cyBhY2N1bXVsYXRpb24gb2YgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaXNBbmltYXRpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpc0FuaW1hdGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIERlZmF1bHQgY29udGFpbmVyIHRoYXQgd2UnbGwgYmUgc2Nyb2xsaW5nXG4gICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9ICQoJ2h0bWwsIGJvZHknKTtcbiAgICAgICAgICAgIHZhciBlbGVtZW50T2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgLy8gVGVzdGluZyBjb250YWluZXIgaW4gb3B0aW9ucyBmb3IgalF1ZXJ5LW5lc3NcbiAgICAgICAgICAgIC8vIElmIHdlJ3JlIG5vdCB1c2luZyBhIGN1c3RvbSBjb250YWluZXIsIHdlIHRha2UgdGhlIHRvcCBkb2N1bWVudCBvZmZzZXRcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSwgd2UgdXNlIHRoZSBlbGVtZW50cyBwb3NpdGlvbiByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuJGNvbnRhaW5lciAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy4kY29udGFpbmVyIGluc3RhbmNlb2YgalF1ZXJ5ICYmIG9wdGlvbnMuJGNvbnRhaW5lci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lciA9IG9wdGlvbnMuJGNvbnRhaW5lcjtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0ID0gJGVsZW1lbnQucG9zaXRpb24oKS50b3BcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudE9mZnNldCA9ICRlbGVtZW50Lm9mZnNldCgpLnRvcFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkY29udGFpbmVyLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogZWxlbWVudE9mZnNldCAtIG9wdGlvbnMuaGVhZGVyT2Zmc2V0XG4gICAgICAgICAgICB9LCBvcHRpb25zLnNwZWVkLCBvcHRpb25zLmVhc2luZywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlKCk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQge2RlZmF1bHQgYXMgQnV0dG9ufSBmcm9tICcuL21vZHVsZXMvQnV0dG9uJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBUaXRsZX0gZnJvbSAnLi9tb2R1bGVzL1RpdGxlJztcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG4vKipcbiAqIEFic3RyYWN0IE1vZHVsZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzc1xue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXG4gICAge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsIHx8IG51bGw7XG4gICAgICAgIHRoaXMuZWwgID0gb3B0aW9ucy5lbCAgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBkZXN0cm95KClcbiAgICB7XG4gICAgICAgIGlmICh0aGlzLiRlbCkge1xuICAgICAgICAgICAgdGhpcy4kZWwub2ZmKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsIEFQUF9OQU1FLCBEQVRBX0FQSV9LRVkgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IERBVEFfS0VZICA9IGAke0FQUF9OQU1FfS5idXR0b25gO1xuY29uc3QgRVZFTlRfS0VZID0gYC4ke0RBVEFfS0VZfWA7XG5cbmNvbnN0IEV2ZW50ID0ge1xuICAgIENMSUNLIDogYGNsaWNrJHtFVkVOVF9LRVl9YFxufTtcblxuLyoqXG4gKiBCdXR0b25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZVxue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXG4gICAge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLiRlbC5vbihFdmVudC5DTElDSywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAkZG9jdW1lbnQudHJpZ2dlcihgY2hhbmdlTGFiZWwuVGl0bGUuJHtBUFBfTkFNRX1gLCBbICQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCkgXSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgdGhpcy4kZWwub2ZmKEVWRU5UX0tFWSk7XG4gICAgfVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuaW1wb3J0IHsgdmlzaWJpbGl0eUFwaSB9IGZyb20gJy4uL3V0aWxzL3Zpc2liaWxpdHknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCBBUFBfTkFNRSwgREFUQV9BUElfS0VZIH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5jb25zdCBEQVRBX0tFWSAgPSBgJHtBUFBfTkFNRX0uVGl0bGVgO1xuY29uc3QgRVZFTlRfS0VZID0gYC4ke0RBVEFfS0VZfWA7XG5cbmNvbnN0IEV2ZW50ID0ge1xuICAgIENIQU5HRV9MQUJFTCA6IGBjaGFuZ2VMYWJlbCR7RVZFTlRfS0VZfWBcbn07XG5cbmNvbnN0IFNlbGVjdG9yID0ge1xuICAgIExBQkVMIDogJy5qcy1sYWJlbCdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZVxue1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpXG4gICAge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcblxuICAgICAgICB0aGlzLiRsYWJlbCA9IHRoaXMuJGVsLmZpbmQoU2VsZWN0b3IuTEFCRUwpO1xuXG4gICAgICAgICRkb2N1bWVudC5vbihFdmVudC5DSEFOR0VfTEFCRUwsIChldmVudCwgdmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlTGFiZWwodmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaGlkZGVuQ2FsbGJhY2tJZGVudCA9IHZpc2liaWxpdHlBcGkoe1xuICAgICAgICAgICAgYWN0aW9uOiAgICdhZGRDYWxsYmFjaycsXG4gICAgICAgICAgICBzdGF0ZTogICAgJ2hpZGRlbicsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5sb2dIaWRkZW5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy52aXNpYmxlQ2FsbGJhY2tJZGVudCA9IHZpc2liaWxpdHlBcGkoe1xuICAgICAgICAgICAgYWN0aW9uOiAgICdhZGRDYWxsYmFjaycsXG4gICAgICAgICAgICBzdGF0ZTogICAgJ3Zpc2libGUnLFxuICAgICAgICAgICAgY2FsbGJhY2s6IHRoaXMubG9nVmlzaWJsZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dIaWRkZW4oKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RpdGxlIGlzIGhpZGRlbicpO1xuICAgIH1cblxuICAgIGxvZ1Zpc2libGUoKVxuICAgIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1RpdGxlIGlzIHZpc2libGUnKTtcbiAgICB9XG5cbiAgICBjaGFuZ2VMYWJlbCh2YWx1ZSlcbiAgICB7XG4gICAgICAgIHRoaXMuJGxhYmVsLnRleHQodmFsdWUpO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgJGRvY3VtZW50Lm9mZihFVkVOVF9LRVkpO1xuXG4gICAgICAgIHRoaXMuJGVsLm9mZihFVkVOVF9LRVkpO1xuXG4gICAgICAgIHZpc2liaWxpdHlBcGkoe1xuICAgICAgICAgICAgYWN0aW9uOiAncmVtb3ZlQ2FsbGJhY2snLFxuICAgICAgICAgICAgc3RhdGU6ICAnaGlkZGVuJyxcbiAgICAgICAgICAgIGlkZW50OiAgIHRoaXMuaGlkZGVuQ2FsbGJhY2tJZGVudFxuICAgICAgICB9KTtcblxuICAgICAgICB2aXNpYmlsaXR5QXBpKHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlbW92ZUNhbGxiYWNrJyxcbiAgICAgICAgICAgIHN0YXRlOiAgJ3Zpc2libGUnLFxuICAgICAgICAgICAgaWRlbnQ6ICAgdGhpcy52aXNpYmxlQ2FsbGJhY2tJZGVudFxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0FycmF5ICggYXJyYXksIHZhbHVlICkge1xuICAgIHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoIHZhbHVlICk7XG5cbiAgICBpZiAoIGluZGV4ID09PSAtMSApIHtcbiAgICAgICAgYXJyYXkucHVzaCggdmFsdWUgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuICAgIGZvciAoIGxldCBpID0gMCwgYyA9IGFycmF5Lmxlbmd0aDsgaSA8IGM7IGkrKyApIHtcbiAgICAgICAgaWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250ZW50c01hdGNoICggYSwgYiApIHtcbiAgICB2YXIgaTtcblxuICAgIGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCBhLmxlbmd0aCAhPT0gYi5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpID0gYS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGlmICggYVtpXSAhPT0gYltpXSApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuICAgIGlmICggdHlwZW9mIHggPT09ICdzdHJpbmcnICkge1xuICAgICAgICByZXR1cm4gWyB4IF07XG4gICAgfVxuXG4gICAgaWYgKCB4ID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG4gICAgcmV0dXJuIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tQXJyYXkgKCBhcnJheSwgbWVtYmVyICkge1xuICAgIGlmICggIWFycmF5ICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuICAgIGlmICggaW5kZXggIT09IC0xICkge1xuICAgICAgICBhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheSAoIGFycmF5TGlrZSApIHtcbiAgICB2YXIgYXJyYXkgPSBbXSwgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG4gICAgICAgIHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG4gICAgfSk7XG59XG4iLCJjb25zdCBBUFBfTkFNRSAgICAgPSAnYm9pbGVycGxhdGUnO1xuY29uc3QgREFUQV9BUElfS0VZID0gJy5kYXRhLWFwaSc7XG5cbmNvbnN0ICRkb2N1bWVudCAgICA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyAgICAgID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgICAgICAgID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuY29uc3QgJGJvZHkgICAgICAgID0gJChkb2N1bWVudC5ib2R5KTtcblxuZXhwb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHksIEFQUF9OQU1FLCBEQVRBX0FQSV9LRVkgfTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xufVxuIiwiLyoqXG4gKiBAc2VlICBodHRwczovL2dpdGh1Yi5jb20vcmFjdGl2ZWpzL3JhY3RpdmUvYmxvYi9kZXYvc3JjL3V0aWxzL2h0bWwuanNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJi9nLCAnJmFtcDsnKVxuICAgICAgICAucmVwbGFjZSgvPC9nLCAnJmx0OycpXG4gICAgICAgIC5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG59XG5cbi8qKlxuICogUHJlcGFyZSBIVE1MIGNvbnRlbnQgdGhhdCBjb250YWlucyBtdXN0YWNoZSBjaGFyYWN0ZXJzIGZvciB1c2Ugd2l0aCBSYWN0aXZlXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5lc2NhcGVIdG1sKHN0cikge1xuICAgIHJldHVybiBzdHJcbiAgICAgICAgLnJlcGxhY2UoLyZsdDsvZywgJzwnKVxuICAgICAgICAucmVwbGFjZSgvJmd0Oy9nLCAnPicpXG4gICAgICAgIC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpO1xufVxuXG4vKipcbiAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBub2RlXG4gKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVEYXRhKG5vZGUpIHtcbiAgICAvLyBBbGwgYXR0cmlidXRlc1xuICAgIHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xuXG4gICAgLy8gUmVnZXggUGF0dGVyblxuICAgIHZhciBwYXR0ZXJuID0gL15kYXRhXFwtKC4rKSQvO1xuXG4gICAgLy8gT3V0cHV0XG4gICAgdmFyIGRhdGEgPSB7fTtcblxuICAgIGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuICAgICAgICBpZiAoIWF0dHJpYnV0ZXNbaV0pIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG4gICAgICAgIGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG4gICAgICAgIC8vIFRoaXMgaGFwcGVucy5cbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG4gICAgICAgIGlmICghbWF0Y2gpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcbiAgICAgICAgLy8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG4gICAgICAgIGRhdGFbbWF0Y2hbMV1dID0gZ2V0RGF0YShub2RlLmdldEF0dHJpYnV0ZShuYW1lKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG5cbnZhciByYnJhY2UgPSAvXig/Olxce1tcXHdcXFddKlxcfXxcXFtbXFx3XFxXXSpcXF0pJC87XG5cbi8qKlxuICogUGFyc2UgdmFsdWUgdG8gZGF0YSB0eXBlLlxuICpcbiAqIEBsaW5rICAgaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi8zLjEuMS9zcmMvZGF0YS5qc1xuICogQHBhcmFtICB7c3RyaW5nfSBkYXRhIC0gQSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybiB7bWl4ZWR9ICBSZXR1cm5zIHRoZSB2YWx1ZSBpbiBpdHMgbmF0dXJhbCBkYXRhIHR5cGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREYXRhKGRhdGEpIHtcbiAgICBpZiAoZGF0YSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoZGF0YSA9PT0gJ251bGwnKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIE9ubHkgY29udmVydCB0byBhIG51bWJlciBpZiBpdCBkb2Vzbid0IGNoYW5nZSB0aGUgc3RyaW5nXG4gICAgaWYgKGRhdGEgPT09ICtkYXRhKycnKSB7XG4gICAgICAgIHJldHVybiArZGF0YTtcbiAgICB9XG5cbiAgICBpZiAocmJyYWNlLnRlc3QoIGRhdGEgKSkge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSggZGF0YSApO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcbiAgICBhcnJheUxpa2VQYXR0ZXJuID0gL15cXFtvYmplY3QgKD86QXJyYXl8RmlsZUxpc3QpXFxdJC87XG5cbi8vIHRoYW5rcywgaHR0cDovL3BlcmZlY3Rpb25raWxscy5jb20vaW5zdGFuY2VvZi1jb25zaWRlcmVkLWhhcm1mdWwtb3ItaG93LXRvLXdyaXRlLWEtcm9idXN0LWlzYXJyYXkvXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheSAoIHRoaW5nICkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG4gICAgcmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuICAgIGlmICggYSA9PT0gbnVsbCAmJiBiID09PSBudWxsICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG4gICAgcmV0dXJuICFpc05hTiggcGFyc2VGbG9hdCggdGhpbmcgKSApICYmIGlzRmluaXRlKCB0aGluZyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNPYmplY3QgKCB0aGluZyApIHtcbiAgICByZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG4gICAgdmFyIGdldFR5cGUgPSB7fTtcbiAgICByZXR1cm4gdGhpbmcgJiYgZ2V0VHlwZS50b1N0cmluZy5jYWxsKHRoaW5nKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzJztcbmltcG9ydCB7IGFycmF5Q29udGFpbnMsIGZpbmRCeUtleVZhbHVlLCByZW1vdmVGcm9tQXJyYXkgfSBmcm9tICcuL2FycmF5JztcbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IENBTExCQUNLUyA9IHtcbiAgICBoaWRkZW46IFtdLFxuICAgIHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuICAgICdhZGRDYWxsYmFjaycsXG4gICAgJ3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuICAgICd2aXNpYmxlJyxcbiAgICAnaGlkZGVuJ1xuXTtcblxuY29uc3QgUFJFRklYID0gJ3YtJztcblxubGV0IFVVSUQgPSAwO1xuXG4vLyBNYWluIGV2ZW50XG4kZG9jdW1lbnQub24oJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChkb2N1bWVudC5oaWRkZW4pIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgnaGlkZGVuJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb25Eb2N1bWVudENoYW5nZSgndmlzaWJsZScpO1xuICAgIH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cbiAgICBpZiAoIWlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBpZGVudCA9IFBSRUZJWCArIFVVSUQrKztcblxuICAgIENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG4gICAgICAgIGlkZW50OiBpZGVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgfSk7XG5cbiAgICByZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuICAgIGlmICh0eXBlb2YoaWRlbnQpID09PSAndW5kZWZpbmVkJyB8fCBpZGVudCA9PT0gJycpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGluZGV4ID0gZmluZEJ5S2V5VmFsdWUoQ0FMTEJBQ0tTW3N0YXRlXSwgJ2lkZW50JywgaWRlbnQpWzBdO1xuXG4gICAgLy8gY29uc29sZS5sb2coaWRlbnQpXG4gICAgLy8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuICAgIGlmICh0eXBlb2YoaW5kZXgpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuICAgIGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcbiAgICBsZXQgaSA9IDA7XG4gICAgbGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG4gICAgZm9yICg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG4gICAgfVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuICAgIGxldCBhY3Rpb24gPSBvcHRpb25zLmFjdGlvbiB8fCAnJztcbiAgICBsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuICAgIGxldCByZXQ7XG5cbiAgICAvLyBUeXBlIGFuZCB2YWx1ZSBjaGVja2luZ1xuICAgIGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQWN0aW9uIGRvZXMgbm90IGV4aXN0Jyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignU3RhdGUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG4gICAgaWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuICAgICAgICByZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcbiAgICAgICAgcmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG59XG5cbmV4cG9ydCB7IHZpc2liaWxpdHlBcGkgfTtcbiJdfQ==
