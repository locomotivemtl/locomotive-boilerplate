/**
 * Module to display a modal dialog.
 *
 * Uses {@link https://github.com/KittyGiraudel/a11y-dialog A11y Dialog}.
 *
 * ### Usage
 *
 * ```html
 * <!-- 1. The dialog container -->
 * <div
 *   id="your-dialog-id"
 *   data-module-modal="your-dialog-id"
 *   aria-labelledby="your-dialog-title-id"
 *   aria-hidden="true"
 * >
 *   <!-- 2. The dialog overlay -->
 *   <div data-a11y-dialog-hide></div>
 *   <!-- 3. The actual dialog -->
 *   <div role="document">
 *     <!-- 4. The close button -->
 *     <button type="button" data-a11y-dialog-hide aria-label="Close dialog">
 *       &times;
 *     </button>
 *     <!-- 5. The dialog title -->
 *     <h1 id="your-dialog-title-id">Your dialog title</h1>
 *     <!-- 6. Dialog content -->
 *   </div>
 * </div>
 *
 * <!-- 7. The a11y-dialog modal trigger -->
 * <button type="button" data-a11y-dialog-show="your-dialog-id">
 *   Open the dialog
 * </button>
 * ```
 *
 * The dialog container must have a unique name for the `data-module-modal`
 * attribute for cross-component interaction.
 *
 * The `id` attribute is recommended but optional if `data-module-modal`
 * is present with a unique name.
 *
 * If the dialog container uses the `data-a11y-dialog` attribute for automatic
 * instantiation through HTML, this component will not initialize.
 *
 * ### Features
 *
 * #### Automatically showing dialog
 *
 * The modal supports being shown on page load via the
 * `data-modal-autoshow` attribute:
 *
 * ```html
 * <div data-module-modal="your-dialog-id"
 *      data-modal-autoshow
 *      aria-labelledby="your-dialog-title-id"
 *      aria-hidden="true"
 * >
 * ```
 *
 * The modal will be shown during the module's `init()` process.
 *
 * #### Showing dialog once
 *
 * The modal supports being shown at most once via the
 * `data-modal-show-once` attribute:
 *
 * ```html
 * <div data-module-modal="your-dialog-id"
 *      data-modal-show-once
 *      aria-labelledby="your-dialog-title-id"
 *      aria-hidden="true"
 * >
 * ```
 *
 * By default, it uses {@see window.localStorage} to persist dismissal.
 * With a "session" value (`data-modal-show-once="session"`), the component
 * will use {@see window.sessionStorage}.
 */

import A11yDialog from 'a11y-dialog'
import { module } from 'modujs';
import { html, isDebug } from '../utils/environment';

/**
 * Component to display a modal dialog.
 *
 * @property {?A11yDialog} dialog     - The {@see A11yDialog} instance.
 * @property {string}      moduleName - The module class name.
 * @property {string}      moduleID   - The module class instance ID.
 */
export default class extends module
{
    /**
     * Whether the dialog should be shown on page load.
     *
     * @var {boolean}
     */
    autoShow = false;

    /**
     * The element to add `contextShowClass` to. Defaults to `<html>`.
     *
     * @var {Element}
     */
    contextElement = html;

    /**
     * The CSS class name to apply to `contextElement` to mark the dialog as shown.
     *
     * @var {string}
     */
    contextShowClass = 'has-modal-open';

    /**
     * Whether to log information about the modal.
     *
     * @var {boolean}
     */
    debug = isDebug;

    /**
     * The storage key to remember the dialog was dismissed.
     *
     * @var {?string}
     */
    dismissedStoreKey;

    /**
     * Whether the dialog can be shown at most once.
     *
     * @var {boolean}
     */
    showOnce = false;

    /**
     * The storage object; either `localStorage` or `sessionStorage`.
     *
     * @var {?Storage}
     */
    showOnceStore = window.localStorage;

    /**
     * Whether the dialog was shown.
     *
     * @var {boolean}
     */
    wasShown = false;

    /**
     * Creates a new Modal component.
     *
     * @param  {object} options          - The module options.
     * @param  {string} options.name     - The module class name.
     * @param  {string} options.dataName - The module data attribute name.
     * @throws {TypeError} If the module ID or module class is missing.
     */
    constructor(options) {
        super(options);

        this.events = {
            click: {
                dismiss: 'hide',
                hide:    'hide',
                show:    'show',
                toggle:  'toggle',
            },
            submit:    'onSubmit',
            submitend: 'hide',
        };

        const moduleAttr = `data-module-${options.dataName}`;

        this.moduleName = options.name;
        this.moduleID   = this.el.getAttribute(moduleAttr);

        if (!this.moduleID) {
            throw new TypeError(
                `${this.moduleName} must have an ID on attribute ${moduleAttr}`
            );
        }

        if (!this.el.hasAttribute('id')) {
            this.el.setAttribute('id', this.moduleID);
        }

        this._onHide   = this.onHide.bind(this);
        this._onShow   = this.onShow.bind(this);
        this._onSubmit = this.onSubmit.bind(this);

        this.resolveShowOnce();
    }

    /**
     * Creates the A11y Dialog instance and initializes the Modal component.
     *
     * If the `data-a11y-dialog` attribute is defined on the
     * {@see this.el dialog element}, the Modal component will
     * be ignored.
     *
     * If the Modal component was previously dismissed,
     * the component will be ignored.
     *
     * @return {void}
     */
    init() {
        if (this.el.hasAttribute('data-a11y-dialog')) {
            const dialogID = (this.el.getAttribute('data-a11y-dialog') || this.moduleID);
            this.debug && console.warn(`${this.moduleName} [${dialogID}] not initialized because of automatic instantiation through HTML`);
            return;
        }

        if (this.showOnce && this.wasShown) {
            this.debug && console.log(`${this.moduleName} [${this.moduleID}] not initialized because the dialog was previously dismissed`);
            return;
        }

        this.dialog = this.createDialog();

        /**
         * Assigning the this class and the dialog to the dialog container
         * element for easy access from the web console.
         */
        this.el.appModal   = this;
        this.el.a11yDialog = this.dialog;

        this.addDialogEventListeners();

        if (this.el.hasAttribute(`${this.mAttr}-autoshow`)) {
            this.dialog.show();
        }
    }

    /**
     * @inheritdoc
     */
    mUpdate(modules) {
        super.mUpdate(modules);

        this.refreshDialogOpeners();
    }

    /**
     * Creates a new A11y Dialog instance.
     *
     * @protected
     * @return {A11yDialog}
     */
    createDialog() {
        return new A11yDialog(this.el);
    }

    /**
     * Destroys the A11y Dialog instance and Modal component.
     *
     * @return {void}
     */
    destroy() {
        this.destroyDialog();

        delete this.el.appModal;
    }

    /**
     * Destroys only the A11y Dialog instance.
     *
     * @return {void}
     */
    destroyDialog() {
        if (this.dialog) {
            this.dialog.destroy();
        }

        delete this.el.a11yDialog;
    }

    /**
     * Dismisses the modal.
     *
     * Marks the modal as dismissed which means it
     * should not be shown for the foreseeable future.
     *
     * @protected
     * @param  {boolean} [destroy=false] - Whether to destroy the modal or not.
     * @return {void}
     */
    dismissDialog(destroy = false) {
        this.wasShown = true;

        if (this.showOnceStore && this.dismissedStoreKey) {
            this.showOnceStore.setItem(this.dismissedStoreKey, this.getDismissedStoreValue());
        } else {
            this.debug && console.warn(`${this.moduleName} [${dialogID}] does not have a 'showOnceStore' or a 'dismissedStoreKey' for persisting dismissal`);
        }

        if (destroy) {
            this.destroyDialog();
        }
    }

    /**
     * Registers event listeners on the A11y Dialog.
     *
     * @protected
     * @return {void}
     */
    addDialogEventListeners() {
        if (this.dialog) {
            this.dialog.on('hide', this._onHide);
            this.dialog.on('show', this._onShow);
        }
    }

    /**
     * Unregisters event listeners on the A11y Dialog.
     *
     * @protected
     * @return {void}
     */
    removeDialogEventListeners() {
        if (this.dialog) {
            this.dialog.off('hide', this._onHide);
            this.dialog.off('show', this._onShow);
        }
    }

    /**
     * @return {self}
     */
    hide() {
        if (this.dialog) {
            this.dialog.hide();
        }

        return this;
    }

    /**
     * @return {self}
     */
    show() {
        if (this.dialog) {
            this.dialog.show();
        }

        return this;
    }

    /**
     * @return {self}
     */
    toggle() {
        if (this.dialog) {
            if (this.dialog.shown) {
                this.dialog.hide();
            } else {
                this.dialog.show();
            }
        }

        return this;
    }

    /**
     * Returns the storage key to remember the dialog was dismissed.
     *
     * @return {string}
     */
    getDismissedStoreKey() {
        return `${this.moduleName}.${this.moduleID}.dismissed`;
    }

    /**
     * Returns the storage value to remember the dialog was dismissed.
     *
     * @return {string}
     */
    getDismissedStoreValue() {
        return (new Date()).toISOString();
    }

    /**
     * Returns a list of kebab-case form module names.
     *
     * @return {string[]}
     */
    getFormModuleNames() {
        return [
            'form',
        ];
    }

    /**
     * Fires when the dialog has finished being hidden from the user.
     *
     * This method will trigger dismissal of the dialog if to be
     * {@see this.showOnce shown at most once}.
     *
     * This method will remove the {@see this.contextShowClass CSS context show class}.
     *
     * @listens A11yDialog#hide
     *
     * @protected
     * @param  {Element} dialogEl - The dialog container element.
     * @param  {Event}   event    - The dialog hide event.
     * @return {void}
     */
    onHide(dialogEl, event) {
        if (this.showOnce && !this.wasShown) {
            this.dismissDialog(true);
        }

        if (this.contextElement && this.contextShowClass) {
            this.contextElement.classList.remove(this.contextShowClass);
        }
    }

    /**
     * Fires when the dialog has been made visible to the user.
     *
     * This method will add the {@see this.contextShowClass CSS context show class}.
     *
     * @listens A11yDialog#show
     *
     * @protected
     * @param  {Element} dialogEl - The dialog container element.
     * @param  {Event}   event    - The dialog show event.
     * @return {void}
     */
    onShow(dialogEl, event) {
        if (this.contextElement && this.contextShowClass) {
            this.contextElement.classList.add(this.contextShowClass);
        }
    }

    /**
     * Handles form submission inside the modal.
     *
     * This event listener is used to handle forms that do not use a custom
     * form module where the modal will dispatch a custom "submitend" event.
     *
     * @listens form#submit
     * @fires   form#submitend
     *
     * @protected
     * @param  {Event} event - The submit event.
     * @return {void}
     */
    onSubmit(event) {
        const selectors = this.getFormModuleNames()
            .map((name) => `:not([data-module-${name}])`)
            .join('');

        if (event.target.matches(selectors)) {
            this.debug && console.log('Modal.onSubmit')
            const submitEndEvent = new CustomEvent('submitend', {
                bubbles: true
            });
            event.target.dispatchEvent(submitEndEvent);
        }
    }

    /**
     * Refreshes all opener event listeners of the A11y Dialog instance.
     *
     * @protected
     * @return {void}
     */
    refreshDialogOpeners() {
        if (this.dialog) {
            // Remove the click event listener from all dialog openers
            this.dialog._openers.forEach((opener) => {
                opener.removeEventListener('click', this.dialog._show);
            });

            // Keep a collection of dialog openers, each of which will be bound a click
            // event listener to open the dialog
            this.dialog._openers = document.querySelectorAll('[data-a11y-dialog-show="' + this.dialog._id + '"]');
            this.dialog._openers.forEach((opener) => {
                opener.addEventListener('click', this.dialog._show);
            });
        }
    }

    /**
     * Configures the "show at most once" feature.
     *
     * @protected
     * @return {void}
     */
    resolveShowOnce() {
        const showOnceAttr = `${this.mAttr}-show-once`;

        this.showOnce = this.el.hasAttribute(showOnceAttr);

        if (!this.showOnce) {
            return;
        }

        switch (this.el.getAttribute(showOnceAttr)) {
            case 'session':
                this.showOnceStore = window.sessionStorage;
                break;

            case 'local':
                this.showOnceStore = window.localStorage;
                break;
        }

        this.dismissedStoreKey = this.getDismissedStoreKey();

        if (this.showOnceStore) {
            this.wasShown = this.showOnceStore.getItem(this.dismissedStoreKey);
        }
    }
}
