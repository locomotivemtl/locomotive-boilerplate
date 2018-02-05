import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';
import BaseTransition from './BaseTransition';

const MODULE_NAME = 'Transition';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

const EVENT = {
    CLICK: `click.${EVENT_NAMESPACE}`,
    READYTOREMOVE: `readyToRemove.${EVENT_NAMESPACE}`,
    READYTODISPLAY: `readyToDisplay.${EVENT_NAMESPACE}`,
    READYTODESTROY: `readyToDestroy.${EVENT_NAMESPACE}`
};


export default class extends BaseTransition{
    constructor(options) {
        super(options);

        this.overrideClass = '-custom-transition';
    }

}
