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

},{"./modules":2,"./templates":4}],2:[function(require,module,exports){
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
    return _interopRequireDefault(_Generic).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL2FwcC5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvbW9kdWxlcy5qcyIsInd3dy9hc3NldHMvc2NyaXB0cy9zcmMvbW9kdWxlcy9HZW5lcmljLmpzIiwid3d3L2Fzc2V0cy9zY3JpcHRzL3NyYy90ZW1wbGF0ZXMuanMiLCJ3d3cvYXNzZXRzL3NjcmlwdHMvc3JjL3RlbXBsYXRlcy9HZW5lcmljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztJQ0VZOzs7O0lBQ0E7Ozs7Ozs7SUFFTixNQUNMLFNBREssR0FDTCxDQUFhLE9BQWIsRUFBc0I7dUJBRGpCLEtBQ2lCOztBQUVyQixNQUFLLFFBQUwsR0FBZ0I7QUFDZixRQUFNLFNBQVMsZUFBVDtBQUNOLFFBQU0sU0FBUyxJQUFUO0VBRlAsQ0FGcUI7O0FBT3JCLE1BQUssTUFBTCxHQUFjO0FBQ2IsbUJBQWlCLEVBQWpCO0FBQ0Esb0JBQWtCLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsWUFBbkIsQ0FBZ0MsZUFBaEMsQ0FBbEI7RUFGRCxDQVBxQjs7QUFZckIsTUFBSyxPQUFMLEdBQWUsT0FBZixDQVpxQjtBQWFyQixNQUFLLFNBQUwsR0FBaUIsU0FBakI7Ozs7Ozs7O0FBYnFCLEtBcUJqQixZQUFZLFNBQVMsZ0JBQVQsQ0FBMEIsZUFBMUIsQ0FBWixDQXJCaUI7QUFzQnJCLE1BQUssSUFBSSxJQUFJLENBQUosRUFBTyxNQUFNLFVBQVUsTUFBVixFQUFrQixJQUFJLEdBQUosRUFBUyxHQUFqRCxFQUFzRDtBQUNyRCxNQUFJLE9BQU8sVUFBVSxDQUFWLEVBQWEsWUFBYixDQUEwQixhQUExQixDQUFQOzs7QUFEaUQsTUFJakQsUUFBUSxLQUFLLE1BQUwsQ0FBWSxDQUFaLEVBQWUsV0FBZixLQUErQixLQUFLLEtBQUwsQ0FBVyxDQUFYLENBQS9CLEdBQStDLFFBQS9DLENBSnlDOztBQU1yRCxNQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsS0FBYixDQUFQLEtBQStCLFVBQS9CLElBQTZDLEtBQUssTUFBTCxDQUFZLGVBQVosQ0FBNEIsT0FBNUIsQ0FBb0MsS0FBcEMsTUFBK0MsQ0FBQyxDQUFELEVBQUk7O0FBRW5HLE9BQUksU0FBUyxJQUFJLEtBQUssT0FBTCxDQUFhLEtBQWIsQ0FBSixFQUFUOztBQUYrRixPQUluRyxDQUFLLE1BQUwsQ0FBWSxlQUFaLENBQTRCLElBQTVCLENBQWlDLE1BQWpDLEVBSm1HO0dBQXBHO0VBTkQ7Ozs7QUF0QnFCLEtBc0NqQixPQUFPLEtBQUssTUFBTCxDQUFZLGdCQUFaLEtBQWtDLFFBQXpDLElBQXFELEtBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLE1BQTdCLEtBQXdDLENBQXhDLEVBQTJDO0FBQ25HLE1BQUksZ0JBQWdCLEtBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLE1BQTdCLENBQW9DLENBQXBDLEVBQXVDLFdBQXZDLEtBQXVELEtBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLEtBQTdCLENBQW1DLENBQW5DLENBQXZELEdBQStGLFVBQS9GLENBRCtFOztBQUduRyxNQUFJLE9BQU8sS0FBSyxTQUFMLENBQWUsYUFBZixDQUFQLEtBQXlDLFVBQXpDLEVBQXFEO0FBQ3hELE9BQUksV0FBVyxJQUFJLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBSixFQUFYLENBRG9EO0dBQXpEO0VBSEQ7Q0F0Q0Q7O0FBK0NBOzs7O0FBSUQsRUFBRSxZQUFXO0FBQ1osUUFBTyxHQUFQLEdBQWEsSUFBSSxHQUFKLEVBQWIsQ0FEWTtDQUFYLENBQUY7Ozs7Ozs7Ozs7Ozs7OzRDQ3pEUTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0lGLGdCQUNMLFNBREssYUFDTCxDQUFhLE9BQWIsRUFBc0I7dUJBRGpCLGVBQ2lCOztBQUNyQixTQUFRLEdBQVIsQ0FBWSxnQkFBWixFQURxQjtBQUVyQixNQUFLLE9BQUwsR0FBZSxPQUFmLENBRnFCO0NBQXRCOztrQkFNYzs7Ozs7Ozs7Ozs7Ozs7NENDWFA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNJRixrQkFDTCxTQURLLGVBQ0wsQ0FBYSxPQUFiLEVBQXNCO3VCQURqQixpQkFDaUI7O0FBQ3JCLFNBQVEsR0FBUixDQUFZLGtCQUFaLEVBRHFCO0FBRXJCLE1BQUssT0FBTCxHQUFlLE9BQWYsQ0FGcUI7Q0FBdEI7O2tCQU1jIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCBlc25leHQ6IHRydWUgKi9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgKiBhcyBtb2R1bGVzIGZyb20gJy4vbW9kdWxlcydcbmltcG9ydCAqIGFzIHRlbXBsYXRlcyBmcm9tICcuL3RlbXBsYXRlcydcblxuY2xhc3MgQXBwIHtcblx0Y29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblxuXHRcdHRoaXMuZWxlbWVudHMgPSB7XG5cdFx0XHRodG1sOiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG5cdFx0XHRib2R5OiBkb2N1bWVudC5ib2R5XG5cdFx0fTtcblxuXHRcdHRoaXMucGFyYW1zID0ge1xuXHRcdFx0Y3VycmVudF9tb2R1bGVzOiBbXSxcblx0XHRcdGN1cnJlbnRfdGVtcGxhdGU6IHRoaXMuZWxlbWVudHMuaHRtbC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdGVtcGxhdGUnKVxuXHRcdH07XG5cblx0XHR0aGlzLm1vZHVsZXMgPSBtb2R1bGVzO1xuXHRcdHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuXG5cdFx0LyoqXG5cdFx0ICogQHRvZG8gIFsxXSAgRGlzY3VzcyBzdG9yaW5nIGluc3RhbmNpYXRlZCBvYmplY3RzXG5cdFx0ICogQHRvZG8gIFsyXSAgRGlzY3VzcyBzaW5nbGV0b24gY29uY2VwdCAob25lIG9mZiBmdW5jdGlvbnMvZGVjbGFyYXRpb25zKVxuXHRcdCAqL1xuXHRcdC8vIE1vZHVsZXNcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHZhciBtb2R1bGVFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1tb2R1bGVdJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IG1vZHVsZUVscy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0bGV0IGF0dHIgPSBtb2R1bGVFbHNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLW1vZHVsZScpO1xuXG5cdFx0XHQvLyBVcHBlcmNhc2luZyBmb3IgY2xhc3MgdXNhZ2Vcblx0XHRcdGxldCBpZGVudCA9IGF0dHIuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBhdHRyLnNsaWNlKDEpICsgJ01vZHVsZSc7XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5tb2R1bGVzW2lkZW50XSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLnBhcmFtcy5jdXJyZW50X21vZHVsZXMuaW5kZXhPZihpZGVudCkgPT09IC0xKSB7XG5cdFx0XHRcdC8vIFsxLDJdXG5cdFx0XHRcdGxldCB3aWRnZXQgPSBuZXcgdGhpcy5tb2R1bGVzW2lkZW50XTtcblx0XHRcdFx0Ly8gWzJdXG5cdFx0XHRcdHRoaXMucGFyYW1zLmN1cnJlbnRfbW9kdWxlcy5wdXNoKHdpZGdldCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gVGVtcGxhdGVcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdGlmICh0eXBlb2YodGhpcy5wYXJhbXMuY3VycmVudF90ZW1wbGF0ZSkgPT09ICdzdHJpbmcnICYmIHRoaXMucGFyYW1zLmN1cnJlbnRfdGVtcGxhdGUubGVuZ3RoICE9PSAwKSB7XG5cdFx0XHR2YXIgdGVtcGxhdGVJZGVudCA9IHRoaXMucGFyYW1zLmN1cnJlbnRfdGVtcGxhdGUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnBhcmFtcy5jdXJyZW50X3RlbXBsYXRlLnNsaWNlKDEpICsgJ1RlbXBsYXRlJztcblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZUlkZW50XSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR2YXIgdGVtcGxhdGUgPSBuZXcgdGhpcy50ZW1wbGF0ZXNbdGVtcGxhdGVJZGVudF07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cbn07XG5cbi8vIEluaXRcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4kKGZ1bmN0aW9uKCkge1xuXHR3aW5kb3cuYXBwID0gbmV3IEFwcCgpO1xufSk7XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY01vZHVsZX0gZnJvbSAnLi9tb2R1bGVzL0dlbmVyaWMnO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdlbmVyaWMgbW9kdWxlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBHZW5lcmljTW9kdWxlIHtcblx0Y29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblx0XHRjb25zb2xlLmxvZygnR2VuZXJpYyBtb2R1bGUnKTtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdlbmVyaWNNb2R1bGU7XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgR2VuZXJpY1RlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlcy9HZW5lcmljJztcbiIsIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBHZW5lcmljIHRlbXBsYXRlXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jbGFzcyBHZW5lcmljVGVtcGxhdGUge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXHRcdGNvbnNvbGUubG9nKCdHZW5lcmljIHRlbXBsYXRlJyk7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBHZW5lcmljVGVtcGxhdGU7XG4iXX0=
