/* jshint esnext: true */
import Module from './Module';

class Generic extends Module {
	constructor(options) {
		super();
		this.$el = options.$el;

		this.$el.on('click', (event) => {
			this.$document.trigger('title.changeLabel', [$(event.currentTarget).val()]);
		});
	}

	// Destroy
	// ==========================================================================
	destroy() {
		this.$el.off();
	}
}

export default Generic;
