import { module } from 'modujs';
import Swup from 'swup';
import SwupFragmentPlugin from '@swup/fragment-plugin';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        const load = new Swup({
            containers: ['[data-load-container]'],
            // cache: false,
            plugins: [
                new SwupFragmentPlugin({
                    rules: [
                        {
                            from: ['/','/index.php','/index.php/per_page/:per_page/page/:page'],
                            to: ['/','/index.php','/index.php/per_page/:per_page/page/:page'],
                            containers: ['#paginated']
                        },
                        {
                            from: ['/','/index.php', '/index.php/per_page/:per_page/page/:page'],
                            to: ['/index.php/modal/:modal'],
                            containers: ['#modal'],
                            name: 'open-modal'
                        },
                        {
                            from: ['/index.php/modal/:modal'],
                            to: ['/index.php/modal/:modal'],
                            containers: ['#modal'],
                            name: 'modal-update'
                        },
                        {
                            from: ['/index.php/modal/:modal'],
                            to: ['/','/index.php', '/index.php/per_page/:per_page/page/:page'],
                            containers: ['#modal', '#paginated'],
                            name: 'close-modal'
                        },
                    ]
                })
            ]
        });

        load.hooks.before('content:replace', async (visit) => {
            console.log('before content replace:', visit);

            for(let container of visit.containers) {
                const oldContainer = this.el.querySelector(container)
                console.log('old container: ', oldContainer)
                this.call('destroy', oldContainer, 'app');
            }
        });

        load.hooks.on('content:replace', (visit) => {
            console.log('On content replace:', visit);

            if(visit.fragmentVisit) {
                if(visit.fragmentVisit.name == 'open-modal') {
                    this.call('populate', document.getElementById('modal'), 'Dialog');
                    this.call('show', null, 'Dialog')
                } else if(visit.fragmentVisit.name == 'close-modal') {
                    this.call('close', null, 'Dialog')
                }
            }

            for(let container of visit.containers) {
                const newContainer = this.el.querySelector(container)
                console.log('new container: ', newContainer)
                newContainer.classList.add('transition-fade')
                this.call('update', newContainer, 'app');
            }
        });

        console.log(this, load);
    }
}
