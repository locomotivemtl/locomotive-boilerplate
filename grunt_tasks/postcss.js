module.exports = {
	postcss: {
    	options: {
	    	processors: [
				require('autoprefixer')({
					browsers: ['last 2 versions', '> 1%', 'ie >= 9']
				}),
			]
		},
		files: [
			{
				src : ['www/assets/styles/dist/*.css'],
				dest : 'www/assets/styles/dist/',
				expand : true,
				flatten : true
			}
		]
	}
}
