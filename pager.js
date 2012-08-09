window.pager = {};

pager.start = function (viewModel) {
    $(window).bind('hashchange', function () {
        pager.route(viewModel.$page, window.location.hash);
    });
    //pager.route(viewModel.$page, window.location.hash);
};

pager.extendWithPage = function (viewModel) {
    viewModel.$page = ko.observable({
        children:ko.observableArray([]),
        route:ko.observableArray([]),
        parentRoute:ko.observableArray([]),
        matched:0,
        __id__:Math.random()
    });
};

pager.route = function ($page, hash) {
    // skip #
    if (hash[0] === '#') {
        hash = hash.slice(1);
    }
    // split on '/'
    var hashRoute = hash.split('/');
    // update route
    $page().route(hashRoute);
};

/**
 *
 * @class ko.bindingHandlers.page
 *
 * Configuration options:
 * id
 * with
 *
 */
ko.bindingHandlers.page = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).hide();
        var value = ko.utils.unwrapObservable(valueAccessor());
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page();
        var route = ko.observableArray([]);
        var parentRoute = ko.observableArray([]);
        ko.computed(function () {
            route(page.route().slice(1));

            if (page.parentRoute) {
                var copyOfParent = page.parentRoute().slice(0);
                copyOfParent.push(value.id);
                parentRoute(copyOfParent);
            } else {
                parentRoute([value.id]);
            }
        });
        var pagerValues = {
            "$page":ko.observable({
                children:ko.observableArray([]),
                parentRoute:parentRoute,
                route:route,
                matched:0,
                __id__:Math.random()
            })
        };

        // Fetch source
        if (value.source) {
            $(element).load(value.source);
        }

        var childBindingContext = bindingContext.createChildContext(value.with ? value.with : viewModel);
        ko.utils.extend(childBindingContext, pagerValues);
        ko.applyBindingsToDescendants(childBindingContext, element);
        return { controlsDescendantBindings:true};
    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page();

        var show = function () {
            var $element = $(element);
            if (!$element.is(':visible')) {
                page.matched++;
                $(element).show();

                // Fetch source
                if (value.sourceOnShow) {
                    if (!value.sourceCache
                        || !element.__pagerLoaded__
                        || (typeof(value.sourceCache) === 'number' && element.__pagerLoaded__ + value.sourceCache * 1000 < Date.now())) {
                        element.__pagerLoaded__ = Date.now();
                        $(element).load(value.sourceOnShow);
                    }
                }
            }
        };

        if (value.id === '?' || value.id === 'start') {
            console.error(value.id + ', matched: ' + page.matched + ', pageid: ' + page.__id__);
        }
        if (value.id === page.route()[0]) {
            // show element
            show();
        } else if ((page.route()[0] === '' || page.route()[0] == null ) && value.id === 'start') {
            show();
        } else if (page.matched === 0 && value.id === '?') {
            show();
        } else {
            // hide element
            if ($(element).is(':visible')) {
                page.matched--;
                console.error("id: " + value.id + ", pageid: " + page.__id__);
                $(element).hide();
            }
        }
    }
};

ko.bindingHandlers['page-href'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page();

        var parentsToTrim = 0;
        while (value.substring(0, 3) === '../') {
            parentsToTrim++;
            value = value.slice(3);
        }

        var parentPath = page.parentRoute().slice(0, page.parentRoute().length - parentsToTrim).join('/');
        $(element).attr({
            'href':'#' + (parentPath === '' ? '' : parentPath + '/') + value
        });
    }
};