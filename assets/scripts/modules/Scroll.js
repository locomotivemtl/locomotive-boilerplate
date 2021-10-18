import { module } from 'modujs';
import { lazyLoadImage } from '../utils/image';
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

        this.scroll.on('call', (func, way, obj, id) => {
            // Using modularJS
            this.call(func[0], { way, obj }, func[1], func[2]);
        });

        this.scroll.on('scroll', (args) => {
            // console.log(args.scroll);
        })
    }

    /**
     * Lazy load
     * See '../utils/image'
     * Recommended to wrap your image in `.c-lazy`. `-lazy-loaded` modifier will be applied on both parent and children
     *
     * @param {obj} | Locomotive Scroll object
     */
    lazyLoad(args) {
        lazyLoadImage(args.obj.target, null, () => {
            //callback
        })
    }

    destroy() {
        this.scroll.destroy();
    }
}
