module.exports = {
	options: {
		'curly': true,
		'eqeqeq': true,
		'eqnull': true,
		'undef': true,
		'unused': true,
		'browser': true,
		'globals': {
			'window': true,
			'$': true,
			'jQuery': true
		}
	},
	src: [
		'www/assets/scripts/src/**/*.js',
		'!www/assets/scripts/src/vendors/**/*.js'
	]
}
