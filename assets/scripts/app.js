import { APP_NAME, $document, $pjaxWrapper } from './utils/environment';

import globals from './globals';

import { arrayContains, removeFromArray } from './utils/array';
import { getNodeData } from './utils/html';
import { isFunction } from './utils/is';

// Basic modules
import * as modules from './modules';

const MODULE_NAME = 'App';
const EVENT_NAMESPACE = `${APP_NAME}.${MODULE_NAME}`;

export const EVENT = {
    INIT_MODULES: `initModules.${EVENT_NAMESPACE}`,
    INIT_SCOPED_MODULES: `initScopedModules.${EVENT_NAMESPACE}`,
    DELETE_SCOPED_MODULES: `deleteScopedModules.${EVENT_NAMESPACE}`
};

class App {
    constructor() {
        this.modules = modules;
        this.currentModules = [];

        $document.on(EVENT.INIT_MODULES, (event) => {
            this.initGlobals(event.firstBlood)
                .deleteModules(event)
                .initModules(event);
        });

        $document.on(EVENT.INIT_SCOPED_MODULES, (event) => {
            this.initModules(event);
        });

        $document.on(EVENT.DELETE_SCOPED_MODULES, (event) => {
            this.deleteModules(event);
        });
    }

    /**
     * Destroy all existing modules or a specific scope of modules
     * @param  {Object} event The event being triggered.
     * @return {Object}       Self (allows chaining)
     */
    deleteModules(event) {
        let destroyAll = true;
        let moduleIds = [];

        // Check for scope first
        if (event.$scope instanceof jQuery && event.$scope.length > 0) {
            // Modules within scope
            const $modules = event.$scope.find('[data-module]');

            // Determine their uids
            moduleIds = $.makeArray($modules.map(function(index) {
                return $modules.eq(index).data('uid');
            }));

            if (moduleIds.length > 0) {
                destroyAll = false;
            } else {
                return this;
            }
        }

        // Loop modules and destroying all of them, or specific ones
        let i = this.currentModules.length;

        while (i--) {
            if (destroyAll || arrayContains(moduleIds, this.currentModules[i].uid)) {
                removeFromArray(moduleIds, this.currentModules[i].uid);
                this.currentModules[i].destroy();
                this.currentModules.splice(i, 1);
            }
        }

        return this;
    }

    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return {Object} Self (allows chaining)
     */
    initGlobals(firstBlood) {
        globals(firstBlood);
        return this;
    }

    /**
     * Find modules and initialize them
     * @param  {Object} event The event being triggered.
     * @return {Object}       Self (allows chaining)
     */
    initModules(event) {
        // Elements with module
        let $moduleEls = [];

        // If first blood, load all modules in the DOM
        // If scoped, render elements with modules
        // If Barba, load modules contained in Barba container
        if (event.firstBlood) {
            $moduleEls = $document.find('[data-module]');
        } else if (event.$scope instanceof jQuery && event.$scope.length > 0) {
            $moduleEls = event.$scope.find('[data-module]');
        } else if (event.isPjax) {
            $moduleEls = $pjaxWrapper.find('[data-module]');
        }

        // Loop through elements
        let i = 0;
        const elsLen = $moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            let el = $moduleEls[i];

            // All data- attributes considered as options
            let options = getNodeData(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $moduleEls.eq(i);

            // Module does exist at this point
            let attr = options.module;

            // Splitting modules found in the data-attribute
            let moduleIdents = attr.split(/[,\s]+/g);

            // Loop modules
            let j = 0;
            let modulesLen = moduleIdents.length;

            for (; j < modulesLen; j++) {
                let moduleAttr = moduleIdents[j];

                if (typeof this.modules[moduleAttr] === 'function') {
                    let module = new this.modules[moduleAttr](options);
                    this.currentModules.push(module);
                    module.init();
                }
            }
        }

        return this;
    }
}

// IIFE for loading the application
// ==========================================================================
(function() {
    new App();
    $document.triggerHandler({
        type: EVENT.INIT_MODULES,
        firstBlood: true
    });
})();
