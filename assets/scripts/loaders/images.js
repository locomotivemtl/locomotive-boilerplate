const LAZY_LOADED_IMAGES = []
const LOADED_IMAGES = []

/**
 * Get an image meta data
 *
 * @param {HTMLImageElement}    $img   - The image element.
 * @return {object}             The given image meta data
 */

const getImageMetadata = $img => ({
    url: $img.src,
    width: $img.naturalWidth,
    height: $img.naturalHeight,
    ratio: $img.naturalWidth / $img.naturalHeight,
})

/**
 * Load the given image.
 *
 * @param {string}  url         - The URI to lazy load into $el.
 * @param {object}  options     - An object of options
 * @return {void}
 */

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
 * Lazy load the given image.
 *
 * @param {HTMLImageElement} $el      - The image element.
 * @param {?string}          url      - The URI to lazy load into $el.
 *     If falsey, the value of the `data-src` attribute on $el will be used as the URI.
 * @param {?function}        callback - A function to call when the image is loaded.
 */

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
        let lazyParent = $el.closest('.c-lazy')

        if (lazyParent) {
            lazyParent.classList.add('-lazy-loaded')
            lazyParent.style.backgroundImage = ''
        }

        $el.classList.add('-lazy-loaded')

        callback?.()
    })
}

/**
 * Preload images that contains data-preload attribute.
 *
 * @param {?function}        callback - A function to call when all images are loaded.
 */

const preloadImages = callback => {
    const $imagesToLoad = document.querySelectorAll('img[data-preload]')

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
    getImageMetadata,
    loadImage,
    lazyLoadImage,
    preloadImages
}
