(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _modules = require('./modules');

var modules = _interopRequireWildcard(_modules);

var _templates = require('./templates');

var templates = _interopRequireWildcard(_templates);

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
		current_modules: [],
		current_template: this.elements.html.getAttribute('data-template')
	};

	this.modules = modules;
	this.templates = templates;

	/**
  * @todo  [1]  Discuss storing instanciated objects
  * @todo  [2]  Discuss singleton concept (one off functions/declarations)
  */
	// Modules
	// ==========================================================================
	var moduleEls = document.querySelectorAll('[data-module]');
	for (var i = 0, len = moduleEls.length; i < len; i++) {
		var attr = moduleEls[i].getAttribute('data-module');

		// Uppercasing for class usage
		var ident = attr.charAt(0).toUpperCase() + attr.slice(1) + 'Module';

		if (typeof this.modules[ident] === 'function' && this.params.current_modules.indexOf(ident) === -1) {
			// [1,2]
			var widget = new this.modules[ident]();
			// [2]
			this.params.current_modules.push(widget);
		}
	}

	// Template
	// ==========================================================================
	if (typeof this.params.current_template === 'string' && this.params.current_template.length !== 0) {
		var templateIdent = this.params.current_template.charAt(0).toUpperCase() + this.params.current_template.slice(1) + 'Template';

		if (typeof this.templates[templateIdent] === 'function') {
			var template = new this.templates[templateIdent]();
		}
	}
};

;

// Init
// ==========================================================================
$(function () {
	window.app = new App();
});

},{"./modules":3,"./templates":5}],2:[function(require,module,exports){
"use strict";

// ==========================================================================
// Globals
// ==========================================================================
var app = window.app || {};

app.globals = {

    init: function init() {

        // Global modules
        // ==========================================================================
        // app.parallax.init();

    }

};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Generic = require('./modules/Generic');

Object.defineProperty(exports, 'GenericModule', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Generic).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/Generic":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Generic module
// ==========================================================================

var GenericModule = function GenericModule(options) {
	_classCallCheck(this, GenericModule);

	console.log('Generic module');
	this.options = options;
};

exports.default = GenericModule;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Generic = require('./templates/Generic');

Object.defineProperty(exports, 'GenericTemplate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Generic).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./templates/Generic":6}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Generic template
// ==========================================================================

var GenericTemplate = function GenericTemplate(options) {
	_classCallCheck(this, GenericTemplate);

	console.log('Generic template');
	this.options = options;
};

exports.default = GenericTemplate;

},{}]},{},[1,2,3,4,5,6])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL2FwcC5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvYXBwL2dsb2JhbHMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL21vZHVsZXMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL21vZHVsZXMvR2VuZXJpYy5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvdGVtcGxhdGVzLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL3NyYy90ZW1wbGF0ZXMvR2VuZXJpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNFWTs7OztJQUNBOzs7Ozs7O0lBRU4sTUFDTCxTQURLLEdBQ0wsQ0FBYSxPQUFiLEVBQXNCO3VCQURqQixLQUNpQjs7QUFFckIsTUFBSyxRQUFMLEdBQWdCO0FBQ2YsUUFBTSxTQUFTLGVBQVQ7QUFDTixRQUFNLFNBQVMsSUFBVDtFQUZQLENBRnFCOztBQU9yQixNQUFLLE1BQUwsR0FBYztBQUNiLG1CQUFpQixFQUFqQjtBQUNBLG9CQUFrQixLQUFLLFFBQUwsQ0FBYyxJQUFkLENBQW1CLFlBQW5CLENBQWdDLGVBQWhDLENBQWxCO0VBRkQsQ0FQcUI7O0FBWXJCLE1BQUssT0FBTCxHQUFlLE9BQWYsQ0FacUI7QUFhckIsTUFBSyxTQUFMLEdBQWlCLFNBQWpCOzs7Ozs7OztBQWJxQixLQXFCakIsWUFBWSxTQUFTLGdCQUFULENBQTBCLGVBQTFCLENBQVosQ0FyQmlCO0FBc0JyQixNQUFLLElBQUksSUFBSSxDQUFKLEVBQU8sTUFBTSxVQUFVLE1BQVYsRUFBa0IsSUFBSSxHQUFKLEVBQVMsR0FBakQsRUFBc0Q7QUFDckQsTUFBSSxPQUFPLFVBQVUsQ0FBVixFQUFhLFlBQWIsQ0FBMEIsYUFBMUIsQ0FBUDs7O0FBRGlELE1BSWpELFFBQVEsS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLFdBQWYsS0FBK0IsS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUEvQixHQUErQyxRQUEvQyxDQUp5Qzs7QUFNckQsTUFBSSxPQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBUCxLQUErQixVQUEvQixJQUE2QyxLQUFLLE1BQUwsQ0FBWSxlQUFaLENBQTRCLE9BQTVCLENBQW9DLEtBQXBDLE1BQStDLENBQUMsQ0FBRCxFQUFJOztBQUVuRyxPQUFJLFNBQVMsSUFBSSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQUosRUFBVDs7QUFGK0YsT0FJbkcsQ0FBSyxNQUFMLENBQVksZUFBWixDQUE0QixJQUE1QixDQUFpQyxNQUFqQyxFQUptRztHQUFwRztFQU5EOzs7O0FBdEJxQixLQXNDakIsT0FBTyxLQUFLLE1BQUwsQ0FBWSxnQkFBWixLQUFrQyxRQUF6QyxJQUFxRCxLQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixNQUE3QixLQUF3QyxDQUF4QyxFQUEyQztBQUNuRyxNQUFJLGdCQUFnQixLQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixNQUE3QixDQUFvQyxDQUFwQyxFQUF1QyxXQUF2QyxLQUF1RCxLQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixLQUE3QixDQUFtQyxDQUFuQyxDQUF2RCxHQUErRixVQUEvRixDQUQrRTs7QUFHbkcsTUFBSSxPQUFPLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBUCxLQUF5QyxVQUF6QyxFQUFxRDtBQUN4RCxPQUFJLFdBQVcsSUFBSSxLQUFLLFNBQUwsQ0FBZSxhQUFmLENBQUosRUFBWCxDQURvRDtHQUF6RDtFQUhEO0NBdENEOztBQStDQTs7OztBQUlELEVBQUUsWUFBVztBQUNaLFFBQU8sR0FBUCxHQUFhLElBQUksR0FBSixFQUFiLENBRFk7Q0FBWCxDQUFGOzs7Ozs7OztBQ3REQSxJQUFJLE1BQU0sT0FBTyxHQUFQLElBQWMsRUFBZDs7QUFFVixJQUFJLE9BQUosR0FBYzs7QUFFVixVQUFPLGdCQUFXOzs7Ozs7S0FBWDs7Q0FGWDs7Ozs7Ozs7Ozs7Ozs7NENDTFE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNJRixnQkFDTCxTQURLLGFBQ0wsQ0FBYSxPQUFiLEVBQXNCO3VCQURqQixlQUNpQjs7QUFDckIsU0FBUSxHQUFSLENBQVksZ0JBQVosRUFEcUI7QUFFckIsTUFBSyxPQUFMLEdBQWUsT0FBZixDQUZxQjtDQUF0Qjs7a0JBTWM7Ozs7Ozs7Ozs7Ozs7OzRDQ1hQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDSUYsa0JBQ0wsU0FESyxlQUNMLENBQWEsT0FBYixFQUFzQjt1QkFEakIsaUJBQ2lCOztBQUNyQixTQUFRLEdBQVIsQ0FBWSxrQkFBWixFQURxQjtBQUVyQixNQUFLLE9BQUwsR0FBZSxPQUFmLENBRnFCO0NBQXRCOztrQkFNYyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZXMnXG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cblx0XHR0aGlzLmVsZW1lbnRzID0ge1xuXHRcdFx0aHRtbDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0Ym9keTogZG9jdW1lbnQuYm9keVxuXHRcdH07XG5cblx0XHR0aGlzLnBhcmFtcyA9IHtcblx0XHRcdGN1cnJlbnRfbW9kdWxlczogW10sXG5cdFx0XHRjdXJyZW50X3RlbXBsYXRlOiB0aGlzLmVsZW1lbnRzLmh0bWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJylcblx0XHR9O1xuXG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcblxuXHRcdC8qKlxuXHRcdCAqIEB0b2RvICBbMV0gIERpc2N1c3Mgc3RvcmluZyBpbnN0YW5jaWF0ZWQgb2JqZWN0c1xuXHRcdCAqIEB0b2RvICBbMl0gIERpc2N1c3Mgc2luZ2xldG9uIGNvbmNlcHQgKG9uZSBvZmYgZnVuY3Rpb25zL2RlY2xhcmF0aW9ucylcblx0XHQgKi9cblx0XHQvLyBNb2R1bGVzXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHR2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXHRcdGZvciAobGV0IGkgPSAwLCBsZW4gPSBtb2R1bGVFbHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdGxldCBhdHRyID0gbW9kdWxlRWxzW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS1tb2R1bGUnKTtcblxuXHRcdFx0Ly8gVXBwZXJjYXNpbmcgZm9yIGNsYXNzIHVzYWdlXG5cdFx0XHRsZXQgaWRlbnQgPSBhdHRyLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgYXR0ci5zbGljZSgxKSArICdNb2R1bGUnO1xuXG5cdFx0XHRpZiAodHlwZW9mIHRoaXMubW9kdWxlc1tpZGVudF0gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5wYXJhbXMuY3VycmVudF9tb2R1bGVzLmluZGV4T2YoaWRlbnQpID09PSAtMSkge1xuXHRcdFx0XHQvLyBbMSwyXVxuXHRcdFx0XHRsZXQgd2lkZ2V0ID0gbmV3IHRoaXMubW9kdWxlc1tpZGVudF07XG5cdFx0XHRcdC8vIFsyXVxuXHRcdFx0XHR0aGlzLnBhcmFtcy5jdXJyZW50X21vZHVsZXMucHVzaCh3aWRnZXQpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFRlbXBsYXRlXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRpZiAodHlwZW9mKHRoaXMucGFyYW1zLmN1cnJlbnRfdGVtcGxhdGUpID09PSAnc3RyaW5nJyAmJiB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0dmFyIHRlbXBsYXRlSWRlbnQgPSB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wYXJhbXMuY3VycmVudF90ZW1wbGF0ZS5zbGljZSgxKSArICdUZW1wbGF0ZSc7XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGVJZGVudF0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dmFyIHRlbXBsYXRlID0gbmV3IHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlSWRlbnRdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG59O1xuXG4vLyBJbml0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJChmdW5jdGlvbigpIHtcblx0d2luZG93LmFwcCA9IG5ldyBBcHAoKTtcbn0pOyIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHbG9iYWxzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxudmFyIGFwcCA9IHdpbmRvdy5hcHAgfHwge307XG5cbmFwcC5nbG9iYWxzID0ge1xuXG4gICAgaW5pdCA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8vIEdsb2JhbCBtb2R1bGVzXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgICAgIC8vIGFwcC5wYXJhbGxheC5pbml0KCk7XG5cbiAgICB9XG5cbn07XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY01vZHVsZX0gZnJvbSAnLi9tb2R1bGVzL0dlbmVyaWMnO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdlbmVyaWMgbW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBHZW5lcmljTW9kdWxlIHtcblx0Y29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblx0XHRjb25zb2xlLmxvZygnR2VuZXJpYyBtb2R1bGUnKTtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVyaWNNb2R1bGU7XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY1RlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlcy9HZW5lcmljJztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIHRlbXBsYXRlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBHZW5lcmljVGVtcGxhdGUge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIHRlbXBsYXRlJyk7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljVGVtcGxhdGU7XG4iXX0=
