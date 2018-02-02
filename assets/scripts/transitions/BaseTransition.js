import { APP_NAME, $document, $html, isDebug, $pjaxWrapper } from '../utils/environment';

export default class {
    constructor(options) {

        this.options = options;
        this.wrapper = options.wrapper;
        this.overrideClass = options.overrideClass ? options.overrideClass : '';

    }

    launch() {
        console.log("---- Launch transition 👊 -----");

        $html
            .removeClass('dom-is-loaded dom-is-animated')
            .addClass(`dom-is-loading ${this.overrideClass}`);

    }

    hideView(view) {
        console.log('----- ❌ [VIEW]:remove - ', view.getAttribute('data-template'));
        view.remove();

    }

    displayView(view) {

        console.log('----- ✅ [VIEW]:display :', view.getAttribute('data-template'));
        this.wrapper.innerHTML = view.outerHTML;

        $html.attr('data-template', view.getAttribute('data-template'));

        // if you want a delay
        setTimeout(() => {

            $html
                .addClass('dom-is-loaded')
                .removeClass('dom-is-loading');

            setTimeout(() => {
                $html
                    .removeClass(this.overrideClass)
                    .addClass('dom-is-animated');
            }, 1000);

        },1000);
    }

    
    destroy() {
        console.log("---- ❌ [transition]:destroy -----");
    }
}
