import loconfig from '../../loconfig.json';
import glob from '../utils/glob.js';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
import concat from 'concat';
import { basename } from 'node:path';

/**
 * Concatenates groups of files.
 *
 * @todo Add support for minification.
 *
 * @async
 * @return {Promise}
 */
export default async function concatFiles() {
    loconfig.tasks.concats.forEach(async ({
        includes,
        outfile
    }) => {
        const filename = basename(outfile || 'undefined');

        const timeLabel = `${filename} concatenated in`;
        console.time(timeLabel);

        try {
            includes = includes.map((path) => template(path));
            outfile  = template(outfile);

            const files = await glob(includes);

            await concat(files, outfile);

            if (files.length) {
                message(`${filename} concatenated`, 'success', timeLabel);
            } else {
                message(`${filename} is empty`, 'notice', timeLabel);
            }
        } catch (err) {
            message(`Error concatenating ${filename}`, 'error');
            message(err);

            notification({
                title:   `${filename} concatenation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        }
    });
};
