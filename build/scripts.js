import esbuild from 'esbuild';
import paths from '../mconfig.json';
import message from './utils/message.js';
import notification from './notification.js';

export function buildScripts() {
    console.time('JS built in');

    esbuild.build({
        entryPoints: [ paths.scripts.src + paths.scripts.main + '.js' ],
        bundle: true,
        minify: true,
        sourcemap: true,
        color: true,
        logLevel: 'error',
        target: [ 'es2015' ],
        outfile: paths.scripts.dest + paths.scripts.main + '.js'
    }).catch((e) => {
        // errors managments (already done in esbuild)

        notification({
            title: 'Javascript built failed 🚨',
            message: `${e.errors[0].text} in ${e.errors[0].location.file} line ${e.errors[0].location.line}`
        });

    }).then(() => {
        message('Javascript built','success', 'JS built in')
    })
}
