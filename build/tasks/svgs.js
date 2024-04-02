import loconfig from '../helpers/config.js';
import glob, { supportsGlob } from '../helpers/glob.js';
import message from '../helpers/message.js';
import notification from '../helpers/notification.js';
import { resolve as resolveTemplate } from '../helpers/template.js';
import { merge } from '../utils/index.js';
import {
    basename,
    dirname,
    extname,
    resolve,
} from 'node:path';
import commonPath from 'common-path';
import mixer from 'svg-mixer';
import slugify from 'url-slug';

const basePath = loconfig?.paths?.svgs?.src
    ? resolve(loconfig.paths.svgs.src)
    : null;

/**
 * @const {object} defaultMixerOptions - The default shared Mixer options.
 */
export const defaultMixerOptions = {
    spriteConfig: {
        usages: false,
    },
};

/**
 * @const {object} developmentMixerOptions - The predefined Mixer options for development.
 * @const {object} productionMixerOptions  - The predefined Mixer options for production.
 */
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
        mixerOptions = merge({}, defaultMixerOptions, mixerOptions);
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

            includes = resolveTemplate(includes);
            outfile  = resolveTemplate(outfile);

            if (supportsGlob && basePath) {
                includes = await glob(includes);
                includes = [ ...new Set(includes) ];

                const common = commonPath(includes);
                if (common.commonDir) {
                    common.commonDir = resolve(common.commonDir);
                }

                /**
                 * Generates the `<symbol id>` attribute and prefix any
                 * SVG files in subdirectories according to the paths
                 * common base path.
                 *
                 * Example for SVG source path `./assets/images/sprite`:
                 *
                 * | Path                                 | ID        |
                 * | ------------------------------------ | --------- |
                 * | `./assets/images/sprite/foo.svg`     | `foo`     |
                 * | `./assets/images/sprite/baz/qux.svg` | `baz-qux` |
                 *
                 * @param  {string} path       - The absolute path to the file.
                 * @param  {string} [query=''] - A query string.
                 * @return {string} The symbol ID.
                 */
                mixerOptions.generateSymbolId = (path, query = '') => {
                    let dirName = dirname(path)
                        .replace(common.commonDir ?? basePath, '')
                        .replace(/^\/|\/$/, '')
                        .replace('/', '-');
                    if (dirName) {
                        dirName += '-';
                    }

                    const fileName = basename(path, extname(path));
                    const decodedQuery = decodeURIComponent(decodeURIComponent(query));
                    return `${dirName}${fileName}${slugify(decodedQuery)}`;
                };
            }

            const result = await mixer(includes, {
                ...mixerOptions,
            });

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
