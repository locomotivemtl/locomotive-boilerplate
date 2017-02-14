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

    /**
     * Init recaptcha dynamically.
     * Use after page transition to make sure recaptcha is loaded.
     * @return {thisArg} Current app instance.
     */


    App.prototype.initRecaptcha = function initRecaptcha() {
        if ($('.g-recaptcha').length) {
            try {
                // Make sure no JS error occur
                grecaptcha.render($('.g-recaptcha').get(0), { sitekey: $('.g-recaptcha').data('sitekey') });
            } catch (e) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHNcXHNjcmlwdHNcXEFwcC5qcyIsImFzc2V0c1xcc2NyaXB0c1xcZ2xvYmFsXFxzY3JvbGxUby5qcyIsImFzc2V0c1xcc2NyaXB0c1xcbW9kdWxlcy5qcyIsImFzc2V0c1xcc2NyaXB0c1xcbW9kdWxlc1xcQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHNcXHNjcmlwdHNcXG1vZHVsZXNcXEJ1dHRvbi5qcyIsImFzc2V0c1xcc2NyaXB0c1xcbW9kdWxlc1xcVGl0bGUuanMiLCJhc3NldHNcXHNjcmlwdHNcXHV0aWxzXFxhcnJheS5qcyIsImFzc2V0c1xcc2NyaXB0c1xcdXRpbHNcXGVudmlyb25tZW50LmpzIiwiYXNzZXRzXFxzY3JpcHRzXFx1dGlsc1xcZ2xvYmFscy5qcyIsImFzc2V0c1xcc2NyaXB0c1xcdXRpbHNcXGh0bWwuanMiLCJhc3NldHNcXHNjcmlwdHNcXHV0aWxzXFxpcy5qcyIsImFzc2V0c1xcc2NyaXB0c1xcdXRpbHNcXHZpc2liaWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0NBOztBQUNBOztBQUdBOzs7O0FBR0E7O0lBQVksTzs7Ozs7OzBKQVJaOzs7QUFJQTs7O0FBR0E7OztJQUdNLEc7QUFDRixtQkFBYztBQUFBOztBQUFBOztBQUNWLGFBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxhQUFLLGNBQUwsR0FBc0IsRUFBdEI7O0FBRUEsK0JBQVUsRUFBVixDQUFhLGlCQUFiLEVBQWdDLFVBQUMsS0FBRCxFQUFXO0FBQ3ZDLGtCQUFLLFdBQUwsQ0FBaUIsTUFBTSxVQUF2QixFQUNLLGFBREwsR0FFSyxXQUZMO0FBR0gsU0FKRDtBQUtIOztBQUVEOzs7Ozs7a0JBSUEsYSw0QkFBZ0I7QUFDWjtBQUNBLFlBQUksSUFBSSxLQUFLLGNBQUwsQ0FBb0IsTUFBNUI7O0FBRUE7QUFDQSxlQUFPLEdBQVAsRUFBWTtBQUNSLGlCQUFLLGNBQUws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QVEsSUFBUixDQUFhLDZCQUFiO0FBQ0EsZUFBTyxLQUFQO0FBQ0g7QUFDSjs7QUFFRDs7OztBQUlBLFNBQVMsZ0JBQVQsQ0FBMkIsS0FBM0IsRUFBa0M7QUFDOUIsUUFBSSxnQkFBZ0IsVUFBVSxLQUFWLENBQXBCO0FBQ0EsUUFBSSxJQUFJLENBQVI7QUFDQSxRQUFJLE1BQU0sY0FBYyxNQUF4Qjs7QUFFQSxXQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNqQixzQkFBYyxDQUFkLEVBQWlCLFFBQWpCO0FBQ0g7QUFDSjs7QUFFRDs7Ozs7QUFLQSxTQUFTLGFBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDN0IsUUFBSSxTQUFTLFFBQVEsTUFBUixJQUFrQixFQUEvQjtBQUNBLFFBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7QUFDQSxRQUFJLFlBQUo7O0FBRUE7QUFDQSxRQUFJLENBQUMsMEJBQWMsT0FBZCxFQUF1QixNQUF2QixDQUFMLEVBQXFDO0FBQ2pDLGdCQUFRLElBQVIsQ0FBYSx1QkFBYjtBQUNBLGVBQU8sS0FBUDtBQUNIO0FBQ0QsUUFBSSxDQUFDLDBCQUFjLE1BQWQsRUFBc0IsS0FBdEIsQ0FBTCxFQUFtQztBQUMvQixnQkFBUSxJQUFSLENBQWEsc0JBQWI7QUFDQSxlQUFPLEtBQVA7QUFDSDs7QUFFRDtBQUNBLFFBQUksV0FBVyxhQUFmLEVBQThCO0FBQzFCLGNBQU0sWUFBWSxLQUFaLEVBQW1CLE9BQW5CLENBQU47QUFDSCxLQUZELE1BRU8sSUFBSSxXQUFXLGdCQUFmLEVBQWlDO0FBQ3BDLGNBQU0sZUFBZSxLQUFmLEVBQXNCLE9BQXRCLENBQU47QUFDSDs7QUFFRCxXQUFPLEdBQVA7QUFDSDs7UUFFUSxhLEdBQUEsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQgfSBmcm9tICcuL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcblxuLy8gR2xvYmFsIGZ1bmN0aW9ucyBhbmQgdG9vbHNcbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vdXRpbHMvZ2xvYmFscyc7XG5cbi8vIEJhc2ljIG1vZHVsZXNcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY2xhc3MgQXBwIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5tb2R1bGVzID0gbW9kdWxlcztcbiAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXG4gICAgICAgICRkb2N1bWVudC5vbignaW5pdE1vZHVsZXMuQXBwJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmluaXRHbG9iYWxzKGV2ZW50LmZpcnN0Qmxvb2QpXG4gICAgICAgICAgICAgICAgLmRlbGV0ZU1vZHVsZXMoKVxuICAgICAgICAgICAgICAgIC5pbml0TW9kdWxlcygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXN0cm95IGFsbCBleGlzdGluZyBtb2R1bGVzXG4gICAgICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuICAgICAqL1xuICAgIGRlbGV0ZU1vZHVsZXMoKSB7XG4gICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICB2YXIgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG4gICAgICAgIC8vIERlc3Ryb3kgYWxsIG1vZHVsZXNcbiAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kdWxlc1tpXS5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnNwbGljZShpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgZ2xvYmFsIGZ1bmN0aW9ucyBhbmQgc2V0dGluZ3NcbiAgICAgKiBBbGxvd3MgeW91IHRvIGluaXRpYWxpemUgZ2xvYmFsIG1vZHVsZXMgb25seSBvbmNlIGlmIHlvdSBuZWVkXG4gICAgICogKGV4Ljogd2hlbiB1c2luZyBCYXJiYS5qcyBvciBTbW9vdGhTdGF0ZS5qcylcbiAgICAgKiBAcmV0dXJuICB7T2JqZWN0fSAgdGhpcyAgQWxsb3dzIGNoYWluaW5nXG4gICAgICovXG4gICAgaW5pdEdsb2JhbHMoZmlyc3RCbG9vZCkge1xuICAgICAgICBnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuICAgICAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcbiAgICAgKi9cbiAgICBpbml0TW9kdWxlcygpIHtcbiAgICAgICAgLy8gRWxlbWVudHMgd2l0aCBtb2R1bGVcbiAgICAgICAgdmFyIG1vZHVsZUVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcblxuICAgICAgICAvLyBMb29wIHRocm91Z2ggZWxlbWVudHNcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgZWxzTGVuID0gbW9kdWxlRWxzLmxlbmd0aDtcblxuICAgICAgICBmb3IgKDsgaSA8IGVsc0xlbjsgaSsrKSB7XG5cbiAgICAgICAgICAgIC8vIEN1cnJlbnQgZWxlbWVudFxuICAgICAgICAgICAgbGV0IGVsID0gbW9kdWxlRWxzW2ldO1xuXG4gICAgICAgICAgICAvLyBBbGwgZGF0YS0gYXR0cmlidXRlcyBjb25zaWRlcmVkIGFzIG9wdGlvbnNcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0gZ2V0Tm9kZURhdGEoZWwpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcbiAgICAgICAgICAgIG9wdGlvbnMuZWwgID0gZWw7XG4gICAgICAgICAgICBvcHRpb25zLiRlbCA9ICQoZWwpO1xuXG4gICAgICAgICAgICAvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG4gICAgICAgICAgICBsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG4gICAgICAgICAgICAvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcbiAgICAgICAgICAgIGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnNwbGl0KC8sXFxzKnxcXHMrL2cpO1xuXG4gICAgICAgICAgICAvLyBMb29wIG1vZHVsZXNcbiAgICAgICAgICAgIGxldCBqID0gMDtcbiAgICAgICAgICAgIGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuICAgICAgICAgICAgZm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUlkZW50c1tqXTtcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0IHJlY2FwdGNoYSBkeW5hbWljYWxseS5cbiAgICAgKiBVc2UgYWZ0ZXIgcGFnZSB0cmFuc2l0aW9uIHRvIG1ha2Ugc3VyZSByZWNhcHRjaGEgaXMgbG9hZGVkLlxuICAgICAqIEByZXR1cm4ge3RoaXNBcmd9IEN1cnJlbnQgYXBwIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGluaXRSZWNhcHRjaGEoKSB7XG4gICAgICAgIGlmICgkKCcuZy1yZWNhcHRjaGEnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIG5vIEpTIGVycm9yIG9jY3VyXG4gICAgICAgICAgICAgICAgZ3JlY2FwdGNoYS5yZW5kZXIoJCgnLmctcmVjYXB0Y2hhJykuZ2V0KDApLCB7IHNpdGVrZXkgOiAkKCcuZy1yZWNhcHRjaGEnKS5kYXRhKCdzaXRla2V5JykgfSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5cbi8vIElJRkUgZm9yIGxvYWRpbmcgdGhlIGFwcGxpY2F0aW9uXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuKGZ1bmN0aW9uKCkge1xuICAgIHdpbmRvdy5BcHAgPSBuZXcgQXBwKCk7XG4gICAgJGRvY3VtZW50LnRyaWdnZXIoe1xuICAgICAgICB0eXBlOiAnaW5pdE1vZHVsZXMuQXBwJyxcbiAgICAgICAgZmlyc3RCbG9vZDogdHJ1ZVxuICAgIH0pO1xufSkoKTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbnZhciBpc0FuaW1hdGluZyA9IGZhbHNlO1xuXG52YXIgZGVmYXVsdHMgPSB7XG4gICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgIGhlYWRlck9mZnNldDogNjAsXG4gICAgc3BlZWQ6IDMwMFxufTtcblxuLyoqXG4gKiBzY3JvbGxUbyBpcyBhIGZ1bmN0aW9uIHRoYXQgc2Nyb2xscyBhIGNvbnRhaW5lciB0byBhbiBlbGVtZW50J3MgcG9zaXRpb24gd2l0aGluIHRoYXQgY29udHJvbGxlclxuICogVXNlcyBqUXVlcnkncyAkLkRlZmVycmVkIHRvIGFsbG93IHVzaW5nIGEgY2FsbGJhY2sgb24gYW5pbWF0aW9uIGNvbXBsZXRpb25cbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAkZWxlbWVudCAgQSBqUXVlcnkgbm9kZVxuICogQHBhcmFtICAge29iamVjdH0gIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbFRvKCRlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgdmFyIGRlZmVycmVkID0gJC5EZWZlcnJlZCgpO1xuXG4gICAgLy8gRHJvcCBldmVyeXRoaW5nIGlmIHRoaXMgYWluJ3QgYSBqUXVlcnkgb2JqZWN0XG4gICAgaWYgKCRlbGVtZW50IGluc3RhbmNlb2YgalF1ZXJ5ICYmICRlbGVtZW50Lmxlbmd0aCA+IDApIHtcblxuICAgICAgICAvLyBNZXJnaW5nIG9wdGlvbnNcbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgKHR5cGVvZiBvcHRpb25zICE9PSAndW5kZWZpbmVkJyA/IG9wdGlvbnMgOiB7fSkpO1xuXG4gICAgICAgIC8vIFByZXZlbnRzIGFjY3VtdWxhdGlvbiBvZiBhbmltYXRpb25zXG4gICAgICAgIGlmIChpc0FuaW1hdGluZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gRGVmYXVsdCBjb250YWluZXIgdGhhdCB3ZSdsbCBiZSBzY3JvbGxpbmdcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gJCgnaHRtbCwgYm9keScpO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnRPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAvLyBUZXN0aW5nIGNvbnRhaW5lciBpbiBvcHRpb25zIGZvciBqUXVlcnktbmVzc1xuICAgICAgICAgICAgLy8gSWYgd2UncmUgbm90IHVzaW5nIGEgY3VzdG9tIGNvbnRhaW5lciwgd2UgdGFrZSB0aGUgdG9wIGRvY3VtZW50IG9mZnNldFxuICAgICAgICAgICAgLy8gSWYgd2UgYXJlLCB3ZSB1c2UgdGhlIGVsZW1lbnRzIHBvc2l0aW9uIHJlbGF0aXZlIHRvIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy4kY29udGFpbmVyICE9PSAndW5kZWZpbmVkJyAmJiBvcHRpb25zLiRjb250YWluZXIgaW5zdGFuY2VvZiBqUXVlcnkgJiYgb3B0aW9ucy4kY29udGFpbmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gb3B0aW9ucy4kY29udGFpbmVyO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXQgPSAkZWxlbWVudC5wb3NpdGlvbigpLnRvcFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50T2Zmc2V0ID0gJGVsZW1lbnQub2Zmc2V0KCkudG9wXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRjb250YWluZXIuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBlbGVtZW50T2Zmc2V0IC0gb3B0aW9ucy5oZWFkZXJPZmZzZXRcbiAgICAgICAgICAgIH0sIG9wdGlvbnMuc3BlZWQsIG9wdGlvbnMuZWFzaW5nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBCdXR0b259IGZyb20gJy4vbW9kdWxlcy9CdXR0b24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFRpdGxlfSBmcm9tICcuL21vZHVsZXMvVGl0bGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbi8qKlxuICogQWJzdHJhY3QgTW9kdWxlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHRoaXMuJGVsID0gb3B0aW9ucy4kZWwgfHwgbnVsbDtcbiAgICAgICAgdGhpcy5lbCAgPSBvcHRpb25zLmVsICB8fCBudWxsO1xuICAgIH1cblxuICAgIGRlc3Ryb3koKVxuICAgIHtcbiAgICAgICAgaWYgKHRoaXMuJGVsKSB7XG4gICAgICAgICAgICB0aGlzLiRlbC5vZmYoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcbmltcG9ydCB7ICRkb2N1bWVudCwgQVBQX05BTUUsIERBVEFfQVBJX0tFWSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuY29uc3QgREFUQV9LRVkgID0gYCR7QVBQX05BTUV9LmJ1dHRvbmA7XG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YDtcblxuY29uc3QgRXZlbnQgPSB7XG4gICAgQ0xJQ0sgOiBgY2xpY2ske0VWRU5UX0tFWX1gXG59O1xuXG4vKipcbiAqIEJ1dHRvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuJGVsLm9uKEV2ZW50LkNMSUNLLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICRkb2N1bWVudC50cmlnZ2VyKGBjaGFuZ2VMYWJlbC5UaXRsZS4ke0FQUF9OQU1FfWAsIFsgJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKSBdKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICB0aGlzLiRlbC5vZmYoRVZFTlRfS0VZKTtcbiAgICB9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5pbXBvcnQgeyB2aXNpYmlsaXR5QXBpIH0gZnJvbSAnLi4vdXRpbHMvdmlzaWJpbGl0eSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsIEFQUF9OQU1FLCBEQVRBX0FQSV9LRVkgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbmNvbnN0IERBVEFfS0VZICA9IGAke0FQUF9OQU1FfS5UaXRsZWA7XG5jb25zdCBFVkVOVF9LRVkgPSBgLiR7REFUQV9LRVl9YDtcblxuY29uc3QgRXZlbnQgPSB7XG4gICAgQ0hBTkdFX0xBQkVMIDogYGNoYW5nZUxhYmVsJHtFVkVOVF9LRVl9YFxufTtcblxuY29uc3QgU2VsZWN0b3IgPSB7XG4gICAgTEFCRUwgOiAnLmpzLWxhYmVsJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlXG57XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucylcbiAgICB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIHRoaXMuJGxhYmVsID0gdGhpcy4kZWwuZmluZChTZWxlY3Rvci5MQUJFTCk7XG5cbiAgICAgICAgJGRvY3VtZW50Lm9uKEV2ZW50LkNIQU5HRV9MQUJFTCwgKGV2ZW50LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VMYWJlbCh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5oaWRkZW5DYWxsYmFja0lkZW50ID0gdmlzaWJpbGl0eUFwaSh7XG4gICAgICAgICAgICBhY3Rpb246ICAgJ2FkZENhbGxiYWNrJyxcbiAgICAgICAgICAgIHN0YXRlOiAgICAnaGlkZGVuJyxcbiAgICAgICAgICAgIGNhbGxiYWNrOiB0aGlzLmxvZ0hpZGRlblxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZpc2libGVDYWxsYmFja0lkZW50ID0gdmlzaWJpbGl0eUFwaSh7XG4gICAgICAgICAgICBhY3Rpb246ICAgJ2FkZENhbGxiYWNrJyxcbiAgICAgICAgICAgIHN0YXRlOiAgICAndmlzaWJsZScsXG4gICAgICAgICAgICBjYWxsYmFjazogdGhpcy5sb2dWaXNpYmxlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvZ0hpZGRlbigpXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZygnVGl0bGUgaXMgaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgbG9nVmlzaWJsZSgpXG4gICAge1xuICAgICAgICBjb25zb2xlLmxvZygnVGl0bGUgaXMgdmlzaWJsZScpO1xuICAgIH1cblxuICAgIGNoYW5nZUxhYmVsKHZhbHVlKVxuICAgIHtcbiAgICAgICAgdGhpcy4kbGFiZWwudGV4dCh2YWx1ZSk7XG4gICAgfVxuXG4gICAgZGVzdHJveSgpXG4gICAge1xuICAgICAgICAkZG9jdW1lbnQub2ZmKEVWRU5UX0tFWSk7XG5cbiAgICAgICAgdGhpcy4kZWwub2ZmKEVWRU5UX0tFWSk7XG5cbiAgICAgICAgdmlzaWJpbGl0eUFwaSh7XG4gICAgICAgICAgICBhY3Rpb246ICdyZW1vdmVDYWxsYmFjaycsXG4gICAgICAgICAgICBzdGF0ZTogICdoaWRkZW4nLFxuICAgICAgICAgICAgaWRlbnQ6ICAgdGhpcy5oaWRkZW5DYWxsYmFja0lkZW50XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZpc2liaWxpdHlBcGkoe1xuICAgICAgICAgICAgYWN0aW9uOiAncmVtb3ZlQ2FsbGJhY2snLFxuICAgICAgICAgICAgc3RhdGU6ICAndmlzaWJsZScsXG4gICAgICAgICAgICBpZGVudDogICB0aGlzLnZpc2libGVDYWxsYmFja0lkZW50XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgdmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZiggdmFsdWUgKTtcblxuICAgIGlmICggaW5kZXggPT09IC0xICkge1xuICAgICAgICBhcnJheS5wdXNoKCB2YWx1ZSApO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGFpbnMgKCBhcnJheSwgdmFsdWUgKSB7XG4gICAgZm9yICggbGV0IGkgPSAwLCBjID0gYXJyYXkubGVuZ3RoOyBpIDwgYzsgaSsrICkge1xuICAgICAgICBpZiAoIGFycmF5W2ldID09IHZhbHVlICkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRlbnRzTWF0Y2ggKCBhLCBiICkge1xuICAgIHZhciBpO1xuXG4gICAgaWYgKCAhaXNBcnJheSggYSApIHx8ICFpc0FycmF5KCBiICkgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIGEubGVuZ3RoICE9PSBiLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGkgPSBhLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgaWYgKCBhW2ldICE9PSBiW2ldICkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVBcnJheSAoIHggKSB7XG4gICAgaWYgKCB0eXBlb2YgeCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgIHJldHVybiBbIHggXTtcbiAgICB9XG5cbiAgICBpZiAoIHggPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEl0ZW0gKCBhcnJheSApIHtcbiAgICByZXR1cm4gYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21BcnJheSAoIGFycmF5LCBtZW1iZXIgKSB7XG4gICAgaWYgKCAhYXJyYXkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIG1lbWJlciApO1xuXG4gICAgaWYgKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICAgIGFycmF5LnNwbGljZSggaW5kZXgsIDEgKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5ICggYXJyYXlMaWtlICkge1xuICAgIHZhciBhcnJheSA9IFtdLCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgYXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJ5S2V5VmFsdWUoIGFycmF5LCBrZXksIHZhbHVlICkge1xuICAgIHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcbiAgICAgICAgcmV0dXJuIG9ialtrZXldID09PSB2YWx1ZTtcbiAgICB9KTtcbn1cbiIsImNvbnN0IEFQUF9OQU1FICAgICA9ICdib2lsZXJwbGF0ZSc7XG5jb25zdCBEQVRBX0FQSV9LRVkgPSAnLmRhdGEtYXBpJztcblxuY29uc3QgJGRvY3VtZW50ICAgID0gJChkb2N1bWVudCk7XG5jb25zdCAkd2luZG93ICAgICAgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCAgICAgICAgPSAkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5jb25zdCAkYm9keSAgICAgICAgPSAkKGRvY3VtZW50LmJvZHkpO1xuXG5leHBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSwgQVBQX05BTUUsIERBVEFfQVBJX0tFWSB9O1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgICBzdmc0ZXZlcnlib2R5KCk7XG59XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgdmFyIHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICB2YXIgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1tpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zLlxuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuICAgICAgICAvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cbiAgICAgICAgZGF0YVttYXRjaFsxXV0gPSBnZXREYXRhKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cblxudmFyIHJicmFjZSA9IC9eKD86XFx7W1xcd1xcV10qXFx9fFxcW1tcXHdcXFddKlxcXSkkLztcblxuLyoqXG4gKiBQYXJzZSB2YWx1ZSB0byBkYXRhIHR5cGUuXG4gKlxuICogQGxpbmsgICBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzMuMS4xL3NyYy9kYXRhLmpzXG4gKiBAcGFyYW0gIHtzdHJpbmd9IGRhdGEgLSBBIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHttaXhlZH0gIFJldHVybnMgdGhlIHZhbHVlIGluIGl0cyBuYXR1cmFsIGRhdGEgdHlwZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERhdGEoZGF0YSkge1xuICAgIGlmIChkYXRhID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGRhdGEgPT09ICdmYWxzZScpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChkYXRhID09PSAnbnVsbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgLy8gT25seSBjb252ZXJ0IHRvIGEgbnVtYmVyIGlmIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBzdHJpbmdcbiAgICBpZiAoZGF0YSA9PT0gK2RhdGErJycpIHtcbiAgICAgICAgcmV0dXJuICtkYXRhO1xuICAgIH1cblxuICAgIGlmIChyYnJhY2UudGVzdCggZGF0YSApKSB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKCBkYXRhICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJ2YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFxuICAgIGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcbiAgICByZXR1cm4gYXJyYXlMaWtlUGF0dGVybi50ZXN0KCB0b1N0cmluZy5jYWxsKCBvYmogKSApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNFcXVhbCAoIGEsIGIgKSB7XG4gICAgaWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBhID09PSBiO1xufVxuXG4vLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE4MDgyL3ZhbGlkYXRlLW51bWJlcnMtaW4tamF2YXNjcmlwdC1pc251bWVyaWNcbmV4cG9ydCBmdW5jdGlvbiBpc051bWVyaWMgKCB0aGluZyApIHtcbiAgICByZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuICAgIHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcbiAgICB2YXIgZ2V0VHlwZSA9IHt9O1xuICAgIHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuICAgIGhpZGRlbjogW10sXG4gICAgdmlzaWJsZTogW11cbn07XG5cbmNvbnN0IEFDVElPTlMgPSBbXG4gICAgJ2FkZENhbGxiYWNrJyxcbiAgICAncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG4gICAgJ3Zpc2libGUnLFxuICAgICdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG4gICAgfVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG4gICAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5jYWxsYmFjayB8fCAnJztcblxuICAgIGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdDYWxsYmFjayBpcyBub3QgYSBmdW5jdGlvbicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG4gICAgQ0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcbiAgICAgICAgaWRlbnQ6IGlkZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICB9KTtcblxuICAgIHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcbiAgICBsZXQgaWRlbnQgPSBvcHRpb25zLmlkZW50IHx8ICcnO1xuXG4gICAgaWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuICAgICAgICBjb25zb2xlLndhcm4oJ05lZWQgaWRlbnQgdG8gcmVtb3ZlIGNhbGxiYWNrJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cbiAgICAvLyBjb25zb2xlLmxvZyhpZGVudClcbiAgICAvLyBjb25zb2xlLmxvZyhDQUxMQkFDS1Nbc3RhdGVdKVxuXG4gICAgaWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlbW92ZUZyb21BcnJheShDQUxMQkFDS1Nbc3RhdGVdLCBpbmRleCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG4gICAgbGV0IGNhbGxiYWNrQXJyYXkgPSBDQUxMQkFDS1Nbc3RhdGVdO1xuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cbiAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcbiAgICB9XG59XG5cbi8qKlxuICogUHVibGljIGZhY2luZyBBUEkgZm9yIGFkZGluZyBhbmQgcmVtb3ZpbmcgY2FsbGJhY2tzXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgICAgICAgICAgb3B0aW9ucyAgT3B0aW9uc1xuICogQHJldHVybiAge2Jvb2xlYW58aW50ZWdlcn0gICAgICAgICAgIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY2FsbGJhY2sgb3IgYm9vbGVhbiBpbmRpY2F0aW5nIHN1Y2Nlc3Mgb3IgZmFpbHVyZVxuICovXG5mdW5jdGlvbiB2aXNpYmlsaXR5QXBpIChvcHRpb25zKSB7XG4gICAgbGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuICAgIGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG4gICAgbGV0IHJldDtcblxuICAgIC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG4gICAgaWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcbiAgICBpZiAoYWN0aW9uID09PSAnYWRkQ2FsbGJhY2snKSB7XG4gICAgICAgIHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gJ3JlbW92ZUNhbGxiYWNrJykge1xuICAgICAgICByZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
