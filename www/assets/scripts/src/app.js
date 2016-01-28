/* jshint esnext: true */
// ==========================================================================
import * as modules from './modules'
import * as templates from './templates'

class App {
	constructor (options) {

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
		for (let i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

			let attr = moduleEls[i].getAttribute('data-module');

			// Splitting modules found in the data-attribute
			let moduleAttrs = attr.replace(/\s/g, '').split(',');

			for (let j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
				let moduleAttr = moduleAttrs[j];

				// Uppercasing for class usage
				let ident = moduleAttr.charAt(0).toUpperCase() + moduleAttr.slice(1) + 'Module';

				if (typeof this.modules[ident] === 'function' && this.params.current_modules.indexOf(ident) === -1) {
					// [1,2]
					let module = new this.modules[ident]({
						$el: $(moduleEls[i])
					});
					// [2]
					this.params.current_modules.push(module);
				}
			}
		}

		// Template
		// ==========================================================================
		if (typeof(this.params.current_template) === 'string' && this.params.current_template.length !== 0) {
			var templateIdent = this.params.current_template.charAt(0).toUpperCase() + this.params.current_template.slice(1) + 'Template';

			if (typeof this.templates[templateIdent] === 'function') {
				var template = new this.templates[templateIdent];
			}
		}

	}
};

// Init
// ==========================================================================
$(function() {
	window.app = new App();
});
