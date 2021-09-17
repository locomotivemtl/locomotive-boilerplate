import notifier from 'node-notifier';

/**
 * Sends a cross-platform native notification.
 *
 * Wraps around node-notifier to assign default values.
 *
 * @param {string|object} options         - The notification options or a message.
 * @param {string}        options.title   - The notification title.
 * @param {string}        options.message - The notification message.
 * @param {string}        options.icon    - The notification icon.
 */
export default function notification(options) {
    if (typeof options === 'string') {
        options = {
            message: options
        };
    } else if (!options.title && !options.message) {
        throw new TypeError(
            'Notification expects at least a \'message\' parameter'
        );
    }

    if (typeof options.icon === 'undefined') {
        options.icon = 'https://user-images.githubusercontent.com/4596862/54868065-c2aea200-4d5e-11e9-9ce3-e0013c15f48c.png';
    }

    notifier.notify(options);
};
