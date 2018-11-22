import { APP_NAME, $document, $html, $body,  isDebug, $pjaxWrapper } from '../utils/environment';

import { EVENT as TransitionEvent } from './TransitionManager'

export default class {
    constructor(options) {

        this.options = options;
        this.wrapper = options.wrapper;
        this.overrideClass = options.overrideClass ? options.overrideClass : '';
        this.clickedLink = options.clickedLink;

    }

    launch() {
        if(isDebug) {
            console.log("---- Launch transition 👊 -----");
        }

        $html
            .removeClass('has-dom-loaded has-dom-animated ')
            .addClass(`has-dom-loading ${this.overrideClass}`);

    }

    hideView(oldView, newView) {
        if(isDebug) {
            console.log('----- ❌ [VIEW]:hide - ', oldView.getAttribute('data-template'));
        }
        
        // launch it at the end (animations...)
        $document.triggerHandler({
            type:TransitionEvent.READYTOAPPEND,
            oldView: oldView,
            newView: newView
        });

    }


    displayView(view) {

        if(isDebug) {
            console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
        }

        $html.attr('data-template', view.getAttribute('data-template'));

        setTimeout(() => {

            $html
                .addClass('has-dom-loaded')
                .removeClass('has-dom-loading');

            setTimeout(() => {
                $html
                    .removeClass(this.overrideClass)
                    .addClass('has-dom-animated');
            }, 1000);

            // launch it at the end (animations...)
            $document.triggerHandler({
                type:TransitionEvent.READYTODESTROY
            });

        },1000);
    }


    destroy() {
        if(isDebug) {
            console.log("---- ❌ [transition]:destroy -----");
        }
    }
}
