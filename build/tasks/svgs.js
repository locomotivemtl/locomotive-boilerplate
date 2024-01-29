import defaultSVGOOptions from '../config/svgo.js';
import loconfig from '../helpers/config.js';
import message from '../helpers/message.js';
import notification from '../helpers/notification.js';
import optimize from '../helpers/svgo.js';
import resolve from '../helpers/template.js';
import { merge } from '../utils/index.js';
import { basename } from 'node:path';
import mixer from 'svg-mixer';

/**
 * @const {object} defaultMixerOptions     - The default shared Mixer options.
 * @const {object} developmentMixerOptions - The predefined Mixer options for development.
 * @const {object} productionMixerOptions  - The predefined Mixer options for production.
 */
export const defaultMixerOptions = {
    spriteConfig: {
        usages: false,
    },
};
export const developmentMixerOptions = Object.assign({}, defaultMixerOptions);
export const productionMixerOptions  = Object.assign({}, defaultMixerOptions);

/**
 * Exclude certain SVGO plugins for the purposes of building a spritesheet.
 */
const excludeSVGOPlugins = [
    'cleanupIds',
    'removeHiddenElems',
];
defaultSVGOOptions.plugins = defaultSVGOOptions.plugins.filter((plugin) => !excludeSVGOPlugins.includes(plugin));
defaultSVGOOptions.js2svg.pretty = false;

/**
 * @const {object} defaultSVGOOptions     - The default shared SVGO options.
 * @const {object} developmentSVGOOptions - The predefined SVGO options for development.
 * @const {object} productionSVGOOptions  - The predefined SVGO options for production.
 */
export { defaultSVGOOptions };
export const developmentSVGOOptions = Object.assign({}, defaultSVGOOptions);
export const productionSVGOOptions  = Object.assign({}, defaultSVGOOptions);

/**
 * @const {object|boolean} developmentSVGsArgs - The predefined `compileSVGs()` options for development.
 * @const {object|boolean} productionSVGsArgs  - The predefined `compileSVGs()` options for production.
 */
export const developmentSVGsArgs = [
    developmentMixerOptions,
    false,
];
export const productionSVGsArgs  = [
    productionMixerOptions,
    productionSVGOOptions,
];

/**
 * Generates and transforms SVG spritesheets.
 *
 * @async
 * @param  {object}         [mixerOptions=null] - Customize the Mixer API options.
 *     If `null`, default production options are used.
 * @param  {object|boolean} [svgoOptions=null]  - Customize the SVGO processor API options.
 *     If `null`, default production options are used.
 * @return {Promise}
 */
export default async function compileSVGs(mixerOptions = null, svgoOptions = null) {
    if (mixerOptions == null) {
        mixerOptions = productionMixerOptions;
    } else if (
        mixerOptions !== developmentMixerOptions &&
        mixerOptions !== productionMixerOptions
    ) {
        mixerOptions = merge({}, defaultMixerOptions, mixerOptions);
    }

    if (optimize) {
        if (svgoOptions == null) {
            svgoOptions = productionSVGOOptions;
        } else if (
            svgoOptions !== false &&
            svgoOptions !== developmentSVGOOptions &&
            svgoOptions !== productionSVGOOptions
        ) {
            svgoOptions = Object.assign({}, defaultSVGOOptions, svgoOptions);
        }
    }

    /**
     * @async
     * @param  {object}   entry          - The entrypoint to process.
     * @param  {string[]} entry.includes - One or more paths to process.
     * @param  {string}   entry.outfile  - The file to write to.
     * @param  {?string}  [entry.label]  - The task label.
     *     Defaults to the outfile name.
     * @return {Promise}
     */
    loconfig.tasks.svgs?.forEach(async ({
        includes,
        outfile,
        label = null
    }) => {
        if (!label) {
            label = basename(outfile || 'undefined');
        }

        const timeLabel = `${label} compiled in`;
        console.time(timeLabel);

        try {
            if (!Array.isArray(includes)) {
                includes = [ includes ];
            }

            includes = resolve(includes);
            outfile  = resolve(outfile);

            const result = await mixer(includes, mixerOptions);

            if (optimize && svgoOptions) {
                result.content = optimize(result.content, svgoOptions).data;
            }

            await result.write(outfile);

            message(`${label} compiled`, 'success', timeLabel);
        } catch (err) {
            message(`Error compiling ${label}`, 'error');
            message(err);

            notification({
                title:   `${label} compilation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        }
    });
};
