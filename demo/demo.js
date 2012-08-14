require(['jquery', 'knockout', 'underscore', 'pager'], function ($, ko, _, pager) {
    var isLoaded = ko.observable(false);
    var viewModel = {
        name:ko.observable("Pelle")
    };

    pager.extendWithPage(viewModel);
    ko.applyBindings(viewModel);
    pager.start(viewModel);

});