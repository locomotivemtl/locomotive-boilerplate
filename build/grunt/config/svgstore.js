module.exports = {
	options: {},
	prod: {
		files: {
			'<%= paths.img.dist %>/sprite.svg': [ '<%= paths.img.src %>/sprite/*.svg' ]
		}
	}
};
