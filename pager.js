(function (window) {

    var pagerJsModule = function ($, _, ko) {

        "use strict";

        /**
         * @module pager
         * @readme README.md
         */

        var pager = {};

        pager.page = null;

        pager.now = function () {
            if (!Date.now) {
                return (new Date()).valueOf();
            } else {
                return Date.now();
            }
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
         * Called when a route does not find a match.
         *
         * @var navigationFailed
         * @type {Observable}
         * @static
         */
        pager.navigationFailed = ko.observable();

        /**
         *
         * @param {String[]} route
         */
        pager.showChild = function (route) {
            pager.page.showPage(route);
            //pager.page.childManager.showChild(route);
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
            this.timeStamp = pager.now();

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
                this.timeStamp = pager.now();
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
                    //me.currentChild.currentId = currentRoute;
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
                        pager.navigationFailed({page:me.page, route:route});
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
                        }, oldCurrentChild);
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

        /*
         * @typedef {{id:String,hideElment:Function,showElement:Function}}
         */
        var PageConfig;

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

            this.route = null;
        };

        var p = pager.Page.prototype;

        /**
         * @method pager.Page#val
         *
         * @param {String} key
         * @return {Object} an un-boxed configuration property
         */
        p.val = function (key) {
            return _ko.value(this.getValue()[key]);
        };

        p.currentChildPage = function () {
            return this.childManager.currentChildO;
        };

        /**
         * @method pager.Page#showPage
         *
         * @param route
         */
        p.showPage = function (route, pageRoute, originalRoute) {
            var m = this,
                currentId = m.currentId,
                params = m.pageRoute ? m.pageRoute.params : null,
                isVisible = m.isVisible();
            m.currentId = pageRoute ? pageRoute.name : null;
            m.isVisible(true);
            m.originalRoute(originalRoute);
            m.route = route;
            m.pageRoute = pageRoute;
            // show if not already visible
            if (!isVisible) {
                m.setParams();
                m.show();
            } else {
                // show if wildcard got new ID
                if (m.getId() === '?' && currentId !== m.currentId) {
                    m.show();
                }
                // update params if they are updated
                if (pageRoute && params !== pageRoute.params) {
                    m.setParams();
                }
            }
            m.childManager.showChild(route);
        };

        /**
         * @method pager.Page#setParams
         *
         */
        p.setParams = function () {
            if (this.pageRoute && this.pageRoute.params) {
                var params = this.pageRoute.params;

                // get view model
                var vm = this.ctx;
                var userParams = this.val('params') || {};
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
            }
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

            // listen to when the element is removed
            ko.utils.domNodeDisposal.addDisposeCallback(m.element, function () {
                // then remove this Page-instance
                m.parentPage.children.remove(m);
            });

            var value = m.getValue();
            m.parentPage = m.getParentPage();
            m.parentPage.children.push(this);

            m.hideElement();

            // Fetch source
            if (m.val('source')) {
                m.loadSource(m.val('source'));
            }

            m.ctx = null;
            if (value['with']) {
                m.ctx = _ko.value(value['with']);
                m.augmentContext();
            } else if (value.withOnShow) {
                m.ctx = {};
            } else {
                m.ctx = m.viewModel;
                m.augmentContext();
            }
            m.childBindingContext = m.bindingContext.createChildContext(m.ctx);
            ko.utils.extend(m.childBindingContext, {$page:this});
            if (!m.val('withOnShow')) {
                ko.applyBindingsToDescendants(m.childBindingContext, m.element);
            }

            // check if this page should trigger showChild at parent
            if (m.parentPage.route && m.parentPage.route[0] === m.getId()) {
                // call once the current event loop is finished.
                setTimeout(function() {
                    m.parentPage.showPage(m.parentPage.route);
                }, 0);
            }

            return { controlsDescendantBindings:true};
        };

        p.augmentContext = function () {
            var m = this;
            if (m.val('params')) {
                $.each(this.val('params'), function (index, param) {
                    if (!m.ctx[param]) {
                        m.ctx[param] = ko.observable();
                    }
                });
            }
            if (this.val('vars')) {
                $.each(this.val('vars'), function (key, value) {
                    m.ctx[key] = ko.observable(value);
                });
            }
            this.setParams();
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
            return this.val('id');
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
                    var path;
                    if (me.val('deep')) {
                        path = [me.currentId].concat(me.route).join('/');
                    } else {
                        path = me.currentId;
                    }
                    return _ko.value(source).replace('{1}', path);
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
                        value.sourceLoaded(me);
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
                    var onLoad = function () {
                        // remove load
                        if (loader) {
                            loader.unload();
                        }
                        // apply bindings
                        ko.applyBindingsToDescendants(me.childBindingContext, me.element);
                        // trigger event
                        if (value.sourceLoaded) {
                            value.sourceLoaded(me);
                        }
                        // possibly continue routing
                        if (me.route) {
                            me.childManager.showChild(me.route);
                        }
                    };
                    if (typeof _ko.value(source) === 'string') {
                        var s = _ko.value(this.sourceUrl(source));
                        $(element).load(s, function () {
                            onLoad();
                        });
                    } else { // should be a method
                        _ko.value(source)(this, function () {
                            onLoad();
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
            //var value = me.getValue();
            me.showElementWrapper(callback);
            if (me.val('title')) {
                window.document.title = me.val('title');
            }
            if (me.val('withOnShow')) {
                if (!me.withOnShowLoaded || me.val('sourceCache') !== true) {
                    me.withOnShowLoaded = true;
                    me.val('withOnShow')(_.bind(function (vm) {
                        var childBindingContext = me.bindingContext.createChildContext(vm);
                        me.ctx = vm;
                        me.augmentContext();
                        ko.utils.extend(childBindingContext, {$page:this});
                        ko.applyBindingsToDescendants(childBindingContext, me.element);
                    }, this), this);
                }
            }

            // Fetch source
            if (me.val('sourceOnShow')) {
                if (!me.val('sourceCache') ||
                    !element.__pagerLoaded__ ||
                    (typeof(me.val('sourceCache')) === 'number' && element.__pagerLoaded__ + me.val('sourceCache') * 1000 < pager.now())) {
                    element.__pagerLoaded__ = pager.now();
                    me.loadSource(me.val('sourceOnShow'));
                }
            }
        };

        /**
         * @method pager.Page#showElementWrapper
         * @param {Function} callback
         */
        p.showElementWrapper = function (callback) {
            if (this.val('beforeShow')) {
                this.val('beforeShow')(this);
            }
            this.showElement(callback);
            if (this.val('afterShow')) {
                this.val('afterShow')(this);
            }
        };

        /**
         * @method pager.Page#showElement
         * @param {Function} callback
         */
        p.showElement = function (callback) {
            if (this.val('showElement')) {
                this.val('showElement')(this, callback);
            } else if (this.val('fx')) {
                pager.fx[this.val('fx')].showElement(this, callback);
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
            if (this.val('beforeHide')) {
                this.val('beforeHide')(this);
            }
            this.hideElement(callback);
            if (this.val('afterHide')) {
                this.val('afterHide')(this);
            }
        };

        /**
         * @method pager.Page#hideElement
         * @param {Function} [callback]
         */
        p.hideElement = function (callback) {
            if (this.val('hideElement')) {
                this.val('hideElement')(this, callback);
            } else if (this.val('fx')) {
                pager.fx[this.val('fx')].hideElement(this, callback);
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
        p.getFullRoute = function () {
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

        p.nullObject = new pager.Page();
        p.nullObject.children = ko.observableArray([]);

        p.child = function (key) {
            return ko.computed(function () {
                var child = _.find(this.children(), function (c) {
                    return c.getId() === key;
                });
                return child || this.nullObject;
            }, this);
        };

        ko.bindingHandlers.page = {
            init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var page = new pager.Page(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                return page.init();
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

        pager.Href = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            this.element = element;
            this.bindingContext = bindingContext;
            this.path = ko.observable();
            this.val = ko.observable(valueAccessor);
        };

        var hp = pager.Href.prototype;

        hp.getParentPage = p.getParentPage;

        hp.init = function () {
            var page = this.getParentPage();

            this.path = ko.computed(function () {
                var value = _ko.value(this.val()());
                if (typeof(value) === 'string') {
                    var parentsToTrim = 0;
                    while (value.substring(0, 3) === '../') {
                        parentsToTrim++;
                        value = value.slice(3);
                    }

                    var fullRoute = page.getFullRoute()();
                    var parentPath = fullRoute.slice(0, fullRoute.length - parentsToTrim).join('/');
                    var fullPath = (parentPath === '' ? '' : parentPath + '/') + value;
                    return fullPath;
                } else if (value.getFullRoute) {
                    return value.getFullRoute()().join('/');
                }
                return "";
            }, this);
        };

        pager.Href.hash = '#';

        hp.bind = function () {
            var hash = ko.computed(function () {
                return pager.Href.hash + this.path();
            }, this);

            ko.applyBindingsToNode(this.element, {
                attr:{
                    'href':hash
                }
            });
        };

        hp.update = function (valueAccessor) {
            this.val(valueAccessor);
        };

        pager.Href5 = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            pager.Href.apply(this, arguments);
        };

        pager.Href5.prototype = new pager.Href();

        pager.Href5.history = window.history;

        pager.Href5.prototype.bind = function () {
            ko.applyBindingsToNode(this.element, {
                attr:{
                    'href':this.path
                },
                click:_.bind(function () {
                    pager.Href5.history.pushState(null, null, this.path());
                }, this)
            });
        };

        ko.bindingHandlers['page-hash'] = {
            init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var href = new pager.Href(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                href.init();
                href.bind();
                element.__ko__page = href;
            },
            update:function (element, valueAccessor) {
                element.__ko__page.update(valueAccessor);
            }
        };

        ko.bindingHandlers['page-href5'] = {
            init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var href = new pager.Href5(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                href.init();
                href.bind();
                element.__ko__page = href;
            },
            update:function (element, valueAccessor) {
                element.__ko__page.update(valueAccessor);
            }
        };

        ko.bindingHandlers['page-href'] = {
            init:function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var Cls = pager.useHTML5history ? pager.Href5 : pager.Href;
                var href = new Cls(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                href.init();
                href.bind();
                element.__ko__page = href;
            },
            update:function (element, valueAccessor) {
                element.__ko__page.update(valueAccessor);
            }
        };

        pager.fx = {};

        pager.fx.cssAsync = function (css) {
            return {
                showElement:function (page, callback) {
                    var $e = $(page.element);
                    $e.addClass(css);
                    $e.show();
                    var i = setInterval(function () {
                        clearInterval(i);
                        $e.addClass(css + '-in');
                    }, 10);
                    var i2 = setInterval(function () {
                        clearInterval(i2);
                        if (callback) {
                            callback();
                        }
                    }, 300);
                },
                hideElement:function (page, callback) {
                    var $e = $(page.element);
                    if (!page.pageHiddenOnce) {
                        page.pageHiddenOnce = true;
                        $e.hide();
                    } else {
                        $e.removeClass(css + '-in');
                        var i = setInterval(function () {
                            clearInterval(i);
                            if (callback) {
                                callback();
                            }
                            $e.hide();
                        }, 300);
                    }
                }
            };
        };

        pager.fx.zoom = pager.fx.cssAsync('pagerjs-fx-zoom');
        pager.fx.flip = pager.fx.cssAsync('pagerjs-fx-flip');
        pager.fx.popout = pager.fx.cssAsync('pagerjs-fx-popout-modal');

        pager.fx.jQuerySync = function (show, hide) {
            return {
                showElement:function (page, callback) {
                    show.call($(page.element), 300, callback);
                },
                hideElement:function (page, callback) {
                    hide.call($(page.element), 300, function () {
                        $(page.element).hide();
                    });
                    if (callback) {
                        callback();
                    }
                }
            };
        };

        pager.fx.slide = pager.fx.jQuerySync($.fn.slideDown, $.fn.slideUp);
        pager.fx.fade = pager.fx.jQuerySync($.fn.fadeIn, $.fn.fadeOut);


        pager.startHistoryJs = function (id) {
            if(id) {
                History.pushState(null, null, id);
            }
            var hashChange = function (hash) {
                // strip #
                if (hash.substring(0, pager.Href.hash.length) === pager.Href.hash) {
                    hash = hash.slice(pager.Href.hash.length);
                }
                // split on '/'
                var hashRoute = decodeURIComponent(hash).split('/');
                pager.showChild(hashRoute);
            };

            // Bind to StateChange Event
            History.Adapter.bind(window, 'statechange', function () {
                var baseUrl = $('base').attr('href');
                var relativeUrl = History.getState().url.replace(baseUrl, '');
                hashChange(relativeUrl);
            });
            History.Adapter.bind(window, 'anchorchange', function () {
                hashChange(location.hash);
            });

            hashChange(History.getState().url.replace(History.getRootUrl(), ''));
        };

        pager.startHashChange = function (id) {
            if(id) {
                location.hash = id;
            }
            $(window).hashchange(function () {
                var hash = location.hash;
                // strip #
                if (hash.substring(0, pager.Href.hash.length) === pager.Href.hash) {
                    hash = hash.slice(pager.Href.hash.length);
                }
                // split on '/'
                var hashRoute = decodeURIComponent(hash).split('/');
                pager.showChild(hashRoute);
            });
            $(window).hashchange();
        };

        /**
         * This is the hash-based start-method.
         *
         * You should only use this method if you do not want HTML5 history support and
         * do not want IE6/7 support.
         *
         * @method start
         * @static
         */
        pager.start = function (id) {
            if(id) {
                location.hash = id;
            }
            var routeFromHashToPage = function (hash) {
                // skip # (or #!/)
                if (hash.substring(0, pager.Href.hash.length) === pager.Href.hash) {
                    hash = hash.slice(pager.Href.hash.length);
                }
                // split on '/'
                var hashRoute = decodeURIComponent(hash).split('/');
                pager.showChild(hashRoute);
            };

            var onHashChange = function () {
                routeFromHashToPage(window.location.hash);
            };
            $(window).bind('hashchange', onHashChange);

            onHashChange();
        };
        return pager;
    };


    /*--------------------------------------------------------------------------*/

    /** Detect free variable `exports` */
    var freeExports = typeof exports === 'object' && exports &&
        (typeof global === 'object' && global && global === global.global && (window = global), exports);

    // expose Pager.js
    // This code is a modified version of the AMD-fallback code found in Lo-Dash
    // (https://raw.github.com/bestiejs/lodash/master/lodash.js)
    // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
    if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        // Expose Lo-Dash to the global object even when an AMD loader is present in
        // case Lo-Dash was injected by a third-party script and not intended to be
        // loaded as a module. The global assignment can be reverted in the Lo-Dash
        // module via its `noConflict()` method.
        // window.pager = pager;

        // define as an anonymous module so, through path mapping, it can be
        // referenced as any module
        define(['jquery', 'underscore', 'knockout'], function (jquery, _, ko) {
            return pagerJsModule($, _, ko);
        });
    }
    // check for `exports` after `define` in case a build optimizer adds an `exports` object
    else if (freeExports) {
        // in Node.js or RingoJS v0.8.0+
        if (typeof module == 'object' && module && module.exports == freeExports) {
            (module.exports = pager).pager = pager;
        }
        // in Narwhal or RingoJS v0.7.0-
        else {
            freeExports.pager = pager;
        }
    }
    else {
        // in a browser or Rhino
        window.pager = pagerJsModule($, _, ko);
    }


}(this));
