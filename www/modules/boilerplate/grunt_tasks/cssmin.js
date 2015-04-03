module.exports = {
	combine: {
		files: [{
			expand: true,
			cwd: 'assets/styles/dist/',
			src: '*.css',
			dest: 'assets/styles/dist/'
		}]
	}
}