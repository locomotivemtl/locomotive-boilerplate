import loconfig from '../loconfig.json';
import concatFiles from './tasks/concats.js';
import compileScripts, { developmentScriptsArgs } from './tasks/scripts.js';
import compileStyles, { developmentStylesArgs } from './tasks/styles.js' ;
import compileSVGs, { developmentSVGsArgs } from './tasks/svgs.js';
import template from './utils/template.js';
import server from 'browser-sync';
import { join } from 'node:path';

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
compileScripts(...developmentScriptsArgs);
compileStyles(...developmentStylesArgs);
compileSVGs(...developmentSVGsArgs);

// and call any methods on it.
server.watch(
    [
        paths.views.src,
        join(paths.scripts.dest, '*.js'),
        join(paths.styles.dest, '*.css'),
        join(paths.svgs.dest, '*.svg'),
    ]
).on('change', server.reload);

// Watch scripts
server.watch(
    [
        join(paths.scripts.src, '**/*.js'),
    ]
).on('change', () => {
    compileScripts(...developmentScriptsArgs);
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
        join(paths.styles.src, '**/*.scss'),
    ]
).on('change', () => {
    compileStyles(...developmentStylesArgs);
});

// Watch svgs
server.watch(
    [
        join(paths.svgs.src, '*.svg'),
    ]
).on('change', () => {
    compileSVGs(...developmentSVGsArgs);
});
