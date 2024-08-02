import { module } from 'modujs';
import modularLoad from 'modularload';
import { CUSTOM_EVENT } from '../config';

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

        load.on('loading', (transition, oldContainer) => {
            const args = { transition, oldContainer };
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent(CUSTOM_EVENT.VISIT_START, { detail: args }))
        });

        load.on('loaded', (transition, oldContainer, newContainer) => {
            this.call('destroy', oldContainer, 'app');
            this.call('update', newContainer, 'app');
        });
    }
}
