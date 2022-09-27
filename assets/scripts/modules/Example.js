import { module } from 'modujs';
import { whenReady } from '../utils/fonts';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        whenReady(
            { family: 'Source Sans', style: 'normal', weight: 700 }
        ).then((fonts) => this.onBoldFontLoaded(fonts));

        whenReady([
            { family: 'Source Sans', style: 'italic', weight: 400 },
        ]).then((fonts) => this.onItalicFontLoaded(fonts));
    }

    onBoldFontLoaded(fonts) {
        console.log('Example: Bold Normal Font Loaded!', fonts)
    }

    onItalicFontLoaded(fonts) {
        console.log('Example: Regular Italic Font Loaded!', fonts)
    }
}
