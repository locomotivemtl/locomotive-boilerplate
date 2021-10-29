import { module } from 'modujs';
import modularLoad from 'modularload';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        const load = new modularLoad({
            enterDelay: 0,
            transitions: {
                customTransition: {}
            }
        });

        this.load.on('loading', (transition, oldContainer) => {
            this.call('hide', null, 'Modal');
        });

        load.on('loaded', (transition, oldContainer, newContainer) => {
            this.call('destroy', oldContainer, 'app');
            this.call('update', newContainer, 'app');
        });
    }
}
