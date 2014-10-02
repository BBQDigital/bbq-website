
// 3rd party functions - ignored by JShint, use with caution and always cite sources
/* jshint ignore:start */

// Read a page's GET URL variables and return them as an associative array. (thanks to http://jquery-howto.blogspot.co.uk/2009/09/get-url-parameters-values-with-jquery.html)
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/* jshint ignore:end */

// Core functions which are used throughout the site on all devices
Core = {
    constructor: function () {

        // set global variables.
        this.bodyTag = $('body');
        this.viewportHeight = this.bodyTag.outerHeight(true);
        this.viewportWidth = this.bodyTag.outerWidth(true);
    },

    init: function () {
        var o = this;
        o.constructor();
        o.loader();
        o.contentCycle('.testimonials blockquote');
        o.warningClose();
        //o.responsiveLogger(); // Only turn on in dev environment

        if (o.viewportWidth <= 650) Mobile.init();
        if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) { Desktop.init(); }

    },

    loader : function () {
        // Things to do as soon as the page has loaded.
        var o = this;
        o.bodyTag.find('.js-disabled').remove();
    },

    warningClose : function () {
        var o = this;
        o.bodyTag.find('.warning').click(function() {
            $(this).fadeOut('fast');
        }).append('<div class="close">x</div>');
    },

    contentCycle : function (element) {
        var el = $(element).hide(),
            count = el.length,
            i = 1;
            el.first().show();
            setInterval( function () {
                if (i < count) {
                    el.fadeOut('fast').delay('300');
                    el.eq(i).fadeIn('slow');
                    i++;
                } else {
                    i = 0;
                }
            }, 11000);
    },

    setHeightToParent: function (element, parent) {
        var getHeight = element.parents(parent).outerHeight(true);
        element.css('height', getHeight+'px');
    },

    responsiveLogger: function() {
        // Output the screen width (For development only this method should be removed when the site is deployed)
        var o = this;
        o.screenLogger = $('<div style="position:fixed;right:5px;top:5px;padding:10px;font-size:12px;background:black;color:#fff;z-index:10000;opacity:0.8"></div>');
        o.screenLogger.appendTo('body');
        setInterval(
            function() {
                o.viewportWidth = $('body').outerWidth(true);
                o.screenLogger.html(o.viewportWidth+'px');
            }, 500
        );
    }
};

// Desktop only functions
Desktop = {
    init : function () {
        var d = this;
        d.parallaxEffect('.parallax', 0.036, 'image');
        d.parallaxEffect('.landing', 0.25);
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
    Forms.init();
});
