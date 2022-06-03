import modular from 'modujs'
import * as modules from './modules'
import globals from './globals'
import { fontsLoader, preloadImages, styleSheetsLoader } from './utils/loaders'
import { html } from './utils/environment'
import config from './config'

class App {
    constructor() {
        console.log(`${this.constructor.name}:constructor`)

        this.options = Object.freeze({
            fonts: [
                // { name: '<font-name>', style: '<font-style>', weight: '<font-weight>' }
            ],
            preloadImage: [
                config.SELECTORS.IMAGE_PRELOAD
            ],
            styleSheets: [
                config.SELECTORS.MAIN_STYLESHEET
            ]
        })

        // Create app
        this.moduleManager = new modular({
            modules: modules
        })

        // this.addCustomEvents()

        this.setInitialVars()
    }

    load() {
        console.log(`${this.constructor.name}:load`)

        // Font load
        const fontLoad = new Promise(resolve => {
            fontsLoader(this.options.fonts, () => {
                html.classList.add(config.CSS_CLASS.FONTS_LOADED)
                resolve()
            })
        })

        // Image preload
        const imagePreload = new Promise(resolve => {
            preloadImages(this.options.preloadImage, () => {
                html.classList.add(config.CSS_CLASS.IMAGES_PRELOADED)
                resolve()
            })
        })

        // Stylesheets load
        const styleSheetLoad = new Promise(resolve => styleSheetsLoader(this.options.styleSheets, () => resolve()))

        Promise.all([
            fontLoad,
            imagePreload,
            styleSheetLoad,
        ]).then(() => {
            this.init()
        }).catch(e => {
            console.log(e)
        })
    }

    init() {
        console.log(`${this.constructor.name}:init`)

        // Init globals
        globals()

        // Init modular app
        this.moduleManager.init(this.moduleManager)

        // Update classes
        html.classList.add(config.CSS_CLASS.LOADED)
        html.classList.add(config.CSS_CLASS.READY)
        html.classList.remove(config.CSS_CLASS.LOADING)
    }

    addCustomEvents() {
        console.log(`${this.constructor.name}:addCustomEvents`)
    }

    /*
     * Set initial variables.
     */

    setInitialVars() {

        /**
         * Store the initial viewport height in a CSS property.
         *
         * @see {@link https://css-tricks.com/the-trick-to-viewport-units-on-mobile/}
         *     This can be applied to elements, instead of using the `vh` unit,
         *     for consistent and correct sizing on mobile browsers.
         *
         * @see {@link https://caniuse.com/viewport-unit-variants}
         *     This trick should be replaced with viewport-relative units
         *     once browser support has improved.
         */

        html.style.setProperty('--vh-initial', `${0.01 * html.clientHeight}px`)
    }
}

const app = new App()
window.addEventListener('load', () => app.load(), { once: true })
