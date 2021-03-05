import paths from '../mconfig.json';
import message from './utils/message.js';
import fs from 'fs';
import concat from 'concat';

export function concatVendors() {
    console.time('Concat in');

    // Get all files in scripts/vendors/
    const files = fs.readdirSync(paths.scripts.vendors.src);

    // Exclude files that are not JavaScript
    var jsFiles = files.filter((file) => {
        return file.includes('.js');
    });

    // Prepend absolute path
    jsFiles = jsFiles.map((file) => {
        return `${paths.scripts.vendors.src + file}`;
    });
    // add files in node_modules example:
    // jsFiles.push('node_modules/gsap/dist/gsap.min.js');

    concat(jsFiles, paths.scripts.dest + paths.scripts.vendors.main + '.js').then(() => {
        message('Vendors concatenated', 'success', 'Concat in');
    })
}
