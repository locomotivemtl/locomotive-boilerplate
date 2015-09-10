module.exports = {

	app: {
		src: [
			'www/modules/boilerplate/assets/scripts/src/app/*.js',
			'www/modules/boilerplate/assets/scripts/src/templates/*.js',
			'www/modules/boilerplate/assets/scripts/src/widgets/*.js',
			'www/modules/boilerplate/assets/scripts/src/app.js'
		],
		dest: 'www/modules/boilerplate/assets/scripts/dist/app.js'
	},
	vendors: {
		src: [
			'www/modules/boilerplate/assets/scripts/src/vendors/*.js'
		],
		dest: 'www/modules/boilerplate/assets/scripts/dist/vendors.js'
	}

};
