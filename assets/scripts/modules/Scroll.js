import { module } from 'modujs';
import LocomotiveScroll from 'locomotive-scroll';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.scroll = new LocomotiveScroll({
            el: this.el,
            smooth: true
        });
    }

    destroy() {
        this.scroll.destroy();
    }
}
