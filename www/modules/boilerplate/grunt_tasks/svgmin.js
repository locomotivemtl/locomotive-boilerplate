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
		expand: true,
		cwd: 'assets/images/dist/',
		src: '*.svg',
		dest: 'assets/images/dist/',
		ext: '.svg',
		extDot: 'first'
	}
}