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
				tasks: ['sass', 'autoprefixer', 'notify:watch'],
				options: {
					spawn: false,
					livereload: true
				}
			}
		},
		sass: {
			dist: {
				files: {
					'assets/styles/dist/main.css': 'assets/styles/src/main.scss',
					'assets/styles/dist/main.ie8.css': 'assets/styles/src/main.ie8.scss'
				}
			}
		},
		
		autoprefixer: {
			build: {
				options: {
					browsers: ['last 2 versions', '> 1%', 'ie >= 8']
				},
				files: [
					{
						src : ['assets/styles/dist/*.css'],
						dest : 'assets/styles/dist/',
						expand : true,
						flatten: true
					}
				]
			}
		},
		notify: {
			watch: {
				options: {
					title: 'SASS',
					message: 'SASS compiled',
				}
			}
		},
		concat: {
			global: {
				src: [
					 'assets/scripts/src/global.js'
					,'assets/scripts/src/vendor/jquery-1.11.1.min.js'
				],
      			dest: 'assets/scripts/dist/main.js',
			}/*,
			home: {
				src: [
					 'assets/scripts/src/vendor/carousel.js'
					,'assets/scripts/src/templates/home.js'
					,'assets/scripts/src/objects/video.js'
				],
      			dest: 'assets/scripts/dist/home.js',
			}*/
		},
		uglify: {
			my_target: {
				files: {
					'assets/scripts/dist/': ['assets/scripts/dist/*.js']
				}
			}
		},
		imagemin: {                          // Task
			dynamic: {
                files: [{
                    expand: true,
                    cwd: 'assets/images/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'assets/images/'
                }]
            }
		}
	});

	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['uglify']);

};
