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
	var templateIdent = this.params.current_template.charAt(0).toUpperCase() + this.params.current_template.slice(1) + 'Template';
	if (typeof this.templates[templateIdent] === 'function') {
		var template = new this.templates[templateIdent]();
	}
};

;

// Init
// ==========================================================================
$(function () {
	window.app = new App();
});

},{"./modules":2,"./templates":4}],2:[function(require,module,exports){
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

},{"./modules/Generic":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./templates/Generic":5}],5:[function(require,module,exports){
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

},{}]},{},[1,2,3,4,5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvbW9kdWxlcy9ib2lsZXJwbGF0ZS9hc3NldHMvc2NyaXB0cy9zcmMvYXBwLmpzIiwid3d3L21vZHVsZXMvYm9pbGVycGxhdGUvYXNzZXRzL3NjcmlwdHMvc3JjL21vZHVsZXMuanMiLCJ3d3cvbW9kdWxlcy9ib2lsZXJwbGF0ZS9hc3NldHMvc2NyaXB0cy9zcmMvbW9kdWxlcy9HZW5lcmljLmpzIiwid3d3L21vZHVsZXMvYm9pbGVycGxhdGUvYXNzZXRzL3NjcmlwdHMvc3JjL3RlbXBsYXRlcy5qcyIsInd3dy9tb2R1bGVzL2JvaWxlcnBsYXRlL2Fzc2V0cy9zY3JpcHRzL3NyYy90ZW1wbGF0ZXMvR2VuZXJpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNFWSxPQUFPOzs7O0lBQ1AsU0FBUzs7Ozs7OztJQUVmLEdBQUcsR0FDUixTQURLLEdBQUcsQ0FDSyxPQUFPLEVBQUU7dUJBRGpCLEdBQUc7O0FBR1AsS0FBSSxDQUFDLFFBQVEsR0FBRztBQUNmLE1BQUksRUFBRSxRQUFRLENBQUMsZUFBZTtBQUM5QixNQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7RUFDbkIsQ0FBQzs7QUFFRixLQUFJLENBQUMsTUFBTSxHQUFHO0FBQ2IsaUJBQWUsRUFBRSxFQUFFO0FBQ25CLGtCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7RUFDbEUsQ0FBQzs7QUFFRixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixLQUFJLENBQUMsU0FBUyxHQUFHLFNBQVM7Ozs7Ozs7O0FBQUMsQUFRM0IsS0FBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQzNELE1BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDckQsTUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7OztBQUFDLEFBR3BELE1BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7O0FBRXBFLE1BQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7O0FBRW5HLE9BQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBQTs7QUFBQyxBQUVyQyxPQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDekM7RUFDRDs7OztBQUFBLEFBSUQsS0FBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQzlILEtBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUN4RCxNQUFJLFFBQVEsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUEsQ0FBQztFQUNqRDtDQUVEOztBQUNEOzs7O0FBQUMsQUFJRixDQUFDLENBQUMsWUFBVztBQUNaLE9BQU0sQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUN2QixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O29CQ3hESyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0lULGFBQWEsR0FDbEIsU0FESyxhQUFhLENBQ0wsT0FBTyxFQUFFO3VCQURqQixhQUFhOztBQUVqQixRQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDOUIsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDdkI7O2tCQUdhLGFBQWE7Ozs7Ozs7Ozs7Ozs7O29CQ1hwQixPQUFPOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0lULGVBQWUsR0FDcEIsU0FESyxlQUFlLENBQ1AsT0FBTyxFQUFFO3VCQURqQixlQUFlOztBQUVuQixRQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDdkI7O2tCQUdhLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAqIGFzIG1vZHVsZXMgZnJvbSAnLi9tb2R1bGVzJ1xuaW1wb3J0ICogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGVzJ1xuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXG5cdFx0dGhpcy5lbGVtZW50cyA9IHtcblx0XHRcdGh0bWw6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGJvZHk6IGRvY3VtZW50LmJvZHlcblx0XHR9O1xuXG5cdFx0dGhpcy5wYXJhbXMgPSB7XG5cdFx0XHRjdXJyZW50X21vZHVsZXM6IFtdLFxuXHRcdFx0Y3VycmVudF90ZW1wbGF0ZTogdGhpcy5lbGVtZW50cy5odG1sLmdldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZScpXG5cdFx0fTtcblxuXHRcdHRoaXMubW9kdWxlcyA9IG1vZHVsZXM7XG5cdFx0dGhpcy50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXM7XG5cblx0XHQvKipcblx0XHQgKiBAdG9kbyAgWzFdICBEaXNjdXNzIHN0b3JpbmcgaW5zdGFuY2lhdGVkIG9iamVjdHNcblx0XHQgKiBAdG9kbyAgWzJdICBEaXNjdXNzIHNpbmdsZXRvbiBjb25jZXB0IChvbmUgb2ZmIGZ1bmN0aW9ucy9kZWNsYXJhdGlvbnMpXG5cdFx0ICovXG5cdFx0Ly8gTW9kdWxlc1xuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0dmFyIG1vZHVsZUVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLW1vZHVsZV0nKTtcblx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gbW9kdWxlRWxzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRsZXQgYXR0ciA9IG1vZHVsZUVsc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbW9kdWxlJyk7XG5cblx0XHRcdC8vIFVwcGVyY2FzaW5nIGZvciBjbGFzcyB1c2FnZVxuXHRcdFx0bGV0IGlkZW50ID0gYXR0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGF0dHIuc2xpY2UoMSkgKyAnTW9kdWxlJztcblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLm1vZHVsZXNbaWRlbnRdID09PSAnZnVuY3Rpb24nICYmIHRoaXMucGFyYW1zLmN1cnJlbnRfbW9kdWxlcy5pbmRleE9mKGlkZW50KSA9PT0gLTEpIHtcblx0XHRcdFx0Ly8gWzEsMl1cblx0XHRcdFx0bGV0IHdpZGdldCA9IG5ldyB0aGlzLm1vZHVsZXNbaWRlbnRdO1xuXHRcdFx0XHQvLyBbMl1cblx0XHRcdFx0dGhpcy5wYXJhbXMuY3VycmVudF9tb2R1bGVzLnB1c2god2lkZ2V0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBUZW1wbGF0ZVxuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0dmFyIHRlbXBsYXRlSWRlbnQgPSB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5wYXJhbXMuY3VycmVudF90ZW1wbGF0ZS5zbGljZSgxKSArICdUZW1wbGF0ZSc7XG5cdFx0aWYgKHR5cGVvZiB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZUlkZW50XSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIHRlbXBsYXRlID0gbmV3IHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlSWRlbnRdO1xuXHRcdH1cblxuXHR9XG59O1xuXG4vLyBJbml0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuJChmdW5jdGlvbigpIHtcblx0d2luZG93LmFwcCA9IG5ldyBBcHAoKTtcbn0pO1xuIiwiZXhwb3J0IHtkZWZhdWx0IGFzIEdlbmVyaWNNb2R1bGV9IGZyb20gJy4vbW9kdWxlcy9HZW5lcmljJztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIG1vZHVsZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgR2VuZXJpY01vZHVsZSB7XG5cdGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cdFx0Y29uc29sZS5sb2coJ0dlbmVyaWMgbW9kdWxlJyk7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljTW9kdWxlO1xuIiwiZXhwb3J0IHtkZWZhdWx0IGFzIEdlbmVyaWNUZW1wbGF0ZX0gZnJvbSAnLi90ZW1wbGF0ZXMvR2VuZXJpYyc7XG4iLCIvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gR2VuZXJpYyB0ZW1wbGF0ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY2xhc3MgR2VuZXJpY1RlbXBsYXRlIHtcblx0Y29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblx0XHRjb25zb2xlLmxvZygnR2VuZXJpYyB0ZW1wbGF0ZScpO1xuXHRcdHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2VuZXJpY1RlbXBsYXRlO1xuIl19
