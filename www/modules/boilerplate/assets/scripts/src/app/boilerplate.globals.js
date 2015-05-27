var app = window.app || {};

app.Globals = {

    init : function(){

        'use strict';

        var self = this;

        /* Site wide binds go here
        ========================================================================== */
        if( $('.js-boilerplate-toggle').length ){

            $('.js-boilerplate-toggle').on('click',function(event) {
                // toggle toggle
            });

        }

        /* When all content has loaded, not just DOM
        ========================================================================== */
        window.onload = function() {

        };

    }

};