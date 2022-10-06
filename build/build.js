import concatFiles from './tasks/concats.js';
import compileScripts from './tasks/scripts.js';
import compileStyles from './tasks/styles.js';
import compileSVGs from './tasks/svgs.js';
import bumpVersion from './tasks/versions.js';

concatFiles();
compileScripts();
compileStyles();
compileSVGs();
bumpVersion();
