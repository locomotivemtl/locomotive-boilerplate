// ==========================================================================
// Title module
// ==========================================================================
import Module from './Module';

class Title extends Module {
	constructor(options) {
		super();
        this.$el = options.$el;

		console.log('Title module');
		console.log(this.$el);
	}

	// Destroy
	// ==========================================================================
	destroy() {
		this.$el.off();
	}
}

export default Title;
 
