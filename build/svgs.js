import mixer from 'svg-mixer';
import paths from '../mconfig.json';
import message from './utils/message.js';

export function generateSpriteSVG() {
    // Write sprite content on disk
    mixer([paths.svgs.src + '*.svg'], {spriteConfig: { usages: false }})
    .then((result) => {
        message('SVG Sprite generated', 'success');
        result.write(paths.svgs.dest + 'sprite.svg')
    });
}