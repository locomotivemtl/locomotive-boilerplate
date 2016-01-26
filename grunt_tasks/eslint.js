module.exports = {
	options: {
		format: require('eslint-tap'),
		configFile: '.eslintrc'
	},
	target: [
        'www/assets/scripts/src/**/*.js',
        '!www/assets/scripts/src/vendors/*.js'
    ],
};
