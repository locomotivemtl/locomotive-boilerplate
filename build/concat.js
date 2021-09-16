import paths from '../mconfig.json';
import message from './utils/message.js';
import notification from './utils/notification.js';
import concat from 'concat';
import { readdir } from 'node:fs/promises';

/**
 * Concatenates third-party JavaScript files.
 */
export async function concatVendors() {
    const filename = 'vendors.js';
    const outfile  = paths.scripts.dest + filename;
    const external = [
        // Add files in node_modules example:
        // 'node_modules/gsap/dist/gsap.min.js',
    ];

    const timeLabel = `${filename} concatenated in`;
    console.time(timeLabel);

    try {
        // Get all files in `scripts/vendors/`
        let files = await readdir(paths.scripts.vendors.src);

        if (files.length) {
            // Exclude files that are not JavaScript
            files = files.filter((file) => file.includes('.js'));

            // Prepend absolute path
            files = files.map((file) => paths.scripts.vendors.src + file);
        }

        if (external.length) {
            files = files.concat(external);
        }

        await concat(files, outfile);

        message(`${filename} concatenated`, 'success', timeLabel);
    } catch (err) {
        message(`Error concatenating ${filename}`, 'error');
        message(err);

        notification({
            title:   `${filename} concatenation failed 🚨`,
            message: `${err.name}: ${err.message}`
        });
    }
};
