import loconfig from '../utils/config.js';
import message from '../utils/message.js';
import resolve from '../utils/template.js';
import {
    mkdir,
    readFile,
    writeFile,
} from 'node:fs/promises';
import {
    basename,
    dirname,
} from 'node:path';

/**
 * @typedef  {object} VersionOptions
 * @property {string} versionKey - The JSON field to add or update.
 */

/**
 * @const {VersionOptions} defaultVersionOptions     - The default shared version options.
 * @const {VersionOptions} developmentVersionOptions - The predefined version options for development.
 * @const {VersionOptions} productionVersionOptions  - The predefined version options for production.
 */
export const defaultVersionOptions = {
    versionKey: 'version',
};
export const developmentVersionOptions = Object.assign({}, defaultVersionOptions);
export const productionVersionOptions  = Object.assign({}, defaultVersionOptions);

/**
 * @const {object} developmentVersionFilesArgs - The predefined `bumpVersion()` options for development.
 * @const {object} productionVersionFilesArgs  - The predefined `bumpVersion()` options for production.
 */
export const developmentVersionFilesArgs = [
    developmentVersionOptions,
];
export const productionVersionFilesArgs  = [
    productionVersionOptions,
];

/**
 * Bumps version numbers in file.
 *
 * @async
 * @param  {object} [versionOptions=null] - Customize the version options.
 *     If `null`, default production options are used.
 * @return {Promise}
 */
export default async function bumpVersion(versionOptions = null) {
    if (versionOptions == null) {
        versionOptions = productionVersionOptions;
    } else if (
        versionOptions !== developmentVersionOptions &&
        versionOptions !== productionVersionOptions
    ) {
        versionOptions = Object.assign({}, defaultVersionOptions, versionOptions);
    }

    loconfig.tasks.versions.forEach(async ({
        outfile,
        key = null,
        label = null
    }) => {
        if (!label) {
            label = basename(outfile || 'undefined');
        }

        const timeLabel = `${label} bumped in`;
        console.time(timeLabel);

        try {
            outfile  = resolve(outfile);

            let json

            try {
                json = JSON.parse(await readFile(outfile));
            } catch (err) {
                message(`${label} is a new file`, 'notice');

                await mkdir(dirname(outfile), {recursive: true });

                json = {};
            }

            json[key || versionOptions.versionKey] = (new Date()).valueOf();

            await writeFile(outfile, JSON.stringify(json, null, 4))

            message(`${label} bumped`, 'success', timeLabel);
        } catch (err) {
            message(`Error bumping ${label}`, 'error');
            message(err);

            notification({
                title:   `${label} bumping failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        }
    });
};
