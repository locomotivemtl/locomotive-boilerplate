module.exports = {
	dev: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
			browserifyOptions: { debug: true },
			exclude: ''
		},
		files: {
			'www/assets/scripts/dist/app.js': [
                'www/assets/scripts/src/**/*.js',
                '!www/assets/scripts/src/vendors/*.js'
            ]
		}
	},
	prod: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
			browserifyOptions: { debug: false },
			exclude: ''
		},
		files: {
            'www/assets/scripts/dist/app.js': [
                'www/assets/scripts/src/**/*.js',
                '!www/assets/scripts/src/vendors/*.js'
            ]
		}
	}
};
