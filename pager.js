var pager = {};

// common KnockoutJS helpers
var _ko = {};

_ko.value = ko.utils.unwrapObservable;

_ko.arrayValue = function (arr) {
    return _.map(arr, function (e) {
        return _ko.value(e);
    });
};

pager.ChildManager = function (children, route, page) {
    var me = this;
    this.route = route;
    this.page = page;

    var currentChild = null;

    /*

     Will show or hide child pages

     Goals:
     1. Get rid of parent
     2. Make use of children
     */
    this.showChild = function () {
        var oldCurrentChild = currentChild;
        currentChild = null;
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
        // find modals in parent - but only if this page is not a modal!
        var isModal = false;
        if (!currentChild && me.page.parentPage) {
            var parentChildren = me.page.parentPage.children;
            _.each(parentChildren(), function (child) {
                if (!match) {
                    var id = _ko.value(_ko.value(child.valueAccessor()).id);
                    var modal = _ko.value(_ko.value(child.valueAccessor()).modal);
                    if (modal) {
                        if (id === currentRoute ||
                            ((currentRoute === '' || currentRoute == null) && id === 'start')) {
                            match = true;
                            currentChild = child;
                            isModal = true;
                        }
                        if (id === '?' && !wildcard) {
                            wildcard = child;
                        }
                    }
                }
            });

        }
        if (!currentChild) {
            currentChild = wildcard;
        }
        if (oldCurrentChild === currentChild && oldCurrentChild) {
            // TODO: solve the infinite recursion bug in some better way. This seems to solve it for now.
            if (!isModal) {
                oldCurrentChild.showPage();
            }
            return;
        }
        if (oldCurrentChild) {
            oldCurrentChild.hidePage(function () {
                if (currentChild) {
                    currentChild.showPage();
                }
            });
        } else if (currentChild) {
            currentChild.showPage();
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
    viewModel.$page = {
        children:ko.observableArray([]),
        route:ko.observableArray([]),
        parentRoute:ko.observableArray([]),
        __id__:Math.random()
    };

    pager.childManager = new pager.ChildManager(viewModel.$page.children, viewModel.$page.route, viewModel.$page);
};


pager.route = function ($page, hash) {
    // skip #
    if (hash[0] === '#') {
        hash = hash.slice(1);
    }
    // split on '/'
    var hashRoute = hash.split('/');
    // update route
    $page.route(hashRoute);

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

    this.childManager = null;
    this.children = null;
    this.parentRoute = null;
    this.route = null;
    this.parentPage = null;
    this.__id__ = null;
};

pager.Page.prototype.showPage = function() {
    this.show();
    this.childManager.showChild();
};

pager.Page.prototype.hidePage = function(callback) {
    this.hideElementWrapper(callback);
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

    page.children.push(this);

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

    this.route = route;
    this.parentPage = page;
    this.parentRoute = parentRoute;
    this.children = ko.observableArray([]);

    var pagerValues = {
        $page : this
    };

    this.pagerValues = pagerValues;


    this.hideElement();

    this.childManager = new pager.ChildManager(pagerValues.$page.children, route, pagerValues.$page);

    // Fetch source
    if (value.source) {
        this.loadSource(value.source);
    }

    var ctx = null;
    if (value['with']) {
        ctx = _ko.value(value['with']);
    } else if (value['withOnShow']) {
        ctx = {};
    } else {
        ctx = this.viewModel;
    }
    this.childBindingContext = this.bindingContext.createChildContext(ctx);

    ko.utils.extend(this.childBindingContext, pagerValues);
    if (!value['withOnShow']) {
        ko.applyBindingsToDescendants(this.childBindingContext, element);
    }
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
    return this.bindingContext.$page || this.bindingContext.$data.$page;
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
    var me = this;
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
            //$(element).load(s, value.sourceLoaded);
            $(element).load(s, function () {
                ko.applyBindingsToDescendants(me.childBindingContext, me.element);
                if (value.sourceLoaded) {
                    value.sourceLoaded.apply(me, arguments);
                }
            });
        }, this);
    }
};

/**
 * @method show
 */
pager.Page.prototype.show = function (callback) {
    var element = this.element;
    var value = this.getValue();
    this.showElementWrapper(callback);
    if (this.getValue().title) {
        window.document.title = this.getValue().title;
    }
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
};

pager.Page.prototype.showElementWrapper = function (callback) {
    if (this.getValue().beforeShow) {
        this.getValue().beforeShow(this);
    }
    this.showElement(callback);
    if (this.getValue().afterShow) {
        this.getValue().afterShow(this);
    }
};

pager.Page.prototype.showElement = function (callback) {
    if (this.getValue().showElement) {
        this.getValue().showElement.call(this, callback);
    } else if (pager.showElement) {
        pager.showElement.call(this, callback);
    } else {
        $(this.element).show(callback);
    }
};

pager.Page.prototype.hideElementWrapper = function (callback) {
    if (this.getValue().beforeHide) {
        this.getValue().beforeHide(this);
    }
    this.hideElement(callback);
    if (this.getValue().afterHide) {
        this.getValue().afterHide(this);
    }
};

pager.Page.prototype.hideElement = function (callback) {
    if (this.getValue().hideElement) {
        this.getValue().hideElement.call(this, callback);
    } else if (pager.hideElement) {
        pager.hideElement.call(this, callback);
    } else {
        $(this.element).hide();
        if (callback) {
            callback();
        }
    }
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

pager.useHTML5history = false;
pager.rootURI = '/';

ko.bindingHandlers['page-href'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page;

        // The href reacts to changes in the value or the parentRoute.
        var path = ko.computed(function () {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var parentsToTrim = 0;
            while (value.substring(0, 3) === '../') {
                parentsToTrim++;
                value = value.slice(3);
            }

            var parentPath = _ko.arrayValue(page.parentRoute().slice(0, page.parentRoute().length - parentsToTrim)).join('/');
            var fullPath = (parentPath === '' ? '' : parentPath + '/') + value;
            var attr = {
                'href':'#' + fullPath
            };
            $(element).attr(attr);
            return fullPath;
        });

        if (pager.useHTML5history && window.history && history.pushState) {
            $(element).click(function (e) {
                e.preventDefault();
                history.pushState(null, null, pager.rootURI + path());
                pager.childManager.route(path().split('/'));
                pager.childManager.showChild();

            });
        }


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

pager.PageAccordionItem.prototype.hideElement = function (callback) {
    if (!this.pageAccordionItemHidden) {
        this.pageAccordionItemHidden = true;
        $(this.getAccordionBody()).hide();
    } else {
        $(this.getAccordionBody()).slideUp();
        if (callback) {
            callback();
        }
    }
};

pager.PageAccordionItem.prototype.showElement = function (callback) {
    $(this.getAccordionBody()).slideDown();
    if (callback) {
        callback();
    }
};

ko.bindingHandlers['page-accordion-item'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var pageAccordionItem = new pager.PageAccordionItem(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        pageAccordionItem.init();
    },
    update:function () {
    }
};