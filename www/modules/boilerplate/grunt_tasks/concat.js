module.exports = {

	app: {
		src: [
			'assets/scripts/src/app/*.js',
			'assets/scripts/src/templates/*.js',
			'assets/scripts/src/app.js'
		],
		dest: 'assets/scripts/dist/app.js'
	},
	vendors: {
		src: [
			'assets/scripts/src/vendors/*.js'
		],
		dest: 'assets/scripts/dist/vendors.js'
	}

};