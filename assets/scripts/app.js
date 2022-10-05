import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';
import config from './config'
import { isFontLoadingAPIAvailable, loadFonts } from './utils/fonts';

const app = new modular({
    modules: modules
});

window.onload = (event) => {
    const $style = document.getElementById('main-css');

    if ($style) {
        if ($style.isLoaded) {
            init();
        } else {
            $style.addEventListener('load', (event) => {
                init();
            });
        }
    } else {
        console.warn('The "main-css" stylesheet not found');
    }
};

export const EAGER_FONTS = [
    { family: 'Source Sans', style: 'normal', weight: 400 },
    { family: 'Source Sans', style: 'normal', weight: 700 },
];

function init() {
    globals();

    app.init(app);

    html.classList.add(config.CSS_CLASS.LOADED);
    html.classList.add(config.CSS_CLASS.READY);
    html.classList.remove(config.CSS_CLASS.LOADING);

    /**
     * Eagerly load the following fonts.
     */
    if (isFontLoadingAPIAvailable) {
        loadFonts(EAGER_FONTS).then((eagerFonts) => {
            html.classList.add('fonts-loaded');
            // console.group('Eager fonts loaded!', eagerFonts.length, '/', document.fonts.size);
            // console.group('State of eager fonts:')
            // eagerFonts.forEach((font) => console.log(font.family, font.style, font.weight, font.status/*, font*/))
            // console.groupEnd()
            // console.group('State of all fonts:')
            // document.fonts.forEach((font) => console.log(font.family, font.style, font.weight, font.status/*, font*/))
            // console.groupEnd()
        });
    }
}

