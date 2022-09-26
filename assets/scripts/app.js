import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';
import { watchFontFaces } from './utils/fontFacesWatcher';

const app = new modular({
    modules: modules,
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

function init() {
    globals();

    app.init(app);

    html.classList.add('is-loaded');
    html.classList.add('is-ready');
    html.classList.remove('is-loading');

    watchFontFaces([
        { family: 'Webfont', style: 'normal', weight: 400 },
    ], true).then(() => {
        html.classList.add('fonts-loaded');
    });
}
