/* jshint esnext: true */
import AbstractModule from './AbstractModule';
import { $document, APP_NAME, DATA_API_KEY } from '../utils/environment';

const DATA_KEY  = `${APP_NAME}.button`;
const EVENT_KEY = `.${DATA_KEY}`;

const Event = {
    CLICK : `click${EVENT_KEY}`
};

/**
 * Button
 */
export default class extends AbstractModule
{
    constructor(options)
    {
        super(options);

        this.$el.on(Event.CLICK, (event) => {
            $document.trigger(`changeLabel.Title.${APP_NAME}`, [ $(event.currentTarget).val() ]);
        });
    }

    destroy()
    {
        this.$el.off(EVENT_KEY);
    }
}
