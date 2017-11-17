/* jshint esnext: true */
import { APP_NAME, $document, $html, $barba } from '../utils/environment';
import { EVENT as APP_EVENT } from '../App';

function DefaultTransition(options) {
    options = options || {};
    const startCallback = (typeof options.startCallback === 'function') ? options.startCallback : function(){};
    const overrideClass = (typeof options.overrideClass === 'string') ? options.overrideClass : '';

    return Barba.BaseTransition.extend({
        start: function() {
            $html
                .removeClass('dom-is-loaded dom-is-animated')
                .addClass(`dom-is-loading ${overrideClass}`);

            startCallback();

            /* Close any overlays */

            setTimeout(() => {
                Promise
                  .all([this.newContainerLoading])
                  .then(this.finish.bind(this));
            }, 1000);
        },
        finish: function() {
            $document.triggerHandler({
                type:   APP_EVENT.DELETE_SCOPED_MODULES,
                $scope: $barba
            });

            this.done();

            const $el = $(this.newContainer);

            // Get the template name of the new container and set it to the DOM
            $html.attr('data-template', $el.data('template'));

            $document.triggerHandler({
                type: APP_EVENT.INIT_SCOPED_MODULES,
                isBarba: true
            });

            $html
                .addClass('dom-is-loaded')
                .removeClass('dom-is-loading');

            setTimeout(() => {
                $html
                    .removeClass(overrideClass)
                    .addClass('dom-is-animated');
            }, 1000);
        }
    });
}

export default DefaultTransition;
