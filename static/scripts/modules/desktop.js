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
