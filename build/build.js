import { concatVendors } from './concat.js';
import { compileScripts } from './scripts.js';
import { compileStyles } from './styles.js' ;
import { compileSVGs } from './svgs.js' ;

concatVendors();
compileScripts();
compileStyles();
compileSVGs();
