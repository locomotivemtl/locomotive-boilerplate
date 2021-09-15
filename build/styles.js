import fs from 'fs';
import sass from 'node-sass';
import paths from '../mconfig.json';
import message from './utils/message.js';
import postcss from './utils/postcss.js';
import notification from './utils/notification.js';

/**
 * Compiles and minifies main Sass files to CSS.
 */
export async function compileStyles() {
    [
        'critical',
        'main',
    ].forEach((name) => {
        const infile  = paths.styles.src  + name + '.scss';
        const outfile = paths.styles.dest + name + '.css';

        const timeLabel = `${name}.css compiled in`;
        console.time(timeLabel);

        sass.render({
            file: infile,
            omitSourceMapUrl: true,
            outFile: outfile,
            outputStyle: 'compressed',
            sourceMap: true,
            sourceMapContents: true
        }, (err, result) => {
            if (err) {
                message(`Error compiling ${name}.scss`, 'error');
                message(err.formatted);

                notification({
                    title:   `${name}.scss compilation failed 🚨`,
                    message: err.formatted
                });
                return;
            }

            if (postcss) {
                postcss.process(result.css, {
                    from: outfile,
                    to: outfile,
                    map: {
                        annotation: false,
                        inline: false,
                        sourcesContent: true
                    }
                }).then((result) => {
                    result.warnings().forEach((warn) => {
                        message(`Error prefixing ${name}.css`, 'error');
                        message(warn.toString());
                    });

                    saveStylesheet(result, outfile, name, timeLabel);
                });
            } else {
                saveStylesheet(result, outfile, name, timeLabel);
            }
        });
    });
};

/**
 * Writes the CSS file, and source map, to the disk.
 *
 * @param {object} result       - The compiler result.
 * @param {Buffer} result.css   - The compiled CSS.
 * @param {Buffer} [result.map] - The source map.
 * @param {string} outfile      - The output file path.
 * @param {string} name         - The Sass entry point identifier.
 * @param {string} [timeLabel]  - The console time identifier.
 */
function saveStylesheet(result, outfile, name, timeLabel) {
    if (result.css) {
        fs.writeFile(outfile, result.css, (err) => {
            if (err) {
                message(`Error compiling ${name}.scss`, 'error');
                message(err);

                notification({
                    title:   `${name}.scss compilation failed 🚨`,
                    message: `Could not save stylesheet to ${name}.css`
                });
                return;
            }

            message(`${name}.css compiled`, 'success', timeLabel);
        });
    }

    if (result.map) {
        fs.writeFile(outfile + '.map', result.map, (err) => {
            if (err) {
                message(`Error compiling ${name}.scss`, 'error');
                message(err);

                notification({
                    title:   `${name}.scss compilation failed 🚨`,
                    message: `Could not save sourcemap to ${name}.css.map`
                });
                return;
            }
        });
    }
}
