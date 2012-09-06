/**
 * @module pager
 * @readme README.md
 */

var pager = {};


/**
 * This is the hash-based start-method.
 *
 * You should only use this method if you do not want HTML5 history support and
 * do not want IE6/7 support.
 *
 * @method start
 * @static
 */
pager.start = function () {

    var onHashChange = function () {
        pager.routeFromHashToPage(window.location.hash);
    };
    $(window).bind('hashchange', onHashChange);
    onHashChange();
};

/**
 * @method extendWithPage
 * @static
 * @param {Observable} viewModel
 */
pager.extendWithPage = function (viewModel) {
    var page = new pager.Page();
    viewModel.$__page__ = page;
    pager.page = page;
};

/**
 *
 *
 * Called when a route does not find a match.
 *
 * @var navigationFailed
 * @type {Function}
 * @static
 */
pager.navigationFailed = null;


/**
 *
 * @param {String} hash
 */
pager.routeFromHashToPage = function (hash) {
    // skip #
    if (hash[0] === '#') {
        hash = hash.slice(1);
    }
    // split on '/'
    var hashRoute = decodeURIComponent(hash).split('/');
    pager.showChild(hashRoute);
};

pager.showChild = function (hashRoute) {
    pager.page.childManager.showChild(hashRoute);
};

// common KnockoutJS helpers
var _ko = {};

_ko.value = ko.utils.unwrapObservable;

_ko.arrayValue = function (arr) {
    return _.map(arr, function (e) {
        return _ko.value(e);
    });
};

var parseStringAsParameters = function (query) {
    var match,
        urlParams = {},
        pl = /\+/g, // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        };

    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }
    return urlParams;
};

var splitRoutePartIntoNameAndParameters = function (routePart) {
    if (!routePart) {
        return {name:null, params:{}};
    }
    var routeSplit = routePart.split('?');
    var name = routeSplit[0];
    var paramsString = routeSplit[1];
    var params = {};
    if (paramsString) {
        params = parseStringAsParameters(paramsString);
    }
    return {
        name:name,
        params:params
    };
};

/**
 * @class pager.ChildManager
 *
 * @param {pager.Page[]} children
 * @param {pager.Page} page
 */
pager.ChildManager = function (children, page) {

    this.currentChildO = ko.observable(null);
    var me = this;
    this.page = page;
    // Used by showChild to find out if the navigation is still current.
    // In needed since the navigation is asynchronous and another navigation might happen in between.
    this.timeStamp = Date.now();

    /**
     * @method pager.ChildManager#hideChild
     */
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

    /**
     * Show the sub-page in this ChildManager's page that matches the route.
     *
     * @method pager.ChildManager#showChild
     * @param {String[]} route route to match a sub-page to. Can be on the form `['foo','bar?x=22&y=11']`.
     */
    this.showChild = function (route) {
        this.timeStamp = Date.now();
        var timeStamp = this.timeStamp;
        var oldCurrentChild = me.currentChild;
        me.currentChild = null;
        var match = false;
        var currentRoutePair = splitRoutePartIntoNameAndParameters(route[0]);
        var currentRoute = currentRoutePair.name;
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

        var findMatchModalOrWildCard = function (child) {
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
        };

        while (!me.currentChild && currentChildManager.page.parentPage && !currentChildManager.page.getValue().modal) {
            var parentChildren = currentChildManager.page.parentPage.children;
            _.each(parentChildren(), findMatchModalOrWildCard);
            if (!me.currentChild) {
                currentChildManager = currentChildManager.page.parentPage.childManager;
            }
        }

        if (!me.currentChild && wildcard) {
            me.currentChild = wildcard;
            me.currentChild.currentId = currentRoute;
        }
        if (me.currentChild) {
            me.currentChildO(me.currentChild);

            if (isModal) {
                me.currentChild.currentParentPage(me.page);
            } else {
                me.currentChild.currentParentPage(null);
            }

        }

        var onFailed = function () {
            if (pager.navigationFailed) {
                pager.navigationFailed(me.page, route);
            }
            if (me.page.getValue().navigationFailed) {
                _ko.value(me.page.getValue().navigationFailed)(me.page, route);
            }
        };

        var showCurrentChild = function () {
            var guard = _ko.value(me.currentChild.getValue().guard);
            if (guard) {
                guard(me.currentChild, route, function () {
                    if (me.timeStamp === timeStamp) {
                        me.currentChild.showPage(route.slice(1), currentRoutePair, route[0]);
                    }
                });
            } else {
                me.currentChild.showPage(route.slice(1), currentRoutePair, route[0]);
            }
        };

        if (oldCurrentChild && oldCurrentChild === me.currentChild) {
            showCurrentChild();
        } else if (oldCurrentChild) {
            oldCurrentChild.hidePage(function () {
                if (me.currentChild) {
                    showCurrentChild();
                } else {
                    onFailed();
                }
            });
        } else if (me.currentChild) {
            showCurrentChild();
        } else {
            onFailed();
        }
    };
};


/**
 *
 * @class pager.Page
 *
 * @param {Node} element
 * @param {Observable} valueAccessor
 * @param allBindingsAccessor
 * @param {Observable} viewModel
 * @param bindingContext
 */
pager.Page = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    /**
     *
     * @type {Node}
     */
    this.element = element;
    /**
     *
     * @type {Observable}
     */
    this.valueAccessor = valueAccessor;
    /**
     *
     * @type {*}
     */
    this.allBindingsAccessor = allBindingsAccessor;
    /**
     *
     * @type {Observable}
     */
    this.viewModel = viewModel;
    /**
     *
     * @type {*}
     */
    this.bindingContext = bindingContext;

    /**
     *
     * @type {ObservableArray}
     */
    this.children = ko.observableArray([]);

    /**
     *
     * @type {pager.ChildManager}
     */
    this.childManager = new pager.ChildManager(this.children, this);
    /**
     *
     * @type {pager.Page}
     */
    this.parentPage = null;
    /**
     *
     * @type {String}
     */
    this.currentId = null;

    /**
     *
     *
     * @type {Observable}
     */
    this.ctx = null;

    /**
     *
     * @type {Observable/pager.Page}
     */
    this.currentParentPage = ko.observable(null);


    /**
     *
     * @type {Observable}
     */
    this.isVisible = ko.observable(false);

    this.originalRoute = ko.observable(null);
};

var p = pager.Page.prototype;

/**
 * @method pager.Page#showPage
 *
 * @param route
 */
p.showPage = function (route, pageRoute, originalRoute) {
    this.isVisible(true);
    this.originalRoute(originalRoute);
    if (pageRoute && pageRoute.params) {
        this.setParams(pageRoute.params);
    }
    this.show();
    this.childManager.showChild(route);
};

/**
 * @method pager.Page#setParams
 *
 * @param params
 */
p.setParams = function (params) {
    // get view model
    var vm = this.ctx;
    var userParams = this.getValue().params || {};
    // for each param for URL
    $.each(params, function (key, value) {
        if (_.indexOf(userParams, key) !== -1) { // make sure it's a valid param
            if (vm[key]) { // set observable ...
                vm[key](value);
            } else { // ... or create observable
                vm[key] = ko.observable(value);
            }
        }
    });
};

/**
 * @method pager.Page#hidePage
 *
 * @param {Function} callback
 */
p.hidePage = function (callback) {
    this.isVisible(false);
    this.hideElementWrapper(callback);
    this.childManager.hideChild();
};

/**
 * @method pager.Page#init
 *
 * @return {Object}
 */
p.init = function () {
    var m = this;

    var value = this.getValue();
    this.parentPage = this.getParentPage();
    this.parentPage.children.push(this);


    this.hideElement();

    // Fetch source
    if (value.source) {
        this.loadSource(value.source);
    }

    this.ctx = null;
    if (value['with']) {
        this.ctx = _ko.value(value['with']);
    } else if (value['withOnShow']) {
        this.ctx = {};
    } else {
        this.ctx = this.viewModel;
    }
    if (value.params) {
        $.each(value.params, function (index, param) {
            if (!m.ctx[param]) {
                m.ctx[param] = ko.observable();
            }
        });
    }
    this.childBindingContext = this.bindingContext.createChildContext(this.ctx);
    ko.utils.extend(this.childBindingContext, {$page:this});
    if (!value['withOnShow']) {
        ko.applyBindingsToDescendants(this.childBindingContext, this.element);
    }
    return { controlsDescendantBindings:true};
};

/**
 * @method pager.Page#getValue
 * @returns {Object} value
 */
p.getValue = function () {
    if (this.valueAccessor) {
        return _ko.value(this.valueAccessor());
    } else {
        return {};
    }
};

/**
 * @method pager.Page#getParentPage
 * @return {pager.Page}
 */
p.getParentPage = function () {
    // search this context/$data until either root is accessed or no page is found
    var bindingContext = this.bindingContext;
    while (bindingContext) {
        if (bindingContext.$page) {
            return bindingContext.$page;
        } else if (bindingContext.$data && bindingContext.$data.$__page__) {
            return bindingContext.$data.$__page__;
        }
        bindingContext = bindingContext.$parentContext;
    }
    return null;
};

/**
 * @method pager.Page#getId
 * @return String
 */
p.getId = function () {
    return _ko.value(this.getValue().id);
};


/**
 * @method pager.Page#sourceUrl
 *
 * @param {Observable/String} source
 * @return {Observable}
 */
p.sourceUrl = function (source) {
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
 * @method pager.Page#loadSource
 * @param source
 */
p.loadSource = function (source) {
    var value = this.getValue();
    var me = this;
    var element = this.element;
    var loader = null;
    var loaderMethod = value.loader || pager.loader;
    if (value.frame === 'iframe') {
        var iframe = $('iframe', $(element));
        if (iframe.length === 0) {
            iframe = $('<iframe></iframe>');
            $(element).append(iframe);
        }
        if (loaderMethod) {
            loader = _ko.value(loaderMethod)(me, iframe);
            loader.load();
        }
        if (value.sourceLoaded) {
            iframe.one('load', function () {
                if (loader) {
                    loader.unload();
                }
                value.sourceLoaded();
            });
        }
        // TODO: remove src binding and add this binding
        ko.applyBindingsToNode(iframe[0], {
            attr:{
                src:this.sourceUrl(source)
            }
        });
    } else {
        if (loaderMethod) {
            loader = _ko.value(loaderMethod)(me, me.element);
            loader.load();
        }
        // TODO: remove all children and add sourceUrl(source)
        ko.computed(function () {
            if (typeof _ko.value(source) === 'string') {
                var s = _ko.value(this.sourceUrl(source));
                $(element).load(s, function () {
                    if (loader) {
                        loader.unload();
                    }
                    ko.applyBindingsToDescendants(me.childBindingContext, me.element);
                    if (value.sourceLoaded) {
                        value.sourceLoaded.apply(me, arguments);
                    }
                });
            } else { // should be a method
                _ko.value(source)(this, function () {
                    if (value.sourceLoaded) {
                        value.sourceLoaded();
                    }
                });
            }
        }, this);
    }
};

/**
 * @method pager.Page#show
 * @param {Function} callback
 */
p.show = function (callback) {
    var element = this.element;
    var me = this;
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
                me.ctx = vm;
                ko.utils.extend(childBindingContext, {$page:this});
                ko.applyBindingsToDescendants(childBindingContext, this.element);
            }, this), this);
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

/**
 * @method pager.Page#showElementWrapper
 * @param {Function} callback
 */
p.showElementWrapper = function (callback) {
    if (this.getValue().beforeShow) {
        this.getValue().beforeShow(this);
    }
    this.showElement(callback);
    if (this.getValue().afterShow) {
        this.getValue().afterShow(this);
    }
};

/**
 * @method pager.Page#showElement
 * @param {Function} callback
 */
pager.Page.prototype.showElement = function (callback) {
    if (this.getValue().showElement) {
        this.getValue().showElement(this, callback);
    } else if (pager.showElement) {
        pager.showElement(this, callback);
    } else {
        $(this.element).show(callback);
    }
};

/**
 *
 * @method pager.Page#hideElementWrapper
 * @param {Function} callback
 */
pager.Page.prototype.hideElementWrapper = function (callback) {
    if (this.getValue().beforeHide) {
        this.getValue().beforeHide(this);
    }
    this.hideElement(callback);
    if (this.getValue().afterHide) {
        this.getValue().afterHide(this);
    }
};

/**
 * @method pager.Page#hideElement
 * @param {Function} [callback]
 */
pager.Page.prototype.hideElement = function (callback) {
    if (this.getValue().hideElement) {
        this.getValue().hideElement(this, callback);
    } else if (pager.hideElement) {
        pager.hideElement(this, callback);
    } else {
        $(this.element).hide();
        if (callback) {
            callback();
        }
    }
};


/**
 *
 * @return {Observable}
 */
pager.Page.prototype.getFullRoute = function () {
    return ko.computed(function () {
        var res = null;
        if (this.currentParentPage && this.currentParentPage()) {
            res = this.currentParentPage().getFullRoute()();
            res.push((this.originalRoute() || this.getId()));
            return res;
        } else if (this.parentPage) {
            res = this.parentPage.getFullRoute()();
            res.push((this.originalRoute() || this.getId()));
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
    update:function () {
    }
};

// page-href

/**
 *
 * @type {Boolean}
 */
pager.useHTML5history = false;
/**
 *
 * @type {String}
 */
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
                pager.showChild(path().split('/'));

            });
        }


    },
    update:function () {
    }
};

/**
 * @class pager.PageAccordionItem
 * @inherits pager.Page
 *
 * @param {Node} element
 * @param {Observable} valueAccessor
 * @param allBindingsAccessor
 * @param {Observable} viewModel
 * @param bindingContext
 */
pager.PageAccordionItem = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    pager.Page.apply(this, arguments);
};

pager.PageAccordionItem.prototype = new pager.Page();

/**
 *
 * @return {Node}
 */
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