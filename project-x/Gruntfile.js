module.exports = function(grunt) {
	'use strict';

	// Load Grunt tasks from NPM packages
	require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),

		watch: {
			css: {
				files: ['assets/styles/src/**/*.scss'],
				tasks: ['sass', 'autoprefixer', 'notify:watch', 'notify_hooks'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		},

		sass: {
			dist: {
				files: {
					'assets/styles/corim.css': 'assets/styles/src/corim.scss',
					'assets/styles/corim.ie8.css': 'assets/styles/src/corim.ie8.scss'
				}
			}
		},
		autoprefixer: {
			build: {
				options: {
					browsers: ['last 2 versions', '> 1%']
				},
				files: [
					{
						src : ['assets/styles/*.css'],
						dest : 'assets/styles/',
						expand : true,
						flatten: true
					}
				]
			}
		},
		notify: {
			task_name: {
				options: {
					// Task-specific options go here.
				}
			},
			watch: {
				options: {
					title: 'Sass',  // optional
					message: 'SASS compiled', //required
				}
			}
		},
		notify_hooks: {
			options: {
				enabled: true,
				title: "Project-x" // defaults to the name in package.json, or will use project directory's name
			}
		},
		concat: {
			jsbasic: {
				src: 'assets/scripts/src/*.js',
				dest: 'assets/scripts/main.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'assets/scripts/main.js': ['assets/scripts/main.js']
				}
			}
		}
	});

	// Configure automatic messaging
	// grunt.task.run('notify_hooks');

	// Integrate jQuery specific tasks
	// grunt.loadTasks('tasks');

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['responsive_images']);

};
