/* jshint esnext: true */
import TransitionManager from './transitions/TransitionManager';

export default function(firstBlood) {
    svg4everybody();

    if (firstBlood) {
        const transitionManager = new TransitionManager();
    }
}
