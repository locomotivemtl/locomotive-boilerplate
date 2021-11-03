import loconfig from '../../loconfig.json';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
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
 * @const {object} developmentSVGsArgs - The predefined `compileSVGs()` options for development.
 * @const {object} productionSVGsArgs  - The predefined `compileSVGs()` options for production.
 */
export const developmentSVGsArgs = [
    developmentMixerOptions,
];
export const productionSVGsArgs  = [
    productionMixerOptions,
];

/**
 * Generates and transforms SVG spritesheets.
 *
 * @async
 * @param  {object} [mixerOptions=null] - Customize the Mixer API options.
 *     If `null`, default production options are used.
 * @return {Promise}
 */
export default async function compileSVGs(mixerOptions = null) {
    if (mixerOptions == null) {
        mixerOptions = productionMixerOptions;
    } else if (
        mixerOptions !== developmentMixerOptions &&
        mixerOptions !== productionMixerOptions
    ) {
        mixerOptions = Object.assign({}, defaultMixerOptions, mixerOptions);
    }

    loconfig.tasks.svgs.forEach(async ({
        includes,
        outfile
    }) => {
        const filename = basename(outfile || 'undefined');

        const timeLabel = `${filename} compiled in`;
        console.time(timeLabel);

        try {
            includes = includes.map((path) => template(path));
            outfile  = template(outfile);

            const result = await mixer(includes, mixerOptions);

            await result.write(outfile);

            message(`${filename} compiled`, 'success', timeLabel);
        } catch (err) {
            message(`Error compiling ${filename}`, 'error');
            message(err);

            notification({
                title:   `${filename} compilation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        }
    });
};
