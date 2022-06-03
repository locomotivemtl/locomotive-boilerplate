const env = process.env.NODE_ENV

export default config = Object.freeze({
    // Environments
    ENV: env,
    IS_PROD: env === 'production',
    IS_DEV: env === 'development',

    // CSS class names
    CSS_CLASS: {
        LOADING: 'is-loading',
        READY: 'is-ready',
        LOADED: 'is-loaded',
        FONTS_LOADED: 'has-fonts-loaded',
        IMAGES_PRELOADED: 'has-images-preloaded',
        LAZY_LOADED: 'is-lazy-loaded',
    },

    // JS selectors
    SELECTORS: {
        IMAGE_LAZY: '.c-lazy',
        IMAGE_PRELOAD: 'img[data-preload]',
        MAIN_STYLESHEET: '#main-css'
    }
})
