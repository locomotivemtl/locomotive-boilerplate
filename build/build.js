import { buildScripts } from './scripts.js';
import { concatVendors } from './concat.js';
import { compileStyles } from './styles.js' ;
import { generateSpriteSVG } from './svgs.js' ;

buildScripts();
concatVendors();
compileStyles();
generateSpriteSVG();
