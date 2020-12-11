
import sass from 'node-sass';
import paths from '../mconfig.json';
import fs from 'fs';
import message from './utils/message.js';

export function compileStyles() {
    console.time('Styles built in');

    // Compile main scss
    sass.render({
        file: paths.styles.src + paths.styles.main + '.scss',
        outFile: paths.styles.dest + paths.styles.main + '.css',
        outputStyle: 'compressed',
        sourceMap: true
    }, (error, result) => {

        if(error) {
            message('Error compiling main.scss', 'error');
            console.log(error);
        } else {
            message('Styles built', 'success', 'Styles built in');
        }

        if(!error){
            // No errors during the compilation, write this result on the disk
            fs.writeFile(paths.styles.dest + paths.styles.main + '.css', result.css, (err) => {});
          }
    });

    console.time('Critical style built in');

    // Compile critical scss
    sass.render({
        file: paths.styles.src + paths.styles.critical + '.scss',
        outFile: paths.styles.dest + paths.styles.critical + '.css',
        outputStyle: 'compressed',
        sourceMap: true
    }, (error, result) => {

        if(error) {
            message('Error compiling critical.scss', 'error');
            console.log(error);
        } else {
            message('Critical style built', 'success', 'Critical style built in');
        }

        if(!error){
            // No errors during the compilation, write this result on the disk
            fs.writeFile(paths.styles.dest + paths.styles.critical + '.css', result.css, (err) => {});
          }
    });
}
