import esbuild from 'esbuild';
import paths from '../mconfig.json';
import message from './utils/message.js';

export function buildScripts() {
    message('Compiling JS...', 'waiting');

    esbuild.buildSync({
        entryPoints: [paths.scripts.src + paths.scripts.main + '.js'],
        bundle: true,
        minify: true,
        sourcemap: true,
        target: ['es2015'],
        outfile: paths.scripts.dest + paths.scripts.main + '.js'
    });
}
