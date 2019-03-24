import { module } from 'modujs';
import { $document } from '../utils/environment'
import ScrollManager from '../scroll/vendors/ScrollManager';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.scrollManager = new ScrollManager({
            container: this.$el,
            selector: '.js-animate',
            smooth: false,
            smoothMobile: false,
            mobileContainer: $document,
            getWay: false,
            getSpeed: false
        });
    }

    destroy() {
        this.scrollManager.destroy();
    }
}
