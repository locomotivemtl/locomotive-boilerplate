module.exports = {
	options: {
		plugins: [
			{ removeViewBox: false },
			{ cleanupIDs: false },
			{ convertPathData: false },
			{ mergePaths: false },
			{ convertShapeToPath: false },
			{ cleanupNumericValues: false },
			{ convertTransform: false },
			{ removeUselessStrokeAndFill: false },
			{ removeTitle: true },
			{ removeDesc: true }
		]
	},
	dist: {
		expand : true,
		cwd    : '<%= paths.img.dist %>',
		src    : '*.svg',
		dest   : '<%= paths.img.dist %>'
	}
};
