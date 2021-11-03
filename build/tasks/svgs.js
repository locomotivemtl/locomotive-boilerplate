import loconfig from '../../loconfig.json';
import glob from '../utils/glob.js';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
import {
    mkdir,
    readFile,
    writeFile
} from 'node:fs/promises';
import {
    basename,
    dirname,
    join,
    resolve
} from 'node:path';
import SVGSpriter from 'svg-sprite';
import Vinyl from 'vinyl';

/**
 * @const {object} defaultSVOOptions     - The default shared SVO options.
 * @const {object} developmentSVOOptions - The predefined SVO options for development.
 * @const {object} productionSVOOptions  - The predefined SVO options for production.
 */
export const defaultSVOOptions = {
};
export const developmentSVOOptions = Object.assign({}, defaultSVOOptions);
export const productionSVOOptions  = Object.assign({}, defaultSVOOptions);

/**
 * @const {object} defaultSVGSpriterOptions     - The default shared SVGSpriter options.
 * @const {object} developmentSVGSpriterOptions - The predefined SVGSpriter options for development.
 * @const {object} productionSVGSpriterOptions  - The predefined SVGSpriter options for production.
 */
export const defaultSVGSpriterOptions = {
    mode: {},
    shape: {
        transform: [],
    },
    svg: {
        doctypeDeclaration: false,
        xmlDeclaration:     false,
    },
};
export const developmentSVGSpriterOptions = Object.assign({}, defaultSVGSpriterOptions);
export const productionSVGSpriterOptions  = Object.assign({}, defaultSVGSpriterOptions);

/**
 * @const {object} developmentSVGsArgs - The predefined `compileSVGs()` options for development.
 * @const {object} productionSVGsArgs  - The predefined `compileSVGs()` options for production.
 */
export const developmentSVGsArgs = [
    developmentSVGSpriterOptions,
    developmentSVOOptions,
];
export const productionSVGsArgs  = [
    productionSVGSpriterOptions,
    productionSVOOptions,
];

/**
 * Generates and transforms SVG spritesheets.
 *
 * @async
 * @param  {object} [spriterOptions=null] - Customize the SVGSpriter API options.
 *     If `null`, default production options are used.
 * @param  {object} [svgoOptions=null]    - Customize the SVGO API options.
 *     If `null`, default production options are used.
 * @return {Promise}
 */
export default async function compileSVGs(spriterOptions = null, svgoOptions = null) {
    if (spriterOptions == null) {
        spriterOptions = productionSVGSpriterOptions;
    } else if (
        spriterOptions !== developmentSVGSpriterOptions &&
        spriterOptions !== productionSVGSpriterOptions
    ) {
        spriterOptions = Object.assign({}, defaultSVGSpriterOptions, spriterOptions);
    }

    if (svgoOptions == null) {
        svgoOptions = productionSVOOptions;
    } else if (
        svgoOptions !== developmentSVOOptions &&
        svgoOptions !== productionSVOOptions
    ) {
        svgoOptions = Object.assign({}, defaultSVOOptions, svgoOptions);
    }

    if (svgoOptions) {
        spriterOptions.shape.transform.push({
            svgo: svgoOptions,
        });
    }

    const svgSpriter = new SVGSpriter(spriterOptions);

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

            svgSpriter.compile({
                symbol: {
                    dest:   dirname(outfile),
                    sprite: filename,
                },
            }, (error, result) => {
                for (const mode in result) {
                    for (const resource in result[mode]) {
                        await mkdir(path.dirname(result[mode][resource].path), {
                            recursive: true
                        });
                        await writeFile(result[mode][resource].path, result[mode][resource].contents);
                    }
                }
            });

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
