import loconfig from '../../loconfig.json';
import message from '../utils/message.js';
import notification from '../utils/notification.js';
import template from '../utils/template.js';
import esbuild from 'esbuild';
import { basename } from 'node:path';

/**
 * Bundles and minifies main JavaScript files.
 */
export async function compileScripts() {
    loconfig.tasks.scripts.forEach(async ({
        includes,
        outdir = '',
        outfile = ''
    }) => {
        const filename = basename(outdir || outfile || 'undefined');

        const timeLabel = `${filename} compiled in`;
        console.time(timeLabel);

        try {
            includes = includes.map((path) => template(path));

            if (outdir) {
                outdir = template(outdir);
            } else if (outfile) {
                outfile = template(outfile);
            } else {
                throw new TypeError(
                    'Expected \'outdir\' or \'outfile\''
                );
            }

            await esbuild.build({
                entryPoints: includes,
                bundle: true,
                minify: true,
                sourcemap: true,
                color: true,
                logLevel: 'error',
                target: [
                    'es2015',
                ],
                outdir,
                outfile
            });

            message(`${filename} compiled`, 'success', timeLabel);
        } catch (err) {
            // errors managments (already done in esbuild)
            notification({
                title:   `${filename} compilation failed 🚨`,
                message: `${err.errors[0].text} in ${err.errors[0].location.file} line ${err.errors[0].location.line}`
            });
        }
    });
};
