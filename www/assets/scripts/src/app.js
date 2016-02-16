/* jshint esnext: true */
// ==========================================================================
import * as modules from './modules'

class App {
	constructor (options) {

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
		const globals = new this.modules['Globals'];

		/**
		 * @todo  [1]  Discuss storing instanciated objects
		 * @todo  [2]  Discuss singleton concept (one off functions/declarations)
		 */
		// Modules
		// ==========================================================================
		const moduleEls = document.querySelectorAll('[data-module]');
		for (let i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

			let attr = moduleEls[i].getAttribute('data-module');

			// Splitting modules found in the data-attribute
			let moduleAttrs = attr.replace(/\s/g, '').split(',');

			for (let j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
				let moduleAttr = moduleAttrs[j];

				if (typeof this.modules[moduleAttr] === 'function' && this.params.current_modules.indexOf(moduleAttr) === -1) {
					// [1,2]
					let module = new this.modules[moduleAttr]({
						$el: $(moduleEls[i])
					});
					// [2]
					this.params.current_modules.push(module);
				}
			}
		}

	}
};

// Init
// ==========================================================================
$(function() {
	window.app = new App();
});
