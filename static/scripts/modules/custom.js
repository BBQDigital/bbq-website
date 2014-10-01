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
        o.interceptSkip();
        //o.responsiveLogger(); // Only turn on in dev environment

        /* These are fine for now but don't allow them into release 2 */
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) Mobile.init();
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

    interceptSkip : function () {
        //As javascript is enabled, lets intercept the clicking of the skip link and make it scroll instead of jump to the content.
        var o = this,
        offset = $('#main').offset(),
        jumpTo = offset.top-40;

        o.bodyTag.find('.skip a').on('click', function(e) {
            e.preventDefault();
            $('html, body').animate({ scrollTop: jumpTo });
        });
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
                o.viewportHeight = $('body').outerHeight(true);
                o.screenLogger.html('w: '+o.viewportWidth+'px  h: '+o.viewportHeight+'px');
            }, 500
        );
    }
};
