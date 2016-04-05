module.exports = {
	dev: {
		options: {
			transform: [['babelify', { presets: ['es2015'] }]],
            watch : true, // use watchify for incremental builds!
            browserifyOptions : {
              debug : true // source mapping
            }
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
