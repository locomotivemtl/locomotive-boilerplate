/* jshint esnext: true */
// ==========================================================================
import * as widgets from './widgets'
import * as templates from './templates'

class App {
	constructor (options) {

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
			var template = new this.templates[templateIdent];
		}

		// Widgets
		// ==========================================================================
		var widgetEls = document.querySelectorAll('[data-widget]');
		for (let i = 0, len = widgetEls.length; i < len; i++) {
			let ident = widgetEls[i].getAttribute('data-widget') + 'Widget';
			if (typeof this.widgets[ident] === 'function' && this.params.current_widgets.indexOf(ident) === -1) {
				/**
				 * @todo Discuss storing instanciated objects
				 */
				let widget = new this.widgets[ident];
				this.params.current_widgets.push(widget);
			}
		}
	}
};

// Init
// ==========================================================================
$(function() {
	window.app = new App();
});
