import loconfig from '../loconfig.json';
import concatFiles, { developmentConcatFilesArgs } from './tasks/concats.js';
import compileScripts, { developmentScriptsArgs } from './tasks/scripts.js';
import compileStyles, { developmentStylesArgs } from './tasks/styles.js' ;
import compileSVGs, { developmentSVGsArgs } from './tasks/svgs.js';
import resolve from './utils/template.js';
import server from 'browser-sync';
import { join } from 'node:path';

const { paths, tasks } = loconfig;

// Convert view(s) to an array
switch (typeof paths.views) {
    case 'string':
        paths.views = [ paths.views ];
        break;

    case 'object':
        if (paths.views == null) {
            paths.views = [];
        } else if (!Array.isArray(paths.views)) {
            paths.views = Object.values(paths.views);
        }
        break;
}

const serverConfig = {
    open: false,
    notify: false
};

// Resolve the URI for the Browsersync server
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
concatFiles(...developmentConcatFilesArgs);
compileScripts(...developmentScriptsArgs);
compileStyles(...developmentStylesArgs);
compileSVGs(...developmentSVGsArgs);

// Reload on any changes to views or processed files
server.watch(
    [
        ...paths.views,
        join(paths.scripts.dest, '*.js'),
        join(paths.styles.dest, '*.css'),
        join(paths.svgs.dest, '*.svg'),
    ]
).on('change', server.reload);

// Watch source scripts
server.watch(
    [
        join(paths.scripts.src, '**/*.js'),
    ]
).on('change', () => {
    compileScripts(...developmentScriptsArgs);
});

// Watch source concats
server.watch(
    resolve(
        tasks.concats.reduce(
            (patterns, { includes }) => patterns.concat(includes),
            []
        )
    )
).on('change', () => {
    concatFiles(...developmentConcatFilesArgs);
});

// Watch source styles
server.watch(
    [
        join(paths.styles.src, '**/*.scss'),
    ]
).on('change', () => {
    compileStyles(...developmentStylesArgs);
});

// Watch source SVGs
server.watch(
    [
        join(paths.svgs.src, '*.svg'),
    ]
).on('change', () => {
    compileSVGs(...developmentSVGsArgs);
});
