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
        if (f.formContainer.length) {
            f.enableForms();
            f.validation();
        }
    },

    enableForms : function () {
        var f = this;
        // Disable forms on the site if javascript is not enabled/supported.
        f.formContainer.removeClass('disabled');
        f.formContainer.find('.warning').remove();
        f.formContainer.find('input, textarea, button').prop('disabled', false);
        // note submit button will not be enabled until validation has passed
    },

    validation : function() {
        // client side validation
        // Any form inside a .form container will be subject to the validation rules set below.
        var f = this,
            passed = false; // Assume the form has failed until validation has completed

        // getLimitType finds the 'maxLength' attribute of the input to determine the length of the input
        // this attribute can be safely used as nothing can ever exceed the max length anyway.
        var getLimitType = function (element) {
            var ml = element.find('input').attr('maxlength');
            if (element.hasClass('exact-chars')) {
                return 'exact_'+ml;
            } else if (element.hasClass('min-chars')) {
                return 'min_'+ml;
            } else if (element.hasClass('max-chars')) {
                return 'max_'+ml;
            } else {
                return 0;
            }
        };

       var runValidator = function(element, mandatory, charlimit, friendlyname, regex) {
            // runValiator has three mandatory paramaters and one optional.
            // element = the container that the targeted input it in (eg .input.validate-as-number) only one input should be in this container
            // mandatory = is this a mandatory field? Options are true or false.
            // Charlimit = is there a max number of charactters? Set to '0' for no.  (Also set to zero if the charlimit is being set elsewhere eg in a custom validator)
            // Charlimit has a few options. It defaults to the maximum number of characters, however you can change it to minimum by calling 'Min_X' or set
            // an exact limit (eg exactly 10 chars) by calling "Exact_X"
            // friendlyname = the element name in a format which can be shown to the end user.
            // Regex = this is the regex pattern required to validate a field. It can be left blank if this is not required.
            // note: runValidator CAN be used on custom validation operations but it will only work on text-based inputs.

            regex = regex || null;

            //check if the item is mandatory and then optionally perform a test based on the regex required and will return either true or false.
            if (mandatory === true) {
                // test to ensure the input has been completed. If not return 'empty' and stop processing
                if (!element.val().length) {
                    passed = false;
                    return {
                        valid: false,
                        errorType: 'empty'
                    };
                }
            }


            if (charlimit !== 0 && charlimit.indexOf("max") >= 0) {
                var max = parseInt(charlimit.split("_").pop());
                if (element.val().length > max) {
                    passed = false;
                    return {
                        valid: false,
                        errorType: 'max-chars',
                        errorVar: max
                    };
                }
            }

            if (charlimit !== 0 && charlimit.indexOf("min") >= 0) {

                var min = parseInt(charlimit.split("_").pop());
                if (element.val().length < min) {
                    passed = false;
                    return {
                        valid: false,
                        errorType: 'min-chars',
                        errorVar: min
                    };
                }
            }

            if (charlimit !== 0 && charlimit.indexOf("exact") >= 0) {
                // If a specific limit is set (eg must be exactly 10 chars)
                var limitTo = parseInt(charlimit.split("_").pop());
                if (element.val().length !== limitTo) {
                    passed = false;
                    return {
                        valid: false,
                        errorType: 'limit-chars',
                        errorVar: limitTo
                    };
                }
            }

            if (regex) {
                if (element.val().length) {
                    // If the field has been filled in test against a regex.
                    var isValid = (!regex.test(element.val())) ? false : true;
                    if(!isValid) {
                        passed = false;
                        var classList = element.attr('class').split(" ");
                        var classIndex = classList.filter(function(word){
                            if(word.match(/v-/g)) return true;
                        }).toString();
                        var regexType = classIndex.replace('v-', '');
                        return {
                            valid: false,
                            errorType: 'regex-'+regexType
                        };
                    }
                }
            }

            if (passed) return true; // No errors were found, validation passed.
        };

        var showErrors = function(results, el) {
            if (results.valid === false) {
                var errorType = results.errorType,
                    errorVar = results.errorVar || results.errorType;
                $(el).addClass('error-flag');

                // Validator did not pass, work out which error was returned and display apropriate message
                switch(errorType){
                    case 'empty':
                        // if (variableField.length) {
                        //     variableField.html(friendlyName);
                        // }
                        // TODO: Else show default text in error
                    break;
                    case 'max-chars':
                    case 'min-chars':
                    case 'limit-chars':
                        // variableField.html(friendlyName);
                        // updateError.find('.variable-number').html(errorVar);
                    break;
                    // Anything else is a regex error
                    default:
                        // updateError.find('.variable-field').html(friendlyName);
                    break;
                }
            }
        };
        var executeValidation = function(el) {
            var form = $(el);

            form.find('input, textarea').each( function() {
                var el = $(this),
                    mandatory = false,
                    theregex = null,
                    results = null,
                    friendlyName = el.parent().find('label').text().replace('_', '');

                /**** Validation presets ****/

                // Input can only contain numbers
                if (el.hasClass('v-num')) theregex = new RegExp("^([0-9])+$");
                // Input can only contain letters (Inlcudes foreign characters)
                if (el.hasClass('v-text')) theregex = new RegExp("^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð .'-]+$");
                // Input cannot contain symbols (letters and numbers only)
                if (el.hasClass('v-alpha')) theregex = new RegExp("[A-Za-z0-9' -]$");
                // Input must validate as a UK postcode
                if (el.hasClass('v-postcode')) theregex = new RegExp("^([A-PR-UWYZa-pr-uwyz]([0-9]{1,2}|([A-HK-Ya-hk-y][0-9]|[A-HK-Ya-hk-y][0-9]([0-9]|[ABEHMNPRV-Yabehmnprvwx-y]))|[0-9][A-HJKPS-UWa-hjkps-uw]) {0,1}[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2})$");
                // Input must validate as email
                if (el.hasClass('v-email')) theregex = new RegExp("^([a-zA-Z0-9\'_\\-\\+\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
                // Input must validate as password
                if (el.hasClass('v-password')) theregex = new RegExp("^[a-zA-Z0-9#~@]{7,14}$");
                // Input must validate as telephone number
                if (el.hasClass('v-tel')) theregex = new RegExp("^(((\\+44\\s?\\d{4}|\\(?0\\d{4}\\)?)\\s?\\d{3}\\s?\\d{3})|((\\+44\\s?\\d{3}|\\(?0\\d{3}\\)?)\\s?\\d{3}\\s?\\d{4})|((\\+44\\s?\\d{2}|\\(?0\\d{2}\\)?)\\s?\\d{4}\\s?\\d{4}))(\\s?\\#(\\d{4}|\\d{3}))?$");

                // Determine if there are any limitations on character numbers and return the correct parameter
                var charLimit = getLimitType(el);
                // Input is mandatory
                if (el.hasClass('required')) mandatory = true;

                results = runValidator(el, mandatory, charLimit, friendlyName, theregex);
                    if (typeof results !== "undefined") {
                    // if there are errors, show them.
                    showErrors(results, el);
                }
            }).on('focus', function() {
                // Remove error flags on focus
                $(this).removeClass('error-flag');
            });
        };


        f.formContainer.find('button').on('click', function(e) {
            e.preventDefault();
            executeValidation($(this).parents('form'));
        });

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

