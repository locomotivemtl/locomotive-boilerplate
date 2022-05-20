const env = process.env.NODE_ENV

export default config = {

    // App
    APP_NAME: 'Boilerplate',
    DATA_API_KEY: '.data-api';   ,

    // Env
    ENV: env,
    IS_PROD: env === 'production',
    IS_DEV: env === 'development',

    // Classnames
    CLASS: {
        LOADING: 'is-loading',
        READY: 'is-ready',
        LOADED: 'is-loaded'
    }
}
