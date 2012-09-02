require(['jquery', 'knockout', 'underscore', 'pager', 'bootstrap'], function ($, ko, _, pager, bootstrap) {
    var viewModel = {
        name:ko.observable("Pelle"),
        description:ko.observable('pl'),
        afterFryIsDisplayed:function () {
            $('body').css("background-color", "#FF9999");
        },
        beforeFryIsHidden:function () {
            $('body').stop().css("background-color", "#FFFFFF");
        },
        showFry:function (page, callback) {
            $(page.element).fadeIn(1000, callback);
        },
        hideFry:function (page, callback) {
            $(page.element).fadeOut(1000, function () {
                $(page.element).hide();
                if (callback) {
                    callback();
                }
            });
        },
        textLoader:function (page, element) {
            var loader = {};
            var txt = $('<div></div>', {text:'Loading ' + page.getValue().title});
            loader.load = function () {
                $(element).append(txt);
            };
            loader.unload = function () {
                txt.remove();
            };
            return loader;
        },
        randomFailed:function (page, route) {
            viewModel.newChildren.push({
                childId:route[0]
            });
            page.showPage(route);
        },
        newChildren:ko.observableArray([])
    };

    window.requireVM = function (module) {
        return function (callback) {
            require([module], function (mod) {
                callback(mod.getVM());
            });
        };
    };

    $(function () {

        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);
        pager.start(viewModel);

        $('.dropdown-toggle').dropdown();
    });


});