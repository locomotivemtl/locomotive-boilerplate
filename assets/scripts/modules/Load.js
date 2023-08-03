import { module } from 'modujs';
import modularLoad from 'modularload';
import { resetLazyloadCallbacks, triggerLazyloadCallbacks } from "../utils/image";

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.load = new modularLoad({
            enterDelay: 0,
            transitions: {
                customTransition: {}
            }
        });

        this.load.on('loaded', (transition, oldContainer, newContainer) => {
            this.call('destroy', oldContainer, 'app');
            this.call('update', newContainer, 'app');

            /**
             * Trigger lazyload
             */
            triggerLazyloadCallbacks();
        });

        this.load.on("loading", () => {
            /**
             * Remove previous lazyload callbacks
             */
            resetLazyloadCallbacks();
        });
    }
}
