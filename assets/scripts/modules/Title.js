/* jshint esnext: true */
import AbstractModule from './AbstractModule';
import { visibilityApi } from '../utils/visibility';
import { $document, APP_NAME, DATA_API_KEY } from '../utils/environment';

const DATA_KEY  = `${APP_NAME}.Title`;
const EVENT_KEY = `.${DATA_KEY}`;

const Event = {
    CHANGE_LABEL : `changeLabel${EVENT_KEY}`
};

const Selector = {
    LABEL : '.js-label'
}

export default class extends AbstractModule
{
    constructor(options)
    {
        super(options);

        this.$label = this.$el.find(Selector.LABEL);

        $document.on(Event.CHANGE_LABEL, (event, value) => {
            this.changeLabel(value);
            this.destroy();
        });

        this.hiddenCallbackIdent = visibilityApi({
            action:   'addCallback',
            state:    'hidden',
            callback: this.logHidden
        });

        this.visibleCallbackIdent = visibilityApi({
            action:   'addCallback',
            state:    'visible',
            callback: this.logVisible
        });
    }

    logHidden()
    {
        console.log('Title is hidden');
    }

    logVisible()
    {
        console.log('Title is visible');
    }

    changeLabel(value)
    {
        this.$label.text(value);
    }

    destroy()
    {
        $document.off(EVENT_KEY);

        this.$el.off(EVENT_KEY);

        visibilityApi({
            action: 'removeCallback',
            state:  'hidden',
            ident:   this.hiddenCallbackIdent
        });

        visibilityApi({
            action: 'removeCallback',
            state:  'visible',
            ident:   this.visibleCallbackIdent
        });
    }
}
