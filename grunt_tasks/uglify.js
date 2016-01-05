module.exports = {
	target: {
		files: [{
			expand: true,
			cwd: 'www/assets/scripts/dist/',
			src: '**/*.js',
			dest: 'www/assets/scripts/dist/'
		}]
	}
}
