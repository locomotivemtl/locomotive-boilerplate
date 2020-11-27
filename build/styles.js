
import sass from 'node-sass';
import paths from '../mconfig.json';
import fs from 'fs';
import message from './utils/message.js';

export function compileStyles() {

    // Compile main scss
    sass.render({
        file: paths.styles.src + paths.styles.main + '.scss',
        outFile: paths.styles.dest + paths.styles.main + '.css',
        outputStyle: 'compressed',
        sourceMap: true
    }, (error, result) => {
        
        if(error) {
            message('Error compile main.scss', 'error');
            console.log(error);
        } else {
            message('main.scss compiled', 'success');
        }

        if(!error){
            // No errors during the compilation, write this result on the disk
            fs.writeFile(paths.styles.dest + paths.styles.main + '.css', result.css, (err) => {});
          }
    });
    // Compile critical scss
    sass.render({
        file: paths.styles.src + paths.styles.critical + '.scss',
        outFile: paths.styles.dest + paths.styles.critical + '.css',
        outputStyle: 'compressed',
        sourceMap: true
    }, (error, result) => {
        
        if(error) {
            message('Error compile critical.scss', 'error');
            console.log(error);
        } else {
            message('critical.scss compiled', 'success');
        }

        if(!error){
            // No errors during the compilation, write this result on the disk
            fs.writeFile(paths.styles.dest + paths.styles.critical + '.css', result.css, (err) => {});
          }
    });
}