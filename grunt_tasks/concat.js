module.exports = {
	app: {
		src: [
			'www/assets/scripts/src/app/*.js',
			'www/assets/scripts/src/templates/*.js',
			'www/assets/scripts/src/widgets/*.js',
			'www/assets/scripts/src/App.js'
		],
		dest: 'www/assets/scripts/dist/app.js'
	},
	vendors: {
		src: [
			'www/assets/scripts/src/vendors/*.js'
		],
		dest: 'www/assets/scripts/dist/vendors.js'
	}
};
