/* jshint esnext: true */
// ==========================================================================
// App
// ==========================================================================
var app = window.app || {};

app.init = function () {

	this.elements = {
		html: document.documentElement,
		body: document.body
	};

	this.params = {
		current_modules: [],
		current_template: this.elements.html.getAttribute('data-template'),
		current_widgets: []
	};

	this.templates = this.templates || {};
	this.widgets = this.widgets || {};

	// Globals
	// ==========================================================================
	if (typeof this.globals === 'function') {
		this.globals();
	}

	// Modules
	// ==========================================================================
	var modules = document.querySelectorAll('[data-app]');
	for (let i = 0, len = modules.length; i < len; i++) {
		let ident = modules[i].getAttribute('data-app');
		if (typeof this[ident] === 'object' && this.params.current_modules.indexOf(ident) === -1) {
			this[ident].init();
			this.params.current_modules.push(ident);
		}
	}

	// Template
	// ==========================================================================
	if (typeof this.templates[this.params.current_template] === 'object') {
		this.templates[this.params.current_template].init();
	}

	// Widgets
	// ==========================================================================
	var widgets = document.querySelectorAll('[data-widget]');
	for (let i = 0, len = widgets.length; i < len; i++) {
		let ident = widgets[i].getAttribute('data-widget');
		if (typeof this.widgets[ident] === 'object' && this.params.current_widgets.indexOf(ident) === -1) {
			this.widgets[ident].init();
			this.params.current_widgets.push(ident);
		}
	}
};

// Init
// ==========================================================================
$(function() {
	app.init();
});
