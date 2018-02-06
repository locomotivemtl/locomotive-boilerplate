import { APP_NAME, $document, $html, $body,  isDebug, $pjaxWrapper } from '../utils/environment';

const MODULE_NAME = 'Transition';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`,
    READYTOREMOVE: `readyToRemove.${EVENT_NAMESPACE}`,
    READYTODESTROY: `readyToDestroy.${EVENT_NAMESPACE}`
};

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
            .removeClass('dom-is-loaded dom-is-animated ')
            .addClass(`dom-is-loading ${this.overrideClass}`);

    }

    hideView(oldView, newView) {
        if(isDebug) {
            console.log('----- ❌ [VIEW]:hide - ', oldView.getAttribute('data-template'));
        }

        // launch it at the end (animations...)
        $document.triggerHandler({
            type:EVENT.READYTOREMOVE,
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
                .addClass('dom-is-loaded')
                .removeClass('dom-is-loading');

            setTimeout(() => {
                $html
                    .removeClass(this.overrideClass)
                    .addClass('dom-is-animated');
            }, 1000);

            // launch it at the end (animations...)
            $document.triggerHandler({
                type:EVENT.READYTODESTROY
            });

        },1000);
    }

    
    destroy() {
        if(isDebug) {
            console.log("---- ❌ [transition]:destroy -----");
        }
    }
}
