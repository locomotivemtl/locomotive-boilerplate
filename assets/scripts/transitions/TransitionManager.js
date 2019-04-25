import { isDebug, APP_NAME, $window, $document, $html, $pjaxWrapper } from '../utils/environment';
import { EVENT as AppEvent } from '../app';
import * as transitions from './transitions';
import Pjax from 'pjax';

const MODULE_NAME = 'Transition';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

export const EVENT = {
    LOAD:           `load.${EVENT_NAMESPACE}`,
    CLICK:          `click.${EVENT_NAMESPACE}`,
    READYTOAPPEND:  `readyToAppend.${EVENT_NAMESPACE}`,
    REFRESH:        `refresh.${EVENT_NAMESPACE}`,
    READYTODESTROY: `readyToDestroy.${EVENT_NAMESPACE}`,
    GOTO:           `goto.${EVENT_NAMESPACE}`,
};

/**
 * PJAX Transitions Manager
 *
 * @todo
 *     - ✅ get data-transition on clicked link -> launch() and add switch(){}
 *     - ✅ add goto listener
 *     - ✅ add overrideClass system for all transitions
 *     - ✅ add base class manager like old DefaultTransition (has-dom-loaded, has-dom-loading etc..)
 *
 *
 * ## Schema
 *
 * - `[]`: Listener
 * - `*`: Trigger event
 *
 * ```
 * [pjax:send] -> (transition) launch()
 *
 * [pjax:switch] (= new view is loaded) -> (transition) hideView()-> hide animations & *readyToAppend
 *
 * [readyToAppend] -> append() -> delete modules
 *                             -> remove oldView from the DOM, and innerHTMl newView
 *                             -> change()
 *
 * display() -> (transition) displayView() -> display animations & *readyToDestroy
 *           -> init new modules
 *
 * [readyToAppend] -> reinit()
 * ```
 */
export default class
{
    /**
     * @return {void}
     */
    constructor()
    {
        // jQuery ondomready
        $window.on(EVENT.LOAD, () => {
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
            elements: [
                `a[href]:not(.${this.noPjaxRequestClass}):not([target="_blank"])`,
                'form[action]',
            ],
            selectors: [
                'title',
                `${this.containerClass}`,
            ],
            switches: {},
            requestOptions: {
                timeout: 2000
            }
        };
        this.options.switches[this.containerClass] = (oldEl, newEl, options) => this.switch(oldEl, newEl, options);
        this.pjax = new Pjax(this.options);

        /*
        ===== LISTENERS =====
        */

        document.addEventListener('pjax:send', (e) => this.send(e));

        $document.on(EVENT.READYTOAPPEND, (event) => {
            this.append(event.oldView, event.newView);
        });

        $document.on(EVENT.READYTODESTROY, (event) => {
            this.reinit();
        });

        $document.on(EVENT.REFRESH, (event) => {
            this.pjax.refresh();
        });

        /**
         * @example <caption>GOTO Usage</caption>
         * ```
         * $(document).triggerHandler({
         *     type:    'goto.Transition',
         *     options: {
         *         el:   {{element clicked?}},
         *         link: {{url}}
         *     }
         * });
         * ```
         */
        $document.on(EVENT.GOTO, (event) => {
            if (event.options.el != undefined) {
                this.autoEl = event.options.el.get(0);
            }
            this.pjax.loadUrl(
                event.options.link,
                $.extend({}, this.pjax.options)
            );
        });
    }

    /**
     * PJAX: Launch when pjax receive a request.
     *
     * Retrieve and process data-transition, then initiate and launch it.
     *
     * @param  {Object} options - The PJAX options related to the triggered element.
     * @return {void}
     */
    send(options)
    {
        if (isDebug) {
            console.info('[TransitionManager.send]', '🙌', 'Sending XHR Request');
        }

        let el, transition;

        if (options.triggerElement !== undefined) {
            el = options.triggerElement;

            transition = el.getAttribute('data-transition') || 'BaseTransition';
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
            wrapper:     this.wrapper,
            clickedLink: el
        });

        this.transition.launch();
    }

    /**
     * PJAX: Launch when new page is loaded.
     *
     * @param  {Element} oldView   - The old element.
     * @param  {Element} newView   - The new element.
     * @param  {Object}  [options] - The current state options from PJAX.
     * @return {void}
     */
    switch(oldView, newView, options)
    {
        if (isDebug) {
            console.info('[TransitionManager.switch]', '👌', 'Switching View');
        }

        this.transition.hideView(oldView, newView);
    }

    /**
     * Launch when you trigger EVENT.READYTOAPPEND in your transition
     * after newView append, launch this.change().
     *
     * Replace the previous two lines with these 2 rAF functions
     * if you want to have the containers overlapped.
     * Useful with a image transition, to prevent flickering.
     *
     * @example
     * ```
     * newView.style.opacity = 0;
     * this.wrapper.appendChild(newView);
     *
     * requestAnimationFrame(() => {
     *     requestAnimationFrame(() => {
     *         newView.style.opacity = 1;
     *         this.change(oldView, newView);
     *     });
     * });
     *
     * @param  {Element} oldView - The old element.
     * @param  {Element} newView - The new element.
     * @return {void}
     */
    append(oldView, newView)
    {
        newView.style.opacity = 0;
        this.wrapper.appendChild(newView);

        newView.style.opacity = 1;
        this.change(oldView, newView);
    }

    /**
     * launch after this.append(), remove modules, remove oldView and set the newView
     *
     * @param  {Element} oldView - The old element.
     * @param  {Element} newView - The new element.
     * @return {void}
     */
    change(oldView, newView)
    {
        $document.triggerHandler({
            type:   AppEvent.DELETE_SCOPED_MODULES,
            $scope: $pjaxWrapper
        });

        oldView.parentNode.removeChild(oldView);

        this.wrapper.innerHTML = newView.outerHTML;

        // Fetch any inline script elements.
        const scripts = newView.querySelectorAll('script.js-inline');

        if (scripts instanceof window.NodeList) {
            let i = 0;
            let len = scripts.length;
            for (; i < len; i++) {
                eval(scripts[i].innerHTML);
            }
        }

        this.pjax.onSwitch();

        $document.triggerHandler({
            type:   AppEvent.INIT_SCOPED_MODULES,
            isPjax: true
        });

        this.transition.displayView(newView);
    }

    /**
     * Launch when you trigger EVENT.READYTODESTROY in your transition -> displayView(), at the end
     *
     * @return {void}
     */
    reinit()
    {
        this.transition.destroy();
        $html.attr('data-transition', '');
        this.transition = new transitions['BaseTransition']({
            wrapper: this.wrapper
        });
    }

    /**
     * DOM is loaded
     *
     * @return {void}
     */
    load()
    {
        $html.addClass('has-dom-loaded')
             .removeClass('has-dom-loading');

        setTimeout(() => {
            $html.addClass('has-dom-animated');
        }, 1000)
    }
}
