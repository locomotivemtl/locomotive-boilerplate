import paths from '../mconfig.json';
import message from '../utils/message.js';
import postcss from '../utils/postcss.js';
import notification from '../utils/notification.js';
import { writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import sass from 'node-sass';

const sassRender = promisify(sass.render);

/**
 * Compiles and minifies main Sass files to CSS.
 */
export async function compileStyles() {
    [
        'critical',
        'main',
    ].forEach(async (name) => {
        const infile  = paths.styles.src  + name + '.scss';
        const outfile = paths.styles.dest + name + '.css';

        const timeLabel = `${name}.css compiled in`;
        console.time(timeLabel);

        try {
            let result = await sassRender({
                file: infile,
                omitSourceMapUrl: true,
                outFile: outfile,
                outputStyle: 'compressed',
                sourceMap: true,
                sourceMapContents: true
            });

            if (postcss) {
                result = await postcss.process(result.css, {
                    from: outfile,
                    to: outfile,
                    map: {
                        annotation: false,
                        inline: false,
                        sourcesContent: true
                    }
                });

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

            writeFile(outfile, result.css).then(() => {
                if (result.css) {
                    message(`${name}.css compiled`, 'success', timeLabel);
                } else {
                    message(`${name}.css is empty`, 'notice', timeLabel);
                }
            }).catch((err) => {
                message(`Error compiling ${name}.scss`, 'error');
                message(err);

                notification({
                    title:   `${name}.scss compilation failed 🚨`,
                    message: `Could not save stylesheet to ${name}.css`
                });
            });

            if (result.map) {
                writeFile(outfile + '.map', result.map.toString()).catch((err) => {
                    message(`Error compiling ${name}.scss`, 'error');
                    message(err);

                    notification({
                        title:   `${name}.scss compilation failed 🚨`,
                        message: `Could not save sourcemap to ${name}.css.map`
                    });
                });
            }
        } catch (err) {
            message(`Error compiling ${name}.scss`, 'error');
            message(err.formatted);

            notification({
                title:   `${name}.scss compilation failed 🚨`,
                message: err.formatted
            });
        }
    });
};
