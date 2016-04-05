(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */


var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App(options) {
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
			this.globals = new this.modules.Globals();
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
   * @param {DOMElement} el
   * @return {Array} data
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

// Document ready
// =========================================================================


$(function () {
	window.app = new App();
	window.app.init();
});

},{"./modules":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Globals = require('./modules/Globals');

Object.defineProperty(exports, 'Globals', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Globals).default;
  }
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

},{"./modules/Button":3,"./modules/Globals":4,"./modules/Title":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var Generic = function (_Module) {
	_inherits(Generic, _Module);

	function Generic(options) {
		_classCallCheck(this, Generic);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Generic).call(this));

		_this.$el = options.$el;

		_this.$el.on('click', function (event) {
			_this.$document.trigger('title.changeLabel', [$(event.currentTarget).val()]);
		});
		return _this;
	}

	// Destroy
	// ==========================================================================


	_createClass(Generic, [{
		key: 'destroy',
		value: function destroy() {
			this.$el.off();
		}
	}]);

	return Generic;
}(_Module3.default);

exports.default = Generic;

},{"./Module":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Svg = require('./Svg');

var _Svg2 = _interopRequireDefault(_Svg);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // ==========================================================================
// Globals module
// ==========================================================================


var Globals = function Globals() {
	_classCallCheck(this, Globals);

	new _Svg2.default();
};

exports.default = Globals;

},{"./Svg":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Module
// ==========================================================================

var Module = function Module() {
	_classCallCheck(this, Module);

	this.$document = $(document);
	this.$window = $(window);
	this.$html = $(document.documentElement);
	this.$body = $(document.body);
};

exports.default = Module;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Svg module
// ==========================================================================


var Svg = function (_Module) {
	_inherits(Svg, _Module);

	function Svg() {
		_classCallCheck(this, Svg);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Svg).call(this));

		svg4everybody();
		return _this;
	}

	return Svg;
}(_Module3.default);

exports.default = Svg;

},{"./Module":5}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* jshint esnext: true */


var Title = function (_Module) {
	_inherits(Title, _Module);

	function Title(options) {
		_classCallCheck(this, Title);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Title).call(this));

		_this.$el = options.$el;
		_this.$label = _this.$el.find('.js-label');

		_this.$document.on('title.changeLabel', function (event, value) {
			_this.changeLabel(value);
		});
		return _this;
	}

	_createClass(Title, [{
		key: 'changeLabel',
		value: function changeLabel(value) {
			this.$label.text(value);
		}

		// Destroy
		// ==========================================================================

	}, {
		key: 'destroy',
		value: function destroy() {
			this.$document.off('title.changeLabel');
			this.$el.off();
		}
	}]);

	return Title;
}(_Module3.default);

exports.default = Title;

},{"./Module":5}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9CdXR0b24uanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0dsb2JhbHMuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL01vZHVsZS5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvU3ZnLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy9UaXRsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FDQ0E7O0lBQVk7Ozs7OztJQUVOO0FBQ0wsVUFESyxHQUNMLENBQVksT0FBWixFQUFxQjt3QkFEaEIsS0FDZ0I7O0FBQ3BCLE9BQUssT0FBTCxHQUFlLE9BQWYsQ0FEb0I7QUFFcEIsT0FBSyxjQUFMLEdBQXNCLEVBQXRCLENBRm9CO0VBQXJCOzs7Ozs7OztjQURLOztnQ0FVUztBQUNiLFFBQUssT0FBTCxHQUFlLElBQUksS0FBSyxPQUFMLENBQWEsT0FBYixFQUFuQixDQURhO0FBRWIsVUFBTyxJQUFQLENBRmE7Ozs7Ozs7Ozs7Z0NBU0E7O0FBRWIsT0FBTSxZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBWjs7O0FBRk8sT0FLVCxJQUFJLENBQUosQ0FMUztBQU1iLE9BQUksU0FBUyxVQUFVLE1BQVYsQ0FOQTs7QUFRYixVQUFPLElBQUksTUFBSixFQUFZLEdBQW5CLEVBQXdCOzs7QUFHdkIsUUFBSSxLQUFLLFVBQVUsQ0FBVixDQUFMOzs7QUFIbUIsUUFNbkIsVUFBVSxLQUFLLFdBQUwsQ0FBaUIsRUFBakIsQ0FBVjs7O0FBTm1CLFdBU3ZCLENBQVEsRUFBUixHQUFhLEVBQWIsQ0FUdUI7QUFVdkIsWUFBUSxHQUFSLEdB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Ozs7Ozs7QUNWZjs7Ozs7Ozs7Ozs7Ozs7O0lBRU07OztBQUNMLFVBREssR0FDTCxHQUFjO3dCQURULEtBQ1M7O3FFQURULGlCQUNTOztBQUdiLGtCQUhhOztFQUFkOztRQURLOzs7a0JBUVM7Ozs7Ozs7Ozs7O0FDWmY7Ozs7Ozs7Ozs7Ozs7SUFFTTs7O0FBQ0wsVUFESyxLQUNMLENBQVksT0FBWixFQUFxQjt3QkFEaEIsT0FDZ0I7O3FFQURoQixtQkFDZ0I7O0FBRXBCLFFBQUssR0FBTCxHQUFXLFFBQVEsR0FBUixDQUZTO0FBR3BCLFFBQUssTUFBTCxHQUFjLE1BQUssR0FBTCxDQUFTLElBQVQsQ0FBYyxXQUFkLENBQWQsQ0FIb0I7O0FBS3BCLFFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsbUJBQWxCLEVBQXVDLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBa0I7QUFDeEQsU0FBSyxXQUFMLENBQWlCLEtBQWpCLEVBRHdEO0dBQWxCLENBQXZDLENBTG9COztFQUFyQjs7Y0FESzs7OEJBV08sT0FBTztBQUNsQixRQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLEtBQWpCLEVBRGtCOzs7Ozs7Ozs0QkFNVDtBQUNULFFBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsbUJBQW5CLEVBRFM7QUFFVCxRQUFLLEdBQUwsQ0FBUyxHQUFULEdBRlM7Ozs7UUFqQkw7OztrQkF1QlMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnO1xuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cdH1cblxuXHQvKipcblx0ICogRXhlY3V0ZSBnbG9iYWwgZnVuY3Rpb25zIGFuZCBzZXR0aW5nc1xuXHQgKiBAcmV0dXJuIHtPYmplY3R9XG5cdCAqL1xuXHRpbml0R2xvYmFscygpIHtcblx0XHR0aGlzLmdsb2JhbHMgPSBuZXcgdGhpcy5tb2R1bGVzLkdsb2JhbHMoKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kIG1vZHVsZXMgYW5kIGluaXRpYWxpemUgdGhlbVxuXHQgKiBAcmV0dXJuICB7T2JqZWN0fSAgdGhpcyAgQWxsb3dzIGNoYWluaW5nXG5cdCAqL1xuXHRpbml0TW9kdWxlcygpIHtcblx0XHQvLyBFbGVtZW50cyB3aXRoIG1vZHVsZVxuXHRcdGNvbnN0IG1vZHVsZUVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcblxuXHRcdC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgZWxzTGVuID0gbW9kdWxlRWxzLmxlbmd0aDtcblxuXHRcdGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuXHRcdFx0Ly8gQ3VycmVudCBlbGVtZW50XG5cdFx0XHRsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cblx0XHRcdC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuXHRcdFx0bGV0IG9wdGlvbnMgPSB0aGlzLmdldEVsZW1EYXRhKGVsKTtcblxuXHRcdFx0Ly8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG5cdFx0XHRvcHRpb25zLmVsID0gZWw7XG5cdFx0XHRvcHRpb25zLiRlbCA9ICQoZWwpO1xuXG5cdFx0XHQvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG5cdFx0XHRsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG5cdFx0XHQvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcblx0XHRcdGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnJlcGxhY2UoL1xccy9nLCAnJykuc3BsaXQoJywnKTtcblxuXHRcdFx0Ly8gTG9vcCBtb2R1bGVzXG5cdFx0XHRsZXQgaiA9IDA7XG5cdFx0XHRsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG5cdFx0XHRcdGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0bGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcblx0ICogQHBhcmFtIHtET01FbGVtZW50fSBlbFxuXHQgKiBAcmV0dXJuIHtBcnJheX0gZGF0YVxuXHQgKi9cblx0Z2V0RWxlbURhdGEoZWwpIHtcblx0XHQvLyBBbGwgYXR0cmlidXRlc1xuXHRcdHZhciBhdHRyaWJ1dGVzID0gZWwuYXR0cmlidXRlcztcblxuXHRcdC8vIFJlZ2V4IFBhdHRlcm5cblx0XHR2YXIgcGF0dGVybiA9IC9eZGF0YVxcLSguKykkLztcblxuXHRcdC8vIE91dHB1dFxuXHRcdHZhciBkYXRhID0ge307XG5cblx0XHRmb3IgKGxldCBpIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdC8vIEF0dHJpYnV0ZXMgbmFtZSAoZXg6IGRhdGEtbW9kdWxlKVxuXHRcdFx0bGV0IG5hbWUgPSBhdHRyaWJ1dGVzW2ldLm5hbWU7XG5cblx0XHRcdC8vIFRoaXMgaGFwcGVucy5cblx0XHRcdGlmICghbmFtZSkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IG1hdGNoID0gbmFtZS5tYXRjaChwYXR0ZXJuKTtcblx0XHRcdGlmICghbWF0Y2gpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIElmIHRoaXMgdGhyb3dzIGFuIGVycm9yLCB5b3UgaGF2ZSBzb21lXG5cdFx0XHQvLyBzZXJpb3VzIHByb2JsZW1zIGluIHlvdXIgSFRNTC5cblx0XHRcdGRhdGFbbWF0Y2hbMV1dID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemUgYXBwIGFmdGVyIGRvY3VtZW50IHJlYWR5XG5cdCAqL1xuXHRpbml0KCkge1xuXHRcdHRoaXMuaW5pdEdsb2JhbHMoKS5pbml0TW9kdWxlcygpO1xuXHR9XG59XG5cbi8vIERvY3VtZW50IHJlYWR5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5kb3cuYXBwID0gbmV3IEFwcCgpO1xuXHR3aW5kb3cuYXBwLmluaXQoKTtcbn0pO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IHtkZWZhdWx0IGFzIEdsb2JhbHN9IGZyb20gJy4vbW9kdWxlcy9HbG9iYWxzJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBCdXR0b259IGZyb20gJy4vbW9kdWxlcy9CdXR0b24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFRpdGxlfSBmcm9tICcuL21vZHVsZXMvVGl0bGUnO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNsYXNzIEdlbmVyaWMgZXh0ZW5kcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXG5cdFx0dGhpcy4kZWwub24oJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG5cdFx0XHR0aGlzLiRkb2N1bWVudC50cmlnZ2VyKCd0aXRsZS5jaGFuZ2VMYWJlbCcsIFskKGV2ZW50LmN1cnJlbnRUYXJnZXQpLnZhbCgpXSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvLyBEZXN0cm95XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwub2ZmKCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2VuZXJpYztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHbG9iYWxzIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBTdmcgZnJvbSAnLi9TdmcnO1xuXG5jbGFzcyBHbG9iYWxzIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bmV3IFN2ZygpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdsb2JhbHM7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy4kZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcblx0XHR0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0dGhpcy4kaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblx0XHR0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2R1bGU7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU3ZnIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5jbGFzcyBTdmcgZXh0ZW5kcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0c3ZnNGV2ZXJ5Ym9keSgpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN2ZztcbsKgXG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuY2xhc3MgVGl0bGUgZXh0ZW5kcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXHRcdHRoaXMuJGxhYmVsID0gdGhpcy4kZWwuZmluZCgnLmpzLWxhYmVsJyk7XG5cblx0XHR0aGlzLiRkb2N1bWVudC5vbigndGl0bGUuY2hhbmdlTGFiZWwnLCAoZXZlbnQsIHZhbHVlKSA9PiB7XG5cdFx0XHR0aGlzLmNoYW5nZUxhYmVsKHZhbHVlKTtcblx0XHR9KTtcblx0fVxuXG5cdGNoYW5nZUxhYmVsKHZhbHVlKSB7XG5cdFx0dGhpcy4kbGFiZWwudGV4dCh2YWx1ZSk7XG5cdH1cblxuXHQvLyBEZXN0cm95XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZG9jdW1lbnQub2ZmKCd0aXRsZS5jaGFuZ2VMYWJlbCcpO1xuXHRcdHRoaXMuJGVsLm9mZigpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpdGxlO1xuIl19
