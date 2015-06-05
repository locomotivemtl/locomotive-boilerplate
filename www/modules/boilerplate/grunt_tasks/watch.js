module.exports = {
	javascript: {
		files: ['assets/scripts/src/**/*.js'],
		tasks: ['concat', 'notify:concat']
	},
	sass: {
		files: ['assets/styles/src/**/*.scss'],
		tasks: ['sass', 'postcss', 'notify:sass'],
		options: {
			spawn: false,
			livereload: true
		}
	},
	svg: {
		files: ['assets/images/**/*.svg'],
		tasks: ['svgstore', 'notify:svg']
	},
	tasks: {
		files: ['grunt_tasks/*.js'],
		options: {
			reload: true
		}
	}
}
