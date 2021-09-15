import paths from '../mconfig.json';
import message from './utils/message.js';
import notification from './utils/notification.js';
import concat from 'concat';
import fs from 'fs';

/**
 * Concatenates third-party JavaScript files.
 */
export function concatVendors() {
    const filename = 'vendors.js';
    const outfile  = paths.scripts.dest + filename;
    const external = [
        // Add files in node_modules example:
        // 'node_modules/gsap/dist/gsap.min.js',
    ];

    const timeLabel = `${filename} concatenated in`;
    console.time(timeLabel);

    // Get all files in `scripts/vendors/`
    fs.readdir(paths.scripts.vendors.src, (err, files) => {
        if (err) {
            message(`Error preparing ${filename}`, 'error');
            message(err);

            notification({
                title:   `${filename} concatenation failed 🚨`,
                message: `${err.name}: ${e.message}`
            });
        }

        if (files.length) {
            // Exclude files that are not JavaScript
            files = files.filter((file) => file.includes('.js'));

            // Prepend absolute path
            files = files.map((file) => paths.scripts.vendors.src + file);
        }

        if (external.length) {
            files = files.concat(external);
        }

        concat(files, outfile).then(() => {
            message(`${filename} concatenated`, 'success', timeLabel);
        }).catch((err) => {
            message(`Error concatenating ${filename}`, 'error');
            message(err);

            notification({
                title:   `${filename} concatenation failed 🚨`,
                message: `${err.name}: ${err.message}`
            });
        });
    });
};
