module.exports = function(grunt) {


	function loadConfig(path) {
		var glob = require('glob');
		var object = {};
		var key;

		glob.sync('*', {cwd: path}).forEach(function(option) {
			key = option.replace(/\.js$/,'');
			object[key] = require(path + option);
		});

		return object;
	}

	var config = {
		pkg: grunt.file.readJSON('package.json')
	}
	grunt.loadTasks('grunt_tasks');
	grunt.util._.extend(config, loadConfig('./grunt_tasks/'));
	grunt.initConfig(config);

	// Load tasks
	require('load-grunt-tasks')(grunt);


	// Register tasks
	grunt.registerTask('default', ['watch', 'notify:watch']);
	grunt.registerTask('sync', ['browserSync', 'watch', 'notify:watch']);
	grunt.registerTask('build', [
		'concat',
		'sass',
		'svgstore',
		'postcss',
		'uglify',
		'cssmin',
		'svgmin',
		'imagemin'
	]);
	grunt.registerTask('c', [
		'csscomb'
	]);
	grunt.registerTask('j', [
		'jshint'
	]);
	grunt.registerTask('wlint', [
		// PHP
		'phplint',
		'jsonlint',
		// Utilities
		'watch'
	]);

};
