// The mobile only functions activated in Core object.
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
                nav.slideUp( function() {
                    header.removeClass('open').addClass('closed');
                });
                toggle = 0;
            }
        });
    }
};
