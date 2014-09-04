/* global Modernizr:true */

// Namespacing
var Core = Core || {};
var Mobile = Mobile || {};
var Desktop = Desktop || {};
var Forms = Forms || {};

// Core functions which are used throughout the site on all devices
Core = {
    constructor: function () {
        // Detect browser
        this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        this.isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

        // set global variables.
        this.bodyTag = $('body');
        this.viewportHeight = this.bodyTag.outerHeight(true);
        this.viewportWidth = this.bodyTag.outerWidth(true);

    },

    init: function () {
        var o = this;
        o.constructor();
        o.loader();
        o.detectSvgSupport();
        o.contentCycle('.testimonials blockquote');
        o.checkPosted();
        //o.responsiveLogger(); // Only turn on in dev environment

        if (o.viewportWidth <= 650) Mobile.init();
        if (o.viewportWidth >= 1024) Desktop.init();
    },

    loader : function () {
        // Things to do as soon as the page has loaded.
        var o = this;
        o.bodyTag.find('.js-disabled').remove();
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
        o.screenLogger = $('<div style="position:fixed;right:5px;top:5px;padding:10px;font-size:12px;background:black;color:#fff;z-index:10000;opacity:0.8"></div>');
        o.screenLogger.appendTo('body');
        setInterval(
            function() {
                o.viewportWidth = $('body').outerWidth(true);
                o.screenLogger.html(o.viewportWidth+'px');
            }, 500
        );
    },


    checkPosted: function () {
        var o = this;
        // Read a page's GET URL variables and return them as an associative array.
        if (o.bodyTag.find('form').length !== 0) {
            // if there is a form on the page, check to see if it has been posted
            if (getUrlVars().posted === 'true') $('.posted-message').addClass('true');
        }

    },
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

// The mobile only functions
Mobile = {
    init : function () {
        var m = this;
        m.mobileMenu();
    },

    mobileMenu: function () {
        var toggle = 0,
        header = Core.bodyTag.find('.wrapper > header'),
        nav = header.find('nav');
        header.on('click', function () {
            if (toggle === 0) {
                $(this).removeClass('closed').addClass('open');
                nav.slideDown();
                toggle = 1;
            } else {
                nav.slideUp(function(){
                    header.removeClass('open').addClass('closed');
                });
                toggle = 0;
            }
        });
    }
};

Forms = {
    constructor : function () {
        this.formContainer = Core.bodyTag.find('.form');
    },

    init : function () {
        var f = this;
        f.constructor();
        f.enableForms();
        f.validation();
    },

    enableForms : function () {
        var f = this;
        // Disable forms on the site if javascript is not enabled/supported.
        f.formContainer.removeClass('disabled');
        f.formContainer.find('.warning').remove();
        f.formContainer.find('input, textarea, button').prop('disabled', false);
    },

    validation : function() {
        // client side validation
    }
};

// 3rd party functions - ignored by JShint, use with caution and always cite sources
/* jshint ignore:start */

// Read a page's GET URL variables and return them as an associative array. (thanks to http://jquery-howto.blogspot.co.uk/2009/09/get-url-parameters-values-with-jquery.html)
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
/* jshint ignore:end */

$(document).ready( function() {
    Core.init();
    Forms.init();
});

