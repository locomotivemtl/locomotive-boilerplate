import { module } from 'modujs';

export default class extends module {
    constructor(m) {
        super(m)

        // Binding
        this.onFontsLoadedBind = this.onFontsLoaded.bind(this)

    }

    ///////////////
    // Lifecyle
    ///////////////
    init() {
        this.bindEvents()

        if (window.isFontsLoaded) {
            this.onFontsLoaded()
        }
    }

    destroy() {
        super.destroy()
        this.unbindEvents()
    }

    ///////////////
    // Events
    ///////////////
    bindEvents() {
        window.addEventListener('fontsLoaded', this.onFontsLoadedBind, {
            once: true
        })
    }

    unbindEvents() {
        window.removeEventListener('fontsLoaded', this.onFontsLoadedBind)
    }

    ///////////////
    // Callbacks
    ///////////////
    onFontsLoaded() {
    }
}