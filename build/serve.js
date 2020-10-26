import browserSync from 'browser-sync';
import paths from '../mconfig.json';

export const server = browserSync.create();

function serve(done) {
    server.init({
        notify: false,
        proxy: paths.url,
        host: paths.url,
        open: false,
        ghostMode: false
    });
    done();
}

export default serve;
