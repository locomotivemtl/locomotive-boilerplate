module.exports = {
	options: {
		spawn: false,
		livereload: false
	},
	javascript_vendors: {
		files: [ '<%= paths.js.src %>/vendors/**/*.js' ],
		tasks: [ 'concat:vendors', 'notify:javascript' ]
	},
	sass: {
		files: [ '<%= paths.css.src %>/**/*.scss' ],
		tasks: [ 'sass', 'postcss', 'notify:sass' ]
	},
	svg: {
		files: [ '<%= paths.img.src %>/**/*.svg' ],
		tasks: [ 'svgstore', 'notify:svg' ]
	},
	tasks: {
		options: {
			reload: true
		},
		files: [
			'Gruntfile.js',
			'<%= paths.grunt %>/**/*'
		]
	}
};
