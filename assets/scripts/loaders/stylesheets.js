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
                hasLoaded = $styleSheet.getAttribute('data-is-loaded') == 'true'
            } catch (e) {
                console.info(`Error with the styleSheet ${$styleSheet}`, e)
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


const styleSheetsLoader = async ($styleSheets, callback) => {

    if (!$styleSheets.length) {
        console.log('Uh oh ! You need to select a <link> element')
        return
    }

    const styleSheetObservers = []

    let observer
    $styleSheets.forEach($styleSheet => {
        observer = loadStylesheet($styleSheet)
        styleSheetObservers.push(observer)
    })

    try {
        await Promise.all(styleSheetObservers)
        callback?.()
    } catch (e) {
        console.warn('Some critical font are not available:', e)
    }
}


export {
    loadStylesheet,
    styleSheetsLoader
}
