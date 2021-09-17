import loconfig from '../../loconfig.json';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
import { basename } from 'node:path';
import mixer from 'svg-mixer';

/**
 * Generates and transforms SVG spritesheets.
 */
export async function compileSVGs() {
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

            const result = await mixer(includes, {
                spriteConfig: {
                    usages: false
                }
            });

            await result.write(outfile);

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
