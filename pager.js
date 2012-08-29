var pager = {};

// common KnockoutJS helpers
var _ko = {};

_ko.value = ko.utils.unwrapObservable;

_ko.arrayValue = function (arr) {
    return _.map(arr, function (e) {
        return _ko.value(e);
    });
};

pager.ChildManager = function (children, page) {

    //this.currentChild = children[0];
    this.currentChildO = ko.observable(null);
    var me = this;
    this.page = page;

    this.hideChild = function () {
        if (me.currentChild) {
            if (me.currentChild.getId() !== 'start') {
                me.currentChild.hidePage(function () {
                });
                me.currentChild = null;
                me.currentChildO(null);
            }
        }
    };

    /*

     Will show or hide child pages

     Goals:
     1. Get rid of parent
     2. Make use of children
     */
    this.showChild = function (route) {
        var oldCurrentChild = me.currentChild;
        me.currentChild = null;
        var match = false;
        var currentRoute = route[0];
        var wildcard = null;
        _.each(children(), function (child) {
            if (!match) {
                var id = child.getId();
                if (id === currentRoute ||
                    ((currentRoute === '' || currentRoute == null) && id === 'start')) {
                    match = true;
                    me.currentChild = child;
                }
                if (id === '?') {
                    wildcard = child;
                }
            }
        });
        // find modals in parent - but only if 1) no match is found, 2) this page got a parent and 3) this page is not a modal!
        var isModal = false;

        var currentChildManager = me;

        while(!me.currentChild && currentChildManager.page.parentPage && !currentChildManager.page.getValue().modal) {
            var parentChildren = currentChildManager.page.parentPage.children;
            _.each(parentChildren(), function (child) {
                if (!match) {
                    var id = child.getId();
                    var modal = child.getValue().modal;
                    if (modal) {
                        if (id === currentRoute ||
                            ((currentRoute === '' || currentRoute == null) && id === 'start')) {
                            match = true;
                            me.currentChild = child;
                            isModal = true;
                        }
                        if (id === '?' && !wildcard) {
                            wildcard = child;
                            isModal = true;
                        }
                    }
                }
            });
            if(!me.currentChild) {
                currentChildManager = currentChildManager.page.parentPage.childManager;
            }
        }



        /*
        if (!me.currentChild && me.page.parentPage && !me.page.getValue().modal) {
            var parentChildren = me.page.parentPage.children;
            _.each(parentChildren(), function (child) {
                if (!match) {
                    var id = child.getId();
                    var modal = child.getValue().modal;
                    if (modal) {
                        if (id === currentRoute ||
                            ((currentRoute === '' || currentRoute == null) && id === 'start')) {
                            match = true;
                            me.currentChild = child;
                            isModal = true;
                        }
                        if (id === '?' && !wildcard) {
                            wildcard = child;
                            isModal = true;
                        }
                    }
                }
            });
        }
        */


        if (!me.currentChild && wildcard) {
            me.currentChild = wildcard;
            me.currentChild.currentId = currentRoute;
        }
        if (me.currentChild) {
            me.currentChildO(me.currentChild);

            if(isModal) {
                me.currentChild.currentParentPage(me.page);
            } else {
                me.currentChild.currentParentPage(null);
            }

        }
        if (oldCurrentChild && oldCurrentChild === me.currentChild) {
            me.currentChild.showPage(route.slice(1));
        } else if (oldCurrentChild) {
            oldCurrentChild.hidePage(function () {
                if (me.currentChild) {
                    me.currentChild.showPage(route.slice(1));
                }
            });
        } else if (me.currentChild) {
            me.currentChild.showPage(route.slice(1));
        }
    };
};

pager.start = function (viewModel) {

    var onHashChange = function () {
        pager.routeFromHashToPage(window.location.hash);
    };
    $(window).bind('hashchange', onHashChange);
    onHashChange();
};

pager.extendWithPage = function (viewModel) {
    viewModel.$page = new pager.Page();

    pager.childManager = new pager.ChildManager(viewModel.$page.children, viewModel.$page);
    viewModel.$page.childManager = pager.childManager;
};


pager.routeFromHashToPage = function (hash) {
    // skip #
    if (hash[0] === '#') {
        hash = hash.slice(1);
    }
    // split on '/'
    var hashRoute = hash.split('/');

    pager.childManager.showChild(hashRoute);

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

    this.children = ko.observableArray([]);

    this.childManager = new pager.ChildManager(this.children, this);
    this.parentPage = null;
    this.currentId = null;

    this.currentParentPage = ko.observable(null);
};

pager.Page.prototype.showPage = function (route) {
    this.show();
    this.childManager.showChild(route);
};

pager.Page.prototype.hidePage = function (callback) {
    this.hideElementWrapper(callback);
    this.childManager.hideChild();
};

/**
 * @method init
 * @return {Object}
 */
pager.Page.prototype.init = function () {

    var value = this.getValue();
    this.parentPage = this.getParentPage();
    this.parentPage.children.push(this);


    this.hideElement();

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

    ko.utils.extend(this.childBindingContext, {$page:this});
    if (!value['withOnShow']) {
        ko.applyBindingsToDescendants(this.childBindingContext, this.element);
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
 * @method getParentPage
 * @return {*}
 */
pager.Page.prototype.getParentPage = function () {
    return this.bindingContext.$page || this.bindingContext.$data.$page;
};

pager.Page.prototype.getId = function () {
    return _ko.value(this.getValue().id);
};

/**
 * @method sourceUrl
 * @param source
 * @return {*}
 */
pager.Page.prototype.sourceUrl = function (source) {
    var me = this;
    if (this.getId() === '?') {
        return ko.computed(function () {
            // TODO: maybe make currentId an ko.observable?
            return _ko.value(source).replace('{1}', me.currentId);
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

                ko.utils.extend(childBindingContext, {$page:this});
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

pager.Page.prototype.getFullRoute = function () {
    return ko.computed(function () {
        if (this.currentParentPage && this.currentParentPage()) {
            var res = this.currentParentPage().getFullRoute()();
            res.push(this.getId());
            return res;
        } else if (this.parentPage) {
            var res = this.parentPage.getFullRoute()();
            res.push(this.getId());
            return res;
        } else { // is root page
            return [];
        }
    }, this);
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

// TODO: extract this into a separate class pager.PageHref
ko.bindingHandlers['page-href'] = {
    init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $page = bindingContext.$page || bindingContext.$data.$page;
        var page = $page;

        // The href reacts to changes in the value
        var path = ko.computed(function () {
            var value = _ko.value(valueAccessor());
            var parentsToTrim = 0;
            while (value.substring(0, 3) === '../') {
                parentsToTrim++;
                value = value.slice(3);
            }

            var fullRoute = page.getFullRoute()();
            var parentPath = fullRoute.slice(0, fullRoute.length - parentsToTrim).join('/');
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
                pager.childManager.showChild(path().split('/'));

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