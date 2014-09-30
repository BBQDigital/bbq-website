// The mobile only functions activated in Core object.
Mobile = {
    init : function () {
        var m = this;
        m.mobileMenu();
    },

    mobileMenu: function () {
        var toggle = 0,
        header = Core.bodyTag.find('.wrapper > header');
        header.on('click', function () {
            if (toggle === 0) {
                $(this).addClass('open');
                toggle = 1;
            } else {
                header.removeClass('open');
                toggle = 0;
            }
        });
    }
};
