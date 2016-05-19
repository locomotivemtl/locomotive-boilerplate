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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Abstract module
 * Gives access to generic jQuery nodes
 */

var AbstractModule = function AbstractModule(options) {
	_classCallCheck(this, AbstractModule);

	this.$document = _environment.$document;
	this.$window = _environment.$window;
	this.$html = _environment.$html;
	this.$body = _environment.$body;
	this.$el = options.$el;
};

exports.default = AbstractModule;

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
		return _this;
	}

	_createClass(_class, [{
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

},{"./AbstractModule":4}],7:[function(require,module,exports){
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

},{"../global/svg":2}]},{},[1,2,3,4,5,6,7,8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhc3NldHMvc2NyaXB0cy9BcHAuanMiLCJhc3NldHMvc2NyaXB0cy9nbG9iYWwvc3ZnLmpzIiwiYXNzZXRzL3NjcmlwdHMvbW9kdWxlcy5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvQWJzdHJhY3RNb2R1bGUuanMiLCJhc3NldHMvc2NyaXB0cy9tb2R1bGVzL0J1dHRvbi5qcyIsImFzc2V0cy9zY3JpcHRzL21vZHVsZXMvVGl0bGUuanMiLCJhc3NldHMvc2NyaXB0cy91dGlscy9lbnZpcm9ubWVudC5qcyIsImFzc2V0cy9zY3JpcHRzL3V0aWxzL2dsb2JhbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQ0NBOzs7O0FBQ0E7O0lBQVk7Ozs7Ozs7O0lBRU47QUFDTCxVQURLLEdBQ0wsR0FBYzt3QkFEVCxLQUNTOztBQUNiLE9BQUssT0FBTCxHQUFlLE9BQWYsQ0FEYTtBQUViLE9BQUssY0FBTCxHQUFzQixFQUF0QixDQUZhO0VBQWQ7Ozs7Ozs7O2NBREs7O2dDQVVTO0FBQ2IsNEJBRGE7QUFFYixVQUFPLElBQVAsQ0FGYTs7Ozs7Ozs7OztnQ0FTQTs7QUFFYixPQUFJLFlBQVksU0FBUyxnQkFBVCxDQUEwQixlQUExQixDQUFaOzs7QUFGUyxPQUtULElBQUksQ0FBSixDQUxTO0FBTWIsT0FBSSxTQUFTLFVBQVUsTUFBVixDQU5BOztBQVFiLFVBQU8sSUFBSSxNQUFKLEVBQVksR0FBbkIsRUFBd0I7OztBQUd2QixRQUFJLEtBQUssVUFBVSxDQUFWLENBQUw7OztBQUhtQixRQU1uQixVQUFVLEtBQUssV0FBTCxDQUFpQixFQUFqQixDQUFWOzs7QUFObUIsV0FTdkIsQ0FBUSxFQUFSLEdBQWEsRUFBYixDQVR1QjtBQVV2QixZQUFRLEdBQVIsR0FBYyxFQUFFLEVB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dUMsVUFBQyxLQUFELEVBQVEsS0FBUixFQUFrQjtBQUN4RCxTQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFEd0Q7R0FBbEIsQ0FBdkMsQ0FMb0I7O0VBQXJCOzs7OzhCQVVZLE9BQU87QUFDbEIsUUFBSyxNQUFMLENBQVksSUFBWixDQUFpQixLQUFqQixFQURrQjs7Ozs0QkFJVDtBQUNULFFBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsbUJBQW5CLEVBRFM7QUFFVCxRQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsUUFBYixFQUZTOzs7Ozs7Ozs7Ozs7Ozs7QUNsQlgsSUFBTSxZQUFZLEVBQUUsUUFBRixDQUFaO0FBQ04sSUFBTSxVQUFVLEVBQUUsTUFBRixDQUFWO0FBQ04sSUFBTSxRQUFRLEVBQUUsU0FBUyxlQUFULENBQVY7QUFDTixJQUFNLFFBQVEsRUFBRSxTQUFTLElBQVQsQ0FBVjs7UUFFRztRQUFXO1FBQVM7UUFBTzs7Ozs7Ozs7O2tCQ0ZyQixZQUFXO0FBQ3pCLHNCQUR5QjtDQUFYOztBQUZmIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBnbG9iYWxzIGZyb20gJy4vdXRpbHMvZ2xvYmFscyc7XG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcyc7XG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cdFx0dGhpcy5jdXJyZW50TW9kdWxlcyA9IFtdO1xuXHR9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGUgZ2xvYmFsIGZ1bmN0aW9ucyBhbmQgc2V0dGluZ3Ncblx0ICogQHJldHVybiB7T2JqZWN0fVxuXHQgKi9cblx0aW5pdEdsb2JhbHMoKSB7XG5cdFx0Z2xvYmFscygpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgbW9kdWxlcyBhbmQgaW5pdGlhbGl6ZSB0aGVtXG5cdCAqIEByZXR1cm4gIHtPYmplY3R9ICB0aGlzICBBbGxvd3MgY2hhaW5pbmdcblx0ICovXG5cdGluaXRNb2R1bGVzKCkge1xuXHRcdC8vIEVsZW1lbnRzIHdpdGggbW9kdWxlXG5cdFx0dmFyIG1vZHVsZUVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcblxuXHRcdC8vIExvb3AgdGhyb3VnaCBlbGVtZW50c1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgZWxzTGVuID0gbW9kdWxlRWxzLmxlbmd0aDtcblxuXHRcdGZvciAoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuXHRcdFx0Ly8gQ3VycmVudCBlbGVtZW50XG5cdFx0XHRsZXQgZWwgPSBtb2R1bGVFbHNbaV07XG5cblx0XHRcdC8vIEFsbCBkYXRhLSBhdHRyaWJ1dGVzIGNvbnNpZGVyZWQgYXMgb3B0aW9uc1xuXHRcdFx0bGV0IG9wdGlvbnMgPSB0aGlzLmdldEVsZW1EYXRhKGVsKTtcblxuXHRcdFx0Ly8gQWRkIGN1cnJlbnQgRE9NIGVsZW1lbnQgYW5kIGpRdWVyeSBlbGVtZW50XG5cdFx0XHRvcHRpb25zLmVsID0gZWw7XG5cdFx0XHRvcHRpb25zLiRlbCA9ICQoZWwpO1xuXG5cdFx0XHQvLyBNb2R1bGUgZG9lcyBleGlzdCBhdCB0aGlzIHBvaW50XG5cdFx0XHRsZXQgYXR0ciA9IG9wdGlvbnMubW9kdWxlO1xuXG5cdFx0XHQvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcblx0XHRcdGxldCBtb2R1bGVJZGVudHMgPSBhdHRyLnJlcGxhY2UoL1xccy9nLCAnJykuc3BsaXQoJywnKTtcblxuXHRcdFx0Ly8gTG9vcCBtb2R1bGVzXG5cdFx0XHRsZXQgaiA9IDA7XG5cdFx0XHRsZXQgbW9kdWxlc0xlbiA9IG1vZHVsZUlkZW50cy5sZW5ndGg7XG5cblx0XHRcdGZvciAoOyBqIDwgbW9kdWxlc0xlbjsgaisrKSB7XG5cdFx0XHRcdGxldCBtb2R1bGVBdHRyID0gbW9kdWxlSWRlbnRzW2pdO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW21vZHVsZUF0dHJdID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0bGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbbW9kdWxlQXR0cl0ob3B0aW9ucyk7XG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50TW9kdWxlcy5wdXNoKG1vZHVsZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgZWxlbWVudCBkYXRhIGF0dHJpYnV0ZXNcblx0ICogQHBhcmFtICAge0RPTUVsZW1lbnR9ICBlbFxuXHQgKiBAcmV0dXJuICB7QXJyYXl9ICAgICAgIGRhdGFcblx0ICovXG5cdGdldEVsZW1EYXRhKGVsKSB7XG5cdFx0Ly8gQWxsIGF0dHJpYnV0ZXNcblx0XHR2YXIgYXR0cmlidXRlcyA9IGVsLmF0dHJpYnV0ZXM7XG5cblx0XHQvLyBSZWdleCBQYXR0ZXJuXG5cdFx0dmFyIHBhdHRlcm4gPSAvXmRhdGFcXC0oLispJC87XG5cblx0XHQvLyBPdXRwdXRcblx0XHR2YXIgZGF0YSA9IHt9O1xuXG5cdFx0Zm9yIChsZXQgaSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHQvLyBBdHRyaWJ1dGVzIG5hbWUgKGV4OiBkYXRhLW1vZHVsZSlcblx0XHRcdGxldCBuYW1lID0gYXR0cmlidXRlc1tpXS5uYW1lO1xuXG5cdFx0XHQvLyBUaGlzIGhhcHBlbnMuXG5cdFx0XHRpZiAoIW5hbWUpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGxldCBtYXRjaCA9IG5hbWUubWF0Y2gocGF0dGVybik7XG5cdFx0XHRpZiAoIW1hdGNoKSB7XG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGlzIHRocm93cyBhbiBlcnJvciwgeW91IGhhdmUgc29tZVxuXHRcdFx0Ly8gc2VyaW91cyBwcm9ibGVtcyBpbiB5b3VyIEhUTUwuXG5cdFx0XHRkYXRhW21hdGNoWzFdXSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fVxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIGFwcCBhZnRlciBkb2N1bWVudCByZWFkeVxuXHQgKi9cblx0aW5pdCgpIHtcblx0XHR0aGlzLmluaXRHbG9iYWxzKCkuaW5pdE1vZHVsZXMoKTtcblx0fVxufVxuXG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5kb3cuYXBwID0gbmV3IEFwcCgpO1xuXHR3aW5kb3cuYXBwLmluaXQoKTtcbn0pO1xuIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG5cdHN2ZzRldmVyeWJvZHkoKTtcbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmV4cG9ydCB7ZGVmYXVsdCBhcyBCdXR0b259IGZyb20gJy4vbW9kdWxlcy9CdXR0b24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIFRpdGxlfSBmcm9tICcuL21vZHVsZXMvVGl0bGUnO1xuIiwiaW1wb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfSBmcm9tICcuLi91dGlscy9lbnZpcm9ubWVudCc7XG5cbi8qKlxuICogQWJzdHJhY3QgbW9kdWxlXG4gKiBHaXZlcyBhY2Nlc3MgdG8gZ2VuZXJpYyBqUXVlcnkgbm9kZXNcbiAqL1xuY2xhc3MgQWJzdHJhY3RNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0dGhpcy4kZG9jdW1lbnQgPSAkZG9jdW1lbnQ7XG5cdFx0dGhpcy4kd2luZG93ID0gJHdpbmRvdztcblx0XHR0aGlzLiRodG1sID0gJGh0bWw7XG5cdFx0dGhpcy4kYm9keSA9ICRib2R5O1xuXHRcdHRoaXMuJGVsID0gb3B0aW9ucy4kZWw7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWJzdHJhY3RNb2R1bGU7XG4iLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG5pbXBvcnQgQWJzdHJhY3RNb2R1bGUgZnJvbSAnLi9BYnN0cmFjdE1vZHVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQWJzdHJhY3RNb2R1bGUge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG5cdFx0c3VwZXIob3B0aW9ucyk7XG5cblx0XHR0aGlzLiRlbC5vbignY2xpY2snLCAoZXZlbnQpID0+IHtcblx0XHRcdHRoaXMuJGRvY3VtZW50LnRyaWdnZXIoJ3RpdGxlLmNoYW5nZUxhYmVsJywgWyQoZXZlbnQuY3VycmVudFRhcmdldCkudmFsKCldKTtcblx0XHR9KTtcblx0fVxuXG5cdGRlc3Ryb3koKSB7XG5cdFx0dGhpcy4kZWwub2ZmKCcuQnV0dG9uJyk7XG5cdH1cbn1cbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBBYnN0cmFjdE1vZHVsZSBmcm9tICcuL0Fic3RyYWN0TW9kdWxlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBBYnN0cmFjdE1vZHVsZSB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcblx0XHRzdXBlcihvcHRpb25zKTtcblxuXHRcdHRoaXMuJGxhYmVsID0gdGhpcy4kZWwuZmluZCgnLmpzLWxhYmVsJyk7XG5cblx0XHR0aGlzLiRkb2N1bWVudC5vbigndGl0bGUuY2hhbmdlTGFiZWwnLCAoZXZlbnQsIHZhbHVlKSA9PiB7XG5cdFx0XHR0aGlzLmNoYW5nZUxhYmVsKHZhbHVlKTtcblx0XHR9KTtcblx0fVxuXG5cdGNoYW5nZUxhYmVsKHZhbHVlKSB7XG5cdFx0dGhpcy4kbGFiZWwudGV4dCh2YWx1ZSk7XG5cdH1cblxuXHRkZXN0cm95KCkge1xuXHRcdHRoaXMuJGRvY3VtZW50Lm9mZigndGl0bGUuY2hhbmdlTGFiZWwnKTtcblx0XHR0aGlzLiRlbC5vZmYoJy5UaXRsZScpO1xuXHR9XG59XG4iLCJjb25zdCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcbmNvbnN0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XG5jb25zdCAkaHRtbCA9ICQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KTtcbmNvbnN0ICRib2R5ID0gJChkb2N1bWVudC5ib2R5KTtcblxuZXhwb3J0IHsgJGRvY3VtZW50LCAkd2luZG93LCAkaHRtbCwgJGJvZHkgfTtcbiIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbmltcG9ydCBzdmcgZnJvbSAnLi4vZ2xvYmFsL3N2Zyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuXHRzdmcoKTtcbn1cbiJdfQ==
