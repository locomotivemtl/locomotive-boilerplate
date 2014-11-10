module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),

		// jsonlint: Validate JSON files
		jsonlint:{
			project:{
				src:[
					'*.json',
					'config/*.json',
					'config/**/*.json',
					'modules/**/config/*.json',
					'modules/**/config/**/*.json'
				]
			},
			charcoal:{
				src:[
					'charcoal/*.json',
					'charcoal/core/config/*.json',
					'charcoal/core/config/**/*.json',
					'charcoal/modules/**/config/*.json',
					'charcoal/modules/**/config/**/*.json'
				]
			}
		},

		// jshint: Validate javascript files with JSHint
		jshint:{
			gruntfile:{
				src:[
					// Self-test
					'Gruntfile.js'
				]
			},
			project:{
				src:[
					'modules/**/assets/scripts/src/*.js',
					'modules/**/assets/scripts/src/**/*.js'
				]
			},
			charcoal:{
				src:[
					'charcoal/core/assets/scripts/src/*.js',
					'charcoal/core/assets/scripts/src/**/*.js',
					'charcoal/modules/**/assets/scripts/src/*.js',
					'charcoal/modules/**/assets/scripts/src/**/*.js'
				]
			}
		},

		// phplint: A simple wrapper around the php -l <filename> command.
		phplint:{
			options: {
				swapPath: '/tmp',
				phpArgs : {
					// add -f for fatal errors
					'-lf': null
				}
			},

			project: [
				'modules/**/code/*.php',
				'modules/**/code/**/*.php',
				'modules/**/assets/templates/*.php',
				'modules/**/assets/templates/**/*.php'
			],
			charcoal: [
				'charcoal/core/code/*.php',
				'charcoal/core/code/**/*.php',
				'charcoal/modules/**/code/*.php',
				'charcoal/modules/**/code/**/*.php'
			]
		},

		// watch: Run tasks whenever watched files change
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

		// sass: Compile Sass to CSS.
		sass: {
			dist: {
				files: {
					'assets/styles/dist/main.css': 'assets/styles/src/main.scss'
				}
			}
		},

		// csscomb: Sort CSS properties in specific order.
		csscomb: {
	        build: {
	            expand: true,
	            cwd: 'assets/styles/src/',
	            src: ['**/*.scss'],
	            dest: 'assets/styles/src/'
	        }
		},

		// autoprefixer: Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
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

		// notify: Automatic Notifications when Grunt tasks fail (or succeed)
		notify: {
			watch: {
				options: {
					title: 'SASS',
					message: 'SASS compiled',
				}
			}
		},

		// concat: Concatenate files
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

		// uglify: Minify (javascript)files with UglifyJS
		uglify: {
			my_target: {
				files: {
					'assets/scripts/dist/': ['assets/scripts/dist/*.js']
				}
			}
		},

		// imagemin: Minify PNG and JPEG images.
		imagemin: {
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

	// Load plugin(s)
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks("grunt-phplint");
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks("grunt-markdown-pdf");

	grunt.registerTask('default', [
		'concat',
		'watch'
	]);
	grunt.registerTask('wlint', [
		// Javasript
		'jshint',
		'jsonlint',
		'concat',

		// PHP
		'phplint',

		// Utilities
		'watch'
	]);
	grunt.registerTask('build', [
		'sass',
		'autoprefixer',
		'concat',
		'uglify',
		'imagemin'
	]);
	grunt.registerTask('c', [
		'csscomb'
	]);
	grunt.registerTask('s', [
		'sass'
	]);
};
