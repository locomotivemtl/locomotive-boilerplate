module.exports = {
	postcss: {
    	options: {
	    	processors: [
				require('autoprefixer-core')({
					browsers: ['last 2 versions', '> 1%', 'ie >= 9']
				}),
			]
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
}
