/* jshint esnext: true */
import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';
import { EVENT as APP_EVENT } from '../App';

//List here all of your transitions
import * as transitions from './transitions';

const MODULE_NAME = 'Transition';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`,
    READYTOREMOVE: `readyToRemove.${EVENT_NAMESPACE}`,
    READYTODESTROY: `readyToDestroy.${EVENT_NAMESPACE}`
};

/*

@todo : 

- ✅ get data-transition on clicked link -> launch() and add switch(){}
- ❌ add goto listener
- ❌ add newPageReady functon with google analytics send (maybe pjax do that?)
- ✅ add overrideClass system for all transitions
- ✅ add base class manager like old DefaultTransition (dom-is-loaded, dom-is-loading etc..)



======= SCHEMA =======

[] : listener
* : trigger event

[pjax:send] -> (transition) launch()

[pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToRemove

[readyToRemove] -> remove() -> delete modules
                            -> remove oldView from the DOM, and innerHTMl newView
                            -> display()

display() -> (transition) displayView() -> display animations & *readyToRemove
          -> init new modules

[readyToRemove] -> reinit()

*/

export default class {
    constructor() {
        

        // jQuery ondomready
        $(() => {
            this.load();
        });

        this.transition = new transitions['BaseTransition']({
            wrapper: this.wrapper
        });

        /*
        ===== PJAX CONFIGURATION =====
        */

        this.containerClass = '.js-pjax-container';
        this.wrapperId = 'js-pjax-wrapper';
        this.noPjaxRequestClass = 'no-transition';
        this.wrapper = document.getElementById(this.wrapperId);

        this.options = {
            debug: false,
            cacheBust: false,
            elements: [`a:not(.${this.noPjaxRequestClass})`,'form[action]'],
            selectors: ['title',`${this.containerClass}`],
            switches: {}
        };
        this.options.switches[this.containerClass] = (oldEl, newEl, options) => this.switch(oldEl, newEl, options)
        this.pjax = new Pjax(this.options);

        /*
        ===== LISTENERS =====
        */

        document.addEventListener('pjax:send',(e) => this.send(e));


        $document.on(EVENT.READYTOREMOVE,(event) => {
            this.remove(event.oldView, event.newView);
        });
        $document.on(EVENT.READYTODESTROY,(event) => {
            this.reinit();
        });
    }


    /**
     * (PJAX) Launch when pjax receive a request
     * get & manage data-transition,init and launch it
     * @param  {event}
     * @return void
     */
    send(e) {
        if(isDebug) {
            console.log("---- Launch request 🙌 -----");
        }

        let el = e.triggerElement;
        
        let transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition';
        $html.attr('data-transition',transition);

        // options available : wrapper, overrideClass
        this.transition = new transitions[transition]({
            wrapper: this.wrapper,
            clickedLink: el
        });

        this.transition.launch();

    }

    /**
     * (PJAX) Launch when new page is loaded
     * @param  {js dom element}, 
     * @param  {js dom element}
     * @param  {options : pjax options}
     * @return void
     */
    switch(oldView, newView, options) {
        if(isDebug) {
            console.log('---- Next view loaded 👌 -----');
        }
        this.transition.hideView(oldView, newView);

        this.pjax.onSwitch();
        
    }

    /**
     * Launch when you trigger EVENT.READYTOREMOVE in your transition -> hideView(), at the end
     * after oldView hidden, delete modules and launch this.display()
     * @param  {js dom element}, 
     * @param  {js dom element}
     * @return void
     */
    remove(oldView, newView) {

        $document.triggerHandler({
            type: APP_EVENT.DELETE_SCOPED_MODULES,
            $scope: $pjaxWrapper
        });

        oldView.remove();

        this.display(newView);
    }

    /**
     * launch after this.remove()
     * @param  {js dom element}, 
     * @return void
     */
    display(view) {
        this.wrapper.innerHTML = view.outerHTML;

        this.transition.displayView(view);

        $document.triggerHandler({
            type: APP_EVENT.INIT_SCOPED_MODULES,
            isPjax: true
        });

    }

    /**
     * Launch when you trigger EVENT.READYTODESTROY in your transition -> displayView(), at the end
     * @return void
     */
    reinit() {
        this.transition.destroy();
        $html.attr('data-transition','');
        this.transition = new transitions['BaseTransition']({
            wrapper: this.wrapper
        });
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
