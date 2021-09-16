import { buildScripts } from './scripts.js';
import { concatVendors } from './concat.js';
import { compileStyles } from './styles.js' ;
import { generateSpriteSVG } from './svgs.js';
import paths from '../mconfig.json';

// Create an named instance in one file...
import bs from 'browser-sync';

// Start the Browsersync server
let bsConfig = {
    open: false,
    notify: false
};

if (typeof paths.proxy === 'string' && paths.proxy.length > 0) {
    // Use proxy
    bsConfig.proxy = paths.proxy;
} else {
    // Use base directory
    bsConfig.server = { baseDir: paths.dest };
}

bs.init(bsConfig);

// Build scripts, compile styles, concat vendors and generate the svgs sprite on first hit
buildScripts();
concatVendors();
compileStyles();
generateSpriteSVG();

// and call any methods on it.
bs.watch(
    [
        paths.views.src,
        paths.scripts.dest + paths.scripts.main + '.js',
        paths.scripts.dest + paths.scripts.vendors.main + '.js',
        paths.styles.dest + paths.styles.main + '.css',
        paths.svgs.dest + 'sprite.svg'
    ]
).on('change', bs.reload);

// Watch scripts
bs.watch(
    [
        paths.scripts.src + '**/*.js'
    ]
).on('change', () => {
    buildScripts();
});

// Watch scripts vendors
bs.watch(
    [
        paths.scripts.vendors.src + '*.js'
    ]
).on('change', () => {
    concatVendors();
});

// Watch styles
bs.watch(
    [
        paths.styles.src + '**/*.scss'
    ]
).on('change', () => {
    compileStyles();
});

// Watch svgs
bs.watch(
    [
        paths.svgs.src + '*.svg'
    ]
).on('change', () => {
    generateSpriteSVG();
});
