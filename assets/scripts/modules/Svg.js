// ==========================================================================
// Svg module
// ==========================================================================
import Module from './Module';

class Svg extends Module {
	constructor() {
		super();

		svg4everybody();
	}

	// Destroy
	// ==========================================================================
	destroy() {
		this.$el.off();
	}
}

export default Svg;
 
