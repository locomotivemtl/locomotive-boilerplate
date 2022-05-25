import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { $html } from './utils/dom';
import config from './config';

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

function init() {
    globals();

    app.init(app);

    $html.classList.add(config.CSS_CLASS.LOADED);
    $html.classList.add(config.CSS_CLASS.READY);
    $html.classList.remove(config.CSS_CLASS.LOADING);
}

