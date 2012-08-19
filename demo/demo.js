require(['jquery', 'knockout', 'underscore', 'pager'], function ($, ko, _, pager) {
    var viewModel = {
        name:ko.observable("Pelle"),
        description: ko.observable('pl')
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


});