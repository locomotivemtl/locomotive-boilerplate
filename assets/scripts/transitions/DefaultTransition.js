import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';


export default class {
    constructor(wrapper) {
        
        this.wrapper = wrapper;
    }

    launch(e) {
        console.log("---- Launch transition 👊 -----");

    }

    hideView(view) {
        console.log('----- ❌ [VIEW]:remove - ', view.getAttribute('data-template'));
        view.remove();

    }

    displayView(view) {
        console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
        this.wrapper.innerHTML = view.outerHTML;
    }

    
    destroy() {
        console.log("---- destroy transition ❌ -----");
    }
}
