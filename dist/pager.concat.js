/*! pager.js - v0.1.0 - 2012-08-14
* http://oscar.finnsson.nu/pagerjs/
* Copyright (c) 2012 Oscar Finnsson; Licensed MIT */

var pager = {};

// common KnockoutJS helpers
var _ko = {};

_ko.value = ko.utils.unwrapObservable;

_ko.arrayValue = function (arr) {
    return _.map(arr, function (e) {
        return _ko.value(e);
    });
};

pager.ChildManager = function (children, route) {

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
                //var childValue = ko.utils.unwrapObservable(child.valueAccessor());
                var id = _ko.value(_ko.value(child.valueAccessor()).id);
                if (id === currentRoute ||
                    ((currentRoute === '' || currentRoute == null) && id === 'start')) {
                    match = true;
                    currentChild = child;
                }
                if (id === '?') {
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

    pager.childManager = new pager.ChildManager(viewModel.$page().children, viewModel.$page().route);
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

/**
 * @class pager.Page
 */

/**
 * @param element
 * @param valueAccessor
 * @param allBindingsAccessor
 * @param viewModel
 * @param bindingContext
 * @constructor
 */
pager.Page = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    this.element = element;
    this.valueAccessor = valueAccessor;
    this.allBindingsAccessor = allBindingsAccessor;
    this.viewModel = viewModel;
    this.bindingContext = bindingContext;
};

/**
 * @method init
 * @return {Object}
 */
pager.Page.prototype.init = function () {

    var value = this.getValue();
    var page = this.getPage();
    var route = ko.observableArray([]);
    var parentRoute = ko.observableArray([]);
    var element = this.element;


    page.children.push({
        valueAccessor:this.valueAccessor,
        element:element,
        page:page,
        show:_.bind(function () {

            this.show();
            childManager.showChild();
        }, this),
        hide:_.bind(function () {
            this.hideElement();
            //$(element).hide();
        }, this)
    });

    // computed observable that triggers on parent route changes
    // and might trigger changes down to child pages
    ko.computed(function () {
        route(page.route().slice(1));
        var id = _ko.value(value).id;

        if (page.parentRoute) {
            var copyOfParent = page.parentRoute().slice(0);
            copyOfParent.push(id);
            parentRoute(copyOfParent);
        } else {
            parentRoute([id]);
        }
    });
    var childManager = null;
    var pagerValues = {
        "$page":ko.observable({
            children:ko.observableArray([]),
            parentRoute:parentRoute,
            route:route,
            __id__:Math.random()
        })
    };
    this.pagerValues = pagerValues;


    this.hideElement();
    //$(element).hide();

    childManager = new pager.ChildManager(pagerValues.$page().children, route);

    // Fetch source
    if (value.source) {
        this.loadSource(value.source);
    }

    //var childBindingContext = this.bindingContext.createChildContext(value['with'] ? ko.utils.unwrapObservable(value['with']) : this.viewModel);
    var ctx = null;
    if (value['with']) {
        ctx = _ko.value(value['with']);
    } else if (value['withOnShow']) {
        ctx = {};
    } else {
        ctx = this.viewModel;
    }
    var childBindingContext = this.bindingContext.createChildContext(ctx);

    ko.utils.extend(childBindingContext, pagerValues);
    ko.applyBindingsToDescendants(childBindingContext, element);
    return { controlsDescendantBindings:true};
};

/**
 * @method getValue
 * @return {*}
 */
pager.Page.prototype.getValue = function () {
    return _ko.value(this.valueAccessor());
};

/**
 * @method getPage
 * @return {*}
 */
pager.Page.prototype.getPage = function () {
    return (this.bindingContext.$page || this.bindingContext.$data.$page)();
};

/**
 * @method sourceUrl
 * @param source
 * @return {*}
 */
pager.Page.prototype.sourceUrl = function (source) {
    var value = this.getValue();
    var page = this.getPage();
    if (_ko.value(value).id === '?') {
        return ko.computed(function () {
            return _ko.value(source).replace('{1}', page.route()[0]);
        });
    } else {
        return ko.computed(function () {
            return _ko.value(source);
        });
    }
};

/**
 * @method loadSource
 * @param source
 */
pager.Page.prototype.loadSource = function (source) {
    var value = this.getValue();
    var element = this.element;
    if (value.frame === 'iframe') {
        var iframe = $('iframe', $(element));
        if (iframe.length === 0) {
            iframe = $('<iframe></iframe>');
            $(element).append(iframe);
        }
        if (value.sourceLoaded) {
            iframe.one('load', value.sourceLoaded);
        }
        // TODO: remove src binding and add this binding
        ko.applyBindingsToNode(iframe[0], {
            attr:{
                src:this.sourceUrl(source)
            }
        });
    } else {
        // TODO: remove all children and add sourceUrl(source)
        ko.computed(function () {
            var s = _ko.value(this.sourceUrl(source));
            $(element).load(s, value.sourceLoaded);
        }, this);
    }
};

/**
 * @method show
 */
pager.Page.prototype.show = function () {
    var element = this.element;
    var value = this.getValue();
    var $element = $(element);
    if (!this.isVisible()) {
        this.showElement();
        if (value.withOnShow) {
            if (!this.withOnShowLoaded) {
                this.withOnShowLoaded = true;
                value.withOnShow(_.bind(function (vm) {
                    var childBindingContext = this.bindingContext.createChildContext(vm);

                    ko.utils.extend(childBindingContext, this.pagerValues);
                    ko.applyBindingsToDescendants(childBindingContext, this.element);

                }, this));
            }
        }

        // Fetch source
        if (value.sourceOnShow) {
            if (!value.sourceCache ||
                !element.__pagerLoaded__ ||
                (typeof(value.sourceCache) === 'number' && element.__pagerLoaded__ + value.sourceCache * 1000 < Date.now())) {
                element.__pagerLoaded__ = Date.now();
                this.loadSource(value.sourceOnShow);
            }
        }
    }
};

pager.Page.prototype.showElement = function () {
    $(this.element).show();
};

pager.Page.prototype.hideElement = function () {
    $(this.element).hide();
};

pager.Page.prototype.isVisible = function () {
    return $(this.element).is(':visible');
};

ko.bindingHandlers.page = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var page = new pager.Page(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        return page.init();
    },
    update:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    }
};

// page-href

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

            var parentPath = _ko.arrayValue(page.parentRoute().slice(0, page.parentRoute().length - parentsToTrim)).join('/');
            $(element).attr({
                'href':'#' + (parentPath === '' ? '' : parentPath + '/') + value
            });
        });

    },
    update:function () {
    }
};

// page-accordion-item

pager.PageAccordionItem = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    pager.Page.apply(this, arguments);
};

pager.PageAccordionItem.prototype = new pager.Page();

pager.PageAccordionItem.prototype.getAccordionBody = function () {
    return $(this.element).children()[1];
};

pager.PageAccordionItem.prototype.hideElement = function () {
    if (!this.pageAccordionItemHidden) {
        this.pageAccordionItemHidden = true;
        $(this.getAccordionBody()).hide();
    } else {
        $(this.getAccordionBody()).slideUp();
    }
};

pager.PageAccordionItem.prototype.showElement = function () {
    $(this.getAccordionBody()).slideDown();
};

pager.PageAccordionItem.prototype.isVisible = function () {
    return $(this.getAccordionBody()).is(':visible');
};

ko.bindingHandlers['page-accordion-item'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var pageAccordionItem = new pager.PageAccordionItem(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        pageAccordionItem.init();
    },
    update:function () {
    }
};