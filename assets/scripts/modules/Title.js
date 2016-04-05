/* jshint esnext: true */
import Module from './Module';

class Title extends Module {
	constructor(options) {
		super();
		this.$el = options.$el;
		this.$label = this.$el.find('.js-label');

		this.$document.on('title.changeLabel', (event, value) => {
			this.changeLabel(value);
		});
	}

	changeLabel(value) {
		this.$label.text(value);
	}

	// Destroy
	// ==========================================================================
	destroy() {
		this.$document.off('title.changeLabel');
		this.$el.off();
	}
}

export default Title;
