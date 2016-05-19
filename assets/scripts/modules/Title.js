/* jshint esnext: true */
import AbstractModule from './AbstractModule';

export default class extends AbstractModule {
	constructor(options) {
		super(options);

		this.$label = this.$el.find('.js-label');

		this.$document.on('title.changeLabel', (event, value) => {
			this.changeLabel(value);
		});
	}

	changeLabel(value) {
		this.$label.text(value);
	}

	destroy() {
		this.$document.off('title.changeLabel');
		this.$el.off('.Title');
	}
}
