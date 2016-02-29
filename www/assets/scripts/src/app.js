/* jshint esnext: true */
// ==========================================================================
import * as modules from './modules'

class App {
	constructor(options) {
		this.modules = modules;
		this.globals;
		this.currentModules = [];
	}

	// Init globals
	// ==========================================================================
	initGlobals() {
		this.globals = new this.modules['Globals'];
	}

	// Init modules
	// ==========================================================================
	initModules() {
		/**
		 * @todo  [1]  Discuss storing instanciated objects
		 * @todo  [2]  Discuss singleton concept (one off functions/declarations)
		 */
		const moduleEls = document.querySelectorAll('[data-module]');
		for (let i = 0, elsLen = moduleEls.length; i < elsLen; i++) {

			let attr = moduleEls[i].getAttribute('data-module');

			// Splitting modules found in the data-attribute
			let moduleAttrs = attr.replace(/\s/g, '').split(',');

			for (let j = 0, modLen = moduleAttrs.length; j < modLen; j++) {
				let moduleAttr = moduleAttrs[j];

				if (typeof this.modules[moduleAttr] === 'function' && this.currentModules.indexOf(moduleAttr) === -1) {
					// [1,2]
					let module = new this.modules[moduleAttr]({
						$el: $(moduleEls[i])
					});
					// [2]
					this.currentModules.push(module);
				}
			}
		}
	}

	// Init
	// ==========================================================================
	init() {
		this.initGlobals();
		this.initModules();
	}
};

// Document ready
// ==========================================================================
$(function() {
	window.app = new App();
	window.app.init();
});
