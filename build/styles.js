import sass from 'node-sass';
import paths from '../mconfig.json';
import fs from 'fs';
import message from './utils/message.js';
import notification from './notification.js';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';

export function compileStyles() {
    console.time('Styles built in');

    // Compile main scss
    sass.render({
        file: paths.styles.src + paths.styles.main + '.scss',
        outFile: paths.styles.dest + paths.styles.main + '.css',
        outputStyle: 'compressed',
        sourceMap: true
    }, (error, result) => {
        if (error) {
            message('Error compiling main.scss', 'error');
            console.log(error.formatted);

            notification({
                title: 'main.scss compilation failed 🚨',
                message: `${error.formatted}`
            });
        } else {
            message('Styles built', 'success', 'Styles built in');
        }

        if (!error){
            // No errors during the compilation, write this result on the disk

                fs.readFile(paths.styles.dest + paths.styles.main + '.css', (err, css) => {
                    postcss([autoprefixer])
                        .process(result.css)
                        .then(result => {
                            fs.writeFile(paths.styles.dest + paths.styles.main + '.css', result.css, () => true)
                            if ( result.map ) {
                                fs.writeFile(paths.styles.dest + paths.styles.main + '.css.map', result.map.toString(), () => true)
                            }
                        })
                })
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
        if (error) {
            message('Error compiling critical.scss', 'error');
            console.log(error);
        } else {
            message('Critical style built', 'success', 'Critical style built in');
        }

        if (!error){
            // No errors during the compilation, write this result on the disk

            fs.readFile(paths.styles.dest + paths.styles.critical + '.css', (err, css) => {
                postcss([autoprefixer])
                    .process(result.css)
                    .then(result => {
                    fs.writeFile(paths.styles.dest + paths.styles.critical + '.css', result.css, () => true)
                    if ( result.map ) {
                        fs.writeFile(paths.styles.dest + paths.styles.critical + '.css.map', result.map.toString(), () => true)
                    }
                })
            })

        }
    });
}
