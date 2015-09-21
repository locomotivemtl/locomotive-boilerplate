module.exports = {
	options: {
		"curly":true,
		"eqeqeq": true,
		"eqnull": true,
		"undef":true,
		"unused": true,
		browser:true,
		"globals":{
			"window":true,
			"$":true,
			"jQuery":true
		}
	},
	src: [
		'www/modules/boilerplate/assets/scripts/src/**/*.js',
		'!www/modules/boilerplate/assets/scripts/src/vendors/**/*.js'
	],
}
