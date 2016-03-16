// ==========================================================================
// Generic module
// ==========================================================================
import Module from './Module';

class Generic extends Module {
	constructor(options) {
		super();
        this.$el = options.$el;

		console.log('Generic module');
		console.log(this.$el);
	}

	// Destroy
	// ==========================================================================
	destroy() {
		this.$el.off();
	}
}

export default Generic;
 
