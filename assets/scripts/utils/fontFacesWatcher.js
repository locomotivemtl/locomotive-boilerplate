/**
 * Watch font faces used in our website and trigger a custom event `fontsLoaded` when all font faces are loaded.
 *
 *  @param {Object[]} fonts - List of fonts to watch
 *  @param {string} fonts[].fontFamily - The family name used is our CSS to identify the font.
 *  @param {string} fonts[].style - The family style used is our CSS by the font.
 *  @param {string} fonts[].weight - The family weight used is our CSS by the font.
 *  @param {boolean} isDebug - Allow console.log inside the function.
 *
 *  @return {Promise} Promise that helps us execute code when all font faces are loaded.
 */
export function fontFacesWatcher(fonts, isDebug = false) {
    return new Promise((resolve) => {
        const checkFonts = () => {
            let isAllLoaded = true;
            let index = 0;
            while (index < fonts.length) {
                const font = fonts[index];
                if (!font.isLoaded) {
                    font.isLoaded = document.fonts.check(
                        `${font.weight} ${font.style} 16px ${font.fontFamily}`
                    );
                    if (!font.isLoaded) {
                        isAllLoaded = false;
                    } else {
                        isDebug && console.log(`${font.fontFamily} is loaded`);
                    }
                }
                index++;
            }
            if (!isAllLoaded) {
                window.requestAnimationFrame(checkFonts);
            } else {
                isDebug && console.log("All fonts loaded");

                requestAnimationFrame(() => {
                    const fontsLoadedEvent = new CustomEvent("fontsLoaded");
                    window.dispatchEvent(fontsLoadedEvent);
                    window.isFontsLoaded = true;
                    resolve();
                });
            }
        };
        window.requestAnimationFrame(checkFonts);
    });
}
