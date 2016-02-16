(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /* jshint esnext: true */
// ==========================================================================


var App = function App(options) {
	_classCallCheck(this, App);

	this.elements = {
		html: document.documentElement,
		body: document.body
	};

	this.params = {
		current_modules: []
	};

	this.modules = modules;

	// Globals module
	// ==========================================================================
	var globals = new this.modules['Globals']();

	/**
  * @todo  [1]  Discuss storing instanciated objects
  * @todo  [2]  Discuss singleton concept (one off functions/declarations)
  */
	// Modules
	// ==========================================================================
	var moduleEls = document.querySelectorAll('[data-module]');
	for (var i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

		var attr = moduleEls[i].getAttribute('data-module');

		// Splitting modules found in the data-attribute
		var moduleAttrs = attr.replace(/\s/g, '').split(',');

		for (var j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
			var moduleAttr = moduleAttrs[j];

			if (typeof this.modules[moduleAttr] === 'function' && this.params.current_modules.indexOf(moduleAttr) === -1) {
				// [1,2]
				var module = new this.modules[moduleAttr]({
					$el: $(moduleEls[i])
				});
				// [2]
				this.params.current_modules.push(module);
			}
		}
	}
};

;

// Init
// ==========================================================================
$(function () {
	window.app = new App();
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

},{"./modules/Generic":3,"./modules/Globals":4,"./modules/Title":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Generic module
// ==========================================================================

var Generic = function Generic(options) {
	_classCallCheck(this, Generic);

	this.$el = options.$el;
	console.log('Generic module');
	console.log(this.$el);
};

exports.default = Generic;

},{}],4:[function(require,module,exports){
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

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Generic = require('./templates/Generic');

Object.defineProperty(exports, 'GenericTemplate', {
  enumerable: true,
  get: function get() {
    return _Generic.default;
  }
});

'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// ==========================================================================


};


