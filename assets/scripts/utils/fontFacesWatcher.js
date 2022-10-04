/**
 * Font Faces Watcher
 *
 * Utility for detecting when specific font faces are loaded
 * and dispatching a custom event.
 */

/**
 * @typedef {Object} FontFaceReference
 *
 * @property {string} family - The name used to identify the font in our CSS.
 * @property {string} style  - The style used by the font in our CSS.
 * @property {string} weight - The weight used by the font in our CSS.
 */

/**
 * Watches for the given font faces and triggers a custom event `fontsLoaded`
 * when all font faces are loaded.
 *
 * @param {FontFaceReference[]|null} [fonts] - List of fonts to watch
 *     or NULL to watch for all fonts.
 * @param {boolean}                  [debug] - If TRUE, log details to the console.
 *
 * @return {Promise}
 */
 export function watchFontFaces(fonts = null, debug = false) {
    return new Promise((resolve) => {
        const onReady = () => {
            const fontsLoadedEvent = new CustomEvent('fontsLoaded');
            window.dispatchEvent(fontsLoadedEvent);
            window.isFontsLoaded = true;
            resolve();
        }
        
        if (!fonts) {
            document.fonts.ready.then(() => onReady());
            return;
        }

        const fontsToLoad = [...fonts];

        for (const font of fontsToLoad) {
            const $element = document.createElement("span");
            $element.textContent = NBSP;
            $element.ariaHidden = true;
            $element.classList.add('u-screen-reader-text');
            $element.style.fontFamily = font.family;
            $element.style.fontStyle = font.style;
            $element.style.fontWeight = font.weight;
            document.body.appendChild($element);
        }

        const checkFonts = () => {
            for (const [index, font] of fontsToLoad.entries()) {

                const isFontLoaded = document.fonts.check(
                    `${font.style} ${font.weight} 16px ${font.family}`
                );

                if (isFontLoaded) {
                    fontsToLoad.splice(index, 1);
                    debug && console.log(
                        '[watchFontFaces]', `${font.family} is loaded`
                    );
                }
            }

            if (fontsToLoad.length) {
                window.requestAnimationFrame(checkFonts);
            } else {
                debug && console.log('[watchFontFaces]', 'All fonts loaded');
                window.requestAnimationFrame(() => onReady());
            }
        };

        window.requestAnimationFrame(checkFonts);
    });
}
