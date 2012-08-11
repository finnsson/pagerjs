var ChildManager = function (children, route) {

    var currentChild = null;

    /*

     Will show or hide child pages

     Goals:
     1. Get rid of parent
     2. Make use of children
     */
    this.showChild = function () {
        if (currentChild) {
            currentChild.hide();
            currentChild = null;
        }
        var match = false;
        var currentRoute = route()[0];
        var wildcard = null;
        _.each(children(), function (child) {
            if (!match) {
                var childValue = ko.utils.unwrapObservable(child.valueAccessor());
                if (childValue.id === currentRoute ||
                    ((currentRoute === '' || currentRoute == null) && childValue.id === 'start')) {
                    match = true;
                    currentChild = child;
                }
                if (childValue.id === '?') {
                    wildcard = child;
                }
            }
        });
        if (!currentChild) {
            currentChild = wildcard;
        }
        if (currentChild) {
            currentChild.show();
        }
    };
};


var pager = {};

window.pager = pager;

pager.start = function (viewModel) {

    var onHashChange = function () {
        pager.route(viewModel.$page, window.location.hash);
    };
    $(window).bind('hashchange', onHashChange);
    onHashChange();
};

pager.extendWithPage = function (viewModel) {
    viewModel.$page = ko.observable({
        children:ko.observableArray([]),
        route:ko.observableArray([]),
        parentRoute:ko.observableArray([]),
        __id__:Math.random()
    });

    pager.childManager = new ChildManager(viewModel.$page().children, viewModel.$page().route);
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

    pager.childManager.showChild();

};

pager.Page = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    this.element = element;
    this.valueAccessor = valueAccessor;
    this.allBindingsAccessor = allBindingsAccessor;
    this.viewModel = viewModel;
    this.bindingContext = bindingContext;

    $(element).hide();
    var value = ko.utils.unwrapObservable(valueAccessor());
    var $page = bindingContext.$page || bindingContext.$data.$page;
    var page = $page();
    var route = ko.observableArray([]);
    var parentRoute = ko.observableArray([]);

    var sourceUrl = function (source) {
        if (value.id === '?') {
            return source.replace('{1}', page.route()[0]);
        } else {
            return source;
        }
    };

    var loadSource = function (source) {
        if (value.frame === 'iframe') {
            var iframe = $('iframe', $(element));
            if (iframe.length === 0) {
                iframe = $('<iframe></iframe>');
                $(element).append(iframe);
            }
            iframe.attr('src', sourceUrl(source));
        } else {
            $(element).load(sourceUrl(source));
        }
    };

    var show = function () {
        var $element = $(element);
        if (!$element.is(':visible')) {
            $(element).show();

            // Fetch source
            if (value.sourceOnShow) {
                if (!value.sourceCache ||
                    !element.__pagerLoaded__ ||
                    (typeof(value.sourceCache) === 'number' && element.__pagerLoaded__ + value.sourceCache * 1000 < Date.now())) {
                    element.__pagerLoaded__ = Date.now();
                    loadSource(value.sourceOnShow);
                }
            }
        }
    };

    page.children.push({
        valueAccessor:valueAccessor,
        element:element,
        page:page,
        show:function () {
            show();
            childManager.showChild();
        },
        hide:function () {
            $(element).hide();
        }
    });

    // computed observable that triggers on parent route changes
    // and might trigger changes down to child pages
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
    var childManager = null;
    var pagerValues = {
        "$page":ko.observable({
            children:ko.observableArray([]),
            parentRoute:parentRoute,
            route:route,
            /*parent:{
             page:page,
             element:element
             },*/
            __id__:Math.random()
        })
    };



    this.init = function() {
        childManager = new ChildManager(pagerValues.$page().children, route);

        // Fetch source
        if (value.source) {
            loadSource(value.source);
        }

        var childBindingContext = bindingContext.createChildContext(value['with'] ? value['with'] : viewModel);
        ko.utils.extend(childBindingContext, pagerValues);
        ko.applyBindingsToDescendants(childBindingContext, element);
        return { controlsDescendantBindings:true};
    };

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
        var page = new pager.Page(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        return page.init();
    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    }
};

ko.bindingHandlers['page-href'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page();

        // The href reacts to changes in the value or the parentRoute.
        ko.computed(function () {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var parentsToTrim = 0;
            while (value.substring(0, 3) === '../') {
                parentsToTrim++;
                value = value.slice(3);
            }

            var parentPath = page.parentRoute().slice(0, page.parentRoute().length - parentsToTrim).join('/');
            $(element).attr({
                'href':'#' + (parentPath === '' ? '' : parentPath + '/') + value
            });
        });

    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    }
};