/**
 * If available, create the PostCSS processor with any plugins.
 *
 * @type {?module:postcss~Processor}
 */
export default await (async () => {
    try {
        const { default: postcss } = await import('postcss');
        const { default: autoprefixer } = await import('autoprefixer');

        if (postcss && autoprefixer) {
            return postcss([ autoprefixer ]);
        }
    } catch (err) {
        // swallow this error; postcss and plugins are optional.
    }

    return null;
})();
