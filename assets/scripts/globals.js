import svg4everybody from 'svg4everybody';
import { ENV } from './config';
import { triggerLazyloadCallbacks } from './utils/image';

// Dynamic imports for development mode only
let gridHelper;
(async () => {
    if (ENV.IS_DEV) {
        const gridHelperModule = await import('./utils/grid-helper');
        gridHelper = gridHelperModule?.gridHelper;
    }
})();

export default function () {
    /**
     * Use external SVG spritemaps
     */
    svg4everybody();

    /**
     * Add grid helper
     */
    gridHelper?.();

    /**
     * Trigger lazyload
     */
    triggerLazyloadCallbacks();
}
