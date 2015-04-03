module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// watch: Run tasks whenever watched files change.
		watch : require('./grunt_tasks/watch'),

		// sass: Compile Sass to CSS
		sass: require('./grunt_tasks/sass'),

		// autoprefixer: Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
		autoprefixer : require('./grunt_tasks/autoprefixer'),

		// csscomb: Sort CSS properties in specific order.
		csscomb : require('./grunt_tasks/csscomb'),

		// cssmin: Compress CSS files
		cssmin : require('./grunt_tasks/cssmin'),

		// svgstore: Merge svgs from a folder
		svgstore: require('./grunt_tasks/svgstore'),

		// svgmin: Minify SVG		
		svgmin : require('./grunt_tasks/cssmin'),

		// concat: Concatenate files.
		concat: require('./grunt_tasks/concat'),
		
		// uglify: Minify (javascript)files with UglifyJS
		uglify : require('./grunt_tasks/uglify'),

		// notify: Automatic Notifications when Grunt tasks fail (or succeed)
		notify : require('./grunt_tasks/notify')
	});

	// Load tasks
	require('load-grunt-tasks')(grunt);


	// Register tasks
	grunt.registerTask('default', ['watch', 'notify:watch']);
	grunt.registerTask('build', [
		'concat',
		'sass',
		'svgstore',
		'autoprefixer',
		'uglify',
		'cssmin',
		'svgmin',
		'imagemin'
	]);
	grunt.registerTask('c', [
		'csscomb'
	]);
};
