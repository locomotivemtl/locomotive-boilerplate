/* jshint esnext: true */
import { $document, $window, $html, $body } from '../utils/environment';

const CALLBACKS = {
	hidden: [],
	visible: []
};

// Main event
$document.on('visibilitychange', function(event) {
	if(document.hidden){
		onDocumentChange('hidden');
	}else{
		onDocumentChange('visible');
	}
});

function registerDocumentHiddenCallback(callback) {
	CALLBACKS['hidden'].push(callback);
}

function registerDocumentVisibleCallback(callback) {
	CALLBACKS['visible'].push(callback);
}

function onDocumentChange(state) {
	let callbacks = CALLBACKS[state];
	let i = 0;
	let len = callbacks.length;

	for (; i < len; i++) {
		callbacks[i]();
	}
}

export {registerDocumentHiddenCallback, registerDocumentVisibleCallback};
