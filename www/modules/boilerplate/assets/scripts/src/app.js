// App object
var app = window.app || {};

// Initialize app
app.init = function(){

	'use strict';

	var self = this;

	self.params = {

	};

	self.elements = {
		html : document.documentElement,
		body : document.body
	};

	// Init as empty and / or build
	self.templates = self.templates || {};

	/* Template scripts pseudo loader
	========================================================================== */

	// Identify the template we're using
	self.params.current_template = self.elements.body.getAttribute('data-template');

	// Run the template script only if it's found
	if( typeof self.templates[ self.params.current_template ] === 'object' ){
		self.templates[ self.params.current_template ].init();
	}

	/* Execute global site scripts
	========================================================================== */
	if( typeof self.Globals === 'object' ){
		self.Globals.init();
	}
};

// On doc ready, init your app
$(function(){
	app.init();
});
