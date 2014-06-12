/* global Modernizr:true */

// Namespacing
var Core = Core || {};

Core = {
    constructor: function () {
        // Detect browser
        this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        this.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        // set global variables.
        this.bodyTag = $('body');
        this.bodyTag.removeClass('no-js').addClass('js'); // We know js has been detected so add the 'js' class to the page.
        this.viewportHeight = this.bodyTag.outerHeight(true);
        this.viewportWidth = this.bodyTag.outerWidth(true);
    },

    init: function () {
        var o = this;
        o.detectSvgSupport();
        //o.responsiveLogger(); // Only turn on in dev environment
    },

    detectSvgSupport: function () {
        if (!Modernizr.svg) {
            $('img[src*="svg"]').attr('src', function() {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    },

    responsiveLogger: function() {
        // Output the screen width (For development only this method should be removed when the site is deployed)
        var o = this;
        o.screenLogger = $('<div style="position:absolute;left:5px;top:5px;padding:10px;font-size:12px;background:black;color:#fff;z-index:10000;opacity:0.8"></div>');
        o.screenLogger.appendTo('body');
        setInterval(
            function() {
                o.viewportWidth = $('body').outerWidth(true);
                o.screenLogger.html(o.viewportWidth+'px');
            }, 500
        );
    },
};

$(document).ready( function() {
    Core.init();
});

