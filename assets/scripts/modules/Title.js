/* jshint esnext: true */
import { visibilityApi } from '../utils/visibility';
import AbstractModule from './AbstractModule';

export default class extends AbstractModule {
	constructor(options) {
		super(options);

		this.$label = this.$el.find('.js-label');

		this.$document.on('Title.changeLabel', (event, value) => {
			this.changeLabel(value);
			this.destroy();
		});

		this.hiddenCallbackIdent = visibilityApi({
			action: 'addCallback',
			state: 'hidden',
			callback: this.logHidden
		});

		this.visibleCallbackIdent = visibilityApi({
			action: 'addCallback',
			state: 'visible',
			callback: this.logVisible
		});
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
		this.$document.off('Title.changeLabel');

		visibilityApi({
			action: 'removeCallback',
			state: 'hidden',
			ident: this.hiddenCallbackIdent
		});

		visibilityApi({
			action: 'removeCallback',
			state: 'visible',
			ident: this.visibleCallbackIdent
		});

		this.$el.off('.Title');
	}
}
