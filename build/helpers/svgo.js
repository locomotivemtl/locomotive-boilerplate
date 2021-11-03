/**
 * @file If available, returns the SVGO API.
 */

let createContentItem, extendDefaultPlugins, loadConfig, optimize;

try {
    let svgo = await import('svgo');

    ({
        createContentItem,
        extendDefaultPlugins,
        loadConfig,
        optimize
    } = svgo.default);
} catch (err) {
    // do nothing
}

export default optimize;
export {
    createContentItem,
    extendDefaultPlugins,
    loadConfig,
    optimize
};
