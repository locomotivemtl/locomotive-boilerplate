/* jshint esnext: true */
import { APP_NAME } from '../utils/environment';
import AbstractModule from './AbstractModule';

const MODULE_NAME = 'Example';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`
};

export default class extends AbstractModule {
    constructor(options) {
        super(options);

        // Declaration of properties
    }

    init() {
        // Set events and such
    }

    destroy() {
        super.destroy();
        this.$el.off(`.${EVENT_NAMESPACE}`);
    }
}
