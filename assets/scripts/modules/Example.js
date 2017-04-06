/* jshint esnext: true */
import AbstractModule from './AbstractModule';

export default class extends AbstractModule
{
    constructor(options)
    {
        super(options);

        // Declaration of properties
    }

    init() {
        // Set events and such
    }

    destroy()
    {
        super.destroy();
    }
}
