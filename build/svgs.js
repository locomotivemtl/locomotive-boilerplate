import mixer from 'svg-mixer';
import paths from '../mconfig.json';
import message from './utils/message.js';

export function generateSpriteSVG() {
    console.time('Sprite generated in');

    // Write sprite content on disk
    mixer([
        paths.svgs.src + '*.svg'
    ], {
        spriteConfig: {
            usages: false
        }
    }).then((result) => {
        result.write(paths.svgs.dest + 'sprite.svg');
        message('SVG Sprite generated', 'success', 'Sprite generated in');
    });
}
