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

	grunt.loadTasks('build/grunt');
	grunt.util._.extend(config, loadConfig('./build/grunt/'));
	grunt.initConfig(config);

	// Load tasks
	require('load-grunt-tasks')(grunt);

	// Register tasks
	grunt.registerTask('default', ['build']);
	grunt.registerTask('sync', ['browserSync', 'browserify:dev', 'watch', 'notify:watch']);
	grunt.registerTask('build', [
		// CSS
		'sass',
		'postcss',
		'cssmin',
		// JS
		'browserify:prod',
		'uglify',
		// SVG
		'svgstore',
		'svgmin',
		// Notify
		'notify:build'
	]);
	grunt.registerTask('w', ['browserify:dev', 'watch', 'notify:watch']);
	grunt.registerTask('c', [
		'csscomb'
	]);
	grunt.registerTask('j', [
		'eslint'
	]);
	grunt.registerTask('p', [
		'phplint'
	]);

};
