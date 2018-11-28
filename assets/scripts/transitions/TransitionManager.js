import Pjax from 'pjax';
import { APP_NAME, $document, $html, isDebug, $pjaxWrapper, $window } from '../utils/environment';
import { EVENT as APP_EVENT } from '../app';

//List here all of your transitions
import * as transitions from './transitions';

const MODULE_NAME = 'Transition';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

export const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`,
    READYTOAPPEND: `readyToAppend.${EVENT_NAMESPACE}`,
    READYTODESTROY: `readyToDestroy.${EVENT_NAMESPACE}`,
    GOTO: `goto.${EVENT_NAMESPACE}`
};

/*

@todo :

- ✅ get data-transition on clicked link -> launch() and add switch(){}
- ✅ add goto listener
- ✅ add overrideClass system for all transitions
- ✅ add base class manager like old DefaultTransition (has-dom-loaded, has-dom-loading etc..)


======= SCHEMA =======

[] : listener
* : trigger event

[pjax:send] -> (transition) launch()

[pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToAppend

[readyToAppend] -> append() -> delete modules
                            -> remove oldView from the DOM, and innerHTMl newView
                            -> change()

display() -> (transition) displayView() -> display animations & *readyToDestroy
          -> init new modules

[readyToAppend] -> reinit()

*/

export default class {
    constructor() {


        // jQuery ondomready
        $window.on('load',() => {
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
            switches: {},
            requestOptions: {
                timeout: 2000
            }
        };
        this.options.switches[this.containerClass] = (oldEl, newEl, options) => this.switch(oldEl, newEl, options)
        this.pjax = new Pjax(this.options);

        /*
        ===== LISTENERS =====
        */

        document.addEventListener('pjax:send',(e) => this.send(e));


        $document.on(EVENT.READYTOAPPEND,(event) => {
            this.append(event.oldView, event.newView);
        });
        $document.on(EVENT.READYTODESTROY,(event) => {
            this.reinit();
        });


        /** goto exampe
        $document.triggerHandler({
            type: 'goto.Transition',
            options : {
                el: {{element clicked?}},
                link: {{url}}
            }
        });
        */
        $document.on(EVENT.GOTO, (e) => {
            if(e.options.el != undefined) {
                this.autoEl = e.options.el.get(0);
            }
            this.pjax.loadUrl(e.options.link, $.extend({}, this.pjax.options));
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

        let el,transition;

        if(e.triggerElement != undefined) {

            el = e.triggerElement;

            transition = el.getAttribute('data-transition') ? el.getAttribute('data-transition') : 'BaseTransition';
            $html.attr('data-transition',transition);

        } else {
            
            if (this.autoEl != undefined) {
                el = this.autoEl;
            } else {
                el = document;
            }

            transition = 'BaseTransition';
        }

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
    }

    /**
     * Launch when you trigger EVENT.READYTOAPPEND in your transition
     * after newView append, launch this.change()
     * @param  {js dom element},
     * @param  {js dom element}
     * @return void
     */
    append(oldView, newView) {
        
        newView.style.opacity = 0;
        this.wrapper.appendChild(newView);

        // Add these 2 rAF if you want to have the containers overlapped
        // Useful with a image transition, to prevent flickering
        // requestAnimationFrame(() => {
            // requestAnimationFrame(() => {
                newView.style.opacity = 1;
                this.change(oldView, newView);
            // });
        // });
        
    }

    /**
     * launch after this.append(), remove modules, remove oldView and set the newView
     * @param  {js dom element},
     * @return void
     */
    change(oldView, newView) {

        $document.triggerHandler({
            type: APP_EVENT.DELETE_SCOPED_MODULES,
            $scope: $pjaxWrapper
        });

        this.wrapper.innerHTML = newView.outerHTML;

        oldView.remove();

        // Fetch any inline script elements.
        const scripts = newView.querySelectorAll('script.js-inline');

        if (scripts instanceof window.NodeList) {
            let i = 0;
            let len = scripts.length;
            for (; i < len; i++) {
                eval(scripts[i].innerHTML);
            }
        }

        $document.triggerHandler({
            type: APP_EVENT.INIT_SCOPED_MODULES,
            isPjax: true
        });

        this.pjax.onSwitch();

        this.transition.displayView(newView);

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
        $html.addClass('has-dom-loaded');
        $html.removeClass('has-dom-loading');
        setTimeout(() => {
            $html.addClass('has-dom-animated');
        }, 1000)
    }
}
