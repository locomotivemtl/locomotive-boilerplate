import loconfig from '../loconfig.json';
import concatFiles, { developmentConcatFilesArgs } from './tasks/concats.js';
import compileScripts, { developmentScriptsArgs } from './tasks/scripts.js';
import compileStyles, { developmentStylesArgs } from './tasks/styles.js' ;
import compileSVGs, { developmentSVGsArgs } from './tasks/svgs.js';
import message from './utils/message.js';
import notification from './utils/notification.js';
import resolve from './utils/template.js';
import browserSync from 'browser-sync';
import { join } from 'node:path';

// Build scripts, compile styles, concat files,
// and generate spritesheets on first hit
concatFiles(...developmentConcatFilesArgs);
compileScripts(...developmentScriptsArgs);
compileStyles(...developmentStylesArgs);
compileSVGs(...developmentSVGsArgs);

// Create a new BrowserSync instance
const server = browserSync.create();

// Start the BrowserSync server
server.init(createServerOptions(loconfig), (err) => {
    if (err) {
        message('Error starting development server', 'error');
        message(err);

        notification({
            title:   'Development server failed',
            message: `${err.name}: ${err.message}`
        });
    }
});

configureServer(server, loconfig);

/**
 * Configures the BrowserSync options.
 *
 * @param  {BrowserSync} server         - The BrowserSync API.
 * @param  {object}      loconfig       - The project configset.
 * @param  {object}      loconfig.paths - The paths options.
 * @param  {object}      loconfig.tasks - The tasks options.
 * @return {void}
 */
function configureServer(server, { paths, tasks }) {
    const views = createViewsArray(paths.views);

    // Reload on any changes to views or processed files
    server.watch(
        [
            ...views,
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
}

/**
 * Creates a new object with all the BrowserSync options.
 *
 * @param  {object} loconfig        - The project configset.
 * @param  {object} loconfig.paths  - The paths options.
 * @param  {object} loconfig.server - The server options.
 * @return {object} Returns the server options.
 */
function createServerOptions({
    paths,
    server: options
}) {
    const config = {
        open: false,
        notify: false
    };

    // Resolve the URI for the BrowserSync server
    if (typeof paths.url === 'string' && paths.url.length > 0) {
        // Use proxy
        config.proxy = paths.url;
    } else if (typeof paths.dest === 'string' && paths.dest.length > 0) {
        // Use base directory
        config.server = {
            baseDir: paths.dest
        };
    }

    Object.assign(config, resolve(options));

    return config;
}

/**
 * Creates a new array (shallow-copied) from the views configset.
 *
 * @param  {*} views - The views configset.
 * @throws {TypeError} If views is invalid.
 * @return {array} Returns the views array.
 */
function createViewsArray(views) {
    if (Array.isArray(views)) {
        return Array.from(views);
    }

    switch (typeof views) {
        case 'string':
            return [ views ];

        case 'object':
            if (views != null) {
                return Object.values(views);
            }
    }

    throw new TypeError(
        'Expected \'views\' to be a string, array, or object'
    );
}
