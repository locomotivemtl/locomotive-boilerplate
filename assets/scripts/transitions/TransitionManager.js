/* jshint esnext: true */
import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';
import { EVENT as APP_EVENT } from '../App';

//List here all of your transitions
import * as transitions from './transitions';

const MODULE_NAME = 'TransitionManager';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`
};

/*

@todo : 

- get data-transition on clicked link -> launch() and add switch(){}
- add goto listener
- add newPageReady functon with google analytics send
- add overrideClass system for all transitions
- add base class manager like old DefaultTransition (dom-is-loaded, dom-is-loading etc..)

*/

export default class {
    constructor() {
        

        // jQuery ondomready
        $(() => {
            this.load();
        });

        this.transition;

        /*
        ===== PJAX CONFIGURATION =====
        */

        this.containerClass = '.js-pjax-container';
        this.wrapperId = 'js-pjax-wrapper';
        this.noPjaxRequestClass = 'no-transition';
        this.wrapper = document.getElementById(this.wrapperId);

        this.options = {
            debug: false,
            elements: [`a:not(.${this.noPjaxRequestClass})`,'form[action]'],
            selectors: ['title',`${this.containerClass}`],
            switches: {}
        };
        this.options.switches[this.containerClass] = (oldEl, newEl, options) => this.switch(oldEl, newEl, options)
        this.pjax = new Pjax(this.options);

        // temporary solution to get currentTarget clicked (to get data-transition)
        let a = document.querySelectorAll(`a:not(.${this.noPjaxRequestClass})`);
        for (var i = a.length - 1; i >= 0; i--) {
            a[i].addEventListener('click',(e) => this.click(e));
        }

        document.addEventListener('pjax:success',(e) => this.success(e));

    }

    click(e) {
        console.log("---- Launch request 🙌 -----");

        let el = e.target;
        let transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition'

        // options available : wrapper, overrideClass
        this.transition = new transitions[transition]({
            wrapper: this.wrapper
        });

        this.transition.launch();
    }

    switch(oldEl, newEl, options) {

        console.log('---- Next view loaded 👌 -----');

        $document.triggerHandler({
            type: APP_EVENT.DELETE_SCOPED_MODULES,
            $scope: $pjaxWrapper
        });

        this.transition.hideView(oldEl);
        this.transition.displayView(newEl);

        $document.triggerHandler({
            type: APP_EVENT.INIT_SCOPED_MODULES,
            isPjax: true
        });

    }

    success(e) {
        this.transition.destroy();
        this.transition = null;
    }

    /**
     * DOM is loaded
     *
     * @return {void}
     */
    load() {
        $html.addClass('dom-is-loaded');
        $html.removeClass('dom-is-loading');
        setTimeout(() => {
            $html.addClass('dom-is-animated');
        }, 1000)
    }
}
