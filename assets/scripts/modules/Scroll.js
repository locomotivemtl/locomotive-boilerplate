import { module } from 'modujs';
import { $document } from '../utils/environment'
import ScrollManager from '../scroll/vendors/ScrollManager';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.scroll = new ScrollManager({
            container: $(this.el),
            smooth: true,
            inertia: 1
        });
    }

    destroy() {
        this.scroll.destroy();
    }
}
