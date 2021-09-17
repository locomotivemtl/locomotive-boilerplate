import paths from '../mconfig.json';
import { concatVendors } from './tasks/concat.js';
import { compileScripts } from './tasks/scripts.js';
import { compileStyles } from './tasks/styles.js' ;
import { compileSVGs } from './tasks/svgs.js';
import server from 'browser-sync';

const serverConfig = {
    open: false,
    notify: false
};

if (typeof paths.url === 'string' && paths.url.length > 0) {
    // Use proxy
    serverConfig.proxy = paths.url;
} else {
    // Use base directory
    serverConfig.server = {
        baseDir: paths.dest
    };
}

// Start the Browsersync server
server.init(serverConfig);

// Build scripts, compile styles, concat vendors and generate the svgs sprite on first hit
concatVendors();
compileScripts();
compileStyles();
compileSVGs();

// and call any methods on it.
server.watch(
    [
        paths.views.src,
        paths.scripts.dest + '*.js',
        paths.styles.dest + '*.css',
        paths.svgs.dest + '*.svg',
    ]
).on('change', server.reload);

// Watch scripts
server.watch(
    [
        paths.scripts.src + '**/*.js',
    ]
).on('change', () => {
    compileScripts();
});

// Watch scripts vendors
server.watch(
    [
        paths.scripts.vendors.src + '*.js',
    ]
).on('change', () => {
    concatVendors();
});

// Watch styles
server.watch(
    [
        paths.styles.src + '**/*.scss',
    ]
).on('change', () => {
    compileStyles();
});

// Watch svgs
server.watch(
    [
        paths.svgs.src + '*.svg',
    ]
).on('change', () => {
    compileSVGs();
});
