module.exports = {
	target: {
		files: [{
			expand: true,
			cwd: 'www/assets/scripts/',
			src: '**/*.js',
			dest: 'www/assets/scripts/'
		}]
	}
};
