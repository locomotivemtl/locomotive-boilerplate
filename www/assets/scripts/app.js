(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _globals = require('./utils/globals');

var _globals2 = _interopRequireDefault(_globals);

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */


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


	App.prototype.initGlobals = function initGlobals() {
		(0, _globals2.default)();
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
	};

	/**
  * Get element data attributes
  * @param   {DOMElement}  el
  * @return  {Array}       data
  */


	App.prototype.getElemData = function getElemData(el) {
		// All attributes
		var attributes = el.attributes;

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
			data[match[1]] = el.getAttribute(name);
		}

		return data;
	};

	/**
  * Initialize app after document ready
  */


	App.prototype.init = function init() {
		this.initGlobals().initModules();
	};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc3ZnLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0J1dHRvbi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvVGl0bGUuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9hcnJheS5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2Vudmlyb25tZW50LmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvZ2xvYmFscy5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2lzLmpzIiwiYXNzZXRzL3NjcmlwdHMvdXRpbHMvdmlzaWJpbGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQ0E7Ozs7QUFDQTs7SUFBWSxPOzs7Ozs7eUpBRlo7OztJQUlNLEc7QUFDTCxnQkFBYztBQUFBOztBQUNiLE9BQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxPQUFLLGNBQUwsR0FBc0IsRUFBdEI7QUFDQTs7QUFFRDs7Ozs7O2VBSUEsVywwQkFBYztBQUNiO0FBQ0EsU0FBTyxJQUFQO0FBQ0EsRTs7QUFFRDs7Ozs7O2VBSUEsVywwQkFBYztBQUNiO0FBQ0EsTUFBSSxZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBaEI7O0FBRUE7QUFDQSxNQUFJLElBQUksQ0FBUjtBQUNBLE1BQUksU0FBUyxVQUFVLE1BQXZCOztBQUVBLFNBQU8sSUFBSSxNQUFYLEVBQW1CLEdBQW5CLEVBQXdCOztBQUV2QjtBQUNBLE9BQUksS0FBSyxVQUFVLENBQVYsQ0FBVDs7QUFFQTtBQUNBLE9BQUksVUFBVSxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBZDs7QUFFQTtBQUNBLFdBQVEsRUFBUixHQUFhLEVBQWI7QUFDQSxXQUFRLEdBQVIsR0FBYyxFQUFFLEVBQUYsQ0FBZDs7QUFFQTtBQUNBLE9BQUksT0FBTyxRQUFRLE1BQW5COztBQUVBO0FBQ0EsT0FBSSxlQUFlLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsRUFBcEIsRUFBd0IsS0FBeEIsQ0FBOEIsR0FBOUIsQ0FBbkI7O0FBRUE7QUFDQSxPQUFJLElBQUksQ0FBUjtBQUNBLE9BQUksYUFBYSxhQUFhLE1BQTlCOztBQUVBLFVBQU8sSUFBSSxVQUFYLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzNCLFFBQUksYUFBYSxhQUFhLENBQWIsQ0FBakI7O0FBRUEsUUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBUCxLQUFvQyxVQUF4QyxFQUFvRDtBQUNuRCxTQUFJLFNBQVMsSUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQUosQ0FBNkIsT0FBN0IsQ0FBYjtBQUNBLFVBQUssY0FBTCxDQUFvQixJQUFwQixDQUF5QixNQUF6QjtBQUNBO0FBQ0Q7QUFDRDs7QUFFRCxTQUFPLElBQVA7QUFDQSxFOztBQUVEOzs7Ozs7O2VBS0EsVyx3QkFBWSxFLEVBQUk7QUFDZjtBQUNBLE1BQUksYUFBYSxHQUFHLFVBQXBCOztBQUVBO0FBQ0EsTUFBSSxVQUFVLGNBQWQ7O0FBRUE7QUFDQSxNQUFJLE9BQU8sRUFBWDs7QUFFQSxPQUFLLElBQUksQ0FBVCxJQUFjLFVBQWQsRUFBMEI7QUFDekIsT0FBSSxDQUFDLFdBQVcsQ0FBWCxDQUFMLEVBQW9CO0FBQ25CO0FBQ0E7O0FBRUQ7QUFDQSxPQUFJLE9BQU8sV0FBVyxDQUFYLEVBQWMsSUFBekI7O0FBRUE7QUFDQSxPQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1Y7QUFDQTs7QUFFRCxPQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFaO0FBQ0EsT0FBSSxDQUFDLEtBQUwsRUFBWTtBQUNYO0FBQ0E7O0FBRUQ7QUFDQTtBQUNBLFFBQUssTUFBTSxDQUFOLENBQUwsSUFBaUIsR0FBRyxZQUFILENBQWdCLElBQWhCLENBQWpCO0FBQ0E7O0FBRUQsU0FBTyxJQUFQO0FBQ0EsRTs7QUFFRDs7Ozs7ZUFHQSxJLG1CQUFPO0FBQ04sT0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsRTs7Ozs7QUFHRixFQUFFLFlBQVc7QUFDWixRQUFPLEdBQVAsR0FBYSxJQUFJLEdBQUosRUFBYjtBQUNBLFFBQU8sR0FBUCxDQUFXLElBQVg7QUFDQSxDQUhEOzs7Ozs7Ozs7a0JDbEhlLFlBQVc7QUFDekI7QUFDQSxDOzs7Ozs7Ozs7Ozs7OzsyQ0NGTyxPOzs7Ozs7Ozs7MENBQ0EsTzs7Ozs7Ozs7Ozs7OztBQ0RSOzt5SkFEQTs7O0FBR0E7Ozs7O2FBS0MsZ0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUNwQixNQUFLLFNBQUw7QUFDQSxNQUFLLE9BQUw7QUFDQSxNQUFLLEtBQUw7QUFDQSxNQUFLLEtBQUw7QUFDQSxNQUFLLEdBQUwsR0FBVyxRQUFRLEdBQW5CO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNiRjs7Ozs7Ozs7Ozs4ZUFEQTs7Ozs7O0FBSUMsaUJBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBLCtDQUNwQiwyQkFBTSxPQUFOLENBRG9COztBQUdwQixRQUFLLEdBQUwsQ0FBUyxFQUFULENBQVksY0FBWixFQUE0QixVQUFDLEtBQUQsRUFBVztBQUN0QyxTQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLG1CQUF2QixFQUE0QyxDQUFDLEVBQUUsTUFBTSxhQUFSLEVBQXVCLEdBQXZCLEVBQUQsQ0FBNUM7QUFDQSxHQUZEO0FBSG9CO0FBTXBCOztrQkFFRCxPLHNCQUFVO0FBQ1QsT0FBSyxHQUFMLENBQVMsR0FBVCxDQUFhLFNBQWI7QUFDQSxFOzs7Ozs7Ozs7Ozs7OztBQ2JGOztBQUNBOzs7Ozs7Ozs7OzhlQUZBOzs7Ozs7QUFLQyxpQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUEsK0NBQ3BCLDJCQUFNLE9BQU4sQ0FEb0I7O0FBR3BCLFFBQUssTUFBTCxHQUFjLE1BQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxXQUFkLENBQWQ7O0FBRUEsUUFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixtQkFBbEIsRUFBdUMsVUFBQyxLQUFELEVBQVEsS0FBUixFQUFrQjtBQUN4RCxTQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDQSxTQUFLLE9BQUw7QUFDQSxHQUhEOztBQUtBLFFBQUssbUJBQUwsR0FBMkIsK0JBQWM7QUFDeEMsV0FBUSxhQURnQztBQUV4QyxVQUFPLFFBRmlDO0FBR3hDLGFBQVUsTUFBSztBQUh5QixHQUFkLENBQTNCOztBQU1BLFFBQUssb0JBQUwsR0FBNEIsK0JBQWM7QUFDekMsV0FBUSxhQURpQztBQUV6QyxVQUFPLFNBRmtDO0FBR3pDLGFBQVUsTUFBSztBQUgwQixHQUFkLENBQTVCO0FBaEJvQjtBQXFCcEI7O2tCQUVELFMsd0JBQVk7QUFDWCxVQUFRLEdBQVIsQ0FBWSxpQkFBWjtBQUNBLEU7O2tCQUVELFUseUJBQWE7QUFDWixVQUFRLEdBQVIsQ0FBWSxrQkFBWjtBQUNBLEU7O2tCQUVELFcsd0JBQVksSyxFQUFPO0FBQ2xCLE9BQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsS0FBakI7QUFDQSxFOztrQkFFRCxPLHNCQUFVO0FBQ1QsT0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixtQkFBbkI7O0FBRUEsaUNBQWM7QUFDYixXQUFRLGdCQURLO0FBRWIsVUFBTyxRQUZNO0FBR2IsVUFBTyxLQUFLO0FBSEMsR0FBZDs7QUFNQSxpQ0FBYztBQUNiLFdBQVEsZ0JBREs7QUFFYixVQUFPLFNBRk07QUFHYixVQUFPLEtBQUs7QUFIQyxHQUFkOztBQU1BLE9BQUssR0FBTCxDQUFTLEdBQVQsQ0FBYSxRQUFiO0FBQ0EsRTs7Ozs7Ozs7Ozs7OztRQ3REYyxVLEdBQUEsVTtRQVFBLGEsR0FBQSxhO1FBVUEsa0IsR0FBQSxrQjtRQXFCQSxXLEdBQUEsVztRQVlBLFEsR0FBQSxRO1FBSUEsZSxHQUFBLGU7UUFZQSxPLEdBQUEsTztRQVNBLGMsR0FBQSxjOztBQTlFaEI7O0FBRU8sU0FBUyxVQUFULENBQXNCLEtBQXRCLEVBQTZCLEtBQTdCLEVBQXFDO0FBQzNDLEtBQUksUUFBUSxNQUFNLE9BQU4sQ0FBZSxLQUFmLENBQVo7O0FBRUEsS0FBSyxVQUFVLENBQUMsQ0FBaEIsRUFBb0I7QUFDbkIsUUFBTSxJQUFOLENBQVksS0FBWjtBQUNBO0FBQ0Q7O0FBRU0sU0FBUyxhQUFULENBQXlCLEtBQXpCLEVBQWdDLEtBQWhDLEVBQXdDO0FBQzlDLE1BQU0sSUFBSSxJQUFJLENBQVIsRUFBVyxJQUFJLE1BQU0sTUFBM0IsRUFBbUMsSUFBSSxDQUF2QyxFQUEwQyxHQUExQyxFQUFnRDtBQUMvQyxNQUFLLE1BQU0sQ0FBTixLQUFZLEtBQWpCLEVBQXlCO0FBQ3hCLFVBQU8sSUFBUDtBQUNBO0FBQ0Q7O0FBRUQsUUFBTyxLQUFQO0FBQ0E7O0FBRU0sU0FBUyxrQkFBVCxDQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFxQztBQUMzQyxLQUFJLENBQUo7O0FBRUEsS0FBSyxDQUFDLGlCQUFTLENBQVQsQ0FBRCxJQUFpQixDQUFDLGlCQUFTLENBQVQsQ0FBdkIsRUFBc0M7QUFDckMsU0FBTyxLQUFQO0FBQ0E7O0FBRUQsS0FBSyxFQUFFLE1BQUYsS0FBYSxFQUFFLE1BQXBCLEVBQTZCO0FBQzVCLFNBQU8sS0FBUDtBQUNBOztBQUVELEtBQUksRUFBRSxNQUFOO0FBQ0EsUUFBUSxHQUFSLEVBQWM7QUFDYixNQUFLLEVBQUUsQ0FBRixNQUFTLEVBQUUsQ0FBRixDQUFkLEVBQXFCO0FBQ3BCLFVBQU8sS0FBUDtBQUNBO0FBQ0Q7O0FBRUQsUUFBTyxJQUFQO0FBQ0E7O0FBRU0sU0FBUyxXQUFULENBQXVCLENBQXZCLEVBQTJCO0FBQ2pDLEtBQUssT0FBTyxDQUFQLEtBQWEsUUFBbEIsRUFBNkI7QUFDNUIsU0FBTyxDQUFFLENBQUYsQ0FBUDtBQUNBOztBQUVELEtBQUssTUFBTSxTQUFYLEVBQXVCO0FBQ3RCLFNBQU8sRUFBUDtBQUNBOztBQUVELFFBQU8sQ0FBUDtBQUNBOztBQUVNLFNBQVMsUUFBVCxDQUFvQixLQUFwQixFQUE0QjtBQUNsQyxRQUFPLE1BQU8sTUFBTSxNQUFOLEdBQWUsQ0FBdEIsQ0FBUDtBQUNBOztBQUVNLFNBQVMsZUFBVCxDQUEyQixLQUEzQixFQUFrQyxNQUFsQyxFQUEyQztBQUNqRCxLQUFLLENBQUMsS0FBTixFQUFjO0FBQ2I7QUFDQTs7QUFFRCxLQUFNLFFBQVEsTUFBTSxPQUFOLENBQWUsTUFBZixDQUFkOztBQUVBLEtBQUssVUFBVSxDQUFDLENBQWhCLEVBQW9CO0FBQ25CLFFBQU0sTUFBTixDQUFjLEtBQWQsRUFBcUIsQ0FBckI7QUFDQTtBQUNEOztBQUVNLFNBQVMsT0FBVCxDQUFtQixTQUFuQixFQUErQjtBQUNyQyxLQUFJLFFBQVEsRUFBWjtBQUFBLEtBQWdCLElBQUksVUFBVSxNQUE5QjtBQUNBLFFBQVEsR0FBUixFQUFjO0FBQ2IsUUFBTSxDQUFOLElBQVcsVUFBVSxDQUFWLENBQVg7QUFDQTs7QUFFRCxRQUFPLEtBQVA7QUFDQTs7QUFFTSxTQUFTLGNBQVQsQ0FBeUIsS0FBekIsRUFBZ0MsR0FBaEMsRUFBcUMsS0FBckMsRUFBNkM7QUFDbkQsUUFBTyxNQUFNLE1BQU4sQ0FBYSxVQUFVLEdBQVYsRUFBZ0I7QUFDbkMsU0FBTyxJQUFJLEdBQUosTUFBYSxLQUFwQjtBQUNBLEVBRk0sQ0FBUDtBQUdBOzs7Ozs7OztBQ2xGRCxJQUFNLFlBQVksRUFBRSxRQUFGLENBQWxCO0FBQ0EsSUFBTSxVQUFVLEVBQUUsTUFBRixDQUFoQjtBQUNBLElBQU0sUUFBUSxFQUFFLFNBQVMsZUFBWCxDQUFkO0FBQ0EsSUFBTSxRQUFRLEVBQUUsU0FBUyxJQUFYLENBQWQ7O1FBRVMsUyxHQUFBLFM7UUFBVyxPLEdBQUEsTztRQUFTLEssR0FBQSxLO1FBQU8sSyxHQUFBLEs7Ozs7Ozs7OztrQkNGckIsWUFBVztBQUN6QjtBQUNBLEM7O0FBSkQ7Ozs7Ozs7Ozs7Ozs7OztRQ0dnQixPLEdBQUEsTztRQUlBLFcsR0FBQSxXO1FBSUEsTyxHQUFBLE87UUFhQSxTLEdBQUEsUztRQUlBLFEsR0FBQSxRO1FBSUEsVSxHQUFBLFU7QUFqQ2hCLElBQUksV0FBVyxPQUFPLFNBQVAsQ0FBaUIsUUFBaEM7QUFBQSxJQUNDLG1CQUFtQixpQ0FEcEI7O0FBR0E7QUFDTyxTQUFTLE9BQVQsQ0FBbUIsS0FBbkIsRUFBMkI7QUFDakMsUUFBTyxTQUFTLElBQVQsQ0FBZSxLQUFmLE1BQTJCLGdCQUFsQztBQUNBOztBQUVNLFNBQVMsV0FBVCxDQUF1QixHQUF2QixFQUE2QjtBQUNuQyxRQUFPLGlCQUFpQixJQUFqQixDQUF1QixTQUFTLElBQVQsQ0FBZSxHQUFmLENBQXZCLENBQVA7QUFDQTs7QUFFTSxTQUFTLE9BQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBMEI7QUFDaEMsS0FBSyxNQUFNLElBQU4sSUFBYyxNQUFNLElBQXpCLEVBQWdDO0FBQy9CLFNBQU8sSUFBUDtBQUNBOztBQUVELEtBQUssUUFBTyxDQUFQLHlDQUFPLENBQVAsT0FBYSxRQUFiLElBQXlCLFFBQU8sQ0FBUCx5Q0FBTyxDQUFQLE9BQWEsUUFBM0MsRUFBc0Q7QUFDckQsU0FBTyxLQUFQO0FBQ0E7O0FBRUQsUUFBTyxNQUFNLENBQWI7QUFDQTs7QUFFRDtBQUNPLFNBQVMsU0FBVCxDQUFxQixLQUFyQixFQUE2QjtBQUNuQyxRQUFPLENBQUMsTUFBTyxXQUFZLEtBQVosQ0FBUCxDQUFELElBQWlDLFNBQVUsS0FBVixDQUF4QztBQUNBOztBQUVNLFNBQVMsUUFBVCxDQUFvQixLQUFwQixFQUE0QjtBQUNsQyxRQUFTLFNBQVMsU0FBUyxJQUFULENBQWUsS0FBZixNQUEyQixpQkFBN0M7QUFDQTs7QUFFTSxTQUFTLFVBQVQsQ0FBcUIsS0FBckIsRUFBNkI7QUFDbkMsS0FBSSxVQUFVLEVBQWQ7QUFDQSxRQUFPLFNBQVMsUUFBUSxRQUFSLENBQWlCLElBQWpCLENBQXNCLEtBQXRCLE1BQWlDLG1CQUFqRDtBQUNBOzs7Ozs7Ozs7O0FDbkNEOztBQUNBOztBQUNBOztBQUVBLElBQU0sWUFBWTtBQUNqQixTQUFRLEVBRFM7QUFFakIsVUFBUztBQUZRLENBQWxCLENBTEE7OztBQVVBLElBQU0sVUFBVSxDQUNmLGFBRGUsRUFFZixnQkFGZSxDQUFoQjs7QUFLQSxJQUFNLFNBQVMsQ0FDZCxTQURjLEVBRWQsUUFGYyxDQUFmOztBQUtBLElBQU0sU0FBUyxJQUFmOztBQUVBLElBQUksT0FBTyxDQUFYOztBQUVBO0FBQ0EsdUJBQVUsRUFBVixDQUFhLGtCQUFiLEVBQWlDLFVBQVMsS0FBVCxFQUFnQjtBQUNoRCxLQUFJLFNBQVMsTUFBYixFQUFxQjtBQUNwQixtQkFBaUIsUUFBakI7QUFDQSxFQUZELE1BRU87QUFDTixtQkFBaUIsU0FBakI7QUFDQTtBQUNELENBTkQ7O0FBUUE7Ozs7OztBQU1BLFNBQVMsV0FBVCxDQUFzQixLQUF0QixFQUE2QixPQUE3QixFQUFzQztBQUNyQyxLQUFJLFdBQVcsUUFBUSxRQUFSLElBQW9CLEVBQW5DOztBQUVBLEtBQUksQ0FBQyxvQkFBVyxRQUFYLENBQUwsRUFBMkI7QUFDMUIsVUFBUSxJQUFSLENBQWEsNEJBQWI7QUFDQSxTQUFPLEtBQVA7QUFDQTs7QUFFRCxLQUFJLFFBQVEsU0FBUyxNQUFyQjs7QUFFQSxXQUFVLEtBQVYsRUFBaUIsSUFBakIsQ0FBc0I7QUFDckIsU0FBTyxLQURjO0FBRXJCLFlBQVU7QUFGVyxFQUF0Qjs7QUFLQSxRQUFPLEtBQVA7QUFDQTs7QUFFRDs7Ozs7O0FBTUEsU0FBUyxjQUFULENBQXlCLEtBQXpCLEVBQWdDLE9BQWhDLEVBQXlDO0FBQ3hDLEtBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7O0FBRUEsS0FBSSxPQUFPLEtBQVAsS0FBa0IsV0FBbEIsSUFBaUMsVUFBVSxFQUEvQyxFQUFtRDtBQUNsRCxVQUFRLElBQVIsQ0FBYSwrQkFBYjtBQUNBLFNBQU8sS0FBUDtBQUNBOztBQUVELEtBQUksUUFBUSwyQkFBZSxVQUFVLEtBQVYsQ0FBZixFQUFpQyxPQUFqQyxFQUEwQyxLQUExQyxFQUFpRCxDQUFqRCxDQUFaOztBQUVBO0FBQ0E7O0FBRUEsS0FBSSxPQUFPLEtBQVAsS0FBa0IsV0FBdEIsRUFBbUM7QUFDbEMsOEJBQWdCLFVBQVUsS0FBVixDQUFoQixFQUFrQyxLQUFsQztBQUNBLFNBQU8sSUFBUDtBQUNBLEVBSEQsTUFHTztBQUNOLFVBQVEsSUFBUixDQUFhLDZCQUFiO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRDs7QUFFRDs7OztBQUlBLFNBQVMsZ0JBQVQsQ0FBMkIsS0FBM0IsRUFBa0M7QUFDakMsS0FBSSxnQkFBZ0IsVUFBVSxLQUFWLENBQXBCO0FBQ0EsS0FBSSxJQUFJLENBQVI7QUFDQSxLQUFJLE1BQU0sY0FBYyxNQUF4Qjs7QUFFQSxRQUFPLElBQUksR0FBWCxFQUFnQixHQUFoQixFQUFxQjtBQUNwQixnQkFBYyxDQUFkLEVBQWlCLFFBQWpCO0FBQ0E7QUFDRDs7QUFFRDs7Ozs7QUFLQSxTQUFTLGFBQVQsQ0FBd0IsT0FBeEIsRUFBaUM7QUFDaEMsS0FBSSxTQUFTLFFBQVEsTUFBUixJQUFrQixFQUEvQjtBQUNBLEtBQUksUUFBUSxRQUFRLEtBQVIsSUFBaUIsRUFBN0I7QUFDQSxLQUFJLFlBQUo7O0FBRUE7QUFDQSxLQUFJLENBQUMsMEJBQWMsT0FBZCxFQUF1QixNQUF2QixDQUFMLEVBQXFDO0FBQ3BDLFVBQVEsSUFBUixDQUFhLHVCQUFiO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7QUFDRCxLQUFJLENBQUMsMEJBQWMsTUFBZCxFQUFzQixLQUF0QixDQUFMLEVBQW1DO0FBQ2xDLFVBQVEsSUFBUixDQUFhLHNCQUFiO0FBQ0EsU0FBTyxLQUFQO0FBQ0E7O0FBRUQ7QUFDQSxLQUFJLFdBQVcsYUFBZixFQUE4QjtBQUM3QixRQUFNLFlBQVksS0FBWixFQUFtQixPQUFuQixDQUFOO0FBQ0EsRUFGRCxNQUVPLElBQUksV0FBVyxnQkFBZixFQUFpQztBQUN2QyxRQUFNLGVBQWUsS0FBZixFQUFzQixPQUF0QixDQUFOO0FBQ0E7O0FBRUQsUUFBTyxHQUFQO0FBQ0E7O1FBRVEsYSxHQUFBLGEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IGdsb2JhbHMgZnJvbSAnLi91dGlscy9nbG9iYWxzJztcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY2xhc3MgQXBwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRpbml0R2xvYmFscygpIHtcblx0XHRnbG9iYWxzKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cblx0ICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuXHQgKi9cblx0aW5pdE1vZHVsZXMoKSB7XG5cdFx0Ly8gRWxlbWVudHMgd2l0aCBtb2R1bGVcblx0XHR2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXG5cdFx0Ly8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciBlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoO1xuXG5cdFx0Zm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG5cdFx0XHQvLyBDdXJyZW50IGVsZW1lbnRcblx0XHRcdGxldCBlbCA9IG1vZHVsZUVsc1tpXTtcblxuXHRcdFx0Ly8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG5cdFx0XHRsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RWxlbURhdGEoZWwpO1xuXG5cdFx0XHQvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcblx0XHRcdG9wdGlvbnMuZWwgPSBlbDtcblx0XHRcdG9wdGlvbnMuJGVsID0gJChlbCk7XG5cblx0XHRcdC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcblx0XHRcdGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cblx0XHRcdC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuXHRcdFx0bGV0IG1vZHVsZUlkZW50cyA9IGF0dHIucmVwbGFjZSgvXFxzL2csICcnKS5zcGxpdCgnLCcpO1xuXG5cdFx0XHQvLyBMb29wIG1vZHVsZXNcblx0XHRcdGxldCBqID0gMDtcblx0XHRcdGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcblx0XHRcdFx0bGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuXHQgKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIGVsXG5cdCAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuXHQgKi9cblx0Z2V0RWxlbURhdGEoZWwpIHtcblx0XHQvLyBBbGwgYXR0cmlidXRlc1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gZWwuYXR0cmlidXRlcztcblxuXHRcdC8vIFJlZ2V4IFBhdHRlcm5cblx0XHR2YXIgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuXHRcdC8vIE91dHB1dFxuXHRcdHZhciBkYXRhID0ge307XG5cblx0XHRmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGlmICghYXR0cmlidXRlc1tpXSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG5cdFx0XHRsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuXHRcdFx0Ly8gVGhpcyBoYXBwZW5zLlxuXHRcdFx0aWYgKCFuYW1lKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuXHRcdFx0aWYgKCFtYXRjaCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcblx0XHRcdC8vIHNlcmlvdXMgcHJvYmxlbXMgaW4geW91ciBIVE1MLlxuXHRcdFx0ZGF0YVttYXRjaFsxXV0gPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH1cblxuXHQvKipcblx0ICogSW5pdGlhbGl6ZSBhcHAgYWZ0ZXIgZG9jdW1lbnQgcmVhZHlcblx0ICovXG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pbml0R2xvYmFscygpLmluaXRNb2R1bGVzKCk7XG5cdH1cbn1cblxuJChmdW5jdGlvbigpIHtcblx0d2luZG93LmFwcCA9IG5ldyBBcHAoKTtcblx0d2luZG93LmFwcC5pbml0KCk7XG59KTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRzdmc0ZXZlcnlib2R5KCk7XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQge2RlZmF1bHQgYXMgQnV0dG9ufSBmcm9tICcuL21vZHVsZXMvQnV0dG9uJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBUaXRsZX0gZnJvbSAnLi9tb2R1bGVzL1RpdGxlJztcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG4vKipcbiAqIEFic3RyYWN0IG1vZHVsZVxuICogR2l2ZXMgYWNjZXNzIHRvIGdlbmVyaWMgalF1ZXJ5IG5vZGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHRoaXMuJGRvY3VtZW50ID0gJGRvY3VtZW50O1xuXHRcdHRoaXMuJHdpbmRvdyA9ICR3aW5kb3c7XG5cdFx0dGhpcy4kaHRtbCA9ICRodG1sO1xuXHRcdHRoaXMuJGJvZHkgPSAkYm9keTtcblx0XHR0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXHR9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHR0aGlzLiRlbC5vbignY2xpY2suQnV0dG9uJywgKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLiRkb2N1bWVudC50cmlnZ2VyKCdUaXRsZS5jaGFuZ2VMYWJlbCcsIFskKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpXSk7XG5cdFx0fSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJGVsLm9mZignLkJ1dHRvbicpO1xuXHR9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyB2aXNpYmlsaXR5QXBpIH0gZnJvbSAnLi4vdXRpbHMvdmlzaWJpbGl0eSc7XG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHR0aGlzLiRsYWJlbCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1sYWJlbCcpO1xuXG5cdFx0dGhpcy4kZG9jdW1lbnQub24oJ1RpdGxlLmNoYW5nZUxhYmVsJywgKGV2ZW50LCB2YWx1ZSkgPT4ge1xuXHRcdFx0dGhpcy5jaGFuZ2VMYWJlbCh2YWx1ZSk7XG5cdFx0XHR0aGlzLmRlc3Ryb3koKTtcblx0XHR9KTtcblxuXHRcdHRoaXMuaGlkZGVuQ2FsbGJhY2tJZGVudCA9IHZpc2liaWxpdHlBcGkoe1xuXHRcdFx0YWN0aW9uOiAnYWRkQ2FsbGJhY2snLFxuXHRcdFx0c3RhdGU6ICdoaWRkZW4nLFxuXHRcdFx0Y2FsbGJhY2s6IHRoaXMubG9nSGlkZGVuXG5cdFx0fSk7XG5cblx0XHR0aGlzLnZpc2libGVDYWxsYmFja0lkZW50ID0gdmlzaWJpbGl0eUFwaSh7XG5cdFx0XHRhY3Rpb246ICdhZGRDYWxsYmFjaycsXG5cdFx0XHRzdGF0ZTogJ3Zpc2libGUnLFxuXHRcdFx0Y2FsbGJhY2s6IHRoaXMubG9nVmlzaWJsZVxuXHRcdH0pO1xuXHR9XG5cblx0bG9nSGlkZGVuKCkge1xuXHRcdGNvbnNvbGUubG9nKCdUaXRsZSBpcyBoaWRkZW4nKTtcblx0fVxuXG5cdGxvZ1Zpc2libGUoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1RpdGxlIGlzIHZpc2libGUnKTtcblx0fVxuXG5cdGNoYW5nZUxhYmVsKHZhbHVlKSB7XG5cdFx0dGhpcy4kbGFiZWwudGV4dCh2YWx1ZSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJGRvY3VtZW50Lm9mZignVGl0bGUuY2hhbmdlTGFiZWwnKTtcblxuXHRcdHZpc2liaWxpdHlBcGkoe1xuXHRcdFx0YWN0aW9uOiAncmVtb3ZlQ2FsbGJhY2snLFxuXHRcdFx0c3RhdGU6ICdoaWRkZW4nLFxuXHRcdFx0aWRlbnQ6IHRoaXMuaGlkZGVuQ2FsbGJhY2tJZGVudFxuXHRcdH0pO1xuXG5cdFx0dmlzaWJpbGl0eUFwaSh7XG5cdFx0XHRhY3Rpb246ICdyZW1vdmVDYWxsYmFjaycsXG5cdFx0XHRzdGF0ZTogJ3Zpc2libGUnLFxuXHRcdFx0aWRlbnQ6IHRoaXMudmlzaWJsZUNhbGxiYWNrSWRlbnRcblx0XHR9KTtcblxuXHRcdHRoaXMuJGVsLm9mZignLlRpdGxlJyk7XG5cdH1cbn1cbiIsImltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuL2lzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRvQXJyYXkgKCBhcnJheSwgdmFsdWUgKSB7XG5cdHZhciBpbmRleCA9IGFycmF5LmluZGV4T2YoIHZhbHVlICk7XG5cblx0aWYgKCBpbmRleCA9PT0gLTEgKSB7XG5cdFx0YXJyYXkucHVzaCggdmFsdWUgKTtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyYXlDb250YWlucyAoIGFycmF5LCB2YWx1ZSApIHtcblx0Zm9yICggbGV0IGkgPSAwLCBjID0gYXJyYXkubGVuZ3RoOyBpIDwgYzsgaSsrICkge1xuXHRcdGlmICggYXJyYXlbaV0gPT0gdmFsdWUgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheUNvbnRlbnRzTWF0Y2ggKCBhLCBiICkge1xuXHR2YXIgaTtcblxuXHRpZiAoICFpc0FycmF5KCBhICkgfHwgIWlzQXJyYXkoIGIgKSApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpZiAoIGEubGVuZ3RoICE9PSBiLmxlbmd0aCApIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRpID0gYS5sZW5ndGg7XG5cdHdoaWxlICggaS0tICkge1xuXHRcdGlmICggYVtpXSAhPT0gYltpXSApIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUFycmF5ICggeCApIHtcblx0aWYgKCB0eXBlb2YgeCA9PT0gJ3N0cmluZycgKSB7XG5cdFx0cmV0dXJuIFsgeCBdO1xuXHR9XG5cblx0aWYgKCB4ID09PSB1bmRlZmluZWQgKSB7XG5cdFx0cmV0dXJuIFtdO1xuXHR9XG5cblx0cmV0dXJuIHg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXN0SXRlbSAoIGFycmF5ICkge1xuXHRyZXR1cm4gYXJyYXlbIGFycmF5Lmxlbmd0aCAtIDEgXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUZyb21BcnJheSAoIGFycmF5LCBtZW1iZXIgKSB7XG5cdGlmICggIWFycmF5ICkge1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZiggbWVtYmVyICk7XG5cblx0aWYgKCBpbmRleCAhPT0gLTEgKSB7XG5cdFx0YXJyYXkuc3BsaWNlKCBpbmRleCwgMSApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b0FycmF5ICggYXJyYXlMaWtlICkge1xuXHR2YXIgYXJyYXkgPSBbXSwgaSA9IGFycmF5TGlrZS5sZW5ndGg7XG5cdHdoaWxlICggaS0tICkge1xuXHRcdGFycmF5W2ldID0gYXJyYXlMaWtlW2ldO1xuXHR9XG5cblx0cmV0dXJuIGFycmF5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJ5S2V5VmFsdWUoIGFycmF5LCBrZXksIHZhbHVlICkge1xuXHRyZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uKCBvYmogKSB7XG5cdFx0cmV0dXJuIG9ialtrZXldID09PSB2YWx1ZTtcblx0fSk7XG59XG4iLCJjb25zdCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbmNvbnN0ICRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblxuZXhwb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBzdmcgZnJvbSAnLi4vZ2xvYmFsL3N2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRzdmcoKTtcbn1cbiIsInZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsXG5cdGFycmF5TGlrZVBhdHRlcm4gPSAvXlxcW29iamVjdCAoPzpBcnJheXxGaWxlTGlzdClcXF0kLztcblxuLy8gdGhhbmtzLCBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS9pbnN0YW5jZW9mLWNvbnNpZGVyZWQtaGFybWZ1bC1vci1ob3ctdG8td3JpdGUtYS1yb2J1c3QtaXNhcnJheS9cbmV4cG9ydCBmdW5jdGlvbiBpc0FycmF5ICggdGhpbmcgKSB7XG5cdHJldHVybiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheUxpa2UgKCBvYmogKSB7XG5cdHJldHVybiBhcnJheUxpa2VQYXR0ZXJuLnRlc3QoIHRvU3RyaW5nLmNhbGwoIG9iaiApICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VxdWFsICggYSwgYiApIHtcblx0aWYgKCBhID09PSBudWxsICYmIGIgPT09IG51bGwgKSB7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRpZiAoIHR5cGVvZiBhID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgYiA9PT0gJ29iamVjdCcgKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuIGEgPT09IGI7XG59XG5cbi8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTgwODIvdmFsaWRhdGUtbnVtYmVycy1pbi1qYXZhc2NyaXB0LWlzbnVtZXJpY1xuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyAoIHRoaW5nICkge1xuXHRyZXR1cm4gIWlzTmFOKCBwYXJzZUZsb2F0KCB0aGluZyApICkgJiYgaXNGaW5pdGUoIHRoaW5nICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdCAoIHRoaW5nICkge1xuXHRyZXR1cm4gKCB0aGluZyAmJiB0b1N0cmluZy5jYWxsKCB0aGluZyApID09PSAnW29iamVjdCBPYmplY3RdJyApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jdGlvbiggdGhpbmcgKSB7XG5cdHZhciBnZXRUeXBlID0ge307XG5cdHJldHVybiB0aGluZyAmJiBnZXRUeXBlLnRvU3RyaW5nLmNhbGwodGhpbmcpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXMnO1xuaW1wb3J0IHsgYXJyYXlDb250YWlucywgZmluZEJ5S2V5VmFsdWUsIHJlbW92ZUZyb21BcnJheSB9IGZyb20gJy4vYXJyYXknO1xuaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuL2Vudmlyb25tZW50JztcblxuY29uc3QgQ0FMTEJBQ0tTID0ge1xuXHRoaWRkZW46IFtdLFxuXHR2aXNpYmxlOiBbXVxufTtcblxuY29uc3QgQUNUSU9OUyA9IFtcblx0J2FkZENhbGxiYWNrJyxcblx0J3JlbW92ZUNhbGxiYWNrJ1xuXTtcblxuY29uc3QgU1RBVEVTID0gW1xuXHQndmlzaWJsZScsXG5cdCdoaWRkZW4nXG5dO1xuXG5jb25zdCBQUkVGSVggPSAndi0nO1xuXG5sZXQgVVVJRCA9IDA7XG5cbi8vIE1haW4gZXZlbnRcbiRkb2N1bWVudC5vbigndmlzaWJpbGl0eWNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG5cdGlmIChkb2N1bWVudC5oaWRkZW4pIHtcblx0XHRvbkRvY3VtZW50Q2hhbmdlKCdoaWRkZW4nKTtcblx0fSBlbHNlIHtcblx0XHRvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG5cdH1cbn0pO1xuXG4vKipcbiAqIEFkZCBhIGNhbGxiYWNrXG4gKiBAcGFyYW0ge3N0cmluZ30gICBzdGF0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm4ge3N0cmluZ30gIGlkZW50XG4gKi9cbmZ1bmN0aW9uIGFkZENhbGxiYWNrIChzdGF0ZSwgb3B0aW9ucykge1xuXHRsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrIHx8ICcnO1xuXG5cdGlmICghaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcblx0XHRjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0bGV0IGlkZW50ID0gUFJFRklYICsgVVVJRCsrO1xuXG5cdENBTExCQUNLU1tzdGF0ZV0ucHVzaCh7XG5cdFx0aWRlbnQ6IGlkZW50LFxuXHRcdGNhbGxiYWNrOiBjYWxsYmFja1xuXHR9KTtcblxuXHRyZXR1cm4gaWRlbnQ7XG59XG5cbi8qKlxuICogUmVtb3ZlIGEgY2FsbGJhY2tcbiAqIEBwYXJhbSAge3N0cmluZ30gICBzdGF0ZSAgVmlzaWJsZSBvciBoaWRkZW5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudCAgVW5pcXVlIGlkZW50aWZpZXJcbiAqIEByZXR1cm4ge2Jvb2xlYW59ICAgICAgICAgSWYgb3BlcmF0aW9uIHdhcyBhIHN1Y2Nlc3NcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlQ2FsbGJhY2sgKHN0YXRlLCBvcHRpb25zKSB7XG5cdGxldCBpZGVudCA9IG9wdGlvbnMuaWRlbnQgfHwgJyc7XG5cblx0aWYgKHR5cGVvZihpZGVudCkgPT09ICd1bmRlZmluZWQnIHx8IGlkZW50ID09PSAnJykge1xuXHRcdGNvbnNvbGUud2FybignTmVlZCBpZGVudCB0byByZW1vdmUgY2FsbGJhY2snKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblxuXHRsZXQgaW5kZXggPSBmaW5kQnlLZXlWYWx1ZShDQUxMQkFDS1Nbc3RhdGVdLCAnaWRlbnQnLCBpZGVudClbMF07XG5cblx0Ly8gY29uc29sZS5sb2coaWRlbnQpXG5cdC8vIGNvbnNvbGUubG9nKENBTExCQUNLU1tzdGF0ZV0pXG5cblx0aWYgKHR5cGVvZihpbmRleCkgIT09ICd1bmRlZmluZWQnKSB7XG5cdFx0cmVtb3ZlRnJvbUFycmF5KENBTExCQUNLU1tzdGF0ZV0sIGluZGV4KTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBlbHNlIHtcblx0XHRjb25zb2xlLndhcm4oJ0NhbGxiYWNrIGNvdWxkIG5vdCBiZSBmb3VuZCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG4vKipcbiAqIFdoZW4gZG9jdW1lbnQgc3RhdGUgY2hhbmdlcywgdHJpZ2dlciBjYWxsYmFja3NcbiAqIEBwYXJhbSAge3N0cmluZ30gIHN0YXRlICBWaXNpYmxlIG9yIGhpZGRlblxuICovXG5mdW5jdGlvbiBvbkRvY3VtZW50Q2hhbmdlIChzdGF0ZSkge1xuXHRsZXQgY2FsbGJhY2tBcnJheSA9IENBTExCQUNLU1tzdGF0ZV07XG5cdGxldCBpID0gMDtcblx0bGV0IGxlbiA9IGNhbGxiYWNrQXJyYXkubGVuZ3RoO1xuXG5cdGZvciAoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRjYWxsYmFja0FycmF5W2ldLmNhbGxiYWNrKCk7XG5cdH1cbn1cblxuLyoqXG4gKiBQdWJsaWMgZmFjaW5nIEFQSSBmb3IgYWRkaW5nIGFuZCByZW1vdmluZyBjYWxsYmFja3NcbiAqIEBwYXJhbSAgIHtvYmplY3R9ICAgICAgICAgICBvcHRpb25zICBPcHRpb25zXG4gKiBAcmV0dXJuICB7Ym9vbGVhbnxpbnRlZ2VyfSAgICAgICAgICAgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjYWxsYmFjayBvciBib29sZWFuIGluZGljYXRpbmcgc3VjY2VzcyBvciBmYWlsdXJlXG4gKi9cbmZ1bmN0aW9uIHZpc2liaWxpdHlBcGkgKG9wdGlvbnMpIHtcblx0bGV0IGFjdGlvbiA9IG9wdGlvbnMuYWN0aW9uIHx8ICcnO1xuXHRsZXQgc3RhdGUgPSBvcHRpb25zLnN0YXRlIHx8ICcnO1xuXHRsZXQgcmV0O1xuXG5cdC8vIFR5cGUgYW5kIHZhbHVlIGNoZWNraW5nXG5cdGlmICghYXJyYXlDb250YWlucyhBQ1RJT05TLCBhY3Rpb24pKSB7XG5cdFx0Y29uc29sZS53YXJuKCdBY3Rpb24gZG9lcyBub3QgZXhpc3QnKTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0aWYgKCFhcnJheUNvbnRhaW5zKFNUQVRFUywgc3RhdGUpKSB7XG5cdFx0Y29uc29sZS53YXJuKCdTdGF0ZSBkb2VzIG5vdCBleGlzdCcpO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdC8vIEB0b2RvIE1hZ2ljIGNhbGwgZnVuY3Rpb24gcGxzXG5cdGlmIChhY3Rpb24gPT09ICdhZGRDYWxsYmFjaycpIHtcblx0XHRyZXQgPSBhZGRDYWxsYmFjayhzdGF0ZSwgb3B0aW9ucyk7XG5cdH0gZWxzZSBpZiAoYWN0aW9uID09PSAncmVtb3ZlQ2FsbGJhY2snKSB7XG5cdFx0cmV0ID0gcmVtb3ZlQ2FsbGJhY2soc3RhdGUsIG9wdGlvbnMpO1xuXHR9XG5cblx0cmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IHsgdmlzaWJpbGl0eUFwaSB9O1xuIl19
