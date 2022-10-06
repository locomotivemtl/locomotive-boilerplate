import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { html } from './utils/environment';
import config from './config'
import { isFontLoadingAPIAvailable, loadFonts } from './utils/fonts';

// Dynamic imports for development mode only
let gridHelper;
(async () => {
    if (config.IS_DEV) {
        const gridHelperModule = await import('./utils/grid-helper');
        gridHelper = gridHelperModule?.gridHelper;
    }
})();

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

export const EAGER_FONTS = [
    { family: 'Source Sans', style: 'normal', weight: 400 },
    { family: 'Source Sans', style: 'normal', weight: 700 },
];

function init() {
    globals();

    app.init(app);

    html.classList.add('is-loaded');
    html.classList.add('is-ready');
    html.classList.remove('is-loading');

    gridHelper?.();
}
