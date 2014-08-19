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
        o.constructor();
        o.detectSvgSupport();
        //o.parallaxEffect('.parallax', 0.036, 'image');
        //o.parallaxEffect('.landing', 0.30);
        //o.responsiveLogger(); // Only turn on in dev environment
    },

    detectSvgSupport: function () {
        if (!Modernizr.svg) {
            $('img[src*="svg"]').attr('src', function() {
                return $(this).attr('src').replace('.svg', '.png');
            });
        }
    },

    setHeightToParent: function (element, parent) {
        var getHeight = element.parents(parent).outerHeight(true);
        element.css('height', getHeight+'px');
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

    parallaxEffect : function (el, moveBy, type) {
        var element = $(el);
        if (element.length) {
            $(window).scroll( function () {
                var vMove = $(window).scrollTop();
                if (type === 'image') {
                    element.css('background-position', '50%' + (vMove * moveBy)+'%');
                } else {
                    element.css('top', (vMove * moveBy)+'px');
                }
            });
        }
    }
};

$(document).ready( function() {
    Core.init();
});

