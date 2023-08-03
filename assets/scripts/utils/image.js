import { CSS_CLASS } from '../config'
import { queryClosestParent } from './html'

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
        const $img = new Image()

        if (options.crossOrigin) {
            $img.crossOrigin = options.crossOrigin
        }

        const loadCallback = () => {
            resolve({
                element: $img,
                ...getImageMetadata($img),
            })
        }

        if($img.decode) {
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
    })
}


/**
 * Lazy load the given image.
 *
 * @param {HTMLImageElement}    $el      - The image element.
 * @param {?string}             url      - The URI to lazy load into $el.
 *     If falsey, the value of the `data-src` attribute on $el will be used as the URI.
 * @param {?function}           callback - A function to call when the image is loaded.
 * @return {void}
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

    if($el.src === src) {
        return
    }

    if ($el.tagName === 'IMG') {
        $el.src = loadedImage.url
    } else {
        $el.style.backgroundImage = `url(${loadedImage.url})`
    }

    requestAnimationFrame(() => {
        let lazyParent = $el.closest(`.${CSS_CLASS.IMAGE}`)

        if(lazyParent) {
            lazyParent.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED)
            lazyParent.style.backgroundImage = ''
        }

        $el.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED)

        callback?.()
    })
}

/**
 * Lazyload Callbacks
 *
 */
const lazyImageLoad = (e) => {
    const $img = e.currentTarget;
    const $parent = queryClosestParent($img, `.${CSS_CLASS.IMAGE}`);

    requestAnimationFrame(() => {
        if ($parent) {
            $parent.classList.remove(CSS_CLASS.IMAGE_LAZY_LOADING);
            $parent.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
        }

        $img.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
    });
};

const lazyImageError = (e) => {
    const $img = e.currentTarget;
    const $parent = queryClosestParent($img, `.${CSS_CLASS.IMAGE}`);

    requestAnimationFrame(() => {
        if ($parent) {
            $parent.classList.remove(CSS_CLASS.IMAGE_LAZY_LOADING);
            $parent.classList.add(CSS_CLASS.IMAGE_LAZY_ERROR);
        }
    });
};

/* Trigger Lazyload Callbacks */
const triggerLazyloadCallbacks = ($lazyImagesArgs) => {
    const $lazyImages = $lazyImagesArgs
        ? $lazyImagesArgs
        : document.querySelectorAll('[loading="lazy"]');

    if ("loading" in HTMLImageElement.prototype) {
        for (const $img of $lazyImages) {
            const $parent = queryClosestParent(
                $img,
                `.${CSS_CLASS.IMAGE}`
            );


            if (!$img.complete) {
                if($parent) {
                    $parent.classList.add(
                        CSS_CLASS.IMAGE_LAZY_LOADING
                    );
                }

                $img.addEventListener("load", lazyImageLoad, { once: true });
                $img.addEventListener("error", lazyImageError, { once: true });
            } else {
                if (!$img.complete) {
                    $parent.classList.add(
                        CSS_CLASS.IMAGE_LAZY_LOADED
                    );
                }
            }
        }
    } else {
        // if 'loading' supported
        for (const $img of $lazyImages) {
            const $parent = queryClosestParent(
                $img,
                `.${CSS_CLASS.IMAGE}`
            );

            if($parent) {
                $parent.classList.add(CSS_CLASS.IMAGE_LAZY_LOADED);
            }
        }
    }
};

/* Reset Lazyload Callbacks */
const resetLazyloadCallbacks = () => {
    if ("loading" in HTMLImageElement.prototype) {
        const $lazyImages = document.querySelectorAll('[loading="lazy"]');
        for (const $img of $lazyImages) {
            $img.removeEventListener("load", lazyImageLoad, { once: true });
            $img.removeEventListener("error", lazyImageError, { once: true });
        }
    }
};


export {
    getImageMetadata,
    loadImage,
    lazyLoadImage,
    triggerLazyloadCallbacks,
    resetLazyloadCallbacks
}
