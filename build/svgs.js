import paths from '../mconfig.json';
import notification from './notification.js';
import message from './utils/message.js';
import mixer from 'svg-mixer';

/**
 * Generates and transforms SVG spritesheets.
 */
export function compileSVGs() {
    [
        {
            includes: [ paths.svgs.src + '*.svg' ],
            filename: 'sprite.svg'
        },
    ].forEach(({
        includes,
        filename
    }) => {
        const outfile = paths.scripts.dest + filename;

        const timeLabel = `${filename} compiled in`;
        console.time(timeLabel);

        mixer(includes, {
            spriteConfig: {
                usages: false
            }
        }).then((result) => {
            result.write(outfile).then(() => {
                message(`${filename} compiled`, 'success', timeLabel);
            });
        }).catch((err) => {
            message(`Error compiling ${filename}`, 'error');
            message(err);

            notification({
                title:   `${filename} compilation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        });
    });
};
