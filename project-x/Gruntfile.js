module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),

		// concat: Concatenate files
		concat: {
			global: {
				src: [
					 'modules/boilerplate/assets/scripts/src/global.js'
					,'modules/boilerplate/assets/scripts/src/vendor/jquery-1.11.1.min.js'
				],
      			dest: 'modules/boilerplate/assets/scripts/dist/main.js',
			}/*,
			home: {
				src: [
					 'modules/boilerplate/assets/scripts/src/vendor/carousel.js'
					,'modules/boilerplate/assets/scripts/src/templates/home.js'
					,'modules/boilerplate/assets/scripts/src/objects/video.js'
				],
      			dest: 'modules/boilerplate/assets/scripts/dist/home.js',
			}*/
		},

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
				files: ['modules/boilerplate/assets/styles/src/**/*.scss'],
				tasks: ['sass', 'autoprefixer', 'notify:sass'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			concat: {
				files: ['modules/boilerplate/assets/scripts/src/**/*.js'],
				tasks: ['concat', 'notify:concat']
			},
			svgstore: {
				files: ['modules/boilerplate/assets/images/svgs/*.svg'],
				tasks: ['svgstore', 'notify:svg']
			}
		},

		// sass: Compile Sass to CSS.
		sass: {
			dist: {
				files: {
					'modules/boilerplate/assets/styles/dist/main.css': 'modules/boilerplate/assets/styles/src/main.scss'
				}
			}
		},

		// csscomb: Sort CSS properties in specific order.
		csscomb: {
	        build: {
	            expand: true,
	            cwd: 'modules/boilerplate/assets/styles/src/',
	            src: ['**/*.scss'],
	            dest: 'modules/boilerplate/assets/styles/src/'
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
						src : ['modules/boilerplate/assets/styles/dist/*.css'],
						dest : 'modules/boilerplate/assets/styles/dist/',
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
					// title: '<%= pkg.title %>',
					message: 'Keeping an eye out, Chief!'
				}
			},
			sass: {
				options: {
					// title: '<%= pkg.title %>',
					message: 'Sass compiled to CSS.'
				}
			},
			concat: {
				options: {
					// title: '<%= pkg.title %>',
					message: 'Javascript is now concatenated'
				}
			},
			svg: {
				options: {
					// title: '<%= pkg.title %>',
					message: 'SVG is now concatenated'
				}
			}

		},

		// svgstore: Merge svgs from a folder
		svgstore: {
			options: {

			},
			default : {
			  files: {
			    'modules/boilerplate/assets/images/svgs.svg': ['modules/boilerplate/assets/images/svgs/*.svg'],
			  },
			},
		},

		// uglify: Minify (javascript)files with UglifyJS
		uglify: {
			my_target: {
				files: {
					'modules/boilerplate/assets/scripts/dist/': ['modules/boilerplate/assets/scripts/dist/*.js']
				}
			}
		},

		// cssmin: Compress CSS files
		cssmin: {
		  combine: {
		    files: {
		      'modules/boilerplate/assets/styles/dist/': ['modules/boilerplate/assets/scripts/dist/*.css']
		    }
		  }
		},

		// imagemin: Minify PNG and JPEG images.
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'modules/boilerplate/assets/images/',
					src: ['*.{png,jpg,gif}'],
					dest: 'modules/boilerplate/assets/images/'
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
	grunt.loadNpmTasks('grunt-svgstore');

	grunt.registerTask('default', ['notify:watch', 'watch']);
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
		'cssmin',
		'imagemin'
	]);
	grunt.registerTask('c', [
		'csscomb'
	]);
	grunt.registerTask('svg', ['svgstore']);
	grunt.registerTask('s', [
		'sass'
	]);
};
