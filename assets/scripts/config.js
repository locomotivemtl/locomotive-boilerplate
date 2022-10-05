/**
 * > When using the esBuild API, all `process.env.NODE_ENV` expressions
 * > are automatically defined to `"production"` if all minification
 * > options are enabled and `"development"` otherwise. This only happens
 * > if `process`, `process.env`, and `process.env.NODE_ENV` are not already
 * > defined. This substitution is necessary to avoid code crashing instantly
 * > (since `process` is a Node API, not a web API).
 * > — https://esbuild.github.io/api/#platform
 */
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
    },
})
