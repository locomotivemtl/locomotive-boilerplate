(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


var _globals = require('./utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);

		this.modules = modules;
		this.currentModules = [];
	}

	/**
  * Execute global functions and settings
  * @return {Object}
  */


	_createClass(App, [{
		key: 'initGlobals',
		value: function initGlobals() {
			(0, _globals2.default)();
			return this;
		}

		/**
   * Find modules and initialize them
   * @return  {Object}  this  Allows chaining
   */

	}, {
		key: 'initModules',
		value: function initModules() {
			// Elements with module
			var moduleEls = document.querySelectorAll('[data-module]');

			// Loop through elements
			var i = 0;
			var elsLen = moduleEls.length;

			for (; i < elsLen; i++) {

				// Current element
				var el = moduleEls[i];

				// All data- attributes considered as options
				var options = this.getElemData(el);

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
		}

		/**
   * Get element data attributes
   * @param   {DOMElement}  el
   * @return  {Array}       data
   */

	}, {
		key: 'getElemData',
		value: function getElemData(el) {
			// All attributes
			var attributes = el.attributes;

			// Regex Pattern
			var pattern = /^data\-(.+)$/;

			// Output
			var data = {};

			for (var i in attributes) {
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
				data[match[1]] = el.getAttribute(name);
			}

			return data;
		}

		/**
   * Initialize app after document ready
   */

	}, {
		key: 'init',
		value: function init() {
			this.initGlobals().initModules();
		}
	}]);

	return App;
}();

$(function () {
	window.app = new App();
	window.app.init();
});

},{"./modules":3,"./utils/globals":9}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	svg4everybody();
};

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
};

exports.default = _class;

},{"../utils/environment":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, options));

		_this.$el.on('click.Button', function (event) {
			_this.$document.trigger('Title.changeLabel', [$(event.currentTarget).val()]);
		});
		return _this;
	}

	_createClass(_class, [{
		key: 'destroy',
		value: function destroy() {
			this.$el.off('.Button');
		}
	}]);

	return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"./AbstractModule":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, options));

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

	_createClass(_class, [{
		key: 'logHidden',
		value: function logHidden() {
			console.log('Title is hidden');
		}
	}, {
		key: 'logVisible',
		value: function logVisible() {
			console.log('Title is visible');
		}
	}, {
		key: 'changeLabel',
		value: function changeLabel(value) {
			this.$label.text(value);
		}
	}, {
		key: 'destroy',
		value: function destroy() {
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
		}
	}]);

	return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/visibility":11,"./AbstractModule":4}],7:[function(require,module,exports){
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

},{"./is":10}],8:[function(require,module,exports){
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
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	(0, _svg2.default)();
};

var _svg = require('../global/svg');

var _svg2 = _interopRequireDefault(_svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../global/svg":2}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{"./array":7,"./environment":8,"./is":10}]},{},[1,2,3,4,5,6,7,8,9,10,11])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc3ZnLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0J1dHRvbi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvVGl0bGUuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9hcnJheS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvZ2xvYmFscy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQ0E7Ozs7QUFDQTs7SUFBWSxPOzs7Ozs7OztJQUVOLEc7QUFDTCxnQkFBYztBQUFBOztBQUNiLE9BQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxPQUFLLGNBQUwsR0FBc0IsRUFBdEI7QUFDQTs7Ozs7Ozs7OztnQ0FNYTtBQUNiO0FBQ0EsVUFBTyxJQUFQO0FBQ0E7Ozs7Ozs7OztnQ0FNYTs7QUFFYixPQUFJLFlBQVksU0FBUyxnQkFBVCxDQUEwQixlQUExQixDQUFoQjs7O0FBR0EsT0FBSSxJQUFJLENBQVI7QUFDQSxPQUFJLFNBQVMsVUFBVSxNQUF2Qjs7QUFFQSxVQUFPLElBQUksTUFBWCxFQUFtQixHQUFuQixFQUF3Qjs7O0FBR3ZCLFFBQUksS0FBSyxVQUFVLENBQVYsQ0FBVDs7O0FBR0EsUUFBSSxVQUFVLEtBQUssV0FBTCxDQUFpQixFQUFqQixDQUFkOzs7QUFHQSxZQUFRLEVBQVIsR0FBYSxFQUFiO0FBQ0EsWUFBUSxHQUFSLEdBQWMsRUFBRSxFQUFGLENBQWQ7OztB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QUNBO0FBQ0Q7Ozs7Ozs7QUFPRCxTQUFTLGFBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDaEMsS0FBSSxTQUFTLFFBQVEsTUFBUixJQUFrQixFQUEvQjtBQUNBLEtBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7QUFDQSxLQUFJLFlBQUo7OztBQUdBLEtBQUksQ0FBQywwQkFBYyxPQUFkLEVBQXVCLE1BQXZCLENBQUwsRUFBcUM7QUFDcEMsVUFBUSxJQUFSLENBQWEsdUJBQWI7QUFDQSxTQUFPLEtBQVA7QUFDQTtBQUNELEtBQUksQ0FBQywwQkFBYyxNQUFkLEVBQXNCLEtBQXRCLENBQUwsRUFBbUM7QUFDbEMsVUFBUSxJQUFSLENBQWEsc0JBQWI7QUFDQSxTQUFPLEtBQVA7QUFDQTs7O0FBR0QsS0FBSSxXQUFXLGFBQWYsRUFBOEI7QUFDN0IsUUFBTSxZQUFZLEtBQVosRUFBbUIsT0FBbkIsQ0FBTjtBQUNBLEVBRkQsTUFFTyxJQUFJLFdBQVcsZ0JBQWYsRUFBaUM7QUFDdkMsUUFBTSxlQUFlLEtBQWYsRUFBc0IsT0FBdEIsQ0FBTjtBQUNBOztBQUVELFFBQU8sR0FBUDtBQUNBOztRQUVRLGEsR0FBQSxhIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vdXRpbHMvZ2xvYmFscyc7XG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cdFx0dGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgZ2xvYmFsIGZ1bmN0aW9ucyBhbmQgc2V0dGluZ3Ncblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0aW5pdEdsb2JhbHMoKSB7XG5cdFx0Z2xvYmFscygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG5cdCAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcblx0ICovXG5cdGluaXRNb2R1bGVzKCkge1xuXHRcdC8vIEVsZW1lbnRzIHdpdGggbW9kdWxlXG5cdFx0dmFyIG1vZHVsZUVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcblxuXHRcdC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgZWxzTGVuID0gbW9kdWxlRWxzLmxlbmd0aDtcblxuXHRcdGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuXHRcdFx0Ly8gQ3VycmVudCBlbGVtZW50XG5cdFx0XHRsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cblx0XHRcdC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuXHRcdFx0bGV0IG9wdGlvbnMgPSB0aGlzLmdldEVsZW1EYXRhKGVsKTtcblxuXHRcdFx0Ly8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG5cdFx0XHRvcHRpb25zLmVsID0gZWw7XG5cdFx0XHRvcHRpb25zLiRlbCA9ICQoZWwpO1xuXG5cdFx0XHQvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG5cdFx0XHRsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG5cdFx0XHQvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcblx0XHRcdGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnJlcGxhY2UoL1xccy9nLCAnJykuc3BsaXQoJywnKTtcblxuXHRcdFx0Ly8gTG9vcCBtb2R1bGVzXG5cdFx0XHRsZXQgaiA9IDA7XG5cdFx0XHRsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG5cdFx0XHRcdGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0bGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcblx0ICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBlbFxuXHQgKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcblx0ICovXG5cdGdldEVsZW1EYXRhKGVsKSB7XG5cdFx0Ly8gQWxsIGF0dHJpYnV0ZXNcblx0XHR2YXIgYXR0cmlidXRlcyA9IGVsLmF0dHJpYnV0ZXM7XG5cblx0XHQvLyBSZWdleCBQYXR0ZXJuXG5cdFx0dmFyIHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cblx0XHQvLyBPdXRwdXRcblx0XHR2YXIgZGF0YSA9IHt9O1xuXG5cdFx0Zm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHQvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcblx0XHRcdGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG5cdFx0XHQvLyBUaGlzIGhhcHBlbnMuXG5cdFx0XHRpZiAoIW5hbWUpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG5cdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuXHRcdFx0Ly8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG5cdFx0XHRkYXRhW21hdGNoWzFdXSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGFwcCBhZnRlciBkb2N1bWVudCByZWFkeVxuXHQgKi9cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRHbG9iYWxzKCkuaW5pdE1vZHVsZXMoKTtcblx0fVxufVxuXG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5kb3cuYXBwID0gbmV3IEFwcCgpO1xuXHR3aW5kb3cuYXBwLmluaXQoKTtcbn0pO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdHN2ZzRldmVyeWJvZHkoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBCdXR0b259IGZyb20gJy4vbW9kdWxlcy9CdXR0b24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFRpdGxlfSBmcm9tICcuL21vZHVsZXMvVGl0bGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbi8qKlxuICogQWJzdHJhY3QgbW9kdWxlXG4gKiBHaXZlcyBhY2Nlc3MgdG8gZ2VuZXJpYyBqUXVlcnkgbm9kZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3Mge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0dGhpcy4kZG9jdW1lbnQgPSAkZG9jdW1lbnQ7XG5cdFx0dGhpcy4kd2luZG93ID0gJHdpbmRvdztcblx0XHR0aGlzLiRodG1sID0gJGh0bWw7XG5cdFx0dGhpcy4kYm9keSA9ICRib2R5O1xuXHRcdHRoaXMuJGVsID0gb3B0aW9ucy4kZWw7XG5cdH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMuJGVsLm9uKCdjbGljay5CdXR0b24nLCAoZXZlbnQpID0+IHtcblx0XHRcdHRoaXMuJGRvY3VtZW50LnRyaWdnZXIoJ1RpdGxlLmNoYW5nZUxhYmVsJywgWyQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCldKTtcblx0XHR9KTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwub2ZmKCcuQnV0dG9uJyk7XG5cdH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7IHZpc2liaWxpdHlBcGkgfSBmcm9tICcuLi91dGlscy92aXNpYmlsaXR5JztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMuJGxhYmVsID0gdGhpcy4kZWwuZmluZCgnLmpzLWxhYmVsJyk7XG5cblx0XHR0aGlzLiRkb2N1bWVudC5vbignVGl0bGUuY2hhbmdlTGFiZWwnLCAoZXZlbnQsIHZhbHVlKSA9PiB7XG5cdFx0XHR0aGlzLmNoYW5nZUxhYmVsKHZhbHVlKTtcblx0XHRcdHRoaXMuZGVzdHJveSgpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5oaWRkZW5DYWxsYmFja0lkZW50ID0gdmlzaWJpbGl0eUFwaSh7XG5cdFx0XHRhY3Rpb246ICdhZGRDYWxsYmFjaycsXG5cdFx0XHRzdGF0ZTogJ2hpZGRlbicsXG5cdFx0XHRjYWxsYmFjazogdGhpcy5sb2dIaWRkZW5cblx0XHR9KTtcblxuXHRcdHRoaXMudmlzaWJsZUNhbGxiYWNrSWRlbnQgPSB2aXNpYmlsaXR5QXBpKHtcblx0XHRcdGFjdGlvbjogJ2FkZENhbGxiYWNrJyxcblx0XHRcdHN0YXRlOiAndmlzaWJsZScsXG5cdFx0XHRjYWxsYmFjazogdGhpcy5sb2dWaXNpYmxlXG5cdFx0fSk7XG5cdH1cblxuXHRsb2dIaWRkZW4oKSB7XG5cdFx0Y29uc29sZS5sb2coJ1RpdGxlIGlzIGhpZGRlbicpO1xuXHR9XG5cblx0bG9nVmlzaWJsZSgpIHtcblx0XHRjb25zb2xlLmxvZygnVGl0bGUgaXMgdmlzaWJsZScpO1xuXHR9XG5cblx0Y2hhbmdlTGFiZWwodmFsdWUpIHtcblx0XHR0aGlzLiRsYWJlbC50ZXh0KHZhbHVlKTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZG9jdW1lbnQub2ZmKCdUaXRsZS5jaGFuZ2VMYWJlbCcpO1xuXG5cdFx0dmlzaWJpbGl0eUFwaSh7XG5cdFx0XHRhY3Rpb246ICdyZW1vdmVDYWxsYmFjaycsXG5cdFx0XHRzdGF0ZTogJ2hpZGRlbicsXG5cdFx0XHRpZGVudDogdGhpcy5oaWRkZW5DYWxsYmFja0lkZW50XG5cdFx0fSk7XG5cblx0XHR2aXNpYmlsaXR5QXBpKHtcblx0XHRcdGFjdGlvbjogJ3JlbW92ZUNhbGxiYWNrJyxcblx0XHRcdHN0YXRlOiAndmlzaWJsZScsXG5cdFx0XHRpZGVudDogdGhpcy52aXNpYmxlQ2FsbGJhY2tJZGVudFxuXHRcdH0pO1xuXG5cdFx0dGhpcy4kZWwub2ZmKCcuVGl0bGUnKTtcblx0fVxufVxuIiwiaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4vaXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkVG9BcnJheSAoIGFycmF5LCB2YWx1ZSApIHtcblx0dmFyIGluZGV4ID0gYXJyYXkuaW5kZXhPZiggdmFsdWUgKTtcblxuXHRpZiAoIGluZGV4ID09PSAtMSApIHtcblx0XHRhcnJheS5wdXNoKCB2YWx1ZSApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRhaW5zICggYXJyYXksIHZhbHVlICkge1xuXHRmb3IgKCBsZXQgaSA9IDAsIGMgPSBhcnJheS5sZW5ndGg7IGkgPCBjOyBpKysgKSB7XG5cdFx0aWYgKCBhcnJheVtpXSA9PSB2YWx1ZSApIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5Q29udGVudHNNYXRjaCAoIGEsIGIgKSB7XG5cdHZhciBpO1xuXG5cdGlmICggIWlzQXJyYXkoIGEgKSB8fCAhaXNBcnJheSggYiApICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGlmICggYS5sZW5ndGggIT09IGIubGVuZ3RoICkge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGkgPSBhLmxlbmd0aDtcblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0aWYgKCBhW2ldICE9PSBiW2ldICkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0fVxuXG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlQXJyYXkgKCB4ICkge1xuXHRpZiAoIHR5cGVvZiB4ID09PSAnc3RyaW5nJyApIHtcblx0XHRyZXR1cm4gWyB4IF07XG5cdH1cblxuXHRpZiAoIHggPT09IHVuZGVmaW5lZCApIHtcblx0XHRyZXR1cm4gW107XG5cdH1cblxuXHRyZXR1cm4geDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RJdGVtICggYXJyYXkgKSB7XG5cdHJldHVybiBhcnJheVsgYXJyYXkubGVuZ3RoIC0gMSBdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlRnJvbUFycmF5ICggYXJyYXksIG1lbWJlciApIHtcblx0aWYgKCAhYXJyYXkgKSB7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0Y29uc3QgaW5kZXggPSBhcnJheS5pbmRleE9mKCBtZW1iZXIgKTtcblxuXHRpZiAoIGluZGV4ICE9PSAtMSApIHtcblx0XHRhcnJheS5zcGxpY2UoIGluZGV4LCAxICk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkgKCBhcnJheUxpa2UgKSB7XG5cdHZhciBhcnJheSA9IFtdLCBpID0gYXJyYXlMaWtlLmxlbmd0aDtcblx0d2hpbGUgKCBpLS0gKSB7XG5cdFx0YXJyYXlbaV0gPSBhcnJheUxpa2VbaV07XG5cdH1cblxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQnlLZXlWYWx1ZSggYXJyYXksIGtleSwgdmFsdWUgKSB7XG5cdHJldHVybiBhcnJheS5maWx0ZXIoZnVuY3Rpb24oIG9iaiApIHtcblx0XHRyZXR1cm4gb2JqW2tleV0gPT09IHZhbHVlO1xuXHR9KTtcbn1cbiIsImNvbnN0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xuY29uc3QgJHdpbmRvdyA9ICQod2luZG93KTtcbmNvbnN0ICRodG1sID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuY29uc3QgJGJvZHkgPSAkKGRvY3VtZW50LmJvZHkpO1xuXG5leHBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9O1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHN2ZyBmcm9tICcuLi9nbG9iYWwvc3ZnJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdHN2ZygpO1xufVxuIiwidmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxcblx0YXJyYXlMaWtlUGF0dGVybiA9IC9eXFxbb2JqZWN0ICg/OkFycmF5fEZpbGVMaXN0KVxcXSQvO1xuXG4vLyB0aGFua3MsIGh0dHA6Ly9wZXJmZWN0aW9ua2lsbHMuY29tL2luc3RhbmNlb2YtY29uc2lkZXJlZC1oYXJtZnVsLW9yLWhvdy10by13cml0ZS1hLXJvYnVzdC1pc2FycmF5L1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkgKCB0aGluZyApIHtcblx0cmV0dXJuIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5TGlrZSAoIG9iaiApIHtcblx0cmV0dXJuIGFycmF5TGlrZVBhdHRlcm4udGVzdCggdG9TdHJpbmcuY2FsbCggb2JqICkgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWwgKCBhLCBiICkge1xuXHRpZiAoIGEgPT09IG51bGwgJiYgYiA9PT0gbnVsbCApIHtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGlmICggdHlwZW9mIGEgPT09ICdvYmplY3QnIHx8IHR5cGVvZiBiID09PSAnb2JqZWN0JyApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRyZXR1cm4gYSA9PT0gYjtcbn1cblxuLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xODA4Mi92YWxpZGF0ZS1udW1iZXJzLWluLWphdmFzY3JpcHQtaXNudW1lcmljXG5leHBvcnQgZnVuY3Rpb24gaXNOdW1lcmljICggdGhpbmcgKSB7XG5cdHJldHVybiAhaXNOYU4oIHBhcnNlRmxvYXQoIHRoaW5nICkgKSAmJiBpc0Zpbml0ZSggdGhpbmcgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0ICggdGhpbmcgKSB7XG5cdHJldHVybiAoIHRoaW5nICYmIHRvU3RyaW5nLmNhbGwoIHRoaW5nICkgPT09ICdbb2JqZWN0IE9iamVjdF0nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKCB0aGluZyApIHtcblx0dmFyIGdldFR5cGUgPSB7fTtcblx0cmV0dXJuIHRoaW5nICYmIGdldFR5cGUudG9TdHJpbmcuY2FsbCh0aGluZykgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pcyc7XG5pbXBvcnQgeyBhcnJheUNvbnRhaW5zLCBmaW5kQnlLZXlWYWx1ZSwgcmVtb3ZlRnJvbUFycmF5IH0gZnJvbSAnLi9hcnJheSc7XG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4vZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG5cdGhpZGRlbjogW10sXG5cdHZpc2libGU6IFtdXG59O1xuXG5jb25zdCBBQ1RJT05TID0gW1xuXHQnYWRkQ2FsbGJhY2snLFxuXHQncmVtb3ZlQ2FsbGJhY2snXG5dO1xuXG5jb25zdCBTVEFURVMgPSBbXG5cdCd2aXNpYmxlJyxcblx0J2hpZGRlbidcbl07XG5cbmNvbnN0IFBSRUZJWCA9ICd2LSc7XG5cbmxldCBVVUlEID0gMDtcblxuLy8gTWFpbiBldmVudFxuJGRvY3VtZW50Lm9uKCd2aXNpYmlsaXR5Y2hhbmdlJywgZnVuY3Rpb24oZXZlbnQpIHtcblx0aWYgKGRvY3VtZW50LmhpZGRlbikge1xuXHRcdG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuXHR9IGVsc2Uge1xuXHRcdG9uRG9jdW1lbnRDaGFuZ2UoJ3Zpc2libGUnKTtcblx0fVxufSk7XG5cbi8qKlxuICogQWRkIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSAgIHN0YXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7c3RyaW5nfSAgaWRlbnRcbiAqL1xuZnVuY3Rpb24gYWRkQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG5cdGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2sgfHwgJyc7XG5cblx0aWYgKCFpc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuXHRcdGNvbnNvbGUud2FybignQ2FsbGJhY2sgaXMgbm90IGEgZnVuY3Rpb24nKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRsZXQgaWRlbnQgPSBQUkVGSVggKyBVVUlEKys7XG5cblx0Q0FMTEJBQ0tTW3N0YXRlXS5wdXNoKHtcblx0XHRpZGVudDogaWRlbnQsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrXG5cdH0pO1xuXG5cdHJldHVybiBpZGVudDtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYSBjYWxsYmFja1xuICogQHBhcmFtICB7c3RyaW5nfSAgIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICogQHBhcmFtICB7c3RyaW5nfSAgIGlkZW50ICBVbmlxdWUgaWRlbnRpZmllclxuICogQHJldHVybiB7Ym9vbGVhbn0gICAgICAgICBJZiBvcGVyYXRpb24gd2FzIGEgc3VjY2Vzc1xuICovXG5mdW5jdGlvbiByZW1vdmVDYWxsYmFjayAoc3RhdGUsIG9wdGlvbnMpIHtcblx0bGV0IGlkZW50ID0gb3B0aW9ucy5pZGVudCB8fCAnJztcblxuXHRpZiAodHlwZW9mKGlkZW50KSA9PT0gJ3VuZGVmaW5lZCcgfHwgaWRlbnQgPT09ICcnKSB7XG5cdFx0Y29uc29sZS53YXJuKCdOZWVkIGlkZW50IHRvIHJlbW92ZSBjYWxsYmFjaycpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGxldCBpbmRleCA9IGZpbmRCeUtleVZhbHVlKENBTExCQUNLU1tzdGF0ZV0sICdpZGVudCcsIGlkZW50KVswXTtcblxuXHQvLyBjb25zb2xlLmxvZyhpZGVudClcblx0Ly8gY29uc29sZS5sb2coQ0FMTEJBQ0tTW3N0YXRlXSlcblxuXHRpZiAodHlwZW9mKGluZGV4KSAhPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRyZW1vdmVGcm9tQXJyYXkoQ0FMTEJBQ0tTW3N0YXRlXSwgaW5kZXgpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUud2FybignQ2FsbGJhY2sgY291bGQgbm90IGJlIGZvdW5kJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbi8qKlxuICogV2hlbiBkb2N1bWVudCBzdGF0ZSBjaGFuZ2VzLCB0cmlnZ2VyIGNhbGxiYWNrc1xuICogQHBhcmFtICB7c3RyaW5nfSAgc3RhdGUgIFZpc2libGUgb3IgaGlkZGVuXG4gKi9cbmZ1bmN0aW9uIG9uRG9jdW1lbnRDaGFuZ2UgKHN0YXRlKSB7XG5cdGxldCBjYWxsYmFja0FycmF5ID0gQ0FMTEJBQ0tTW3N0YXRlXTtcblx0bGV0IGkgPSAwO1xuXHRsZXQgbGVuID0gY2FsbGJhY2tBcnJheS5sZW5ndGg7XG5cblx0Zm9yICg7IGkgPCBsZW47IGkrKykge1xuXHRcdGNhbGxiYWNrQXJyYXlbaV0uY2FsbGJhY2soKTtcblx0fVxufVxuXG4vKipcbiAqIFB1YmxpYyBmYWNpbmcgQVBJIGZvciBhZGRpbmcgYW5kIHJlbW92aW5nIGNhbGxiYWNrc1xuICogQHBhcmFtICAge29iamVjdH0gICAgICAgICAgIG9wdGlvbnMgIE9wdGlvbnNcbiAqIEByZXR1cm4gIHtib29sZWFufGludGVnZXJ9ICAgICAgICAgICBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNhbGxiYWNrIG9yIGJvb2xlYW4gaW5kaWNhdGluZyBzdWNjZXNzIG9yIGZhaWx1cmVcbiAqL1xuZnVuY3Rpb24gdmlzaWJpbGl0eUFwaSAob3B0aW9ucykge1xuXHRsZXQgYWN0aW9uID0gb3B0aW9ucy5hY3Rpb24gfHwgJyc7XG5cdGxldCBzdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgJyc7XG5cdGxldCByZXQ7XG5cblx0Ly8gVHlwZSBhbmQgdmFsdWUgY2hlY2tpbmdcblx0aWYgKCFhcnJheUNvbnRhaW5zKEFDVElPTlMsIGFjdGlvbikpIHtcblx0XHRjb25zb2xlLndhcm4oJ0FjdGlvbiBkb2VzIG5vdCBleGlzdCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHRpZiAoIWFycmF5Q29udGFpbnMoU1RBVEVTLCBzdGF0ZSkpIHtcblx0XHRjb25zb2xlLndhcm4oJ1N0YXRlIGRvZXMgbm90IGV4aXN0Jyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0Ly8gQHRvZG8gTWFnaWMgY2FsbCBmdW5jdGlvbiBwbHNcblx0aWYgKGFjdGlvbiA9PT0gJ2FkZENhbGxiYWNrJykge1xuXHRcdHJldCA9IGFkZENhbGxiYWNrKHN0YXRlLCBvcHRpb25zKTtcblx0fSBlbHNlIGlmIChhY3Rpb24gPT09ICdyZW1vdmVDYWxsYmFjaycpIHtcblx0XHRyZXQgPSByZW1vdmVDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyB2aXNpYmlsaXR5QXBpIH07XG4iXX0=
