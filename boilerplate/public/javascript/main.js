require(['jquery', 'knockout', 'underscore', 'pager', 'history'], function ($, ko, _, pager, history) {
    var viewModel = {
    };

    viewModel.requireVM = function (module) {
        return function (callback) {
            require([module], function (mod) {
                callback(mod.getVM());
            });
        };
    };

    viewModel.requireView = function (viewModule) {
        return function (page, callback) {
            require([viewModule], function (viewString) {
                $(page.element).html(viewString);
                callback();
            });
        };
    };

    $(function () {

        //pager.useHTML5history = true;
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);

        var hashChange = function (hash) {
            console.error("hashChange");
            // strip #
            if (hash[0] === '#') {
                hash = hash.slice(1);
            }
            // split on '/'
            var hashRoute = decodeURIComponent(hash).split('/');
            pager.showChild(hashRoute);
        };

        // Bind to StateChange Event
        History.Adapter.bind(window,'statechange',function(){
            console.error("statechange");
            var relativeUrl = History.getState().url.replace(History.getRootUrl(), '');
            hashChange(relativeUrl);
        });
        History.Adapter.bind(window,'anchorchange',function(){
            console.error("anchorchange");
            hashChange(location.hash);
        });

        hashChange(History.getState().url.replace(History.getRootUrl(), ''));

        window.Hist = History;
        window.P = pager;

    });


});