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
												var moduleIdents = attr.replace(/\s/g, '').split(',');

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
 * Abstract module
 * Gives access to generic jQuery nodes
 */

var _class = function _class(options) {
	_classCallCheck(this, _class);

	this.$document = _environment.$document;
	this.$window = _environment.$window;
	this.$html = _environment.$html;
	this.$body = _environment.$body;
	this.$el = options.$el;
	this.el = options.el;
};

exports.default = _class;

},{"../utils/environment":8}],5:[function(require,module,exports){
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

		var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

		_this.$el.on('click.Button', function (event) {
			_this.$document.trigger('Title.changeLabel', [$(event.currentTarget).val()]);
		});
		return _this;
	}

	_class.prototype.destroy = function destroy() {
		this.$el.off('.Button');
	};

	return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _visibility = require('../utils/visibility');

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

		var _this = _possibleConstructorReturn(this, _AbstractModule.call(this, options));

		_this.$label = _this.$el.find('.js-label');

		_this.$document.on('Title.changeLabel', function (event, value) {
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
		this.$document.off('Title.changeLabel');

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

		this.$el.off('.Title');
	};

	return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/visibility":12,"./AbstractModule":4}],7:[function(require,module,exports){
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
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var $document = $(document);
var $window = $(window);
var $html = $(document.documentElement);
var $body = $(document.body);

exports.$document = $document;
exports.$window = $window;
exports.$html = $html;
exports.$body = $body;

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
        data[match[1]] = node.getAttribute(name);
    }

    return data;
}

},{}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc2NvbGxUby5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0Fic3RyYWN0TW9kdWxlLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9CdXR0b24uanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL1RpdGxlLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvYXJyYXkuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9lbnZpcm9ubWVudC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2dsb2JhbHMuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9odG1sLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvaXMuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQTs7QUFDQTs7QUFHQTs7OztBQUdBOztJQUFZLE87Ozs7Ozt5SkFSWjs7O0FBSUE7OztBQUdBOzs7SUFHTSxHO0FBQ0wsbUJBQWM7QUFBQTs7QUFBQTs7QUFDYixhQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0EsYUFBSyxjQUFMLEdBQXNCLEVBQXRCOztBQUVBLCtCQUFVLEVBQVYsQ0FBYSxpQkFBYixFQUFnQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxrQkFBSyxXQUFMLENBQWlCLE1BQU0sVUFBdkIsRUFDRSxhQURGLEdBRUUsV0FGRjtBQUdBLFNBSkQ7QUFLQTs7QUFFRDs7Ozs7O2tCQUlBLGEsNEJBQWdCO0FBQ2Y7QUFDQSxZQUFJLElBQUksS0FBSyxjQUFMLENBQW9CLE1BQTVCOztBQUVBO0FBQ0EsZUFBTyxHQUFQLEVBQVk7QUFDWCxpQkFBSyxjQUFMLENBQW9CLENBQXBCLEVBQXVCLE9BQXZCO0FBQ0EsaUJBQUss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QUNqQyxLQUFJLGdCQUFnQixVQUFVLEtBQVYsQ0FBcEI7QUFDQSxLQUFJLElBQUksQ0FBUjtBQUNBLEtBQUksTUFBTSxjQUFjLE1BQXhCOztBQUVBLFFBQU8sSUFBSSxHQUFYLEVBQWdCLEdBQWhCLEVBQXFCO0FBQ3BCLGdCQUFjLENBQWQsRUFBaUIsUUFBakI7QUFDQTtBQUNEOztBQUVEOzs7OztBQUtBLFNBQVMsYUFBVCxDQUF3QixPQUF4QixFQUFpQztBQUNoQyxLQUFJLFNBQVMsUUFBUSxNQUFSLElBQWtCLEVBQS9CO0FBQ0EsS0FBSSxRQUFRLFFBQVEsS0FBUixJQUFpQixFQUE3QjtBQUNBLEtBQUksWUFBSjs7QUFFQTtBQUNBLEtBQUksQ0FBQywwQkFBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUwsRUFBcUM7QUFDcEMsVUFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNELEtBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDbEMsVUFBUSxJQUFSLENBQWEsc0JBQWI7QUFDQSxTQUFPLEtBQVA7QUFDQTs7QUFFRDtBQUNBLEtBQUksV0FBVyxhQUFmLEVBQThCO0FBQzdCLFFBQU0sWUFBWSxLQUFaLEVBQW1CLE9BQW5CLENBQU47QUFDQSxFQUZELE1BRU8sSUFBSSxXQUFXLGdCQUFmLEVBQWlDO0FBQ3ZDLFFBQU0sZUFBZSxLQUFmLEVBQXNCLE9BQXRCLENBQU47QUFDQTs7QUFFRCxRQUFPLEdBQVA7QUFDQTs7UUFFUSxhLEdBQUEsYSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQgfSBmcm9tICcuL3V0aWxzL2Vudmlyb25tZW50JztcbmltcG9ydCB7IGdldE5vZGVEYXRhIH0gZnJvbSAnLi91dGlscy9odG1sJztcblxuLy8gR2xvYmFsIGZ1bmN0aW9ucyBhbmQgdG9vbHNcbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vdXRpbHMvZ2xvYmFscyc7XG5cbi8vIEJhc2ljIG1vZHVsZXNcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY2xhc3MgQXBwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cblx0XHQkZG9jdW1lbnQub24oJ2luaXRNb2R1bGVzLkFwcCcsIChldmVudCkgPT4ge1xuXHRcdFx0dGhpcy5pbml0R2xvYmFscyhldmVudC5maXJzdEJsb29kKVxuXHRcdFx0XHQuZGVsZXRlTW9kdWxlcygpXG5cdFx0XHRcdC5pbml0TW9kdWxlcygpO1xuXHRcdH0pO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlc3Ryb3kgYWxsIGV4aXN0aW5nIG1vZHVsZXNcblx0ICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuXHQgKi9cblx0ZGVsZXRlTW9kdWxlcygpIHtcblx0XHQvLyBMb29wIG1vZHVsZXNcblx0XHR2YXIgaSA9IHRoaXMuY3VycmVudE1vZHVsZXMubGVuZ3RoO1xuXG5cdFx0Ly8gRGVzdHJveSBhbGwgbW9kdWxlc1xuXHRcdHdoaWxlIChpLS0pIHtcblx0XHRcdHRoaXMuY3VycmVudE1vZHVsZXNbaV0uZGVzdHJveSgpO1xuXHRcdFx0dGhpcy5jdXJyZW50TW9kdWxlcy5zcGxpY2UoaSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuXHQgKiBBbGxvd3MgeW91IHRvIGluaXRpYWxpemUgZ2xvYmFsIG1vZHVsZXMgb25seSBvbmNlIGlmIHlvdSBuZWVkXG5cdCAqIChleC46IHdoZW4gdXNpbmcgQmFyYmEuanMgb3IgU21vb3RoU3RhdGUuanMpXG5cdCAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcblx0ICovXG5cdGluaXRHbG9iYWxzKGZpcnN0Qmxvb2QpIHtcblx0XHRnbG9iYWxzKGZpcnN0Qmxvb2QpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG5cdCAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcblx0ICovXG5cdGluaXRNb2R1bGVzKCkge1xuICAgICAgICAvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuICAgICAgICB2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuICAgICAgICAgICAgLy8gQ3VycmVudCBlbGVtZW50XG4gICAgICAgICAgICBsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cbiAgICAgICAgICAgIC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBnZXROb2RlRGF0YShlbCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjdXJyZW50IERPTSBlbGVtZW50IGFuZCBqUXVlcnkgZWxlbWVudFxuICAgICAgICAgICAgb3B0aW9ucy5lbCA9IGVsO1xuICAgICAgICAgICAgb3B0aW9ucy4kZWwgPSAkKGVsKTtcblxuICAgICAgICAgICAgLy8gTW9kdWxlIGRvZXMgZXhpc3QgYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgbGV0IGF0dHIgPSBvcHRpb25zLm1vZHVsZTtcblxuICAgICAgICAgICAgLy8gU3BsaXR0aW5nIG1vZHVsZXMgZm91bmQgaW4gdGhlIGRhdGEtYXR0cmlidXRlXG4gICAgICAgICAgICBsZXQgbW9kdWxlSWRlbnRzID0gYXR0ci5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJyk7XG5cbiAgICAgICAgICAgIC8vIExvb3AgbW9kdWxlc1xuICAgICAgICAgICAgbGV0IGogPSAwO1xuICAgICAgICAgICAgbGV0IG1vZHVsZXNMZW4gPSBtb2R1bGVJZGVudHMubGVuZ3RoO1xuXG4gICAgICAgICAgICBmb3IgKDsgaiA8IG1vZHVsZXNMZW47IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZHVsZXMucHVzaChtb2R1bGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cblxuLy8gSUlGRSBmb3IgbG9hZGluZyB0aGUgYXBwbGljYXRpb25cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4oZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LkFwcCA9IG5ldyBBcHAoKTtcbiAgICAkZG9jdW1lbnQudHJpZ2dlcih7XG4gICAgICAgIHR5cGU6ICdpbml0TW9kdWxlcy5BcHAnLFxuICAgICAgICBmaXJzdEJsb29kOiB0cnVlXG4gICAgfSk7XG59KSgpO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xudmFyIGlzQW5pbWF0aW5nID0gZmFsc2U7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgICBlYXNpbmc6ICdzd2luZycsXG4gICAgaGVhZGVyT2Zmc2V0OiA2MCxcbiAgICBzcGVlZDogMzAwXG59O1xuXG4vKipcbiAqIHNjcm9sbFRvIGlzIGEgZnVuY3Rpb24gdGhhdCBzY3JvbGxzIGEgY29udGFpbmVyIHRvIGFuIGVsZW1lbnQncyBwb3NpdGlvbiB3aXRoaW4gdGhhdCBjb250cm9sbGVyXG4gKiBVc2VzIGpRdWVyeSdzICQuRGVmZXJyZWQgdG8gYWxsb3cgdXNpbmcgYSBjYWxsYmFjayBvbiBhbmltYXRpb24gY29tcGxldGlvblxuICogQHBhcmFtICAge29iamVjdH0gICRlbGVtZW50ICBBIGpRdWVyeSBub2RlXG4gKiBAcGFyYW0gICB7b2JqZWN0fSAgb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Nyb2xsVG8oJGVsZW1lbnQsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSAkLkRlZmVycmVkKCk7XG5cbiAgICAvLyBEcm9wIGV2ZXJ5dGhpbmcgaWYgdGhpcyBhaW4ndCBhIGpRdWVyeSBvYmplY3RcbiAgICBpZiAoJGVsZW1lbnQgaW5zdGFuY2VvZiBqUXVlcnkgJiYgJGVsZW1lbnQubGVuZ3RoID4gMCkge1xuXG4gICAgICAgIC8vIE1lcmdpbmcgb3B0aW9uc1xuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCAodHlwZW9mIG9wdGlvbnMgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucyA6IHt9KSk7XG5cbiAgICAgICAgLy8gUHJldmVudHMgYWNjdW11bGF0aW9uIG9mIGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlzQW5pbWF0aW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBEZWZhdWx0IGNvbnRhaW5lciB0aGF0IHdlJ2xsIGJlIHNjcm9sbGluZ1xuICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSAkKCdodG1sLCBib2R5Jyk7XG4gICAgICAgICAgICB2YXIgZWxlbWVudE9mZnNldCA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRlc3RpbmcgY29udGFpbmVyIGluIG9wdGlvbnMgZm9yIGpRdWVyeS1uZXNzXG4gICAgICAgICAgICAvLyBJZiB3ZSdyZSBub3QgdXNpbmcgYSBjdXN0b20gY29udGFpbmVyLCB3ZSB0YWtlIHRoZSB0b3AgZG9jdW1lbnQgb2Zmc2V0XG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUsIHdlIHVzZSB0aGUgZWxlbWVudHMgcG9zaXRpb24gcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLiRjb250YWluZXIgIT09ICd1bmRlZmluZWQnICYmIG9wdGlvbnMuJGNvbnRhaW5lciBpbnN0YW5jZW9mIGpRdWVyeSAmJiBvcHRpb25zLiRjb250YWluZXIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSBvcHRpb25zLiRjb250YWluZXI7XG4gICAgICAgICAgICAgICAgZWxlbWVudE9mZnNldCA9ICRlbGVtZW50LnBvc2l0aW9uKCkudG9wXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVsZW1lbnRPZmZzZXQgPSAkZWxlbWVudC5vZmZzZXQoKS50b3BcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJGNvbnRhaW5lci5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IGVsZW1lbnRPZmZzZXQgLSBvcHRpb25zLmhlYWRlck9mZnNldFxuICAgICAgICAgICAgfSwgb3B0aW9ucy5zcGVlZCwgb3B0aW9ucy5lYXNpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IHtkZWZhdWx0IGFzIEJ1dHRvbn0gZnJvbSAnLi9tb2R1bGVzL0J1dHRvbic7XG5leHBvcnQge2RlZmF1bHQgYXMgVGl0bGV9IGZyb20gJy4vbW9kdWxlcy9UaXRsZSc7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuLyoqXG4gKiBBYnN0cmFjdCBtb2R1bGVcbiAqIEdpdmVzIGFjY2VzcyB0byBnZW5lcmljIGpRdWVyeSBub2Rlc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLiRkb2N1bWVudCA9ICRkb2N1bWVudDtcblx0XHR0aGlzLiR3aW5kb3cgPSAkd2luZG93O1xuXHRcdHRoaXMuJGh0bWwgPSAkaHRtbDtcblx0XHR0aGlzLiRib2R5ID0gJGJvZHk7XG5cdFx0dGhpcy4kZWwgPSBvcHRpb25zLiRlbDtcblx0XHR0aGlzLmVsID0gb3B0aW9ucy5lbDtcblx0fVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy4kZWwub24oJ2NsaWNrLkJ1dHRvbicsIChldmVudCkgPT4ge1xuXHRcdFx0dGhpcy4kZG9jdW1lbnQudHJpZ2dlcignVGl0bGUuY2hhbmdlTGFiZWwnLCBbJChldmVudC5jdXJyZW50VGFyZ2V0KS52YWwoKV0pO1xuXHRcdH0pO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRlbC5vZmYoJy5CdXR0b24nKTtcblx0fVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgdmlzaWJpbGl0eUFwaSB9IGZyb20gJy4uL3V0aWxzL3Zpc2liaWxpdHknO1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy4kbGFiZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtbGFiZWwnKTtcblxuXHRcdHRoaXMuJGRvY3VtZW50Lm9uKCdUaXRsZS5jaGFuZ2VMYWJlbCcsIChldmVudCwgdmFsdWUpID0+IHtcblx0XHRcdHRoaXMuY2hhbmdlTGFiZWwodmFsdWUpO1xuXHRcdFx0dGhpcy5kZXN0cm95KCk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLmhpZGRlbkNhbGxiYWNrSWRlbnQgPSB2aXNpYmlsaXR5QXBpKHtcblx0XHRcdGFjdGlvbjogJ2FkZENhbGxiYWNrJyxcblx0XHRcdHN0YXRlOiAnaGlkZGVuJyxcblx0XHRcdGNhbGxiYWNrOiB0aGlzLmxvZ0hpZGRlblxuXHRcdH0pO1xuXG5cdFx0dGhpcy52aXNpYmxlQ2FsbGJhY2tJZGVudCA9IHZpc2liaWxpdHlBcGkoe1xuXHRcdFx0YWN0aW9uOiAnYWRkQ2FsbGJhY2snLFxuXHRcdFx0c3RhdGU6ICd2aXNpYmxlJyxcblx0XHRcdGNhbGxiYWNrOiB0aGlzLmxvZ1Zpc2libGVcblx0XHR9KTtcblx0fVxuXG5cdGxvZ0hpZGRlbigpIHtcblx0XHRjb25zb2xlLmxvZygnVGl0bGUgaXMgaGlkZGVuJyk7XG5cdH1cblxuXHRsb2dWaXNpYmxlKCkge1xuXHRcdGNvbnNvbGUubG9nKCdUaXRsZSBpcyB2aXNpYmxlJyk7XG5cdH1cblxuXHRjaGFuZ2VMYWJlbCh2YWx1ZSkge1xuXHRcdHRoaXMuJGxhYmVsLnRleHQodmFsdWUpO1xuXHR9XG5cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRkb2N1bWVudC5vZmYoJ1RpdGxlLmNoYW5nZUxhYmVsJyk7XG5cblx0XHR2aXNpYmlsaXR5QXBpKHtcblx0XHRcdGFjdGlvbjogJ3JlbW92ZUNhbGxiYWNrJyxcblx0XHRcdHN0YXRlOiAnaGlkZGVuJyxcblx0XHRcdGlkZW50OiB0aGlzLmhpZGRlbkNhbGxiYWNrSWRlbnRcblx0XHR9KTtcblxuXHRcdHZpc2liaWxpdHlBcGkoe1xuXHRcdFx0YWN0aW9uOiAncmVtb3ZlQ2FsbGJhY2snLFxuXHRcdFx0c3RhdGU6ICd2aXNpYmxlJyxcblx0XHRcdGlkZW50OiB0aGlzLnZpc2libGVDYWxsYmFja0lkZW50XG5cdFx0fSk7XG5cblx0XHR0aGlzLiRlbC5vZmYoJy5UaXRsZScpO1xuXHR9XG59XG4iLCJpbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi9pcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRUb0FycmF5ICggYXJyYXksIHZhbHVlICkge1xuXHR2YXIgaW5kZXggPSBhcnJheS5pbmRleE9mKCB2YWx1ZSApO1xuXG5cdGlmICggaW5kZXggPT09IC0xICkge1xuXHRcdGFycmF5LnB1c2goIHZhbHVlICk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGFpbnMgKCBhcnJheSwgdmFsdWUgKSB7XG5cdGZvciAoIGxldCBpID0gMCwgYyA9IGFycmF5Lmxlbmd0aDsgaSA8IGM7IGkrKyApIHtcblx0XHRpZiAoIGFycmF5W2ldID09IHZhbHVlICkge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250ZW50c01hdGNoICggYSwgYiApIHtcblx0dmFyIGk7XG5cblx0aWYgKCAhaXNBcnJheSggYSApIHx8ICFpc0FycmF5KCBiICkgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aWYgKCBhLmxlbmd0aCAhPT0gYi5sZW5ndGggKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0aSA9IGEubGVuZ3RoO1xuXHR3aGlsZSAoIGktLSApIHtcblx0XHRpZiAoIGFbaV0gIT09IGJbaV0gKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnN1cmVBcnJheSAoIHggKSB7XG5cdGlmICggdHlwZW9mIHggPT09ICdzdHJpbmcnICkge1xuXHRcdHJldHVybiBbIHggXTtcblx0fVxuXG5cdGlmICggeCA9PT0gdW5kZWZpbmVkICkge1xuXHRcdHJldHVybiBbXTtcblx0fVxuXG5cdHJldHVybiB4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbGFzdEl0ZW0gKCBhcnJheSApIHtcblx0cmV0dXJuIGFycmF5WyBhcnJheS5sZW5ndGggLSAxIF07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVGcm9tQXJyYXkgKCBhcnJheSwgbWVtYmVyICkge1xuXHRpZiAoICFhcnJheSApIHtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YoIG1lbWJlciApO1xuXG5cdGlmICggaW5kZXggIT09IC0xICkge1xuXHRcdGFycmF5LnNwbGljZSggaW5kZXgsIDEgKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9BcnJheSAoIGFycmF5TGlrZSApIHtcblx0dmFyIGFycmF5ID0gW10sIGkgPSBhcnJheUxpa2UubGVuZ3RoO1xuXHR3aGlsZSAoIGktLSApIHtcblx0XHRhcnJheVtpXSA9IGFycmF5TGlrZVtpXTtcblx0fVxuXG5cdHJldHVybiBhcnJheTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRCeUtleVZhbHVlKCBhcnJheSwga2V5LCB2YWx1ZSApIHtcblx0cmV0dXJuIGFycmF5LmZpbHRlcihmdW5jdGlvbiggb2JqICkge1xuXHRcdHJldHVybiBvYmpba2V5XSA9PT0gdmFsdWU7XG5cdH0pO1xufVxuIiwiY29uc3QgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XG5jb25zdCAkd2luZG93ID0gJCh3aW5kb3cpO1xuY29uc3QgJGh0bWwgPSAkKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5jb25zdCAkYm9keSA9ICQoZG9jdW1lbnQuYm9keSk7XG5cbmV4cG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH07XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRzdmc0ZXZlcnlib2R5KCk7XG59XG4iLCIvKipcbiAqIEBzZWUgIGh0dHBzOi8vZ2l0aHViLmNvbS9yYWN0aXZlanMvcmFjdGl2ZS9ibG9iL2Rldi9zcmMvdXRpbHMvaHRtbC5qc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlSHRtbChzdHIpIHtcbiAgICByZXR1cm4gc3RyXG4gICAgICAgIC5yZXBsYWNlKC8mL2csICcmYW1wOycpXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcbiAgICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIEhUTUwgY29udGVudCB0aGF0IGNvbnRhaW5zIG11c3RhY2hlIGNoYXJhY3RlcnMgZm9yIHVzZSB3aXRoIFJhY3RpdmVcbiAqIEBwYXJhbSAge3N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmVzY2FwZUh0bWwoc3RyKSB7XG4gICAgcmV0dXJuIHN0clxuICAgICAgICAucmVwbGFjZSgvJmx0Oy9nLCAnPCcpXG4gICAgICAgIC5yZXBsYWNlKC8mZ3Q7L2csICc+JylcbiAgICAgICAgLnJlcGxhY2UoLyZhbXA7L2csICcmJyk7XG59XG5cbi8qKlxuICogR2V0IGVsZW1lbnQgZGF0YSBhdHRyaWJ1dGVzXG4gKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIG5vZGVcbiAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZURhdGEobm9kZSkge1xuICAgIC8vIEFsbCBhdHRyaWJ1dGVzXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XG5cbiAgICAvLyBSZWdleCBQYXR0ZXJuXG4gICAgdmFyIHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cbiAgICAvLyBPdXRwdXRcbiAgICB2YXIgZGF0YSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghYXR0cmlidXRlc1tpXSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcbiAgICAgICAgbGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cbiAgICAgICAgLy8gVGhpcyBoYXBwZW5zLlxuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcbiAgICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuICAgICAgICAvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cbiAgICAgICAgZGF0YVttYXRjaFsxXV0gPSBub2RlLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG5cdHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG5cdHJldHVybiBhcnJheUxpa2VQYXR0ZXJuLnRlc3QoIHRvU3RyaW5nLmNhbGwoIG9iaiApICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VxdWFsICggYSwgYiApIHtcblx0aWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIGEgPT09IGI7XG59XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODIvdmFsaWRhdGUtbnVtYmVycy1pbi1qYXZhc2NyaXB0LWlzbnVtZXJpY1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyAoIHRoaW5nICkge1xuXHRyZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuXHRyZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG5cdHZhciBnZXRUeXBlID0ge307XG5cdHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuXHRoaWRkZW46IFtdLFxuXHR2aXNpYmxlOiBbXVxufTtcblxuY29uc3QgQUNUSU9OUyA9IFtcblx0J2FkZENhbGxiYWNrJyxcblx0J3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuXHQndmlzaWJsZScsXG5cdCdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGlmIChkb2N1bWVudC5oaWRkZW4pIHtcblx0XHRvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcblx0fSBlbHNlIHtcblx0XHRvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG5cdH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuXHRsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8ICcnO1xuXG5cdGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcblx0XHRjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0bGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG5cdENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG5cdFx0aWRlbnQ6IGlkZW50LFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9KTtcblxuXHRyZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG5cdGxldCBpZGVudCA9IG9wdGlvbnMuaWRlbnQgfHwgJyc7XG5cblx0aWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuXHRcdGNvbnNvbGUud2FybignTmVlZCBpZGVudCB0byByZW1vdmUgY2FsbGJhY2snKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cblx0Ly8gY29uc29sZS5sb2coaWRlbnQpXG5cdC8vIGNvbnNvbGUubG9nKENBTExCQUNLU1tzdGF0ZV0pXG5cblx0aWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmVtb3ZlRnJvbUFycmF5KENBTExCQUNLU1tzdGF0ZV0sIGluZGV4KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuXHRsZXQgY2FsbGJhY2tBcnJheSA9IENBTExCQUNLU1tzdGF0ZV07XG5cdGxldCBpID0gMDtcblx0bGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG5cdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgZmFjaW5nIEFQSSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBjYWxsYmFja3NcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAgICAgICAgICBvcHRpb25zICBPcHRpb25zXG4gKiBAcmV0dXJuICB7Ym9vbGVhbnxpbnRlZ2VyfSAgICAgICAgICAgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjYWxsYmFjayBvciBib29sZWFuIGluZGljYXRpbmcgc3VjY2VzcyBvciBmYWlsdXJlXG4gKi9cbmZ1bmN0aW9uIHZpc2liaWxpdHlBcGkgKG9wdGlvbnMpIHtcblx0bGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuXHRsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuXHRsZXQgcmV0O1xuXG5cdC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG5cdGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG5cdFx0Y29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG5cdFx0Y29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG5cdGlmIChhY3Rpb24gPT09ICdhZGRDYWxsYmFjaycpIHtcblx0XHRyZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG5cdH0gZWxzZSBpZiAoYWN0aW9uID09PSAncmVtb3ZlQ2FsbGJhY2snKSB7XG5cdFx0cmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
