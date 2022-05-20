import { module } from 'modujs';
import barba from '@barba/core';
import config from '../config'

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        barba.init({
            debug: config.IS_DEV,
            schema: {
                prefix: 'data-load',
            },
            transitions: [{
                name: 'default-transition',
                leave: (data) => {
                    this.call('destroy', data.current.container, 'app');
                },
                enter: (data) => {
                    this.call('update', data.next.container, 'app');
                }
            }]
        });
    }
}
