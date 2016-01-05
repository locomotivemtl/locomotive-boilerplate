module.exports = {
	options: {
		config: '.csscomb.json'
	},
	build: {
		expand: true,
		cwd: 'www/assets/styles/src/',
		src: ['**/*.scss', '!base/_fonts.scss'],
		dest: 'www/assets/styles/src/'
	}
};
