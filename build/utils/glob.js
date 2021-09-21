/**
 * @file Retrieve the first available glob library.
 *
 * Note that options vary between libraries.
 *
 * Candidates:
 * - {@link https://npmjs.com/package/tiny-glob tiny-glob}
 * - {@link https://npmjs.com/package/globby}
 * - {@link https://npmjs.com/package/fast-glob fast-glob}
 * - {@link https://npmjs.com/package/glob glob}
 */

import { promisify } from 'node:util';

const candidates = [
    'tiny-glob',
    'globby',
    'fast-glob',
    'glob',
];

var glob, module;

for (let name of candidates) {
    try {
        module = await import(name);
        module = module.default;

        /**
         * Wrap the function to ensure
         * a common pattern.
         */
        switch (name) {
            case 'tiny-glob':
                glob = createArrayableGlob(module, {
                    filesOnly: true
                });
                break;

            case 'glob':
                glob = promisify(module);
                break;

            default:
                glob = module;
                break;
        }

        break; // loop
    } catch (err) {
        // swallow this error; skip to the next candidate.
    }
}

if (!glob) {
    throw new TypeError(
        `No glob library was found, expected one of: ${modules.join(', ')}`
    );
}

export default glob;

/**
 * Creates a wrapper function for the glob function
 * to provide support for arrays of patterns.
 *
 * @param  {function} glob    - The glob function.
 * @param  {object}   options - The glob options.
 * @return {function}
 */
function createArrayableGlob(glob, options) {
    return (patterns, options) => {
        const globs = patterns.map((pattern) => glob(pattern, options));

        return Promise.all(globs).then((files) => {
            return [].concat.apply([], files);
        });
    };
}
