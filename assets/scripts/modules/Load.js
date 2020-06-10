import { module } from 'modujs';
import modularLoad from 'modularload';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.analyticsId = this.getData('analytics');

        const load = new modularLoad({
            enterDelay: 0,
            transitions: {
                customTransition: {}
            }
        });

        load.on('loaded', (transition, oldContainer, newContainer) => {
            this.call('destroy', oldContainer, 'app');
            this.call('update', newContainer, 'app');

            if(window.gtag && this.analyticsId != null) {
                gtag('config', this.analyticsId, {
                    'page_path':  location.pathname,
                    'page_title': document.title
                });
            }
        });
    }
}
