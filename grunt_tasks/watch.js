module.exports = {
	javascript: {
		files: ['www/modules/boilerplate/assets/scripts/src/**/*.js'],
		tasks: ['concat', 'babel', 'notify:concat']
	},
	sass: {
		files: ['www/modules/boilerplate/assets/styles/src/**/*.scss'],
		tasks: ['sass', 'postcss', 'notify:sass'],
		options: {
			spawn: false,
			livereload: true
		}
	},
	svg: {
		files: ['www/modules/boilerplate/assets/images/**/*.svg'],
		tasks: ['svgstore', 'notify:svg']
	},
	tasks: {
		files: ['grunt_tasks/*.js'],
		options: {
			reload: true
		}
	}
}
