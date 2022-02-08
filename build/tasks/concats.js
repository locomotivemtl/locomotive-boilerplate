import loconfig from '../../loconfig.json';
import glob from '../utils/glob.js';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
import concat from 'concat';
import { basename } from 'node:path';

/**
 * @const {object} defaultGlobOptions     - The default shared glob options.
 * @const {object} developmentGlobOptions - The predefined glob options for development.
 * @const {object} productionGlobOptions  - The predefined glob options for production.
 */
export const defaultGlobOptions = {
};
export const developmentGlobOptions = Object.assign({}, defaultGlobOptions);
export const productionGlobOptions  = Object.assign({}, defaultGlobOptions);

/**
 * @const {object} developmentConcatFilesArgs - The predefined `concatFiles()` options for development.
 * @const {object} productionConcatFilesArgs  - The predefined `concatFiles()` options for production.
 */
export const developmentConcatFilesArgs = [
    developmentGlobOptions,
];
export const productionConcatFilesArgs  = [
    productionGlobOptions,
];

/**
 * Concatenates groups of files.
 *
 * @todo Add support for minification.
 *
 * @async
 * @param  {object} [globOptions=null]   - Customize the glob options.
 *     If `null`, default production options are used.
 * @return {Promise}
 */
export default async function concatFiles(globOptions = null) {
    if (globOptions == null) {
        globOptions = productionGlobOptions;
    } else if (
        globOptions !== developmentGlobOptions &&
        globOptions !== productionGlobOptions
    ) {
        globOptions = Object.assign({}, defaultGlobOptions, globOptions);
    }

    loconfig.tasks.concats.forEach(async ({
        includes,
        outfile,
        label = null
    }) => {
        if (!label) {
            label = basename(outfile || 'undefined');
        }

        const timeLabel = `${label} concatenated in`;
        console.time(timeLabel);

        try {
            includes = includes.map((path) => template(path));
            outfile  = template(outfile);

            const files = await glob(includes, globOptions);

            await concat(files, outfile);

            if (files.length) {
                message(`${label} concatenated`, 'success', timeLabel);
            } else {
                message(`${label} is empty`, 'notice', timeLabel);
            }
        } catch (err) {
            message(`Error concatenating ${label}`, 'error');
            message(err);

            notification({
                title:   `${label} concatenation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        }
    });
};
