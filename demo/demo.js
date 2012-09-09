require(['jquery', 'knockout', 'underscore', 'pager', 'bootstrap', 'history'], function ($, ko, _, pager) {
    var viewModel = {
        name:ko.observable("Pelle"),
        description:ko.observable('pl'),
        externalContentLoaded:function (page) {
            prettyPrint();
        },
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
        loggedIn:ko.observable(false),
        isLoggedIn:function (page, route, callback) {
            if (viewModel.loggedIn()) {
                callback();
            } else {
                window.location.href = "#guards/login";
            }
        },
        logout:function () {
            viewModel.loggedIn(false);
            return true;
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

    window.requireView = function (viewModule) {
        return function (page, callback) {
            require([viewModule], function (viewString) {
                $(page.element).html(viewString);
                callback();
            });
        };
    };

    window.recapLoaded = function (page) {
        prettyPrint();
        $('.tt').tooltip();

        // for each h3
        var h3s = $('h3', $(page.element));
        $.each(h3s, function (h3Index, h3) {
            var $h3 = $(h3);
            // get all siblings until another h3 or h2
            var siblings = $([]);
            var sibling = $h3.next();
            while (sibling && sibling.length > 0 && sibling[0].tagName.toLocaleLowerCase() !== 'h3' && sibling[0].tagName.toLocaleLowerCase() !== 'h2') {
                siblings.push(sibling);
                sibling = sibling.next();
            }
            // hide all siblings
            siblings.toggle();
            // on h3-click toggle all siblings
            $h3.click(function () {
                siblings.toggle();
            });
        });
    };


    $(function () {

        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);

        // using jquery hashchange-plugin instead of pager.start
        $(window).hashchange(function () {
            var hash = location.hash;
            // strip #
            if (hash[0] === '#') {
                hash = hash.slice(1);
            }
            // split on '/'
            var hashRoute = decodeURIComponent(hash).split('/');
            pager.showChild(hashRoute);
        });
        $(window).hashchange();

        $('.dropdown-toggle').dropdown();
    });


});