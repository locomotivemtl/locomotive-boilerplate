(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _widgets = require('./widgets');

var widgets = _interopRequireWildcard(_widgets);

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
		current_template: this.elements.html.getAttribute('data-template'),
		current_widgets: []
	};

	this.widgets = widgets;
	this.templates = templates;

	/**
  * @todo Discuss naming conventions and difference between modules and widgets
  */
	// Modules
	// ==========================================================================
	//var modules = document.querySelectorAll('[data-app]');
	//for (let i = 0, len = modules.length; i < len; i++) {
	//	let ident = modules[i].getAttribute('data-app');
	//	if (typeof this[ident] === 'object' && this.params.current_modules.indexOf(ident) === -1) {
	//		this[ident].init();
	//		this.params.current_modules.push(ident);
	//	}
	//}

	// Template
	// ==========================================================================
	var templateIdent = this.params.current_template + 'Template';
	if (typeof this.templates[templateIdent] === 'function') {
		var template = new this.templates[templateIdent]();
	}

	// Widgets
	// ==========================================================================
	var widgetEls = document.querySelectorAll('[data-widget]');
	for (var i = 0, len = widgetEls.length; i < len; i++) {
		var ident = widgetEls[i].getAttribute('data-widget') + 'Widget';
		if (typeof this.widgets[ident] === 'function' && this.params.current_widgets.indexOf(ident) === -1) {
			/**
    * @todo Discuss storing instanciated objects
    */
			var widget = new this.widgets[ident]();
			this.params.current_widgets.push(widget);
		}
	}
};

;

// Init
// ==========================================================================
$(function () {
	window.app = new App();
});

},{"./templates":2,"./widgets":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generic = require('./templates/generic');

Object.defineProperty(exports, 'genericTemplate', {
  enumerable: true,
  get: function get() {
    return _generic.default;
  }
});

},{"./templates/generic":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Generic template
// ==========================================================================

var genericTemplate = function genericTemplate(options) {
	_classCallCheck(this, genericTemplate);

	console.log('Generic template');
	this.options = options;
};

exports.default = genericTemplate;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _generic = require('./widgets/generic');

Object.defineProperty(exports, 'genericWidget', {
  enumerable: true,
  get: function get() {
    return _generic.default;
  }
});

},{"./widgets/generic":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==========================================================================
// Generic widget
// ==========================================================================

var genericWidget = function genericWidget(options) {
	_classCallCheck(this, genericWidget);

	console.log('Generic widget');
	this.options = options;
};

exports.default = genericWidget;

},{}]},{},[1,2,3,4,5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvbW9kdWxlcy9ib2lsZXJwbGF0ZS9hc3NldHMvc2NyaXB0cy9zcmMvYXBwLmpzIiwid3d3L21vZHVsZXMvYm9pbGVycGxhdGUvYXNzZXRzL3NjcmlwdHMvc3JjL3RlbXBsYXRlcy5qcyIsInd3dy9tb2R1bGVzL2JvaWxlcnBsYXRlL2Fzc2V0cy9zY3JpcHRzL3NyYy90ZW1wbGF0ZXMvZ2VuZXJpYy5qcyIsInd3dy9tb2R1bGVzL2JvaWxlcnBsYXRlL2Fzc2V0cy9zY3JpcHRzL3NyYy93aWRnZXRzLmpzIiwid3d3L21vZHVsZXMvYm9pbGVycGxhdGUvYXNzZXRzL3NjcmlwdHMvc3JjL3dpZGdldHMvZ2VuZXJpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7SUNFWSxPQUFPOzs7O0lBQ1AsU0FBUzs7Ozs7OztJQUVmLEdBQUcsR0FDUixTQURLLEdBQUcsQ0FDSyxPQUFPLEVBQUU7dUJBRGpCLEdBQUc7O0FBR1AsS0FBSSxDQUFDLFFBQVEsR0FBRztBQUNmLE1BQUksRUFBRSxRQUFRLENBQUMsZUFBZTtBQUM5QixNQUFJLEVBQUUsUUFBUSxDQUFDLElBQUk7RUFDbkIsQ0FBQzs7QUFFRixLQUFJLENBQUMsTUFBTSxHQUFHO0FBQ2IsaUJBQWUsRUFBRSxFQUFFO0FBQ25CLGtCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7QUFDbEUsaUJBQWUsRUFBRSxFQUFFO0VBQ25CLENBQUM7O0FBRUYsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQyxBQWtCM0IsS0FBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsR0FBRyxVQUFVLENBQUM7QUFDOUQsS0FBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3hELE1BQUksUUFBUSxHQUFHLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBQSxDQUFDO0VBQ2pEOzs7O0FBQUEsQUFJRCxLQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDM0QsTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyRCxNQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxHQUFHLFFBQVEsQ0FBQztBQUNoRSxNQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxVQUFVLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFOzs7O0FBSW5HLE9BQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBQSxDQUFDO0FBQ3JDLE9BQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUN6QztFQUNEO0NBQ0Q7O0FBQ0Q7Ozs7QUFBQyxBQUlGLENBQUMsQ0FBQyxZQUFXO0FBQ1osT0FBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0NBQ3ZCLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7b0JDL0RLLE9BQU87Ozs7Ozs7Ozs7Ozs7Ozs7O0lDSU0sZUFBZSxHQUNuQyxTQURvQixlQUFlLENBQ3RCLE9BQU8sRUFBRTt1QkFERixlQUFlOztBQUVsQyxRQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDaEMsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Q0FDdkI7O2tCQUptQixlQUFlOzs7Ozs7Ozs7Ozs7OztvQkNKNUIsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNJTSxhQUFhLEdBQ2pDLFNBRG9CLGFBQWEsQ0FDcEIsT0FBTyxFQUFFO3VCQURGLGFBQWE7O0FBRWhDLFFBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUM5QixLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUN2Qjs7a0JBSm1CLGFBQWEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoganNoaW50IGVzbmV4dDogdHJ1ZSAqL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmltcG9ydCAqIGFzIHdpZGdldHMgZnJvbSAnLi93aWRnZXRzJ1xuaW1wb3J0ICogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGVzJ1xuXG5jbGFzcyBBcHAge1xuXHRjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuXG5cdFx0dGhpcy5lbGVtZW50cyA9IHtcblx0XHRcdGh0bWw6IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcblx0XHRcdGJvZHk6IGRvY3VtZW50LmJvZHlcblx0XHR9O1xuXG5cdFx0dGhpcy5wYXJhbXMgPSB7XG5cdFx0XHRjdXJyZW50X21vZHVsZXM6IFtdLFxuXHRcdFx0Y3VycmVudF90ZW1wbGF0ZTogdGhpcy5lbGVtZW50cy5odG1sLmdldEF0dHJpYnV0ZSgnZGF0YS10ZW1wbGF0ZScpLFxuXHRcdFx0Y3VycmVudF93aWRnZXRzOiBbXVxuXHRcdH07XG5cblx0XHR0aGlzLndpZGdldHMgPSB3aWRnZXRzO1xuXHRcdHRoaXMudGVtcGxhdGVzID0gdGVtcGxhdGVzO1xuXG5cdFx0LyoqXG5cdFx0ICogQHRvZG8gRGlzY3VzcyBuYW1pbmcgY29udmVudGlvbnMgYW5kIGRpZmZlcmVuY2UgYmV0d2VlbiBtb2R1bGVzIGFuZCB3aWRnZXRzXG5cdFx0ICovXG5cdFx0Ly8gTW9kdWxlc1xuXHRcdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cdFx0Ly92YXIgbW9kdWxlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWFwcF0nKTtcblx0XHQvL2ZvciAobGV0IGkgPSAwLCBsZW4gPSBtb2R1bGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0Ly9cdGxldCBpZGVudCA9IG1vZHVsZXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWFwcCcpO1xuXHRcdC8vXHRpZiAodHlwZW9mIHRoaXNbaWRlbnRdID09PSAnb2JqZWN0JyAmJiB0aGlzLnBhcmFtcy5jdXJyZW50X21vZHVsZXMuaW5kZXhPZihpZGVudCkgPT09IC0xKSB7XG5cdFx0Ly9cdFx0dGhpc1tpZGVudF0uaW5pdCgpO1xuXHRcdC8vXHRcdHRoaXMucGFyYW1zLmN1cnJlbnRfbW9kdWxlcy5wdXNoKGlkZW50KTtcblx0XHQvL1x0fVxuXHRcdC8vfVxuXG5cdFx0Ly8gVGVtcGxhdGVcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHZhciB0ZW1wbGF0ZUlkZW50ID0gdGhpcy5wYXJhbXMuY3VycmVudF90ZW1wbGF0ZSArICdUZW1wbGF0ZSc7XG5cdFx0aWYgKHR5cGVvZiB0aGlzLnRlbXBsYXRlc1t0ZW1wbGF0ZUlkZW50XSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dmFyIHRlbXBsYXRlID0gbmV3IHRoaXMudGVtcGxhdGVzW3RlbXBsYXRlSWRlbnRdO1xuXHRcdH1cblxuXHRcdC8vIFdpZGdldHNcblx0XHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXHRcdHZhciB3aWRnZXRFbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS13aWRnZXRdJyk7XG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IHdpZGdldEVscy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0bGV0IGlkZW50ID0gd2lkZ2V0RWxzW2ldLmdldEF0dHJpYnV0ZSgnZGF0YS13aWRnZXQnKSArICdXaWRnZXQnO1xuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLndpZGdldHNbaWRlbnRdID09PSAnZnVuY3Rpb24nICYmIHRoaXMucGFyYW1zLmN1cnJlbnRfd2lkZ2V0cy5pbmRleE9mKGlkZW50KSA9PT0gLTEpIHtcblx0XHRcdFx0LyoqXG5cdFx0XHRcdCAqIEB0b2RvIERpc2N1c3Mgc3RvcmluZyBpbnN0YW5jaWF0ZWQgb2JqZWN0c1xuXHRcdFx0XHQgKi9cblx0XHRcdFx0bGV0IHdpZGdldCA9IG5ldyB0aGlzLndpZGdldHNbaWRlbnRdO1xuXHRcdFx0XHR0aGlzLnBhcmFtcy5jdXJyZW50X3dpZGdldHMucHVzaCh3aWRnZXQpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTtcblxuLy8gSW5pdFxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiQoZnVuY3Rpb24oKSB7XG5cdHdpbmRvdy5hcHAgPSBuZXcgQXBwKCk7XG59KTtcbiIsImV4cG9ydCB7ZGVmYXVsdCBhcyBnZW5lcmljVGVtcGxhdGV9IGZyb20gJy4vdGVtcGxhdGVzL2dlbmVyaWMnO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdlbmVyaWMgdGVtcGxhdGVcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdlbmVyaWNUZW1wbGF0ZSB7XG5cdGNvbnN0cnVjdG9yIChvcHRpb25zKSB7XG5cdFx0Y29uc29sZS5sb2coJ0dlbmVyaWMgdGVtcGxhdGUnKTtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG59XG4iLCJleHBvcnQge2RlZmF1bHQgYXMgZ2VuZXJpY1dpZGdldH0gZnJvbSAnLi93aWRnZXRzL2dlbmVyaWMnO1xuIiwiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdlbmVyaWMgd2lkZ2V0XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnZW5lcmljV2lkZ2V0IHtcblx0Y29uc3RydWN0b3IgKG9wdGlvbnMpIHtcblx0XHRjb25zb2xlLmxvZygnR2VuZXJpYyB3aWRnZXQnKTtcblx0XHR0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXHR9XG59XG4iXX0=
