require(['jquery', 'knockout', 'underscore', 'pager', 'history'], function ($, ko, _, pager) {
    var viewModel = {
    };

    $(function () {
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);
        pager.start();
    });


});