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
		cwd: 'www/assets/images/dist/',
		src: '*.svg',
		dest: 'www/assets/images/dist/',
		ext: '.svg',
		extDot: 'first'
	}
}
