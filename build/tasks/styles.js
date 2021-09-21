import loconfig from '../../loconfig.json';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import postcss, { pluginsMap as postcssPluginsMap } from '../utils/postcss.js';
import template from '../utils/template.js';
import { writeFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { promisify } from 'node:util';
import sass from 'node-sass';

const sassRender = promisify(sass.render);

let postcssProcessor;

/**
 * @const {object} defaultSassOptions     - The default shared Sass options.
 * @const {object} developmentSassOptions - The predefined Sass options for development.
 * @const {object} productionSassOptions  - The predefined Sass options for production.
 */
export const defaultSassOptions = {
    omitSourceMapUrl: true,
    sourceMap: true,
    sourceMapContents: true,
};
export const developmentSassOptions = Object.assign({}, defaultSassOptions, {
    outputStyle: 'expanded',
});
export const productionSassOptions = Object.assign({}, defaultSassOptions, {
    outputStyle: 'compressed',
});

/**
 * @const {object} defaultPostCSSOptions     - The default shared PostCSS options.
 * @const {object} developmentPostCSSOptions - The predefined PostCSS options for development.
 * @const {object} productionPostCSSOptions  - The predefined PostCSS options for production.
 */
export const defaultPostCSSOptions = {
    processor: {
        map: {
            annotation: false,
            inline: false,
            sourcesContent: true,
        },
    },
};
export const developmentPostCSSOptions = Object.assign({}, defaultPostCSSOptions);
export const productionPostCSSOptions  = Object.assign({}, defaultPostCSSOptions);

/**
 * @const {object} developmentStylesArgs - The predefined `compileStyles()` options for development.
 * @const {object} productionStylesArgs  - The predefined `compileStyles()` options for production.
 */
export const developmentStylesArgs = [
    developmentSassOptions,
    developmentPostCSSOptions,
];
export const productionStylesArgs  = [
    productionSassOptions,
    productionPostCSSOptions,
];

/**
 * Compiles and minifies main Sass files to CSS.
 *
 * @todo Add deep merge of `postcssOptions` to better support customization
 *     of default processor options.
 *
 * @async
 * @param  {object}         [sassOptions=null]    - Customize the Sass render API options.
 *     If `null`, default production options are used.
 * @param  {object|boolean} [postcssOptions=null] - Customize the PostCSS processor API options.
 *     If `null`, default production options are used.
 *     If `false`, PostCSS processing will be ignored.
 * @return {Promise}
 */
export default async function compileStyles(sassOptions = null, postcssOptions = null) {
    if (sassOptions == null) {
        sassOptions = productionSassOptions;
    } else if (
        sassOptions !== developmentSassOptions &&
        sassOptions !== productionSassOptions
    ) {
        sassOptions = Object.assign({}, defaultSassOptions, sassOptions);
    }

    if (postcss) {
        if (postcssOptions == null) {
            postcssOptions = productionPostCSSOptions;
        } else if (
            postcssOptions !== false &&
            postcssOptions !== developmentSassOptions &&
            postcssOptions !== productionSassOptions
        ) {
            postcssOptions = Object.assign({}, defaultPostCSSOptions, postcssOptions);
        }
    }

    loconfig.tasks.styles.forEach(async ({
        infile,
        outfile
    }) => {
        const name = basename((outfile || 'undefined'), '.css');

        const timeLabel = `${name}.css compiled in`;
        console.time(timeLabel);

        try {
            infile  = template(infile);
            outfile = template(outfile);

            let result = await sassRender(Object.assign({}, sassOptions, {
                file: infile,
                outFile: outfile,
            }));

            if (postcss && postcssOptions) {
                if (typeof postcssProcessor === 'undefined') {
                    postcssProcessor = createPostCSSProcessor(
                        postcssPluginsMap,
                        postcssOptions
                    );
                }

                result = await postcssProcessor.process(
                    result.css,
                    Object.assign({}, postcssOptions.processor, {
                        from: outfile,
                        to: outfile,
                    })
                );

                if (result.warnings) {
                    const warnings = result.warnings();
                    if (warnings.length) {
                        message(`Error processing ${name}.css`, 'warning');
                        warnings.forEach((warn) => {
                            message(warn.toString());
                        });
                    }
                }
            }

            try {
                await writeFile(outfile, result.css);

                if (result.css) {
                    message(`${name}.css compiled`, 'success', timeLabel);
                } else {
                    message(`${name}.css is empty`, 'notice', timeLabel);
                }
            } catch (err) {
                message(`Error compiling ${name}.css`, 'error');
                message(err);

                notification({
                    title:   `${name}.css save failed 🚨`,
                    message: `Could not save stylesheet to ${name}.css`
                });
            }

            if (result.map) {
                try {
                    await writeFile(outfile + '.map', result.map.toString());
                } catch (err) {
                    message(`Error compiling ${name}.css.map`, 'error');
                    message(err);

                    notification({
                        title:   `${name}.css.map save failed 🚨`,
                        message: `Could not save sourcemap to ${name}.css.map`
                    });
                }
            }
        } catch (err) {
            message(`Error compiling ${name}.scss`, 'error');
            message(err.formatted || err);

            notification({
                title:   `${name}.scss compilation failed 🚨`,
                message: (err.formatted || `${err.name}: ${err.message}`)
            });
        }
    });
};

/**
 * Creates a PostCSS Processor with the given plugins and options.
 *
 * @param {array<(function|object)>|object<string, (function|object)>} pluginsListOrMap -
 *     A list or map of plugins.
 *     If a map of plugins, the plugin name looks up `options`.
 * @param {object}              options - The PostCSS options.
 */
function createPostCSSProcessor(pluginsListOrMap, options)
{
    let plugins;

    if (Array.isArray(pluginsListOrMap)) {
        plugins = pluginsListOrMap;
    } else {
        plugins = [];

        for (let [ name, plugin ] of Object.entries(pluginsListOrMap)) {
            if (name in options) {
                plugin = plugin[name](options[name]);
            }

            plugins.push(plugin);
        }
    }

    return postcss(plugins);
}
