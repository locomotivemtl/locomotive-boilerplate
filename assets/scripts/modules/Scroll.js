import { module } from 'modujs';
import locomotiveScroll from 'locomotive-scroll';

export default class extends module {
    constructor(m) {
        super(m);
    }

    init() {
        this.scroll = new locomotiveScroll({
            el: this.el,
            smooth: true
        });
    }

    destroy() {
        this.scroll.destroy();
    }
}
