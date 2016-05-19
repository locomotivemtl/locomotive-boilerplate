/* jshint esnext: true */
import AbstractModule from './AbstractModule';

export default class extends AbstractModule {
	constructor(options) {
		super(options);

		this.$el.on('click', (event) => {
			this.$document.trigger('title.changeLabel', [$(event.currentTarget).val()]);
		});
	}

	destroy() {
		this.$el.off('.Button');
	}
}
