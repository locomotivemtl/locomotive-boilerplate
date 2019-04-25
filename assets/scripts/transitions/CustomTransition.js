import { isDebug, $document, $html } from '../utils/environment';
import { EVENT as TransitionEvent } from './TransitionManager';
import BaseTransition from './BaseTransition';

/**
 * Custom PJAX Transition
 */
export default class extends BaseTransition
{
    /**
     * @param  {Object} options - The transition options.
     * @return {void}
     */
    constructor(options)
    {
        super(options);

        this.overrideClass = '-custom-transition';
    }
}
