module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		

		// sass: Compile Sass to CSS
		sass: require('./grunt_tasks/sass'),

		// svgstore: Merge svgs from a folder
		svgstore: require('./grunt_tasks/svgstore'),

		// concat: Concatenate files.
		concat: require('./grunt_tasks/concat'),

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
						flatten : true
					}
				]
			}
		},

		// watch: Run tasks whenever watched files change.
		watch: {
			concat: {
				files: ['assets/scripts/src/**/*.js'],
				tasks: ['concat', 'notify:concat']
			},
			sass: {
				files: ['assets/styles/src/**/*.scss'],
				tasks: ['sass', 'autoprefixer', 'notify:sass'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			svgstore: {
				files: ['assets/images/**/*.svg'],
				tasks: ['svgstore', 'notify:svg']
			},
			tasks: {
				files: ['grunt_tasks/*.js'],
				options: {
			      reload: true
			    }
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
					message: 'JavaScript is now concatenated'
				}
			},
			svg: {
				options: {
					// title: '<%= pkg.title %>',
					message: 'SVG is now concatenated'
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

		// uglify: Minify (javascript)files with UglifyJS
		uglify: {
			target: {
				files: [{
					expand: true,
					cwd: 'assets/scripts/dist/',
					src: '**/*.js',
					dest: 'assets/scripts/dist/'
				}]
			}
		},

		// cssmin: Compress CSS files
		cssmin: {
		  combine: {
		    files: {
		      'assets/styles/dist/': ['assets/scripts/dist/*.css']
		    }
		  }
		},

		// svgmin: Minify SVG
		svgmin: {
	        options: {
	            plugins: [
	                { removeViewBox: false },
	                { cleanupIDs: false },
	                { convertPathData: false },
	                { mergePaths: false },
	                { convertShapeToPath: false },
	                { cleanupNumericValues: false },
	                { convertTransform: false },
				    { removeUselessStrokeAndFill: false }
	            ]
	        },
	        dist: {
	            files: {
	                'assets/images/dist/': 'assets/images/dist/*.svg'
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
		}

	});

	// Load tasks
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-svgstore');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-csscomb');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks("grunt-phplint");


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

};
