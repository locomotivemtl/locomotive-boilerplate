module.exports = {
	dev: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
			browserifyOptions: { debug: true },
			exclude: ''
		},
		files: {
			'www/assets/scripts/app.js': [
                'assets/scripts/**/*.js',
                '!assets/scripts/vendors/*.js'
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
            'www/assets/scripts/app.js': [
                'assets/scripts/**/*.js',
                '!assets/scripts/vendors/*.js'
            ]
		}
	}
};
