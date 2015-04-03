module.exports = {
	target: {
		files: [{
			expand: true,
			cwd: 'assets/scripts/dist/',
			src: '**/*.js',
			dest: 'assets/scripts/dist/'
		}]
	}
}