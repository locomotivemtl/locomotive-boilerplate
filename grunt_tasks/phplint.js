module.exports = {
	options: {
		swapPath: '/tmp',
		phpArgs : {
			// add -f for fatal errors
			'-lf': null
		}
	},

	project: [
		'code/*.php',
		'code/**/*.php',
		'www/modules/boilerplate/assets/templates/*.php',
		'www/modules/boilerplate/assets/templates/**/*.php'
	],
	charcoal: [
		'../charcoal/core/code/*.php',
		'../charcoal/core/code/**/*.php',
		'../charcoal/modules/**/code/*.php',
		'../charcoal/modules/**/code/**/*.php'
	]
}
