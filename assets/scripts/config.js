/**
 * > When using the esBuild API, all `process.env.NODE_ENV` expressions
 * > are automatically defined to `"production"` if all minification
 * > options are enabled and `"development"` otherwise. This only happens
 * > if `process`, `process.env`, and `process.env.NODE_ENV` are not already
 * > defined. This substitution is necessary to avoid code crashing instantly
 * > (since `process` is a Node API, not a web API).
 * > — https://esbuild.github.io/api/#platform
 */

const NODE_ENV = process.env.NODE_ENV
const IS_MOBILE = window.matchMedia('(any-pointer:coarse)').matches

// Main environment variables
const ENV = Object.freeze({
    // Node environment
    NAME: NODE_ENV,
    IS_PROD: NODE_ENV === 'production',
    IS_DEV: NODE_ENV === 'development',

    // Device
    IS_MOBILE,
    IS_DESKTOP: !IS_MOBILE,

    // Supports
    SUPPORTS_VH: (
        'CSS' in window
        && 'supports' in window.CSS
        && window.CSS.supports('height: 100svh')
        && window.CSS.supports('height: 100dvh')
        && window.CSS.supports('height: 100lvh')
    )
})

// Main CSS classes used within the project
const CSS_CLASS = Object.freeze({
    LOADING: 'is-loading',
    LOADED: 'is-loaded',
    READY: 'is-ready',
    FONTS_LOADED: 'fonts-loaded',
    LAZY_CONTAINER: 'c-lazy',
    LAZY_LOADED: '-lazy-loaded',
    // ...
})

// Custom js events
const CUSTOM_EVENT = Object.freeze({
    RESIZE_END: 'loco.resizeEnd',
    // ...
})

// Fonts parameters
const FONT = Object.freeze({
    EAGER: [
        { family: 'Source Sans', style: 'normal', weight: 400 },
        { family: 'Source Sans', style: 'normal', weight: 700 },
    ],
})

export {
    ENV,
    CSS_CLASS,
    CUSTOM_EVENT,
    FONT,
}
