/* jshint esnext: true */
import globals from './utils/globals';
import * as modules from './modules';

class App {
	constructor() {
		this.modules = modules;
		this.currentModules = [];
	}

	/**
	 * Execute global functions and settings
	 * @return {Object}
	 */
	initGlobals() {
		globals();
		return this;
	}

	/**
	 * Find modules and initialize them
	 * @return  {Object}  this  Allows chaining
	 */
	initModules() {
		// Elements with module
		var moduleEls = document.querySelectorAll('[data-module]');

		// Loop through elements
		var i = 0;
		var elsLen = moduleEls.length;

		for (; i < elsLen; i++) {

			// Current element
			let el = moduleEls[i];

			// All data- attributes considered as options
			let options = this.getElemData(el);

			// Add current DOM element and jQuery element
			options.el = el;
			options.$el = $(el);

			// Module does exist at this point
			let attr = options.module;

			// Splitting modules found in the data-attribute
			let moduleIdents = attr.replace(/\s/g, '').split(',');

			// Loop modules
			let j = 0;
			let modulesLen = moduleIdents.length;

			for (; j < modulesLen; j++) {
				let moduleAttr = moduleIdents[j];

				if (typeof this.modules[moduleAttr] === 'function') {
					let module = new this.modules[moduleAttr](options);
					this.currentModules.push(module);
				}
			}
		}

		return this;
	}

	/**
	 * Get element data attributes
	 * @param   {DOMElement}  el
	 * @return  {Array}       data
	 */
	getElemData(el) {
		// All attributes
		var attributes = el.attributes;

		// Regex Pattern
		var pattern = /^data\-(.+)$/;

		// Output
		var data = {};

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
			// serious problems in your HTML.
			data[match[1]] = el.getAttribute(name);
		}

		return data;
	}

	/**
	 * Initialize app after document ready
	 */
	init() {
		this.initGlobals().initModules();
	}
}

$(function() {
	window.app = new App();
	window.app.init();
});
