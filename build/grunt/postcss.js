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
				src : ['www/assets/styles/*.css'],
				dest : 'www/assets/styles/',
				expand : true,
				flatten : true
			}
		]
	}
};
