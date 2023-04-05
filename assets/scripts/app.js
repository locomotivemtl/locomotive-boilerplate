import modular from 'modujs';
import * as modules from './modules';
import globals from './globals';
import { debounce } from './utils/tickers'
import { $html } from './utils/dom';
import { ENV, FONT, CUSTOM_EVENT, CSS_CLASS } from './config'
import { isFontLoadingAPIAvailable, loadFonts } from './utils/fonts';

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

    $html.classList.add(CSS_CLASS.LOADED);
    $html.classList.add(CSS_CLASS.READY);
    $html.classList.remove(CSS_CLASS.LOADING);

    // Bind window resize event with default vars
    const resizeEndEvent = new CustomEvent(CUSTOM_EVENT.RESIZE_END)
    window.addEventListener('resize', () => {
        $html.style.setProperty('--vw', `${document.documentElement.clientWidth * 0.01}px`)
        debounce(() => {
            window.dispatchEvent(resizeEndEvent)
        }, 200, false)
    })

    /**
     * Eagerly load the following fonts.
     */
    if (isFontLoadingAPIAvailable) {
        loadFonts(FONT.EAGER_FONTS, ENV.IS_DEV).then((eagerFonts) => {
            $html.classList.add(CSS_CLASS.FONTS_LOADED);

            if (ENV.IS_DEV) {
                console.group('Eager fonts loaded!', eagerFonts.length, '/', document.fonts.size);
                console.group('State of eager fonts:')
                eagerFonts.forEach((font) => console.log(font.family, font.style, font.weight, font.status/*, font*/))
                console.groupEnd()
                console.group('State of all fonts:')
                document.fonts.forEach((font) => console.log(font.family, font.style, font.weight, font.status/*, font*/))
                console.groupEnd()
            }
        });
    }
}
