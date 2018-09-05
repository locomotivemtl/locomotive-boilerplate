import gulp from 'gulp';
import styles from './build/styles.js';
import scripts from './build/scripts.js';
import concat from './build/concat.js';
import svgs from './build/svgs.js';
import serve from './build/serve.js';
import watch from './build/watch.js';
import { buildStyles, buildScripts } from './build/build.js';

const compile = gulp.series(styles, scripts, svgs, concat);
const main = gulp.series(compile, serve, watch);
const build = gulp.series(compile, buildStyles, buildScripts);

gulp.task('default', main);
gulp.task('compile', compile);
gulp.task('build', build);
