requirejs.config({
    shim: {
        bootstrap: ['jquery'],
        hashchange: ['jquery']
    },
    paths: {
        product: 'vm/product',
        jquery: 'lib/jquery-1.7.2.min',
        knockout: 'lib/knockout-2.2.0',
        pager: 'lib/pager.min',
        hashchange: 'lib/jquery.ba-hashchange.min'
    }
});

requirejs(['jquery', 'knockout', 'pager', 'hashchange'], function ($, ko, pager) {

    var viewModel = {
        "products": [
            {
                "name": "What-If Machine",
                "price": "$ 100"
            },
            {
                "name": "Fing-Longer",
                "price": "$ 200"
            },
            {
                "name": "Parallel Universe Box",
                "price": "$ 1000"
            }
        ]
    };

    window.requireVM = function (moduleName) {
        return function (callback) {
            require([moduleName], function (mod) {
                callback(mod);
            });
        };
    };

    window.requireJson = function(url) {

    };

    // withOnShow: requireVM('product')

    $(function () {
        pager.Href.hash = '#!/';

        pager.extendWithPage(viewModel);

        ko.applyBindings(viewModel);
        pager.start();

    });
});