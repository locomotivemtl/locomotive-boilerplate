module.exports = {
	dev: {
		bsFiles: {
			src : [
				 'www/assets/styles/**/*.css'
				,'www/assets/scripts/**/*.js'
				,'www/assets/images/**/*.svg'
				,'www/**/*.php'
			]
		},
		options: {
			proxy: "localhost",
			port: 3000,
			watchTask: true,
			notify: false
		}
	}
};
