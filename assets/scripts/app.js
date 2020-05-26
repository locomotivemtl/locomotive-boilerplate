import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';

const app = new modular({
    modules: modules
});

window.onload = (event) => {
    const $style = document.getElementById("stylesheet");

    if ($style.isLoaded) {
        init();
    } else {
        $style.addEventListener('load', (event) => {
            init();
        });
    }
};

function init() {
    app.init(app);
    globals();

    html.classList.add('is-loaded', 'is-ready');
    html.classList.remove('is-loading');
}

