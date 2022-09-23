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
 * Watches for the given font faces and triggers a custom event `fontsloaded`
 * when all font faces are loaded.
 *
 * @param {FontFaceReference[]} fonts - List of fonts to watch
 * @param {boolean}             debug - Log details to the console.
 *
 * @return {Promise}
 */
 export function watchFontFaces(fonts = null, debug = false) {
    return new Promise((resolve) => {
        const onReady = () => {
            const fontsLoadedEvent = new CustomEvent('fontsloaded');
            window.dispatchEvent(fontsLoadedEvent);
            window.isFontsLoaded = true;
            resolve();
        }
        
        if (!fonts) {
            document.fonts.ready.then(() => {
                onReady();
            })
        } else {
            const checkFonts = () => {
                let isAllLoaded = true;
    
                for (const font of fonts) {
                    if (!font.isLoaded) {
                        font.isLoaded = document.fonts.check(
                            `${font.weight} ${font.style} 16px ${font.fontFamily}`
                        );
                        if (!font.isLoaded) {
                            isAllLoaded = false;
                        } else {
                            debug && console.log(`[WatchFontFaces]', '${font.fontFamily} is loaded`);
                        }
                    }
                }
                if (!isAllLoaded) {
                    window.requestAnimationFrame(checkFonts);
                } else {
                    debug && console.log('[WatchFontFaces]', 'All fonts loaded');
    
                    requestAnimationFrame(() => {
                        onReady();
                    });
                }
            };
            window.requestAnimationFrame(checkFonts);
        }
    });
}
