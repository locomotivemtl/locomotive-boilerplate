/* jshint esnext: true */
import { $document } from './utils/environment';
import { getNodeData } from './utils/html';

// Global functions and tools
import globals from './globals';
import { isFunction } from './utils/is';

// Basic modules
import * as modules from './modules';

class App {
    constructor() {
        this.modules = modules;
        this.currentModules = [];

        $document.on('initModules.App', (event) => {
            this.initGlobals(event.firstBlood)
                .deleteModules()
                .initModules(event);
        });

        $document.on('initScopedModules.App', (event) => {
            this.initModules(event);
        });
    }

    /**
     * Destroy all existing modules
     * @return  {Object}  this  Allows chaining
     */
    deleteModules() {
        // Loop modules
        let i = this.currentModules.length;

        // Destroy all modules
        while (i--) {
            this.currentModules[i].destroy();
            this.currentModules.splice(i);
        }

        return this;
    }

    /**
     * Execute global functions and settings
     * Allows you to initialize global modules only once if you need
     * (ex.: when using Barba.js or SmoothState.js)
     * @return  {Object}  this  Allows chaining
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
        let moduleEls;

        // If first blood, load all modules in the DOM
        // If scoped, render elements with modules
        // If not, load modules contained in Barba container
        if (event.firstBlood) {
            moduleEls = document.querySelectorAll('[data-module]');
        } else if (typeof event.scope !== 'undefined' && isFunction(event.scope.querySelectorAll)) {
            moduleEls = event.scope.querySelectorAll('[data-module]');
        } else {
            moduleEls = document.getElementById('js-barba-wrapper').querySelectorAll('[data-module]');
        }

        // Loop through elements
        let i = 0;
        const elsLen = moduleEls.length;

        for (; i < elsLen; i++) {

            // Current element
            let el = moduleEls[i];

            // All data- attributes considered as options
            let options = getNodeData(el);

            // Add current DOM element and jQuery element
            options.el = el;
            options.$el = $(el);

            // Module does exist at this point
            let attr = options.module;

            // Splitting modules found in the data-attribute
            let moduleIdents = attr.split(/,\s*|\s+/g);

            // Loop modules
            let j = 0;
            let modulesLen = moduleIdents.length;

            for (; j < modulesLen; j++) {
                let moduleAttr = moduleIdents[j];

                if (typeof this.modules[moduleAttr] === 'function') {
                    let module = new this.modules[moduleAttr](options);
                    this.currentModules.push(module);
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
        type: 'initModules.App',
        firstBlood: true
    });
})();
