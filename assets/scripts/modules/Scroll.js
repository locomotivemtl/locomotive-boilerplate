import { APP_NAME, $document } from '../utils/environment';
import AbstractModule from './AbstractModule';
import ScrollManager from '../scroll/vendors/ScrollManager';

const MODULE_NAME = 'Scroll';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

export default class extends AbstractModule {
    constructor(options) {
        super(options);
    }

    init() {
        setTimeout(() => {
            this.scrollManager = new ScrollManager({
                container: this.$el,
                selector: '.js-animate',
                smooth: false,
                smoothMobile: false,
                mobileContainer: $document,
                getWay: false,
                getSpeed: false
            });
        }, 500);
    }

    destroy() {
        super.destroy();
        this.scrollManager.destroy();
    }
}
