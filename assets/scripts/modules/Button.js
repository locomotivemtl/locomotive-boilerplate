/* jshint esnext: true */
import AbstractModule from './AbstractModule';

export default class extends AbstractModule {
	constructor(options) {
		super(options);

		this.$el.on('click.Button', (event) => {
			this.$document.trigger('Title.changeLabel', [$(event.currentTarget).val()]);
		});
	}

	destroy() {
		this.$el.off('.Button');
	}
}
