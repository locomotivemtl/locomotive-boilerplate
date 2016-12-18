/* jshint esnext: true */
import { $document, $window, $html, $body } from '../utils/environment';

/**
 * Abstract Module
 */
export default class
{
    constructor(options)
    {
        this.$el = options.$el || null;
        this.el  = options.el  || null;
    }

    destroy()
    {
        if (this.$el) {
            this.$el.off();
        }
    }
}
