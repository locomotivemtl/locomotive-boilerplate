import TransitionManager from './transitions/TransitionManager';
import svg4everybody from 'svg4everybody';

export default function(firstBlood) {
    svg4everybody();

    if (firstBlood) {
        const transitionManager = new TransitionManager();
    }
}
