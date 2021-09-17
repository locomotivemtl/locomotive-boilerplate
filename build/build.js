import { concatVendors } from './tasks/concat.js';
import { compileScripts } from './tasks/scripts.js';
import { compileStyles } from './tasks/styles.js' ;
import { compileSVGs } from './tasks/svgs.js' ;

concatVendors();
compileScripts();
compileStyles();
compileSVGs();
