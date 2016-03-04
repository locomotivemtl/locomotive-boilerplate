(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esnext: true */
// ==========================================================================


var _Modules = require('./Modules');

var modules = _interopRequireWildcard(_Modules);

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

	}, {
		key: 'initModules',
		value: function initModules() {
			/**
    * @todo  [1]  Discuss storing instanciated objects
    * @todo  [2]  Discuss singleton concept (one off functions/declarations)
    */
			var moduleEls = document.querySelectorAll('[data-module]');
			for (var i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

				var attr = moduleEls[i].getAttribute('data-module');

				// Splitting modules found in the data-attribute
				var moduleAttrs = attr.replace(/\s/g, '').split(',');

				for (var j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
					var moduleAttr = moduleAttrs[j];

					if (typeof this.modules[moduleAttr] === 'function' && this.currentModules.indexOf(moduleAttr) === -1) {
						// [1,2]
						var module = new this.modules[moduleAttr]({
							$el: $(moduleEls[i])
						});
						// [2]
						this.currentModules.push(module);
					}
				}
			}
		}

		// Init
		// ==========================================================================

	}, {
		key: 'init',
		value: function init() {
			this.initGlobals();
			this.initModules();
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

},{"./Modules":2}],2:[function(require,module,exports){
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

},{"./modules/Generic":4,"./modules/Globals":5,"./modules/Title":8}],3:[function(require,module,exports){
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

},{"./modules/Generic":4,"./modules/Globals":5,"./modules/Title":8}],4:[function(require,module,exports){
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

},{"./Module":6}],5:[function(require,module,exports){
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

},{"./Svg":7}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{"./Module":6}],8:[function(require,module,exports){
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

},{"./Module":6}]},{},[1,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxBcHAuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxNb2R1bGVzLmpzIiwid3d3XFxhc3NldHNcXHNjcmlwdHNcXHNyY1xcbW9kdWxlcy5qcyIsInd3d1xcYXNzZXRzXFxzY3JpcHRzXFxzcmNcXG1vZHVsZXNcXEdlbmVyaWMuanMiLCJ3d3dcXGFzc2V0c1xcc2NyaXB0c1xcc3JjXFxtb2R1bGVzXFxHbG9iYWxzLmpzIiwid3d3XFxhc3NldHNcXHNjcmlwdHNcXHNyY1xcbW9kdWxlc1xcTW9kdWxlLmpzIiwid3d3XFxhc3NldHNcXHNjcmlwdHNcXHNyY1xcbW9kdWxlc1xcU3ZnLmpzIiwid3d3XFxhc3NldHNcXHNjcmlwdHNcXHNyY1xcbW9kdWxlc1xcVGl0bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztJQ0VZOzs7Ozs7SUFFTjtBQUNMLFVBREssR0FDTCxDQUFZLE9BQVosRUFBcUI7d0JBRGhCLEtBQ2dCOztBQUNwQixPQUFLLE9BQUwsR0FBZSxPQUFmLENBRG9CO0FBRXBCLE9BQUssT0FBTCxDQUZvQjtBQUdwQixPQUFLLGNBQUwsR0FBc0IsRUFBdEIsQ0FIb0I7RUFBckI7Ozs7OztjQURLOztnQ0FTUztBQUNiLFFBQUssT0FBTCxHQUFlLElBQUksS0FBSyxPQUFMLENBQWEsU0FBYixDQUFKLEVBQWYsQ0FEYTs7Ozs7Ozs7Z0NBTUE7Ozs7O0FBS2IsT0FBTSxZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBWixDQUxPO0FBTWIsUUFBSyxJQUFJLElBQUksQ0FBSixFQUFPLFNBQVMsVUFBVSxNQUFWLEVBQWtCLElBQUksTUFBSixFQUFZLEdBQXZELEVBQTREOztBQUUzRCxRQUFJLE9BQU8sVUFBVSxDQUFWLEVBQWEsWUFBYixDQUEwQixhQUExQixDQUFQOzs7QUFGdUQsUUFLdkQsY0FBYyxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLEVBQXdCLEtBQXhCLENBQThCLEdBQTlCLENBQWQsQ0FMdUQ7O0FBTzNELFNBQUssSUFBSSxJQUFJLENBQUosRUFBTyxTQUFTLFlBQVksTUFBWixFQUFvQixJQUFJLE1BQUosRUFBWSxHQUF6RCxFQUE4RDtBQUM3RCxTQUFJLGFBQWEsWUFBWSxDQUFaLENBQWIsQ0FEeUQ7O0FBRzdELFNBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQVAsS0FBb0MsVUFBcEMsSUFBa0QsS0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLFVBQTVCLE1BQTRDLENBQUMsQ0FBRCxFQUFJOztBQUVyRyxVQUFJLFNBQVMsSUFBSSxLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQUosQ0FBNkI7QUFDekMsWUFBSyxFQUFFLFVBQVUsQ0FBVixDQUFGLENBQUw7T0FEWSxDQUFUOztBQUZpRyxVQU1yRyxDQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsTUFBekIsRUFOcUc7TUFBdEc7S0FIRDtJQVBEOzs7Ozs7Ozt5QkF3Qk07QUFDTixRQUFLLFdBQUwsR0FETTtBQUVOLFFBQUssV0FBTCxHQUZNOzs7O1FBN0NGOzs7QUFpREw7Ozs7QUFJRCxFQUFFLFlBQVc7QUFDWixRQUFPLEdBQVAsR0FBYSxJQUFJLEdBQUosRUFBYixDQURZO0FBRVosUUFBTyxHQUFQLENBQVcsSUFBWCxHQUZZO0NBQVgsQ0FBRjs7Ozs7Ozs7Ozs7Ozs7NENDekRROzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzswQ0FDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRDQ0ZBOzs7Ozs7Ozs7NENBQ0E7Ozs7Ozs7OzswQ0FDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDR0Y7OztBQUNMLFVBREssT0FDTCxDQUFZLE9BQVosRUFBcUI7d0JBRGhCLFNBQ2dCOztxRUFEaEIscUJBQ2dCOztBQUVkLFFBQUssR0FBTCxHQUFXLFFBQVEsR0FBUixDQUZHOztBQUlwQixVQUFRLEdBQVIsQ0FBWSxnQkFBWixFQUpvQjtBQUtwQixVQUFRLEdBQVIsQ0FBWSxNQUFLLEdBQUwsQ0FBWixDQUxvQjs7RUFBckI7Ozs7OztjQURLOzs0QkFXSztBQUNULFFBQUssR0FBTCxDQUFTLEdBQVQsR0FEUzs7OztRQVhMOzs7a0JBZ0JTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2hCVCxVQUNMLFNBREssT0FDTCxHQUFjO3VCQURULFNBQ1M7O0FBQ2IscUJBRGE7Q0FBZDs7a0JBS2M7Ozs7Ozs7Ozs7Ozs7OztJQ1BULFNBQ0wsU0FESyxNQUNMLEdBQWM7dUJBRFQsUUFDUzs7QUFDYixNQUFLLE9BQUwsR0FBZSxFQUFFLE1BQUYsQ0FBZixDQURhO0FBRWIsTUFBSyxLQUFMLEdBQWEsRUFBRSxTQUFTLGVBQVQsQ0FBZixDQUZhO0FBR2IsTUFBSyxLQUFMLEdBQWEsRUFBRSxTQUFTLElBQVQsQ0FBZixDQUhhO0NBQWQ7O2tCQU9jOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ1BUOzs7QUFDTCxVQURLLEdBQ0wsR0FBYzt3QkFEVCxLQUNTOztxRUFEVCxpQkFDUzs7QUFHYixrQkFIYTs7RUFBZDs7Ozs7O2NBREs7OzRCQVNLO0FBQ1QsUUFBSyxHQUFMLENBQVMsR0FBVCxHQURTOzs7O1FBVEw7OztrQkFjUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNkVDs7O0FBQ0wsVUFESyxLQUNMLENBQVksT0FBWixFQUFxQjt3QkFEaEIsT0FDZ0I7O3FFQURoQixtQkFDZ0I7O0FBRWQsUUFBSyxHQUFMLEdBQVcsUUFBUSxHQUFSLENBRkc7O0FBSXBCLFVBQVEsR0FBUixDQUFZLGNBQVosRUFKb0I7QUFLcEIsVUFBUSxHQUFSLENBQVksTUFBSyxHQUFMLENBQVosQ0FMb0I7O0VBQXJCOzs7Ozs7Y0FESzs7NEJBV0s7QUFDVCxRQUFLLEdBQUwsQ0FBUyxHQUFULEdBRFM7Ozs7UUFYTDs7O2tCQWdCUyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL01vZHVsZXMnXG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHR0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuXHRcdHRoaXMuZ2xvYmFscztcblx0XHR0aGlzLmN1cnJlbnRNb2R1bGVzID0gW107XG5cdH1cblxuXHQvLyBJbml0IGdsb2JhbHNcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0aW5pdEdsb2JhbHMoKSB7XG5cdFx0dGhpcy5nbG9iYWxzID0gbmV3IHRoaXMubW9kdWxlc1snR2xvYmFscyddO1xuXHR9XG5cblx0Ly8gSW5pdCBtb2R1bGVzXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGluaXRNb2R1bGVzKCkge1xuXHRcdC8qKlxuXHRcdCAqIEB0b2RvICBbMV0gIERpc2N1c3Mgc3RvcmluZyBpbnN0YW5jaWF0ZWQgb2JqZWN0c1xuXHRcdCAqIEB0b2RvICBbMl0gIERpc2N1c3Mgc2luZ2xldG9uIGNvbmNlcHQgKG9uZSBvZmYgZnVuY3Rpb25zL2RlY2xhcmF0aW9ucylcblx0XHQgKi9cblx0XHRjb25zdCBtb2R1bGVFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIGVsc0xlbiA9IG1vZHVsZUVscy5sZW5ndGg7IGkgPCBlbHNMZW47IGkrKykge1xuXG5cdFx0XHRsZXQgYXR0ciA9IG1vZHVsZUVsc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kdWxlJyk7XG5cblx0XHRcdC8vIFNwbGl0dGluZyBtb2R1bGVzIGZvdW5kIGluIHRoZSBkYXRhLWF0dHJpYnV0ZVxuXHRcdFx0bGV0IG1vZHVsZUF0dHJzID0gYXR0ci5yZXBsYWNlKC9cXHMvZywgJycpLnNwbGl0KCcsJyk7XG5cblx0XHRcdGZvciAobGV0IGogPSAwLCBtb2RMZW4gPSBtb2R1bGVBdHRycy5sZW5ndGg7IGogPCBtb2RMZW47IGorKykge1xuXHRcdFx0XHRsZXQgbW9kdWxlQXR0ciA9IG1vZHVsZUF0dHJzW2pdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY3VycmVudE1vZHVsZXMuaW5kZXhPZihtb2R1bGVBdHRyKSA9PT0gLTEpIHtcblx0XHRcdFx0XHQvLyBbMSwyXVxuXHRcdFx0XHRcdGxldCBtb2R1bGUgPSBuZXcgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdKHtcblx0XHRcdFx0XHRcdCRlbDogJChtb2R1bGVFbHNbaV0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gWzJdXG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBJbml0XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5pbml0R2xvYmFscygpO1xuXHRcdHRoaXMuaW5pdE1vZHVsZXMoKTtcblx0fVxufTtcblxuLy8gRG9jdW1lbnQgcmVhZHlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5kb3cuYXBwID0gbmV3IEFwcCgpO1xuXHR3aW5kb3cuYXBwLmluaXQoKTtcbn0pO1xuIiwiZXhwb3J0IHtkZWZhdWx0IGFzIEdsb2JhbHN9IGZyb20gJy4vbW9kdWxlcy9HbG9iYWxzJztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIEdlbmVyaWN9IGZyb20gJy4vbW9kdWxlcy9HZW5lcmljJztcclxuZXhwb3J0IHtkZWZhdWx0IGFzIFRpdGxlfSBmcm9tICcuL21vZHVsZXMvVGl0bGUnO1xyXG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2xvYmFsc30gZnJvbSAnLi9tb2R1bGVzL0dsb2JhbHMnO1xyXG5leHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY30gZnJvbSAnLi9tb2R1bGVzL0dlbmVyaWMnO1xyXG5leHBvcnQge2RlZmF1bHQgYXMgVGl0bGV9IGZyb20gJy4vbW9kdWxlcy9UaXRsZSc7XHJcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnXG5cbmNsYXNzIEdlbmVyaWMgZXh0ZW5kcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIoKTtcbiAgICAgICAgdGhpcy4kZWwgPSBvcHRpb25zLiRlbDtcblxuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIG1vZHVsZScpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcblx0fVxuXG5cdC8vIERlc3Ryb3lcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRlbC5vZmYoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljO1xuwqBcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHbG9iYWxzIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBTdmcgZnJvbSAnLi9TdmcnO1xuXG5jbGFzcyBHbG9iYWxzIHtcblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0bmV3IFN2ZygpO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdsb2JhbHM7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLiR3aW5kb3cgPSAkKHdpbmRvdyk7XG5cdFx0dGhpcy4kaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcblx0XHR0aGlzLiRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBNb2R1bGU7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gU3ZnIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnXG5cbmNsYXNzIFN2ZyBleHRlbmRzIE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cblx0XHRzdmc0ZXZlcnlib2R5KCk7XG5cdH1cblxuXHQvLyBEZXN0cm95XG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwub2ZmKCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3ZnO1xuwqBcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUaXRsZSBtb2R1bGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJ1xuXG5jbGFzcyBUaXRsZSBleHRlbmRzIE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcigpO1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXG5cdFx0Y29uc29sZS5sb2coJ1RpdGxlIG1vZHVsZScpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcblx0fVxuXG5cdC8vIERlc3Ryb3lcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0ZGVzdHJveSgpIHtcblx0XHR0aGlzLiRlbC5vZmYoKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaXRsZTtcbsKgXG4iXX0=
