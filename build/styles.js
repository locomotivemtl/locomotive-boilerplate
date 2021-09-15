import autoprefixer from 'autoprefixer';
import fs from 'fs';
import sass from 'node-sass';
import postcss from 'postcss';
import paths from '../mconfig.json';
import message from './utils/message.js';
import notification from './utils/notification.js';

/**
 * Compiles and minifies main Sass files to CSS.
 */
export function compileStyles() {
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

            fs.access(outfile, (err) => {
                if (err) {
                    message(`Error compiling ${name}.scss`, 'error');
                    message(err);

                    notification({
                        title:   `${name}.scss compilation failed 🚨`,
                        message: err
                    });
                    return;
                }

                postcss([ autoprefixer ]).process(result.css, {
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

                    if (result.map) {
                        fs.writeFile(outfile + '.map', result.map.toString(), (err) => {
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
                });
            });
        });
    });
};
