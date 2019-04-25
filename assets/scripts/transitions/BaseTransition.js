import { isDebug, $document, $html } from '../utils/environment';
import { EVENT as TransitionEvent } from './TransitionManager';

/**
 * Base PJAX Transition
 */
export default class
{
    /**
     * @param  {Object} options - The transition options.
     * @return {void}
     */
    constructor(options)
    {
        this.options       = options;
        this.wrapper       = options.wrapper;
        this.overrideClass = options.overrideClass ? options.overrideClass : '';
        this.clickedLink   = options.clickedLink;
    }

    /**
     * @return {void}
     */
    launch()
    {
        if (isDebug) {
            console.info('[BaseTransition.launch]', '👊', 'Launching Transition');
        }

        $html.removeClass('has-dom-loaded has-dom-animated')
             .addClass(`has-dom-loading ${this.overrideClass}`);
    }

    /**
     * @param  {Element} oldView - The old element.
     * @param  {Element} newView - The new element.
     * @return {void}
     */
    hideView(oldView, newView)
    {
        if (isDebug) {
            console.info('[BaseTransition.hideView]', '🌃', 'Hiding View', '--', oldView.getAttribute('data-template'));
        }

        // launch it at the end (animations...)
        $document.triggerHandler({
            type:    TransitionEvent.READYTOAPPEND,
            oldView: oldView,
            newView: newView
        });
    }

    /**
     * launch after this.append(), remove modules, remove oldView and set the newView
     *
     * @param  {Element} view - The new element.
     * @return {void}
     */
    displayView(view)
    {
        if (isDebug) {
            console.info('[BaseTransition.displayView]', '🌇', 'Showing View', '--', view.getAttribute('data-template'));
        }

        $html.attr('data-template', view.getAttribute('data-template'));

        setTimeout(() => {
            $html.addClass('has-dom-loaded')
                 .removeClass('has-dom-loading');

            setTimeout(() => {
                $html.removeClass(this.overrideClass)
                     .addClass('has-dom-animated');
            }, 1000);

            // launch it at the end (animations...)
            $document.triggerHandler({
                type: TransitionEvent.READYTODESTROY
            });

        }, 1000);
    }

    /**
     * @return {void}
     */
    destroy()
    {
        if (isDebug) {
            console.info('[BaseTransition.destroy]', '💥', 'Destroying Transition');
        }
    }
}
