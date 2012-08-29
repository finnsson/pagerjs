require(['jquery', 'knockout', 'underscore', 'pager', 'bootstrap'], function ($, ko, _, pager, bootstrap) {
    var viewModel = {
        name:ko.observable("Pelle"),
        description:ko.observable('pl'),
        afterFryIsDisplayed:function () {
            $('body').css("background-color", "#FF9999");
        },
        beforeFryIsHidden:function () {
            $('body').stop().css("background-color", "#FFFFFF");
        }
    };

    window.requireVM = function (module) {
        return function (callback) {
            require([module], function (mod) {
                callback(mod.getVM());
            });
        };
    };

    pager.extendWithPage(viewModel);
    ko.applyBindings(viewModel);
    pager.start(viewModel);

    $('.dropdown-toggle').dropdown();


});