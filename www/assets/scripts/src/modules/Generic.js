// ==========================================================================
// Generic module
// ==========================================================================

class GenericModule {
	constructor (options) {
        this.$el = options.$el;
		console.log('Generic module');
		console.log(this.$el);
	}
}

export default GenericModule;
