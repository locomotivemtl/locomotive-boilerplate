module.exports = {
	options: {
		config: '.csscomb.json'
	},
	build: {
		expand: true,
		cwd: 'assets/styles/src/',
		src: ['**/*.scss'],
		dest: 'assets/styles/src/'
	}
}