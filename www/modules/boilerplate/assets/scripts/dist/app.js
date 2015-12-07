'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

/* jshint esnext: true */
// ==========================================================================
// Globals
// ==========================================================================
var app = window.app || {};

app.globals = function () {
	// Global app modules
	// ==========================================================================
	// this.parallax.init();
};

// ==========================================================================
// Generic template
// ==========================================================================
var app = window.app || {};
app.templates = app.templates || {};

app.templates.generic = {

	init: function init() {}

};

// ==========================================================================
// Generic widget
// ==========================================================================
var app = window.app || {};
app.widgets = app.widgets || {};

app.widgets.generic = {

	init: function init() {}

};

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
	for (var i = 0, len = modules.length; i < len; i++) {
		var ident = modules[i].getAttribute('data-app');
		if (_typeof(this[ident]) === 'object' && this.params.current_modules.indexOf(ident) === -1) {
			this[ident].init();
			this.params.current_modules.push(ident);
		}
	}

	// Template
	// ==========================================================================
	if (_typeof(this.templates[this.params.current_template]) === 'object') {
		this.templates[this.params.current_template].init();
	}

	// Widgets
	// ==========================================================================
	var widgets = document.querySelectorAll('[data-widget]');
	for (var i = 0, len = widgets.length; i < len; i++) {
		var ident = widgets[i].getAttribute('data-widget');
		if (_typeof(this.widgets[ident]) === 'object' && this.params.current_widgets.indexOf(ident) === -1) {
			this.widgets[ident].init();
			this.params.current_widgets.push(ident);
		}
	}
};

// Init
// ==========================================================================
$(function () {
	app.init();
});
//# sourceMappingURL=app.js.map
