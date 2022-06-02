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
                console.info(`CSS font loading API error with ${fontName} ${fontStyle} ${fontWeight}`, e)
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

const fontsLoader = async (fonts, callback) => {

    if (!fonts.length) {
        return
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


export {
    loadFont,
    fontsLoader
}
