module.exports = {
	options: {
		stripBanners: true
	},
	prod: {
		options: {
			banner: '/*! Dependencies for <%= package.title %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
		},
		src  : [ '<%= paths.js.src %>/vendors/**/*.js' ],
		dest : '<%= paths.js.dist %>/vendors.js'
	}
};
