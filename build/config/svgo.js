/**
 * @file Provides a custom configuration to optimize (but not minimize)
 * individual SVG files.
 *
 * This configset will not work, as is, with spritesheets.
 * You will need to remove the following plugins:
 *
 * - `cleanupIds`
 * - `removeHiddenElems`
 */

export default {
    multipass: true,
    js2svg: {
        indent: 4,
        pretty: true,
    },
    plugins: [
        'cleanupAttrs',
        'cleanupEnableBackground',
        'cleanupIds',
        'cleanupListOfValues',
        'cleanupNumericValues',
        'collapseGroups',
        'convertColors',
        'convertEllipseToCircle',
        'convertPathData',
        'convertShapeToPath',
        'convertStyleToAttrs',
        'convertTransform',
        'inlineStyles',
        'mergePaths',
        'mergeStyles',
        'minifyStyles',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'removeComments',
        'removeDesc',
        'removeDimensions',
        'removeDoctype',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeEmptyContainers',
        'removeEmptyText',
        'removeHiddenElems',
        'removeMetadata',
        'removeNonInheritableGroupAttrs',
        'removeRasterImages',
        'removeScriptElement',
        'removeStyleElement',
        'removeTitle',
        'removeUnknownsAndDefaults',
        'removeUnusedNS',
        'removeUselessDefs',
        'removeUselessStrokeAndFill',
        'removeViewBox',
        // 'removeXMLNS',
        // 'removeXMLProcInst',
        // 'reusePaths',
        // 'sortAttrs',
        'sortDefsChildren',
    ],
};
