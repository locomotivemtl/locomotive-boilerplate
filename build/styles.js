import fs from 'fs';
import sass from 'node-sass';
import paths from '../mconfig.json';
import message from './utils/message.js';
import notification from './notification.js';

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
            outFile: outfile,
            outputStyle: 'compressed',
            sourceMap: true
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

            fs.writeFile(outfile, result.css, (err) => {
                if (err) {
                    message(`Error compiling ${name}.scss`, 'error');
                    message(err.formatted);

                    notification({
                        title:   `${name}.scss compilation failed 🚨`,
                        message: `Could not save stylesheet to ${name}.css`
                    });
                    return;
                }

                message(`${name}.css compiled`, 'success', timeLabel);
            });
        });
    });
}
