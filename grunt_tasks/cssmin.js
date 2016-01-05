module.exports = {
	combine: {
		files: [{
			expand: true,
			cwd: 'www/assets/styles/dist/',
			src: '*.css',
			dest: 'www/assets/styles/dist/'
		}]
	}
}
