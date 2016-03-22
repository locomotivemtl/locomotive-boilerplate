module.exports = {
	combine: {
		files: [{
			expand: true,
			cwd: 'www/assets/styles/',
			src: '*.css',
			dest: 'www/assets/styles/'
		}]
	}
};
