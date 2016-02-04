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
	for (var i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

		var attr = moduleEls[i].getAttribute('data-module');

		// Splitting modules found in the data-attribute
		var moduleAttrs = attr.replace(/\s/g, '').split(',');

		for (var j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
			var moduleAttr = moduleAttrs[j];

			// Uppercasing for class usage
			var ident = moduleAttr.charAt(0).toUpperCase() + moduleAttr.slice(1) + 'Module';

			if (typeof this.modules[ident] === 'function' && this.params.current_modules.indexOf(ident) === -1) {
				// [1,2]
				var module = new this.modules[ident]({
					$el: $(moduleEls[i])
				});
				// [2]
				this.params.current_modules.push(module);
			}
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

},{"./modules":3,"./templates":6}],2:[function(require,module,exports){
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
    return _Generic.default;
  }
});

var _Title = require('./modules/Title');

Object.defineProperty(exports, 'TitleModule', {
  enumerable: true,
  get: function get() {
    return _Title.default;
  }
});

},{"./modules/Generic":4,"./modules/Title":5}],4:[function(require,module,exports){
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

	this.$el = options.$el;
	console.log('Generic module');
	console.log(this.$el);
};

exports.default = GenericModule;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Title module
// ==========================================================================

var TitleModule = function TitleModule(options) {
	_classCallCheck(this, TitleModule);

	this.$el = options.$el;
	console.log('Title module');
	console.log(this.$el);
};

exports.default = TitleModule;

},{}],6:[function(require,module,exports){
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

},{"./templates/Generic":7}],7:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5,6,7])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL2FwcC5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvYXBwL2dsb2JhbHMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL21vZHVsZXMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL21vZHVsZXMvR2VuZXJpYy5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvbW9kdWxlcy9UaXRsZS5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvdGVtcGxhdGVzLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL3NyYy90ZW1wbGF0ZXMvR2VuZXJpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNFWSxPQUFPOzs7O0lBQ1AsU0FBUzs7Ozs7OztJQUVmLEdBQUcsR0FDUixTQURLLEdBQUcsQ0FDSyxPQUFPLEVBQUU7dUJBRGpCLEdBQUc7O0FBR1AsS0FBSSxDQUFDLFFBQVEsR0FBRztBQUNmLE1BQUksRUFBRSxRQUFRLENBQUMsZUFBZTtBQUM5QixNQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7RUFDbkIsQ0FBQzs7QUFFRixLQUFJLENBQUMsTUFBTSxHQUFHO0FBQ2IsaUJBQWUsRUFBRSxFQUFFO0FBQ25CLGtCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7RUFDbEUsQ0FBQzs7QUFFRixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixLQUFJLENBQUMsU0FBUyxHQUFHLFNBQVM7Ozs7Ozs7O0FBQUMsQUFRM0IsS0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzNELE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FB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VyxDQUNILE9BQU8sRUFBRTt1QkFEakIsV0FBVzs7QUFFVCxLQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFDN0IsUUFBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUM1QixRQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN0Qjs7a0JBR2EsV0FBVzs7Ozs7Ozs7Ozs7Ozs7b0JDWmxCLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7O0lDSVQsZUFBZSxHQUNwQixTQURLLGVBQWUsQ0FDUCxPQUFPLEVBQUU7dUJBRGpCLGVBQWU7O0FBRW5CLFFBQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQyxLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUN2Qjs7a0JBR2EsZUFBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBqc2hpbnQgZXNuZXh0OiB0cnVlICovXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuaW1wb3J0ICogYXMgbW9kdWxlcyBmcm9tICcuL21vZHVsZXMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZXMnXG5cbmNsYXNzIEFwcCB7XG5cdGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cblx0XHR0aGlzLmVsZW1lbnRzID0ge1xuXHRcdFx0aHRtbDogZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuXHRcdFx0Ym9keTogZG9jdW1lbnQuYm9keVxuXHRcdH07XG5cblx0XHR0aGlzLnBhcmFtcyA9IHtcblx0XHRcdGN1cnJlbnRfbW9kdWxlczogW10sXG5cdFx0XHRjdXJyZW50X3RlbXBsYXRlOiB0aGlzLmVsZW1lbnRzLmh0bWwuZ2V0QXR0cmlidXRlKCdkYXRhLXRlbXBsYXRlJylcblx0XHR9O1xuXG5cdFx0dGhpcy5tb2R1bGVzID0gbW9kdWxlcztcblx0XHR0aGlzLnRlbXBsYXRlcyA9IHRlbXBsYXRlcztcblxuXHRcdC8qKlxuXHRcdCAqIEB0b2RvICBbMV0gIERpc2N1c3Mgc3RvcmluZyBpbnN0YW5jaWF0ZWQgb2JqZWN0c1xuXHRcdCAqIEB0b2RvICBbMl0gIERpc2N1c3Mgc2luZ2xldG9uIGNvbmNlcHQgKG9uZSBvZmYgZnVuY3Rpb25zL2RlY2xhcmF0aW9ucylcblx0XHQgKi9cblx0XHQvLyBNb2R1bGVzXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHR2YXIgbW9kdWxlRWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtbW9kdWxlXScpO1xuXHRcdGZvciAobGV0IGkgPSAwLCBlbHNMZW4gPSBtb2R1bGVFbHMubGVuZ3RoOyBpIDwgZWxzTGVuOyBpKyspIHtcblxuXHRcdFx0bGV0IGF0dHIgPSBtb2R1bGVFbHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLW1vZHVsZScpO1xuXG5cdFx0XHQvLyBTcGxpdHRpbmcgbW9kdWxlcyBmb3VuZCBpbiB0aGUgZGF0YS1hdHRyaWJ1dGVcblx0XHRcdGxldCBtb2R1bGVBdHRycyA9IGF0dHIucmVwbGFjZSgvXFxzL2csICcnKS5zcGxpdCgnLCcpO1xuXG5cdFx0XHRmb3IgKGxldCBqID0gMCwgbW9kTGVuID0gbW9kdWxlQXR0cnMubGVuZ3RoOyBqIDwgbW9kTGVuOyBqKyspIHtcblx0XHRcdFx0bGV0IG1vZHVsZUF0dHIgPSBtb2R1bGVBdHRyc1tqXTtcblxuXHRcdFx0XHQvLyBVcHBlcmNhc2luZyBmb3IgY2xhc3MgdXNhZ2Vcblx0XHRcdFx0bGV0IGlkZW50ID0gbW9kdWxlQXR0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG1vZHVsZUF0dHIuc2xpY2UoMSkgKyAnTW9kdWxlJztcblxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMubW9kdWxlc1tpZGVudF0gPT09ICdmdW5jdGlvbicgJiYgdGhpcy5wYXJhbXMuY3VycmVudF9tb2R1bGVzLmluZGV4T2YoaWRlbnQpID09PSAtMSkge1xuXHRcdFx0XHRcdC8vIFsxLDJdXG5cdFx0XHRcdFx0bGV0IG1vZHVsZSA9IG5ldyB0aGlzLm1vZHVsZXNbaWRlbnRdKHtcblx0XHRcdFx0XHRcdCRlbDogJChtb2R1bGVFbHNbaV0pXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0Ly8gWzJdXG5cdFx0XHRcdFx0dGhpcy5wYXJhbXMuY3VycmVudF9tb2R1bGVzLnB1c2gobW9kdWxlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFRlbXBsYXRlXG5cdFx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblx0XHRpZiAodHlwZW9mKHRoaXMucGFyYW1zLmN1cnJlbnRfdGVtcGxhdGUpID09PSAnc3RyaW5nJyAmJiB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0dmFyIHRlbXBsYXRlSWRlbnQgPSB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wYXJhbXMuY3VycmVudF90ZW1wbGF0ZS5zbGljZSgxKSArICdUZW1wbGF0ZSc7XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGVJZGVudF0gPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0dmFyIHRlbXBsYXRlID0gbmV3IHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlSWRlbnRdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG59O1xuXG4vLyBJbml0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJChmdW5jdGlvbigpIHtcblx0d2luZG93LmFwcCA9IG5ldyBBcHAoKTtcbn0pO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdsb2JhbHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG52YXIgYXBwID0gd2luZG93LmFwcCB8fCB7fTtcblxuYXBwLmdsb2JhbHMgPSB7XG5cbiAgICBpbml0IDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gR2xvYmFsIG1vZHVsZXNcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAgICAgLy8gYXBwLnBhcmFsbGF4LmluaXQoKTtcblxuICAgIH1cblxufTtcbiIsImV4cG9ydCB7ZGVmYXVsdCBhcyBHZW5lcmljTW9kdWxlfSBmcm9tICcuL21vZHVsZXMvR2VuZXJpYyc7XG5leHBvcnQge2RlZmF1bHQgYXMgVGl0bGVNb2R1bGV9IGZyb20gJy4vbW9kdWxlcy9UaXRsZSc7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gR2VuZXJpYyBtb2R1bGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNsYXNzIEdlbmVyaWNNb2R1bGUge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIG1vZHVsZScpO1xuXHRcdGNvbnNvbGUubG9nKHRoaXMuJGVsKTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljTW9kdWxlO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRpdGxlIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgVGl0bGVNb2R1bGUge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgICAgICB0aGlzLiRlbCA9IG9wdGlvbnMuJGVsO1xuXHRcdGNvbnNvbGUubG9nKCdUaXRsZSBtb2R1bGUnKTtcblx0XHRjb25zb2xlLmxvZyh0aGlzLiRlbCk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGl0bGVNb2R1bGU7XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY1RlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlcy9HZW5lcmljJztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIHRlbXBsYXRlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBHZW5lcmljVGVtcGxhdGUge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIHRlbXBsYXRlJyk7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljVGVtcGxhdGU7XG4iXX0=
