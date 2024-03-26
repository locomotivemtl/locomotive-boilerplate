import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { debounce } from './utils/tickers';
import { $html } from './utils/dom';
import { ENV, FONT, CUSTOM_EVENT, CSS_CLASS } from './config'
import { isFontLoadingAPIAvailable, loadFonts } from './utils/fonts';

const app = new modular({
    modules,
});

function init() {
    bindEvents();
    globals();
    setViewportSizes();

    app.init(app);

    $html.classList.add(CSS_CLASS.LOADED, CSS_CLASS.READY);
    $html.classList.remove(CSS_CLASS.LOADING);

    /**
     * Debug focus
     */
    // document.addEventListener(
    //     "focusin",
    //     function () {
    //         console.log('focused: ', document.activeElement)
    //     }, true
    // );

    /**
     * Eagerly load the following fonts.
     */
    if (isFontLoadingAPIAvailable) {
        loadFonts(FONT.EAGER, ENV.IS_DEV).then((eagerFonts) => {
            $html.classList.add(CSS_CLASS.FONTS_LOADED);

            /**
             * Debug fonts loading
             */
            // if (ENV.IS_DEV) {
            //     console.group('Eager fonts loaded!', eagerFonts.length, '/', document.fonts.size);
            //     console.group('State of eager fonts:');
            //     eagerFonts.forEach(font => console.log(font.family, font.style, font.weight, font.status));
            //     console.groupEnd();
            //     console.group('State of all fonts:');
            //     document.fonts.forEach(font => console.log(font.family, font.style, font.weight, font.status));
            //     console.groupEnd();
            // }
        });
    }
}

////////////////
// Global events
////////////////
function bindEvents() {

    // Resize event
    const resizeEndEvent = new CustomEvent(CUSTOM_EVENT.RESIZE_END)
    window.addEventListener(
        "resize",
        debounce(() => {
            window.dispatchEvent(resizeEndEvent)
        }, 200, false)
    )
    window.addEventListener(
        "resize",
        onResize
    )
}

function onResize() {
    setViewportSizes()
}

function setViewportSizes() {

    // Document styles
    const documentStyles = document.documentElement.style;

    // Viewport width
    const vw = document.body.clientWidth * 0.01;
    documentStyles.setProperty('--vw', `${vw}px`);

    // Return if browser supports vh, svh, dvh, & lvh
    if (ENV.SUPPORTS_VH) {
        return
    }

    // Viewport height
    const svh = document.documentElement.clientHeight * 0.01;
    documentStyles.setProperty('--svh', `${svh}px`);

    const dvh = window.innerHeight * 0.01;
    documentStyles.setProperty('--dvh', `${dvh}px`);

    if (document.body) {
        const fixed = document.createElement('div');
        fixed.style.width = '1px';
        fixed.style.height = '100vh';
        fixed.style.position = 'fixed';
        fixed.style.left = '0';
        fixed.style.top = '0';
        fixed.style.bottom = '0';
        fixed.style.visibility = 'hidden';

        document.body.appendChild(fixed);

        var fixedHeight = fixed.clientHeight;

        fixed.remove();

        const lvh = fixedHeight * 0.01;

        documentStyles.setProperty('--lvh', `${lvh}px`);
    }
}

////////////////
// Execute
////////////////
window.addEventListener('load', () => {
    const $style = document.getElementById('main-css');

    if ($style) {
        if ($style.isLoaded) {
            init();
        } else {
            $style.addEventListener('load', init);
        }
    } else {
        console.warn('The "main-css" stylesheet not found');
    }
});
