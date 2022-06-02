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



export {
    getImageMetadata,
}
