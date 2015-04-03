module.exports = {
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
}