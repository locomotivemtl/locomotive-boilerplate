import config from '../config'
import { getImageMetadata } from './image'

/**
 * Load the given font
 *
 * @param {string}      fontName    - The font name
 * @param {string}      fontStyle   - The font style
 * @param {string}      fontWeight  - The font weight
 * @return {function}   Promise
 */

const loadFont = (fontName, fontStyle, fontWeight) => {
    return new Promise(resolve => {

        let loop = null

        const clearLoop = () => {
            if (loop) {
                clearInterval(loop)
                loop = null
            }
        }

        const tryToLoadFont = () => {
            let hasLoaded = false

            try {
                hasLoaded = document.fonts.check(`${fontStyle} ${fontWeight} 16px ${fontName}`)
            } catch (e) {
                console.warn(`CSS font loading API error with ${fontName} ${fontStyle} ${fontWeight}`, e)
                clearLoop()
                resolve()
            }

            if (hasLoaded) {
                console.info(`${fontName} ${fontStyle} ${fontWeight} loaded`)
                clearLoop()
                resolve()
            }
        }

        loop = setInterval(tryToLoadFont, 500)
    })
}


/**
 * Load an array of promises
 *
 * @param {array}       fonts    - An array of objects of all the fonts to load
 *                                 [{ <fontName>, <fontStyle>, <fontWeight> }]
 * @return {function}   Callback
 */

const fontsLoader = async (fonts, callback) => {

    if (!fonts.length) {
        return callback?.()
    }

    const fontFaceObservers = []

    let observer
    fonts.forEach((font) => {
        observer = loadFont(font.name, font.style, font.weight)
        fontFaceObservers.push(observer)
    })

    try {
        await Promise.all(fontFaceObservers)
        callback?.()
    } catch (e) {
        console.warn('Some critical font are not available:', e)
    }
}


/**
 * Load the given stylesheet
 *
 * @param {DOMElement}  $styleSheet - The stylesheet element
 * @return {function}   Promise
 */

const loadStylesheet = $styleSheet => {
    return new Promise(resolve => {

        let loop = null

        const clearLoop = () => {
            if (loop) {
                clearInterval(loop)
                loop = null
            }
        }

        const checkStyleSheetLoading = () => {

            let hasLoaded = false

            try {
                hasLoaded = $styleSheet.isLoaded
            } catch (e) {
                console.warn(`Error with the styleSheet ${$styleSheet}`, e)
                clearLoop()
                resolve()
            }

            if (hasLoaded) {
                console.info('This stylesheet is loaded', $styleSheet)
                clearLoop()
                resolve()
            }
        }

        loop = setInterval(checkStyleSheetLoading, 100)
    })
}


/**
 * Load an array of stylesheets
 *
 * @param {array}       $styleSheets    - An array of DOMElements of all the stylesheets to load
 * @return {function}   Callback
 */

const styleSheetsLoader = async (styleSheets, callback) => {

    if (!styleSheets.length) {
        console.log('Uh oh ! You need to select a <link> element')
        return callback?.()
    }

    const styleSheetObservers = []

    let observer
    let $styleSheet
    styleSheets.forEach(styleSheet => {
        $styleSheet = document.querySelector(styleSheet)

        if(typeof $styleSheet !== undefined) {
            observer = loadStylesheet($styleSheet)
            styleSheetObservers.push(observer)
        }
    })

    try {
        await Promise.all(styleSheetObservers)
        callback?.()
    } catch (e) {
        console.warn('Some critical font are not available:', e)
    }
}


/**
 * Load the given image
 *
 * @param {string}  url         - The URI to lazy load into $el.
 * @param {object}  options     - An object of options
 * @return {void}
 */

const LOADED_IMAGES = []
const loadImage = (url, options = {}) => {
    return new Promise((resolve, reject) => {

        let loadedImage = LOADED_IMAGES.find(image => image.url === url)

        if (loadedImage) {
            resolve({
                ...loadedImage,
                ...options
            })
        } else {
            const $img = new Image()

            if (options.crossOrigin) {
                $img.crossOrigin = options.crossOrigin
            }

            const loadCallback = () => {
                const result = {
                    element: $img,
                    ...getImageMetadata($img),
                    ...options
                }
                LOADED_IMAGES.push(result)
                resolve(result)
            }

            if ($img.decode) {
                $img.src = url
                $img.decode().then(loadCallback).catch(e => {
                    reject(e)
                })
            } else {
                $img.onload = loadCallback
                $img.onerror = (e) => {
                    reject(e)
                }
                $img.src = url
            }
        }

    })
}


/**
 * Lazy load the given image
 *
 * @param {HTMLImageElement} $el      - The image element.
 * @param {?string}          url      - The URI to lazy load into $el.
 *     If falsey, the value of the `data-src` attribute on $el will be used as the URI.
 * @param {?function}        callback - A function to call when the image is loaded.
 */

const LAZY_LOADED_IMAGES = []
const lazyLoadImage = async ($el, url, callback) => {
    let src = url ? url : $el.dataset.src

    let loadedImage = LAZY_LOADED_IMAGES.find(image => image.url === src)

    if (!loadedImage) {
        loadedImage = await loadImage(src)

        if (!loadedImage.url) {
            return
        }

        LAZY_LOADED_IMAGES.push(loadedImage)
    }

    if ($el.src === src) {
        return
    }

    if ($el.tagName === 'IMG') {
        $el.src = loadedImage.url
    } else {
        $el.style.backgroundImage = `url(${loadedImage.url})`
    }

    requestAnimationFrame(() => {
        let lazyParent = $el.closest(config.SELECTORS.IMAGE_LAZY)

        if (lazyParent) {
            lazyParent.classList.add(config.CSS_CLASS.LAZY_LOADED)
            lazyParent.style.backgroundImage = ''
        }

        $el.classList.add(config.CSS_CLASS.LAZY_LOADED)

        callback?.()
    })
}


/**
 * Preload images that contains data-preload attribute
 *
 * @param {?function}        callback - A function to call when all images are loaded.
 */

const preloadImages = (selector = config.SELECTORS.IMAGE_PRELOAD, callback) => {
    const $imagesToLoad = document.querySelectorAll(selector)

    if (!$imagesToLoad.length) {
        callback?.()
        return
    }

    const promises = []

    $imagesToLoad.forEach($image => {
        const url = $image.dataset.src
        const promise = lazyLoadImage($image, url)
        promises.push(promise)
    })

    Promise.all(promises).then(() => {
        callback?.()
    })
}


export {
    loadFont,
    fontsLoader,
    loadStylesheet,
    styleSheetsLoader,
    loadImage,
    lazyLoadImage,
    preloadImages,
}
