module.exports = {
	dev: {
		bsFiles: {
			src : [
				 'www/modules/boilerplate/assets/styles/dist/*.css'
				,'www/modules/boilerplate/assets/scripts/dist/*.js'
				,'www/modules/boilerplate/assets/templates/*.php'
			]
		},
		options: {
			proxy: "localhost",
			port: 3000,
			watchTask: true,
			notify: false
		}
	}
}
