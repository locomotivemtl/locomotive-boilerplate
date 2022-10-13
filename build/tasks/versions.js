import loconfig from '../utils/config.js';
import message from '../utils/message.js';
import resolve from '../utils/template.js';
import { randomBytes } from 'node:crypto';
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
 * @property {string|number|null} prettyPrint   - A string or number to insert
 *     white space into the output JSON string for readability purposes.
 * @property {string}             versionFormat - The version number format.
 * @property {string}             versionKey    - The JSON field name assign
 *     the version number to.
 */

/**
 * @const {VersionOptions} defaultVersionOptions     - The default shared version options.
 * @const {VersionOptions} developmentVersionOptions - The predefined version options for development.
 * @const {VersionOptions} productionVersionOptions  - The predefined version options for production.
 */
export const defaultVersionOptions = {
    prettyPrint:   4,
    versionFormat: 'timestamp',
    versionKey:    'version',
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
export default async function bumpVersions(versionOptions = null) {
    if (versionOptions == null) {
        versionOptions = productionVersionOptions;
    } else if (
        versionOptions !== developmentVersionOptions &&
        versionOptions !== productionVersionOptions
    ) {
        versionOptions = Object.assign({}, defaultVersionOptions, versionOptions);
    }

    const queue = new Map();

    loconfig.tasks.versions.forEach(({
        outfile,
        label = null,
        ...options
    }) => {
        if (!label) {
            label = basename(outfile || 'undefined');
        }

        options.pretty = (options.pretty ?? versionOptions.prettyPrint);
        options.format = (options.format ?? versionOptions.versionFormat);
        options.key    = (options.key ?? versionOptions.versionKey);

        if (queue.has(outfile)) {
            queue.get(outfile).then(() => handleBumpVersion(outfile, label, options));
        } else {
            queue.set(outfile, handleBumpVersion(outfile, label, options));
        }
    });
};

/**
 * Creates a formatted version number or string.
 *
 * @param  {string} format - The version format.
 * @return {string|number}
 */
function createVersionNumber(format) {
    let [ type, modifier ] = format.split(':');

    switch (type) {
        case 'hex':
        case 'hexadecimal':
            modifier = Number.parseInt(modifier);

            if (Number.isNaN(modifier)) {
                modifier = 6;
            }

            return randomBytes(modifier).toString('hex');

        case 'timestamp':
            return Date.now().valueOf();
    }

    throw new TypeError(
        'Expected \'format\' to be either "timestamp" or "hexadecimal"'
    );
}

/**
 * @async
 * @param  {string} outfile
 * @param  {string} label
 * @param  {object} options
 * @return {Promise}
 */
async function handleBumpVersion(outfile, label, options) {
    const timeLabel = `${label} bumped in`;
    console.time(timeLabel);

    try {
        outfile = resolve(outfile);

        let json;

        try {
            json = JSON.parse(await readFile(outfile));
        } catch (err) {
            json = {};

            message(`${label} is a new file`, 'notice');

            await mkdir(dirname(outfile), { recursive: true });
        }

        json[options.key] = createVersionNumber(options.format);

        await writeFile(outfile, JSON.stringify(json, null, options.pretty));

        message(`${label} bumped`, 'success', timeLabel);
    } catch (err) {
        message(`Error bumping ${label}`, 'error');
        message(err);

        notification({
            title:   `${label} bumping failed 🚨`,
            message: `${err.name}: ${err.message}`
        });
    }
}
