/* jshint esnext: true */
import { $document, $html, isDebug } from '../utils/environment';

import DefaultTransition from './DefaultTransition';

export default class {
    constructor() {
        let clickedLink = undefined;
        let transition = '';

        // jQuery ondomready
        $(() => {
            this.load();
        });

        $document.on('goTo.PageTransitionManager', (event) => {
            if (!window.history.pushState) {
                window.location = event.options.location;
            } else {
                transition = event.options.transition;
                Barba.Pjax.goTo(event.options.location);
            }
        });

        // Define different page transitions
        Barba.Pjax.getTransition = function() {
            transition = (clickedLink instanceof Node) ? clickedLink.getAttribute('data-transition') : (typeof transition === 'string' ? transition : '');

            let TransitionObject;

            switch (transition) {
                default:
                    TransitionObject = DefaultTransition();
            }

            clickedLink = undefined;
            transition = '';

            return TransitionObject;
        }

        Barba.Dispatcher.on('linkClicked', (HTMLElement) => {
            clickedLink = HTMLElement;
        });

        Barba.Dispatcher.on('newPageReady', (currentStatus, prevStatus, container, currentHTML) => {
            // Fetch any inline script elements.
            const scripts = container.querySelectorAll('script.js-inline');

            if (scripts instanceof window.NodeList) {
                let i = 0;
                let len = scripts.length;
                for (; i < len; i++) {
                    eval(scripts[i].innerHTML);
                }
            }

            /**
             * Execute any third party features.
             */
        });

        Barba.Dispatcher.on('transitionCompleted', (currentStatus, prevStatus) => {
            //Update google analytics viewing page with changeUrlTracker (autotrack)
            if(!isDebug){
                ga('send', 'pageview');
            }
        });

        Barba.Pjax.Dom.containerClass = 'js-barba-container';
        Barba.Pjax.Dom.wrapperId = 'js-barba-wrapper';

        Barba.Pjax.start();
    }

    /**
     * Init Google Analytics and init plugin(s) of autotrack
     *
     * @return {void}
     */
    initAutotrack(){
       ga('create', 'UA-XXXXXXXX-X', 'auto');
       ga('require', 'urlChangeTracker');
       ga('send', 'pageview');
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
        }, 1000);

        if(!isDebug){
            //Init autotrack - google analytics
            this.initAutotrack();
        }
    }
}
