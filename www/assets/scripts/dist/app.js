(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */
// ==========================================================================


var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App(options) {
		_classCallCheck(this, App);

		this.modules = modules;
		this.globals;
		this.currentModules = [];
	}

	// Init globals
	// ==========================================================================


	_createClass(App, [{
		key: 'initGlobals',
		value: function initGlobals() {
			this.globals = new this.modules['Globals']();
		}

		// Init modules
		// ==========================================================================

		/**
   * Module init
   *
   * @todo  [1]  Discuss storing instanciated objects
   * @todo  [2]  Discuss singleton concept (one off functions/declarations)
   * @return {thigArg}
   */

	}, {
		key: 'initModules',
		value: function initModules() {
			// Elements with module
			var moduleEls = document.querySelectorAll('[data-module]');

			// Loop through elements
			var i = 0,
			    elsLen = moduleEls.length;
			for (; i < elsLen; i++) {

				// Current element
				var el = moduleEls[i];

				// All data- attributes considered as options
				var options = this.getElemData(el);

				// Add current element AND jQuery element
				options.el = el;
				options.$el = $(el);

				// Module does exist at this point
				var attr = options.module;

				// Splitting modules found in the data-attribute
				var moduleAttrs = attr.replace(/\s/g, '').split(',');

				// Loop modules
				var j = 0,
				    modLen = moduleAttrs.length;
				for (; j < modLen; j++) {
					var moduleAttr = moduleAttrs[j];

					if (typeof this.modules[moduleAttr] === 'function' && this.currentModules.indexOf(moduleAttr) === -1) {
						// [1,2]
						var module = new this.modules[moduleAttr](options);
						// [2]
						this.currentModules.push(module);
					}
				}
			}

			return this;
		}

		// Init
		// ==========================================================================

	}, {
		key: 'init',
		value: function init() {
			this.initGlobals();
			this.initModules();
		}

		// Utils
		// ==========================================================================
		//
		/**
   * Get element datas
   *
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
				// serious problem in your HTML.
				data[match[1]] = el.getAttribute(name);
			}

			return data;
		}
	}]);

	return App;
}();

;

// Document ready
// ==========================================================================
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

var _Generic = require('./modules/Generic');

Object.defineProperty(exports, 'Generic', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Generic).default;
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

},{"./modules/Generic":3,"./modules/Globals":4,"./modules/Title":7}],3:[function(require,module,exports){
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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Generic module
// ==========================================================================


var Generic = function (_Module) {
	_inherits(Generic, _Module);

	function Generic(options) {
		_classCallCheck(this, Generic);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Generic).call(this));

		_this.$el = options.$el;

		console.log('Generic module');
		console.log(_this.$el);
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

	// Destroy
	// ==========================================================================


	_createClass(Svg, [{
		key: 'destroy',
		value: function destroy() {
			this.$el.off();
		}
	}]);

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

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // ==========================================================================
// Title module
// ==========================================================================


var Title = function (_Module) {
	_inherits(Title, _Module);

	function Title(options) {
		_classCallCheck(this, Title);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Title).call(this));

		_this.$el = options.$el;

		console.log('Title module');
		console.log(_this.$el);
		return _this;
	}

	// Destroy
	// ==========================================================================


	_createClass(Title, [{
		key: 'destroy',
		value: function destroy() {
			this.$el.off();
		}
	}]);

	return Title;
}(_Module3.default);

exports.default = Title;

},{"./Module":5}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxhcHAuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxtb2R1bGVzLmpzIiwid3d3XFxhc3NldHNcXHNjcmlwdHNcXHNyY1xcbW9kdWxlc1xcR2VuZXJpYy5qcyIsInd3d1xcYXNzZXRzXFxzY3JpcHRzXFxzcmNcXG1vZHVsZXNcXEdsb2JhbHMuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxtb2R1bGVzXFxNb2R1bGUuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxtb2R1bGVzXFxTdmcuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxtb2R1bGVzXFxUaXRsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0VBOztJQUFZOzs7Ozs7SUFFTjtBQUVMLFVBRkssR0FFTCxDQUFZLE9BQVosRUFDQTt3QkFISyxLQUdMOztBQUNDLE9BQUssT0FBTCxHQUFlLE9BQWYsQ0FERDtBQUVDLE9BQUssT0FBTCxDQUZEO0FBR0MsT0FBSyxjQUFMLEdBQXNCLEVBQXRCLENBSEQ7RUFEQTs7Ozs7O2NBRks7O2dDQVlMO0FBQ0MsUUFBSyxPQUFMLEdBQWUsSUFBSSxLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQUosRUFBZixDQUREOzs7Ozs7Ozs7Ozs7Ozs7O2dDQWVBOztBQUVDLE9BQU0sWUFBWSxTQUFTLGdCQUFULENBQTBCLGVBQTFCLENBQVo7OztBQUZQLE9BS0ssSUFBSSxDQUFKO09BQ0gsU0FBUyxVQUFVLE1BQVYsQ0FOWDtBQU9DLFVBQU8sSUFBSSxNQUFKLEVBQVksR0FBbkIsRUFBd0I7OztBQUd2QixRQUFJLEtBQUssVUFBVSxDQUFWLENBQUw7OztBQUhtQixRQU1uQixVQUFVLEtBQUssV0FBTCxDQUFpQixFQUFqQixDQUFWOzs7QUFObUIsV0FTdkIsQ0FBUSxFQUFSLEdBQWEsRUFBYixDQVR1QjtBQVV2QixZQUFRLEdBQVIsR0FBYyxFQUFFLEVBQUYsQ0FBZDs7O0FBVnVCLFFBYW5CLE9BQU8sUUFBUSxNQUFSOzs7QUFiWSxRQWdCbkIsY0FBYyxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLENBQThCLEdBQTlCLENBQWQ7OztBQWhCbUIsUUFtQm5CLElBQUksQ0FBSjtRQUNILFNBQVMsWUFBWSxNQUFaLENBcEJhO0FBcUJ2QixXQUFPLElBQUksTUFBSixFQUFZLEdBQW5CLEVBQXdCO0FBQ3ZCLFNBQUksYUFBYSxZQUFZLENBQVosQ0FBYixDQURtQjs7QUFHdkIsU0FBSSxPQUFPLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBUCxLQUFvQyxVQUFwQyxJQUFrRCxLQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBNUIsTUFBNEMsQ0FBQyxDQUFELEVBQUk7O0FBRXJHLFVBQUksU0FBUyxJQUFJLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBSixDQUE2QixPQUE3QixDQUFUOztBQUZpRyxVQUlyRyxDQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsTUFBekIsRUFKcUc7TUFBdEc7S0FIRDtJQXJCRDs7QUFpQ0EsVUFBTyxJQUFQLENBeENEOzs7Ozs7Ozt5QkE4Q0E7QUFDQyxRQUFLLFdBQUwsR0FERDtBQUVDLFFBQUssV0FBTCxHQUZEOzs7Ozs7Ozs7Ozs7Ozs7OEJBZVksSUFDWjs7QUFFQyxPQUFJLGFBQWEsR0FBRyxVQUFIOzs7QUFGbEIsT0FLSyxVQUFVLGNBQVY7OztBQUxMLE9BUUssT0FBTyxFQUFQLENBUkw7O0FBVUMsUUFBSyxJQUFJLENBQUosSUFBUyxVQUFkLEVBQTBCOztBQUV6QixRQUFJLE9BQU8sV0FBVyxDQUFYLEVBQWMsSUFBZDs7O0FBRmMsUUFLckIsQ0FBQyxJQUFELEVBQU87QUFDVixjQURVO0tBQVg7O0FBSUEsUUFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBUixDQVRxQjtBQVV6QixRQUFJLENBQUMsS0FBRCxFQUFRO0FBQ1gsY0FEVztLQUFaOzs7O0FBVnlCLFFBZ0J6QixDQUFNLE1BQU0sQ0FBTixDQUFOLElBQW1CLEdBQUcsWUFBSCxDQUFnQixJQUFoQixDQUFuQixDQWhCeUI7SUFBMUI7O0FBbUJBLFVBQU8sSUFBUCxDQTdCRDs7OztRQXpGSzs7O0FBd0hMOzs7O0FBSUQsRUFBRSxZQUFXO0FBQ1osUUFBTyxHQUFQLEdBQWEsSUFBSSxHQUFKLEVBQWIsQ0FEWTtBQUVaLFFBQU8sR0FBUCxDQUFXLElBQVgsR0FGWTtDQUFYLENBQUY7Ozs7Ozs7Ozs7Ozs7OzRDQ2hJUTs7Ozs7Ozs7OzRDQUNBOzs7Ozs7Ozs7MENBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ0NSOzs7Ozs7Ozs7Ozs7Ozs7SUFFTTs7O0FBQ0wsVUFESyxPQUNMLENBQVksT0FBWixFQUFxQjt3QkFEaEIsU0FDZ0I7O3FFQURoQixxQkFDZ0I7O0FBRWQsUUFBSyxHQUFMLEdBQVcsUUFBUSxHQUFSLENBRkc7O0FBSXBCLFVBQVEsR0FBUixDQUFZLGdCQUFaLEVBSm9CO0FBS3BCLFVBQVEsR0FBUixDQUFZLE1BQUssR0FBTCxDQUFaLENBTG9COztFQUFyQjs7Ozs7O2NBREs7OzRCQVdLO0FBQ1QsUUFBSyxHQUFMLENBQVMsR0FBVCxHQURTOzs7O1FBWEw7OztrQkFnQlM7Ozs7Ozs7OztBQ2xCZjs7Ozs7Ozs7Ozs7SUFFTSxVQUNMLFNBREssT0FDTCxHQUFjO3VCQURULFNBQ1M7O0FBQ2IscUJBRGE7Q0FBZDs7a0JBS2M7Ozs7Ozs7Ozs7Ozs7OztJQ1BULFNBQ0wsU0FESyxNQUNMLEdBQWM7dUJBRFQsUUFDUzs7QUFDYixNQUFLLE9BQUwsR0FBZSxFQUFFLE1BQUYsQ0FBZixDQURhO0FBRWIsTUFBSyxLQUFMLEdBQWEsRUFBRSxTQUFTLGVBQVQsQ0FBZixDQUZhO0FBR2IsTUFBSyxLQUFMLEdBQWEsRUFBRSxTQUFTLElBQVQsQ0FBZixDQUhhO0NBQWQ7O2tCQU9jOzs7Ozs7Ozs7OztBQ1RmOzs7Ozs7Ozs7Ozs7Ozs7SUFFTTs7O0FBQ0wsVUFESyxHQUNMLEdBQWM7d0JBRFQsS0FDUzs7cUVBRFQsaUJBQ1M7O0FBR2Isa0JBSGE7O0VBQWQ7Ozs7OztjQURLOzs0QkFTSztBQUNULFFBQUssR0FBTCxDQUFTLEdBQVQsR0FEUzs7OztRQVRMOzs7a0JBY1M7Ozs7Ozs7Ozs7O0FDaEJmOzs7Ozs7Ozs7Ozs7Ozs7SUFFTTs7O0FBQ0wsVUFESyxLQUNMLENBQVksT0FBWixFQUFxQjt3QkFEaEIsT0FDZ0I7O3FFQURoQixtQkFDZ0I7O0FBRWQsUUFBSyxHQUFMLEdBQVcsUUFBUSxHQUFSLENBRkc7O0FBSXBCLFVBQVEsR0FBUixDQUFZLGNBQVosRUFKb0I7QUFLcEIsVUFBUSxHQUFSLENBQVksTUFBSyxHQUFMLENBQVosQ0FMb0I7O0VBQXJCOzs7Ozs7Y0FESzs7NEJBV0s7QUFDVCxRQUFLLEdBQUwsQ0FBUyxHQUFULEdBRFM7Ozs7UUFYTDs7O2tCQWdCUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnXG5cbmNsYXNzIEFwcFxue1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKVxuXHR7XG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLmdsb2JhbHM7XG5cdFx0dGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXHR9XG5cblx0Ly8gSW5pdCBnbG9iYWxzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGluaXRHbG9iYWxzKClcblx0e1xuXHRcdHRoaXMuZ2xvYmFscyA9IG5ldyB0aGlzLm1vZHVsZXNbJ0dsb2JhbHMnXTtcblx0fVxuXG5cdC8vIEluaXQgbW9kdWxlc1xuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5cdC8qKlxuXHQgKiBNb2R1bGUgaW5pdFxuXHQgKlxuXHQgKiBAdG9kbyAgWzFdICBEaXNjdXNzIHN0b3JpbmcgaW5zdGFuY2lhdGVkIG9iamVjdHNcblx0ICogQHRvZG8gIFsyXSAgRGlzY3VzcyBzaW5nbGV0b24gY29uY2VwdCAob25lIG9mZiBmdW5jdGlvbnMvZGVjbGFyYXRpb25zKVxuXHQgKiBAcmV0dXJuIHt0aGlnQXJnfVxuXHQgKi9cblx0aW5pdE1vZHVsZXMoKVxuXHR7XG5cdFx0Ly8gRWxlbWVudHMgd2l0aCBtb2R1bGVcblx0XHRjb25zdCBtb2R1bGVFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG5cblx0XHQvLyBMb29wIHRocm91Z2ggZWxlbWVudHNcblx0XHRsZXQgaSA9IDAsXG5cdFx0XHRlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoO1xuXHRcdGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuXHRcdFx0Ly8gQ3VycmVudCBlbGVtZW50XG5cdFx0XHRsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cblx0XHRcdC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuXHRcdFx0bGV0IG9wdGlvbnMgPSB0aGlzLmdldEVsZW1EYXRhKGVsKTtcblxuXHRcdFx0Ly8gQWRkIGN1cnJlbnQgZWxlbWVudCBBTkQgalF1ZXJ5IGVsZW1lbnRcblx0XHRcdG9wdGlvbnMuZWwgPSBlbDtcblx0XHRcdG9wdGlvbnMuJGVsID0gJChlbCk7XG5cblx0XHRcdC8vIE1vZHVsZSBkb2VzIGV4aXN0IGF0IHRoaXMgcG9pbnRcblx0XHRcdGxldCBhdHRyID0gb3B0aW9ucy5tb2R1bGU7XG5cblx0XHRcdC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuXHRcdFx0bGV0IG1vZHVsZUF0dHJzID0gYXR0ci5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJyk7XG5cblx0XHRcdC8vIExvb3AgbW9kdWxlc1xuXHRcdFx0bGV0IGogPSAwLFxuXHRcdFx0XHRtb2RMZW4gPSBtb2R1bGVBdHRycy5sZW5ndGhcblx0XHRcdGZvciAoOyBqIDwgbW9kTGVuOyBqKyspIHtcblx0XHRcdFx0bGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVBdHRyc1tqXTtcblxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLmN1cnJlbnRNb2R1bGVzLmluZGV4T2YobW9kdWxlQXR0cikgPT09IC0xKSB7XG5cdFx0XHRcdFx0Ly8gWzEsMl1cblx0XHRcdFx0XHRsZXQgbW9kdWxlID0gbmV3IHRoaXMubW9kdWxlc1ttb2R1bGVBdHRyXShvcHRpb25zKTtcblx0XHRcdFx0XHQvLyBbMl1cblx0XHRcdFx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzLnB1c2gobW9kdWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0Ly8gSW5pdFxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRpbml0KClcblx0e1xuXHRcdHRoaXMuaW5pdEdsb2JhbHMoKTtcblx0XHR0aGlzLmluaXRNb2R1bGVzKCk7XG5cdH1cblxuXG5cdC8vIFV0aWxzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdC8vXG5cdC8qKlxuXHQgKiBHZXQgZWxlbWVudCBkYXRhc1xuXHQgKlxuXHQgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGVsXG5cdCAqIEByZXR1cm4ge0FycmF5fSBkYXRhXG5cdCAqL1xuXHRnZXRFbGVtRGF0YShlbClcblx0e1xuXHRcdC8vIEFsbCBhdHRyaWJ1dGVzXG5cdFx0bGV0IGF0dHJpYnV0ZXMgPSBlbC5hdHRyaWJ1dGVzO1xuXG5cdFx0Ly8gUmVnZXggUGF0dGVyblxuXHRcdGxldCBwYXR0ZXJuID0gL15kYXRhXFwtKC4rKSQvO1xuXG5cdFx0Ly8gT3V0cHV0XG5cdFx0bGV0IGRhdGEgPSB7fTtcblxuXHRcdGZvciAobGV0IGkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0Ly8gQXR0cmlidXRlcyBuYW1lIChleDogZGF0YS1tb2R1bGUpXG5cdFx0XHRsZXQgbmFtZSA9IGF0dHJpYnV0ZXNbaV0ubmFtZTtcblxuXHRcdFx0Ly8gVGhpcyBoYXBwZW5zLlxuXHRcdFx0aWYgKCFuYW1lKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXQgbWF0Y2ggPSBuYW1lLm1hdGNoKHBhdHRlcm4pO1xuXHRcdFx0aWYgKCFtYXRjaCkge1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhpcyB0aHJvd3MgYW4gZXJyb3IsIHlvdSBoYXZlIHNvbWVcblx0XHRcdC8vIHNlcmlvdXMgcHJvYmxlbSBpbiB5b3VyIEhUTUwuXG5cdFx0XHRkYXRhWyBtYXRjaFsxXSBdID0gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkYXRhO1xuXHR9XG59O1xuXG4vLyBEb2N1bWVudCByZWFkeVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiQoZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5hcHAgPSBuZXcgQXBwKCk7XG5cdHdpbmRvdy5hcHAuaW5pdCgpO1xufSk7XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2xvYmFsc30gZnJvbSAnLi9tb2R1bGVzL0dsb2JhbHMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEdlbmVyaWN9IGZyb20gJy4vbW9kdWxlcy9HZW5lcmljJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBUaXRsZX0gZnJvbSAnLi9tb2R1bGVzL1RpdGxlJztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnXG5cbmNsYXNzIEdlbmVyaWMgZXh0ZW5kcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIoKTtcbiAgICAgICAgdGhpcy4kZWwgPSBvcHRpb25zLiRlbDtcblxuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIG1vZHVsZScpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcblx0fVxuXG5cdC8vIERlc3Ryb3lcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRlbC5vZmYoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljO1xuwqBcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHbG9iYWxzIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBTdmcgZnJvbSAnLi9TdmcnO1xuXG5jbGFzcyBHbG9iYWxzIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bmV3IFN2ZygpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdsb2JhbHM7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0dGhpcy4kaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblx0XHR0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2R1bGU7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU3ZnIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnXG5cbmNsYXNzIFN2ZyBleHRlbmRzIE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHRzdmc0ZXZlcnlib2R5KCk7XG5cdH1cblxuXHQvLyBEZXN0cm95XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwub2ZmKCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3ZnO1xuwqBcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUaXRsZSBtb2R1bGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJ1xuXG5jbGFzcyBUaXRsZSBleHRlbmRzIE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcigpO1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXG5cdFx0Y29uc29sZS5sb2coJ1RpdGxlIG1vZHVsZScpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcblx0fVxuXG5cdC8vIERlc3Ryb3lcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRlbC5vZmYoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaXRsZTtcbsKgXG4iXX0=
