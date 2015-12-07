module.exports = {
	dev: {
		bsFiles: {
			src: [
				'www/assets/styles/dist/*.css',
				'www/assets/scripts/dist/*.js'
			]
		},
		options: {
			proxy: 'localhost',
			port: 3000,
			watchTask: true,
			notify: false
		}
	}
};
