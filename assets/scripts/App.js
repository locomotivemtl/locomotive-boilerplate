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
	/**
	 * Module init
	 *
	 * @todo  [1]  Discuss storing instanciated objects
	 * @todo  [2]  Discuss singleton concept (one off functions/declarations)
	 * @return {thigArg}
	 */
	initModules() {
		// Elements with module
		const moduleEls = document.querySelectorAll('[data-module]');

		// Loop through elements
		let i = 0,
			elsLen = moduleEls.length;
		for (; i < elsLen; i++) {

			// Current element
			let el = moduleEls[i];

			// All data- attributes considered as options
			let options = this.getElemData(el);

			// Add current element AND jQuery element
			options.el = el;
			options.$el = $(el);

			// Module does exist at this point
			let attr = options.module;

			// Splitting modules found in the data-attribute
			let moduleAttrs = attr.replace(/\s/g, '').split(',');

			// Loop modules
			let j = 0,
				modLen = moduleAttrs.length
			for (; j < modLen; j++) {
				let moduleAttr = moduleAttrs[j];

				if (typeof this.modules[moduleAttr] === 'function' && this.currentModules.indexOf(moduleAttr) === -1) {
					// [1,2]
					let module = new this.modules[moduleAttr](options);
					// [2]
					this.currentModules.push(module);
				}
			}
		}

		return this;
	}

	// Init
	// ==========================================================================
	init() {
		this.initGlobals();
		this.initModules();
	}


	// Utils
	// ==========================================================================
	//
	/**
	 * Get element datas
	 *
	 * @param {DOMElement} el
	 * @return {Array} data
	 */
	getElemData(el) {
		// All attributes
		let attributes = el.attributes;

		// Regex Pattern
		let pattern = /^data\-(.+)$/;

		// Output
		let data = {};

		for (let i in attributes) {
			// Attributes name (ex: data-module)
			let name = attributes[i].name;

			// This happens.
			if (!name) {
				continue;
			}

			let match = name.match(pattern);
			if (!match) {
				continue;
			}

			// If this throws an error, you have some
			// serious problem in your HTML.
			data[ match[1] ] = el.getAttribute(name);
		}

		return data;
	}
};

// Document ready
// ==========================================================================
$(function() {
	window.app = new App();
	window.app.init();
});
