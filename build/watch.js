import loconfig from '../loconfig.json';
import { concatFiles } from './tasks/concats.js';
import { compileScripts } from './tasks/scripts.js';
import { compileStyles } from './tasks/styles.js' ;
import { compileSVGs } from './tasks/svgs.js';
import template from './utils/template.js';
import server from 'browser-sync';

const { paths, tasks } = loconfig;

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

// Build scripts, compile styles, concat files,
// and generate spritesheets on first hit
concatFiles();
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

// Watch concats
server.watch(
    tasks.concats.reduce(
        (patterns, { includes }) => patterns.concat(includes),
        []
    ).map((path) => template(path))
).on('change', () => {
    concatFiles();
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
