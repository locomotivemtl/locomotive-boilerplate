module.exports = {
	options: {
		config: '.csscomb.json'
	},
	build: {
		expand: true,
		cwd: 'assets/styles/src/',
		src: ['**/*.scss', '!base/_fonts.scss'],
		dest: 'assets/styles/src/'
	}
}
