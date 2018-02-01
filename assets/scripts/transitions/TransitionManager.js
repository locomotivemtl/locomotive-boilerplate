/* jshint esnext: true */
import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';
import { EVENT as APP_EVENT } from '../App';

//List here all of your transitions
import DefaultTransition from './DefaultTransition';


const MODULE_NAME = 'TransitionManager';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;


/*
@todo : 
- get data-transition on clicked link -> launch() and add switch(){}
- add goto listener
- add newPageReady functon with google analytics send

*/

const EVENT = {
    GOTO: `goto.${EVENT_NAMESPACE}`
};

export default class {
    constructor() {
        

        // jQuery ondomready
        $(() => {
            this.load();
        });

        this.transition;

        
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

        document.addEventListener('pjax:send',(e) => this.send(e));
        document.addEventListener('pjax:success',(e) => this.success(e));
    }

    send(e) {
        console.log("---- Launch request 🙌 -----");

        //by default, but need to be manage by data-transiton on currentTarget
        this.transition = new DefaultTransition(this.wrapper);
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
