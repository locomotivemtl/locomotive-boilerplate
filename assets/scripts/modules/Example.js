import { module } from 'modujs';
import { EAGER_FONTS } from '../app';
import { whenReady } from '../utils/fonts';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        whenReady(EAGER_FONTS).then((fonts) => this.onFontsLoaded(fonts));
    }

    onFontsLoaded(fonts) {
        console.log('Example: Eager Fonts Loaded!', fonts)
    }
}
