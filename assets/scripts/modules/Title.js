/* jshint esnext: true */
import { registerDocumentHiddenCallback, registerDocumentVisibleCallback } from '../utils/visibility';
import AbstractModule from './AbstractModule';

export default class extends AbstractModule {
	constructor(options) {
		super(options);

		this.$label = this.$el.find('.js-label');

		this.$document.on('title.changeLabel', (event, value) => {
			this.changeLabel(value);
		});

		registerDocumentHiddenCallback(this.logHidden);
		registerDocumentVisibleCallback(this.logVisible);
	}

	logHidden() {
		console.log('Title is hidden');
	}

	logVisible() {
		console.log('Title is visible');
	}

	changeLabel(value) {
		this.$label.text(value);
	}

	destroy() {
		this.$document.off('title.changeLabel');
		this.$el.off('.Title');
	}
}
