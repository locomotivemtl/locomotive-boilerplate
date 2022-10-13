/**
 * @file If available, returns the PostCSS Processor creator and
 * any the Autoprefixer PostCSS plugin.
 */

/**
 * @typedef {import('autoprefixer').autoprefixer.Options} AutoprefixerOptions
 */

/**
 * @typedef {import('postcss').AcceptedPlugin} AcceptedPlugin
 */

/**
 * @typedef {import('postcss').ProcessOptions} ProcessOptions
 */

/**
 * @typedef {import('postcss').Processor} Processor
 */

/**
 * @typedef {AcceptedPlugin[]} PluginList
 */

/**
 * @typedef {object<string, AcceptedPlugin>} PluginMap
 */

/**
 * @typedef {PluginList|PluginMap} PluginCollection
 */

/**
 * @typedef {object} PostCSSOptions
 *
 * @property {ProcessOptions}      processor    - The `Processor#process()` options.
 * @property {AutoprefixerOptions} autoprefixer - The `autoprefixer()` options.
 */

let postcss, autoprefixer;

try {
    postcss = await import('postcss');
    postcss = postcss.default;

    autoprefixer = await import('autoprefixer');
    autoprefixer = autoprefixer.default;
} catch (err) {
    // do nothing
}

const supportsPostCSS = (typeof postcss === 'function');

const pluginsList = [
    autoprefixer,
];
const pluginsMap = {
    'autoprefixer': autoprefixer,
};

/**
 * Attempts to create a PostCSS Processor with the given plugins and options.
 *
 * @param  {PluginCollection} pluginsListOrMap - A list or map of plugins.
 *     If a map of plugins, the plugin name looks up `options`.
 * @param  {PostCSSOptions}   options - The PostCSS wrapper options.
 * @return {?Processor}
 */
function createProcessor(pluginsListOrMap, options)
{
    if (!postcss) {
        return null;
    }

    const plugins = parsePlugins(pluginsListOrMap, options);

    return postcss(plugins);
}

/**
 * Parses the PostCSS plugins and options.
 *
 * @param  {PluginCollection} pluginsListOrMap - A list or map of plugins.
 *     If a map of plugins, the plugin name looks up `options`.
 * @param  {PostCSSOptions}   options - The PostCSS wrapper options.
 * @return {PluginList}
 */
function parsePlugins(pluginsListOrMap, options)
{
    if (Array.isArray(pluginsListOrMap)) {
        return pluginsListOrMap;
    }

    /** @type {PluginList} */
    const plugins = [];

    for (let [ name, plugin ] of Object.entries(pluginsListOrMap)) {
        if (name in options) {
            plugin = plugin[name](options[name]);
        }

        plugins.push(plugin);
    }

    return plugins;
}

export default postcss;

export {
    autoprefixer,
    createProcessor,
    parsePlugins,
    pluginsList,
    pluginsMap,
    postcss,
    supportsPostCSS,
};
