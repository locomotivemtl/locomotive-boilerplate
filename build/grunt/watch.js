module.exports = {
	javascript_app: {
		files: [
			'assets/scripts/**/*.js',
			'!assets/scripts/vendors/*.js'
		],
		tasks: ['browserify:dev', 'notify:javascript']
	},
	javascript_vendors: {
		files: [
			'assets/scripts/vendors/*.js'
		],
		tasks: ['concat:vendors', 'notify:javascript']
	},
	sass: {
		files: ['assets/styles/**/*.scss'],
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
		files: ['build/grunt/*.js'],
		options: {
			reload: true
		}
	}
};
