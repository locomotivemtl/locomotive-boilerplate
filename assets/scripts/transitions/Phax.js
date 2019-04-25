import Pjax from 'pjax';
import { default as newUid } from '../../../node_modules/pjax/lib/uniqueid.js';
import { default as trigger } from '../../../node_modules/pjax/lib/events/trigger.js';
import { default as on } from '../../../node_modules/pjax/lib/events/on.js';

const PhaxDisposition = {
    INTERNAL: 'internal',
}

/**
 * Add the 'state' property to jQuery's Event object
 * so we can use it in `$(window).bind('popstate')`
 */
if ($.event.props && $.inArray('state', $.event.props) < 0) {
    $.event.props.push('state');
} else if (!('state' in $.Event.prototype)) {
    $.event.addProp('state');
}

/**
 * Super PJAX
 *
 * Adds support for tracking internal page changes without Pjax using AJAX.
 *
 * @version PJAX v0.2.8 / PHAX v0.1.0
 */
const Phax = function (options) {
    this.lastNamespace   = null;
    this.lastDisposition = null;

    /**
     * This event listener is used to short-circuit PJAX's popstate listener.
     *
     * This allows us to provide support for "internal" states that don't
     * require an AJAX request.
     *
     * @event popstate
     */
    on(window, 'popstate', (event) => this.onPopState(event));

    Pjax.call(this, options);
};

Phax.newUid    = newUid;
Phax.prototype = Pjax.prototype;
Phax.prototype.__loadUrl = Pjax.prototype.loadUrl;
Phax.prototype.__afterAllSwitches = Pjax.prototype.afterAllSwitches;

/**
 * @listens event:popstate
 * @param  {Event} event - The popstate event.
 * @return {void}
 */
Phax.prototype.onPopState = function (event) {
    if (event.state) {
        // short-circuit popstate event listener from PJAX
        event.stopImmediatePropagation();

        var options = $.extend({}, this.options);

        options.url         = event.state.url;
        options.title       = event.state.title;
        options.namespace   = event.state.namespace || null;
        options.disposition = event.state.disposition || null;
        // Since state already exists, prevent it from being pushed again
        options.history     = false;
        options.scrollPos   = event.state.scrollPos;

        if (event.state.uid < this.lastUid) {
            options.backward = true;
        } else {
            options.forward = true;
        }

        if (this.lastNamespace !== event.state.namespace) {
            options.transition = true;
        }

        if (this.lastDisposition !== event.state.disposition) {
            options.transition = true;
        }

        this.lastUid = event.state.uid;
        this.lastNamespace = event.state.namespace;
        this.lastDisposition = event.state.disposition;

        trigger(document, 'pjax:popstate', options);

        // @todo implement history cache here, based on uid
        this.loadUrl(event.state.url, options);
    }
};

/**
 * Manually triggers the loading of a URL.
 *
 * @override Pjax.prototype.loadUrl()
 *     This method allows one to bypass the AJAX request to provide support
 *     for internal content changes.
 *
 * @param  {String} href      - The requested URL.
 * @param  {Object} [options] - The options for this request.
 * @return {void}
 */
Phax.prototype.loadUrl = function (href, options) {
    if (options.disposition === PhaxDisposition.INTERNAL && options.transition !== true) {
        this.log('internal href', href, options);

        this.handleRoute(href, options);
    } else {
        // Pjax.prototype.loadUrl.call(this, href, options);
        this.__loadUrl(href, options);
    }
};

/**
 * Processes the URL, then calls {@see pjax.processRoute()} to allow related modules
 * to process the new history state.
 *
 * @param  {String} href    - The "internal" URL that was passed to `loadUrl()`.
 * @param  {Object} options - The "internal" options for this request.
 * @return {void}
 */
Phax.prototype.handleRoute = function (href, options) {
    options = $.extend({}, options || this.options);
    options.request = null;

    // push scroll position to history
    var currentState = window.history.state || {};
    window.history.replaceState(
        {
            url:         currentState.url         || window.location.href,
            title:       currentState.title       || document.title,
            namespace:   currentState.namespace   || null,
            disposition: currentState.disposition || null,
            uid:         currentState.uid         || newUid(),
            scrollPos:   [
                document.documentElement.scrollLeft || document.body.scrollLeft,
                document.documentElement.scrollTop  || document.body.scrollTop,
            ],
        },
        document.title,
        window.location.href
    );

    this.state.href    = href;
    this.state.options = options;

    try {
        this.processRoute(href, options);
    } catch (e) {
        trigger(document, 'pjax:error', options);

        if (!this.options.debug) {
            if (console && console.error) {
                console.error('Pjax switch fail: ', e);
            }
            return this.latestChance(href);
        } else {
            throw e;
        }
    }
};

/**
 * @abstract
 *
 * @param  {String} href    - The "internal" URL that was passed to `loadUrl()`.
 * @param  {Object} options - The "internal" options for this request.
 * @return {void}
 */
Phax.prototype.processRoute = function (href, options) {
    const state = this.state;

    if (state.options.history) {
        if (!window.history.state) {
            this.lastUid = this.maxUid = newUid();
            this.lastNamespace = null;
            this.lastDisposition = null;
            window.history.replaceState(
                {
                    url:         window.location.href,
                    title:       document.title,
                    namespace:   null,
                    disposition: null,
                    uid:         this.maxUid,
                    scrollPos:   [ 0, 0 ],
                },
                document.title
            );
        }

        // Update browser history
        this.lastUid = this.maxUid = newUid();
        this.lastNamespace = state.options.namespace || null;
        this.lastDisposition = state.options.disposition || null;

        window.history.pushState(
            {
                url:         state.href,
                title:       state.options.title,
                namespace:   this.lastNamespace,
                disposition: this.lastDisposition,
                uid:         this.maxUid,
                scrollPos:   [ 0, 0 ],
            },
            state.options.title,
            state.href
        );
    }

    trigger(document, 'pjax:complete pjax:success', state.options);
};

/**
 * @override Pjax.prototype.afterAllSwitches()
 *     This method updates the custom {@see pjax.lastNamespace}
 *     and {@see pjax.lastDisposition} properties.
 *
 * @return {void}
 */
Phax.prototype.afterAllSwitches = function () {
    // Keep a copy because Pjax.prototype.afterAllSwitches()
    // resets the class property
    const state = $.extend({}, this.state);

    // Pjax.prototype.afterAllSwitches.call(this);
    this.__afterAllSwitches();

    // Update the new history state
    if (state.options.history) {
        this.lastNamespace   = state.options.namespace || null;
        this.lastDisposition = state.options.disposition || null;

        window.history.replaceState(
            {
                url:         state.href,
                title:       state.options.title,
                namespace:   this.lastNamespace,
                disposition: this.lastDisposition,
                uid:         this.maxUid,
                scrollPos:   [ 0, 0 ],
            },
            state.options.title
        );
    }
};

export {
    Phax as default,
    PhaxDisposition
};
