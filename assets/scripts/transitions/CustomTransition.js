import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';
import BaseTransition from './BaseTransition';

export default class extends BaseTransition{
    constructor(options) {
        super(options);

        this.overrideClass = '-custom-transition';
    }

}
