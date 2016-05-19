import { $document, $window, $html, $body } from '../utils/environment';

/**
 * Abstract module
 * Gives access to generic jQuery nodes
 */
class AbstractModule {
	constructor(options) {
		this.$document = $document;
		this.$window = $window;
		this.$html = $html;
		this.$body = $body;
		this.$el = options.$el;
	}
}

export default AbstractModule;
