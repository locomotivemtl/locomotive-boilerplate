/**
 * @file If available, returns the PostCSS processor with any plugins.
 */

try {
    var { default: postcss } = await import('postcss');
    let { default: autoprefixer } = await import('autoprefixer');

    postcss = postcss([ autoprefixer ]);
} catch (err) {
    postcss = null;
}

export default postcss;
