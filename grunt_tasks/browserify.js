module.exports = {
	dev: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
			browserifyOptions: { debug: true },
			exclude: ''
		},
		files: {
			'www/modules/boilerplate/assets/scripts/dist/app.js': ['www/modules/boilerplate/assets/scripts/src/**/*.js']
		}
	},
	prod: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
			browserifyOptions: { debug: false },
			exclude: ''
		},
		files: {
			'www/modules/boilerplate/assets/scripts/dist/app.js': ['www/modules/boilerplate/assets/scripts/src/**/*.js']
		}
	}
};
