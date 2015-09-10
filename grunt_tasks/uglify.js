module.exports = {
	target: {
		files: [{
			expand: true,
			cwd: 'www/modules/boilerplate/assets/scripts/dist/',
			src: '**/*.js',
			dest: 'www/modules/boilerplate/assets/scripts/dist/'
		}]
	}
}
