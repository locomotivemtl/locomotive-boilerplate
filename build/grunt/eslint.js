module.exports = {
	options: {
		format: require('eslint-tap'),
		configFile: '.eslintrc'
	},
	target: [
        'assets/scripts/**/*.js',
        '!assets/scripts/vendors/*.js'
    ],
};
