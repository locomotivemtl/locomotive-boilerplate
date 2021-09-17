import paths from '../mconfig.json';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import esbuild from 'esbuild';

/**
 * Bundles and minifies main JavaScript files.
 */
export async function compileScripts() {
    [
        'app.js',
    ].forEach((filename) => {
        const includes = [ paths.scripts.src  + filename ];
        const outfile  = paths.scripts.dest + filename;

        const timeLabel = `${filename} compiled in`;
        console.time(timeLabel);

        esbuild.build({
            entryPoints: includes,
            bundle: true,
            minify: true,
            sourcemap: true,
            color: true,
            logLevel: 'error',
            target: [
                'es2015',
            ],
            outfile
        }).catch((err) => {
            // errors managments (already done in esbuild)
            notification({
                title:   `${filename} compilation failed 🚨`,
                message: `${err.errors[0].text} in ${err.errors[0].location.file} line ${err.errors[0].location.line}`
            });
        }).then(() => {
            message(`${filename} compiled`, 'success', timeLabel);
        });
    });
};
