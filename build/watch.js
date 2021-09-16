import { buildScripts } from './scripts.js';
import { concatVendors } from './concat.js';
import { compileStyles } from './styles.js' ;
import { generateSpriteSVG } from './svgs.js';
import paths from '../mconfig.json';

// Create an named instance in one file...
import server from 'browser-sync';

// Start the Browsersync server
let serverConfig = {
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

server.init(serverConfig);

// Build scripts, compile styles, concat vendors and generate the svgs sprite on first hit
buildScripts();
concatVendors();
compileStyles();
generateSpriteSVG();

// and call any methods on it.
server.watch(
    [
        paths.views.src,
        paths.scripts.dest + paths.scripts.main + '.js',
        paths.scripts.dest + paths.scripts.vendors.main + '.js',
        paths.styles.dest + paths.styles.main + '.css',
        paths.svgs.dest + 'sprite.svg'
    ]
).on('change', server.reload);

// Watch scripts
server.watch(
    [
        paths.scripts.src + '**/*.js'
    ]
).on('change', () => {
    buildScripts();
});

// Watch scripts vendors
server.watch(
    [
        paths.scripts.vendors.src + '*.js'
    ]
).on('change', () => {
    concatVendors();
});

// Watch styles
server.watch(
    [
        paths.styles.src + '**/*.scss'
    ]
).on('change', () => {
    compileStyles();
});

// Watch svgs
server.watch(
    [
        paths.svgs.src + '*.svg'
    ]
).on('change', () => {
    generateSpriteSVG();
});
