import { APP_NAME } from './utils/environment';
import TransitionManager from './transitions/TransitionManager';
import svg4everybody from 'svg4everybody';

export default function(firstBlood) {
    svg4everybody();

    if (firstBlood) {
        const transitionManager = new TransitionManager();

        window[APP_NAME] = window[APP_NAME] || {};
        window[APP_NAME].pjax = transitionManager.pjax;
    }
}
