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

},{"./modules":3,"./utils/globals":8}],2:[function(require,module,exports){
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

},{"../utils/environment":7}],5:[function(require,module,exports){
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

		_this.$el.on('click', function (event) {
			_this.$document.trigger('title.changeLabel', [$(event.currentTarget).val()]);
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

		_this.$document.on('title.changeLabel', function (event, value) {
			_this.changeLabel(value);
		});

		(0, _visibility.registerDocumentHiddenCallback)(_this.logHidden);
		(0, _visibility.registerDocumentVisibleCallback)(_this.logVisible);
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
			this.$document.off('title.changeLabel');
			this.$el.off('.Title');
		}
	}]);

	return _class;
}(_AbstractModule3.default);

exports.default = _class;

},{"../utils/visibility":9,"./AbstractModule":4}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{"../global/svg":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.registerDocumentVisibleCallback = exports.registerDocumentHiddenCallback = undefined;

var _environment = require('../utils/environment');

var CALLBACKS = {
	hidden: [],
	visible: []
};

// Main event
/* jshint esnext: true */
_environment.$document.on('visibilitychange', function (event) {
	if (document.hidden) {
		onDocumentChange('hidden');
	} else {
		onDocumentChange('visible');
	}
});

function registerDocumentHiddenCallback(callback) {
	CALLBACKS['hidden'].push(callback);
}

function registerDocumentVisibleCallback(callback) {
	CALLBACKS['visible'].push(callback);
}

function onDocumentChange(state) {
	var callbacks = CALLBACKS[state];
	var i = 0;
	var len = callbacks.length;

	for (; i < len; i++) {
		callbacks[i]();
	}
}

exports.registerDocumentHiddenCallback = registerDocumentHiddenCallback;
exports.registerDocumentVisibleCallback = registerDocumentVisibleCallback;

},{"../utils/environment":7}]},{},[1,2,3,4,5,6,7,8,9])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc3ZnLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0J1dHRvbi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvVGl0bGUuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9lbnZpcm9ubWVudC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2dsb2JhbHMuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy92aXNpYmlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNDQTs7OztBQUNBOztJQUFZOzs7Ozs7OztJQUVOO0FBQ0wsVUFESyxHQUNMLEdBQWM7d0JBRFQsS0FDUzs7QUFDYixPQUFLLE9BQUwsR0FBZSxPQUFmLENBRGE7QUFFYixPQUFLLGNBQUwsR0FBc0IsRUFBdEIsQ0FGYTtFQUFkOzs7Ozs7OztjQURLOztnQ0FVUztBQUNiLDRCQURhO0FBRWIsVUFBTyxJQUFQLENBRmE7Ozs7Ozs7Ozs7Z0NBU0E7O0FBRWIsT0FBSSxZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBWjs7O0FBRlMsT0FLVCxJQUFJLENBQUosQ0FMUztBQU1iLE9BQUksU0FBUyxVQUFVLE1BQVYsQ0FOQTs7QUFRYixVQUFPLElBQUksTUFBSixFQUFZLEdBQW5CLEVBQXdCOzs7QUFHdkIsUUFBSSxLQUFLLFVBQVUsQ0FBVixDQUFMOzs7QUFIbUIsUUFNbkIsVUFBVSxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBVjs7O0FBTm1CLFdBU3ZCLENBQVEsRUFBUixHQUFhLEVB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QXlCLFFBQXpCLEVBRGlEO0NBQWxEOztBQUlBLFNBQVMsK0JBQVQsQ0FBeUMsUUFBekMsRUFBbUQ7QUFDbEQsV0FBVSxTQUFWLEVBQXFCLElBQXJCLENBQTBCLFFBQTFCLEVBRGtEO0NBQW5EOztBQUlBLFNBQVMsZ0JBQVQsQ0FBMEIsS0FBMUIsRUFBaUM7QUFDaEMsS0FBSSxZQUFZLFVBQVUsS0FBVixDQUFaLENBRDRCO0FBRWhDLEtBQUksSUFBSSxDQUFKLENBRjRCO0FBR2hDLEtBQUksTUFBTSxVQUFVLE1BQVYsQ0FIc0I7O0FBS2hDLFFBQU8sSUFBSSxHQUFKLEVBQVMsR0FBaEIsRUFBcUI7QUFDcEIsWUFBVSxDQUFWLElBRG9CO0VBQXJCO0NBTEQ7O1FBVVE7UUFBZ0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IGdsb2JhbHMgZnJvbSAnLi91dGlscy9nbG9iYWxzJztcbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJztcblxuY2xhc3MgQXBwIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRpbml0R2xvYmFscygpIHtcblx0XHRnbG9iYWxzKCk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogRmluZCBtb2R1bGVzIGFuZCBpbml0aWFsaXplIHRoZW1cblx0ICogQHJldHVybiAge09iamVjdH0gIHRoaXMgIEFsbG93cyBjaGFpbmluZ1xuXHQgKi9cblx0aW5pdE1vZHVsZXMoKSB7XG5cdFx0Ly8gRWxlbWVudHMgd2l0aCBtb2R1bGVcblx0XHR2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXG5cdFx0Ly8gTG9vcCB0aHJvdWdoIGVsZW1lbnRzXG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciBlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoO1xuXG5cdFx0Zm9yICg7IGkgPCBlbHNMZW47IGkrKykge1xuXG5cdFx0XHQvLyBDdXJyZW50IGVsZW1lbnRcblx0XHRcdGxldCBlbCA9IG1vZHVsZUVsc1tpXTtcblxuXHRcdFx0Ly8gQWxsIGRhdGEtIGF0dHJpYnV0ZXMgY29uc2lkZXJlZCBhcyBvcHRpb25zXG5cdFx0XHRsZXQgb3B0aW9ucyA9IHRoaXMuZ2V0RWxlbURhdGEoZWwpO1xuXG5cdFx0XHQvLyBBZGQgY3VycmVudCBET00gZWxlbWVudCBhbmQgalF1ZXJ5IGVsZW1lbnRcblx0XHRcdG9wdGlvbnMuZWwgPSBlbDtcblx0XHRcdG9wdGlvbnMuJGVsID0gJChlbCk7XG5cblx0XHRcdC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcblx0XHRcdGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cblx0XHRcdC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuXHRcdFx0bGV0IG1vZHVsZUlkZW50cyA9IGF0dHIucmVwbGFjZSgvXFxzL2csICcnKS5zcGxpdCgnLCcpO1xuXG5cdFx0XHQvLyBMb29wIG1vZHVsZXNcblx0XHRcdGxldCBqID0gMDtcblx0XHRcdGxldCBtb2R1bGVzTGVuID0gbW9kdWxlSWRlbnRzLmxlbmd0aDtcblxuXHRcdFx0Zm9yICg7IGogPCBtb2R1bGVzTGVuOyBqKyspIHtcblx0XHRcdFx0bGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVJZGVudHNbal07XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0XHRsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBlbGVtZW50IGRhdGEgYXR0cmlidXRlc1xuXHQgKiBAcGFyYW0gICB7RE9NRWxlbWVudH0gIGVsXG5cdCAqIEByZXR1cm4gIHtBcnJheX0gICAgICAgZGF0YVxuXHQgKi9cblx0Z2V0RWxlbURhdGEoZWwpIHtcblx0XHQvLyBBbGwgYXR0cmlidXRlc1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gZWwuYXR0cmlidXRlcztcblxuXHRcdC8vIFJlZ2V4IFBhdHRlcm5cblx0XHR2YXIgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuXHRcdC8vIE91dHB1dFxuXHRcdHZhciBkYXRhID0ge307XG5cblx0XHRmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuXHRcdFx0bGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cblx0XHRcdC8vIFRoaXMgaGFwcGVucy5cblx0XHRcdGlmICghbmFtZSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcblx0XHRcdGlmICghbWF0Y2gpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG5cdFx0XHQvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cblx0XHRcdGRhdGFbbWF0Y2hbMV1dID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYXBwIGFmdGVyIGRvY3VtZW50IHJlYWR5XG5cdCAqL1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaW5pdEdsb2JhbHMoKS5pbml0TW9kdWxlcygpO1xuXHR9XG59XG5cbiQoZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5hcHAgPSBuZXcgQXBwKCk7XG5cdHdpbmRvdy5hcHAuaW5pdCgpO1xufSk7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcblx0c3ZnNGV2ZXJ5Ym9keSgpO1xufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IHtkZWZhdWx0IGFzIEJ1dHRvbn0gZnJvbSAnLi9tb2R1bGVzL0J1dHRvbic7XG5leHBvcnQge2RlZmF1bHQgYXMgVGl0bGV9IGZyb20gJy4vbW9kdWxlcy9UaXRsZSc7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyAkZG9jdW1lbnQsICR3aW5kb3csICRodG1sLCAkYm9keSB9IGZyb20gJy4uL3V0aWxzL2Vudmlyb25tZW50JztcblxuLyoqXG4gKiBBYnN0cmFjdCBtb2R1bGVcbiAqIEdpdmVzIGFjY2VzcyB0byBnZW5lcmljIGpRdWVyeSBub2Rlc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLiRkb2N1bWVudCA9ICRkb2N1bWVudDtcblx0XHR0aGlzLiR3aW5kb3cgPSAkd2luZG93O1xuXHRcdHRoaXMuJGh0bWwgPSAkaHRtbDtcblx0XHR0aGlzLiRib2R5ID0gJGJvZHk7XG5cdFx0dGhpcy4kZWwgPSBvcHRpb25zLiRlbDtcblx0fVxufVxuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IEFic3RyYWN0TW9kdWxlIGZyb20gJy4vQWJzdHJhY3RNb2R1bGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEFic3RyYWN0TW9kdWxlIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucykge1xuXHRcdHN1cGVyKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy4kZWwub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLiRkb2N1bWVudC50cmlnZ2VyKCd0aXRsZS5jaGFuZ2VMYWJlbCcsIFskKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpXSk7XG5cdFx0fSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJGVsLm9mZignLkJ1dHRvbicpO1xuXHR9XG59XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgeyByZWdpc3RlckRvY3VtZW50SGlkZGVuQ2FsbGJhY2ssIHJlZ2lzdGVyRG9jdW1lbnRWaXNpYmxlQ2FsbGJhY2sgfSBmcm9tICcuLi91dGlscy92aXNpYmlsaXR5JztcbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMuJGxhYmVsID0gdGhpcy4kZWwuZmluZCgnLmpzLWxhYmVsJyk7XG5cblx0XHR0aGlzLiRkb2N1bWVudC5vbigndGl0bGUuY2hhbmdlTGFiZWwnLCAoZXZlbnQsIHZhbHVlKSA9PiB7XG5cdFx0XHR0aGlzLmNoYW5nZUxhYmVsKHZhbHVlKTtcblx0XHR9KTtcblxuXHRcdHJlZ2lzdGVyRG9jdW1lbnRIaWRkZW5DYWxsYmFjayh0aGlzLmxvZ0hpZGRlbik7XG5cdFx0cmVnaXN0ZXJEb2N1bWVudFZpc2libGVDYWxsYmFjayh0aGlzLmxvZ1Zpc2libGUpO1xuXHR9XG5cblx0bG9nSGlkZGVuKCkge1xuXHRcdGNvbnNvbGUubG9nKCdUaXRsZSBpcyBoaWRkZW4nKTtcblx0fVxuXG5cdGxvZ1Zpc2libGUoKSB7XG5cdFx0Y29uc29sZS5sb2coJ1RpdGxlIGlzIHZpc2libGUnKTtcblx0fVxuXG5cdGNoYW5nZUxhYmVsKHZhbHVlKSB7XG5cdFx0dGhpcy4kbGFiZWwudGV4dCh2YWx1ZSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJGRvY3VtZW50Lm9mZigndGl0bGUuY2hhbmdlTGFiZWwnKTtcblx0XHR0aGlzLiRlbC5vZmYoJy5UaXRsZScpO1xuXHR9XG59XG4iLCJjb25zdCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbmNvbnN0ICRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblxuZXhwb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBzdmcgZnJvbSAnLi4vZ2xvYmFsL3N2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRzdmcoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCB7ICRkb2N1bWVudCwgJHdpbmRvdywgJGh0bWwsICRib2R5IH0gZnJvbSAnLi4vdXRpbHMvZW52aXJvbm1lbnQnO1xuXG5jb25zdCBDQUxMQkFDS1MgPSB7XG5cdGhpZGRlbjogW10sXG5cdHZpc2libGU6IFtdXG59O1xuXG4vLyBNYWluIGV2ZW50XG4kZG9jdW1lbnQub24oJ3Zpc2liaWxpdHljaGFuZ2UnLCBmdW5jdGlvbihldmVudCkge1xuXHRpZihkb2N1bWVudC5oaWRkZW4pe1xuXHRcdG9uRG9jdW1lbnRDaGFuZ2UoJ2hpZGRlbicpO1xuXHR9ZWxzZXtcblx0XHRvbkRvY3VtZW50Q2hhbmdlKCd2aXNpYmxlJyk7XG5cdH1cbn0pO1xuXG5mdW5jdGlvbiByZWdpc3RlckRvY3VtZW50SGlkZGVuQ2FsbGJhY2soY2FsbGJhY2spIHtcblx0Q0FMTEJBQ0tTWydoaWRkZW4nXS5wdXNoKGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gcmVnaXN0ZXJEb2N1bWVudFZpc2libGVDYWxsYmFjayhjYWxsYmFjaykge1xuXHRDQUxMQkFDS1NbJ3Zpc2libGUnXS5wdXNoKGNhbGxiYWNrKTtcbn1cblxuZnVuY3Rpb24gb25Eb2N1bWVudENoYW5nZShzdGF0ZSkge1xuXHRsZXQgY2FsbGJhY2tzID0gQ0FMTEJBQ0tTW3N0YXRlXTtcblx0bGV0IGkgPSAwO1xuXHRsZXQgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDtcblxuXHRmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0Y2FsbGJhY2tzW2ldKCk7XG5cdH1cbn1cblxuZXhwb3J0IHtyZWdpc3RlckRvY3VtZW50SGlkZGVuQ2FsbGJhY2ssIHJlZ2lzdGVyRG9jdW1lbnRWaXNpYmxlQ2FsbGJhY2t9O1xuIl19
