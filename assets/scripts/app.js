import modular from 'modujs'
import * as modules from './modules'
import globals from './globals'
import { fontsLoader, preloadImages, styleSheetsLoader } from './utils/loaders'
import { html } from './utils/environment'
import config from './config'

class App {
    constructor() {
        console.log(`${this.constructor.name}:constructor`)

        this.options = {
            fonts: [
                // { name: '<font-name>', style: '<font-style>', weight: '<font-weight>' }
            ],
            preloadImage: [
                'img[data-preload]'
            ],
            styleSheets: [
                '#main-css'
            ]
        }

        // Create app
        this.moduleManager = new modular({
            modules: modules
        })

        // this.addCustomEvents()

        this.setVars()
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
     * Set initial vars
     *
     * `--vh-initial` is necessary for mobile vh unit
     */
    setVars() {
        html.style.setProperty('--vh-initial', `${0.01 * html.clientHeight}px`)
    }
}

const app = new App()
window.addEventListener('load', app.load)
