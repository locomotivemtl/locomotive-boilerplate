import { createFocusTrap } from 'focus-trap'
import { module as Module } from 'modujs'
import { $html } from '../utils/dom'
import { CUSTOM_EVENT } from '../config'

/**
 * Generic component to display a modal.
 *
 */
export default class Modal extends Module {
    /**
     * Creates a new Modal.
     *
     * @param  {object} options          - The module options.
     * @param  {string} options.dataName - The module data attribute name.
     * @throws {TypeError} If the class does not have an active CSS class defined.
     */

    static CLASS = {
        EL: 'is-open',
        HTML: 'has-modal-open',
    }

    constructor(options) {
        super(options)

        // Data
        this.moduleName = options.name
        this.dataName   = this.getData('name') || options.dataName

        // Bindings
        this.toggle         = this.toggle.bind(this)
        this.onModalOpen    = this.onModalOpen.bind(this)
        this.onVisitStart   = this.onVisitStart.bind(this)

        // UI
        this.$togglers          = document.querySelectorAll(`[data-${this.dataName}-toggler]`)
        this.$focusTrapTargets  = Array.from(this.el.querySelectorAll(`[data-${this.dataName}-target]`))

        // Focus trap options
        this.focusTrapOptions = {
            /**
             * There is a delay between when the class is applied
             * and when the element is focusable
             */
            checkCanFocusTrap: (trapContainers) => {
                const results = trapContainers.map((trapContainer) => {
                    return new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (
                                getComputedStyle(trapContainer).visibility !==
                                'hidden'
                            ) {
                                resolve()
                                clearInterval(interval)
                            }
                        }, 5)
                    })
                })

                // Return a promise that resolves when all the trap containers are able to receive focus
                return Promise.all(results)
            },

            onActivate: () => {
                this.el.classList.add(Modal.CLASS.EL)
                $html.classList.add(Modal.CLASS.HTML)
                $html.classList.add('has-'+this.dataName+'-open')
                this.el.setAttribute('aria-hidden', false)
                this.isOpen = true

                this.onActivate?.();
            },

            onPostActivate: () => {
                this.$togglers.forEach(($toggler) => {
                    $toggler.setAttribute('aria-expanded', true)
                })
            },

            onDeactivate: () => {
                this.el.classList.remove(Modal.CLASS.EL)
                $html.classList.remove(Modal.CLASS.HTML)
                $html.classList.remove('has-'+this.dataName+'-open')
                this.el.setAttribute('aria-hidden', true)
                this.isOpen = false

                this.onDeactivate?.();
            },

            onPostDeactivate: () => {
                this.$togglers.forEach(($toggler) => {
                    $toggler.setAttribute('aria-expanded', false)
                })
            },

            clickOutsideDeactivates: true,
        }

        this.isOpen = false
    }

    /////////////////
    // Lifecycle
    /////////////////
    init() {
        this.onBeforeInit?.()

        this.focusTrap = createFocusTrap(
            this.$focusTrapTargets.length > 0 ? this.$focusTrapTargets : [this.el],
            this.focusTrapOptions
        )

        this.bindEvents()

        this.onInit?.()
    }

    destroy() {
        this.focusTrap?.deactivate?.({
            returnFocus: false,
        })

        this.unbindEvents()

        this.onDestroy?.()

        super.destroy()
    }

    /////////////////
    // Events
    /////////////////
    bindEvents() {
        window.addEventListener(CUSTOM_EVENT.VISIT_START, this.onVisitStart)
        window.addEventListener(CUSTOM_EVENT.MODAL_OPEN, this.onModalOpen)

        this.$togglers.forEach(($toggler) => {
            $toggler.addEventListener('click', this.toggle)
        })
    }

    unbindEvents() {
        window.removeEventListener(CUSTOM_EVENT.VISIT_START, this.onVisitStart)
        window.removeEventListener(CUSTOM_EVENT.MODAL_OPEN, this.onModalOpen)

        this.$togglers.forEach(($toggler) => {
            $toggler.removeEventListener('click', this.toggle)
        })
    }

    /////////////////
    // Callbacks
    /////////////////
    onVisitStart() {
        // Close the modal on page change
        this.close()
    }

    onModalOpen(event) {
        // Close the modal if another one is opened
        if (event.detail !== this.el) {
            this.close()
        }
    }

    /////////////////
    // Methods
    /////////////////
    toggle(event) {
        if (this.el.classList.contains(Modal.CLASS.EL)) {
            this.close(event)
        } else {
            this.open(event)
        }
    }

    open(args) {
        if (this.isOpen) return

        this.focusTrap?.activate?.()

        this.onOpen?.(args)

        window.dispatchEvent(new CustomEvent(CUSTOM_EVENT.MODAL_OPEN, { detail: this.el }))
    }

    close(args) {
        if (!this.isOpen) return

        this.focusTrap?.deactivate?.()

        this.onClose?.(args)
    }
}
