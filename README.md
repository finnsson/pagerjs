# pager.js

pager.js provides the possibility of creating single page applications in a declarative fashion.

This makes it easier to design large scale single page web sites.

See the [demo](http://oscar.finnsson.nu/pagerjs/demo/).

## Getting Started

* Download the [developer version](https://raw.github.com/finnsson/pagerjs/master/pager.js)
   or the [minified version](https://raw.github.com/finnsson/pagerjs/master/dist/pager.min.js)
   of pager.js
* Include all dependencies (jQuery, Underscore.js, KnockoutJS) as well as pager.js in your site
* Start using the bindings `page`, `page-href`, and `page-accordion-item`. Consult the
  [web page](http://oscar.finnsson.nu/pagerjs/) or
  [test cases](https://github.com/finnsson/pagerjs/tree/master/test) for how to use the bindings.
* Insert the lines `pager.extendWithPage(viewModel); ko.applyBindings(viewModel); pager.start(viewModel);`
* Rock 'n' Roll!

## Helpers

* `pager.route`
* `pager.start`
* `pager.extendWithPage`

### Example

    // viewModel is your KnockoutJS view model
    var viewModel = {};
    // pager.extendWithPage extends your
    // view model with some pager-specific data
    pager.extendWithPage(viewModel);
    // apply your view model as normal
    ko.applyBindings(viewModel);
    // start the pager. Will listen to hashchange and
    // show/hide pages depending on their page IDs
    pager.start(viewModel);


## Custom Bindings

pager.js extends KnockoutJS with four custom bindings: `page`, `page-href`, `page-hash` and
`page-href5`.

### page

    <div data-bind="page: {}">
    </div>

#### Configurations

* `{String} id` of scoped page that a router should react to. E.g. `start` or `user/me`.
  If the id is `?` (wildcard) it will match anything if no other page in the same parent match.
* `{Object} with` that can change the scope of elements descendants. The same behavior as the normal `with`-binding.
* `{Function} withOnShow` sets the view model of elements descendants async after the page is shown. This is useful
  so you can extract sub pages view models to other `.js`-files.
* `{String/Function} source` to load into element using `jQuery#load`. The source will be loaded once the page is processed.
  If it is a function it is invoken.
* `{Function} sourceLoaded` is a method/event/callback to run once the `source` (or `sourceOnShow`) is loaded.
* `{String/Function} sourceOnShow` to load into element using `jQuery#load` when the element is displayed. Thus sub pages
  can be extracted and loaded on demand. If it is a function it is invoken.
* `{Boolean/Number} sourceCache` can be set to true in order for sourceOnShow to only load the source once.
  If a number is specified the cache is valid for that amount of time in seconds.
* `{String} frame` can be set to `iframe` in order for the source to be loaded into an iframe. If the page contains
  an iframe that element is used.
* `{Boolean} modal` can be set to `true` in order for the page to act as a modal. If a page is a modal it can be
  found by child-pages to sibling-pages of the modal.
* `{Function} beforeHide` is called before the page is hidden.
* `{Function} beforeShow` is called before the page is shown.
* `{Function} afterHide` is called after the page is hidden.
* `{Function} afterShow` is called after the page is shown.
* `{Function} hideElement` can be supplied as a custom hide-method instead of the default `$(element).hide()`;
* `{Function} showElement` can be supplied as a custom show-method instead of the default `$(element).show()`;
* `{Function} loader` to call once the page is loaded. Can e.g. create a spinner inside the element.
* `{Function} navigationFailed` method to call if a navigation could not find any matching page.
* `{Object} params` binds URL-parameters to local observables.
* `{Function} guard` validates a page transition before it is happening.


### page-href

    <a data-bind="page-href: 'somePagePath'"></a>

Calculates absolute href based on the location of the element.


## Dependencies

- [KnockoutJS](http://knockoutjs.com/)
- [jQuery](http://jquery.com/)
- [Underscore.js](http://underscorejs.org/)

For developing pager.js you'll need

- [Node.js](http://nodejs.org/)
- [Grunt](https://github.com/cowboy/grunt)
- [QUnit](http://qunitjs.com/)
- [PhantomJS](http://phantomjs.org/)
- [RequireJS](http://requirejs.org/)

## Behaviors

The following behaviors specify and exemplify what pager.js is capable of.

### Should display page with id start by default

    <div>
      <div data-bind="page: {id: 'bar'}">Bar</div>
      <!-- Foo is displayed -->
      <div data-bind="page: {id: 'start'}">Foo</div>
    </div>

### Should navigate to page using scoped IDs.

    <div data-bind="page: {id:'start'}">
      <a href="#foo">Go to foo</a>
    </div>
    <div data-bind="page: {id: 'foo'}">
      Foo. Go to <a href="#start">start</a>
    </div>

### Should be possible to do deep navigation

    <div id="start" data-bind="page: {id: 'start'}">
        <a href="#user/fry">Go to Fry</a>
    </div>

    <div id="user" data-bind="page: {id: 'user'}">
        <div id="fry" data-bind="page: {id: 'fry'}">Fry</div>
    </div>

### Should load external content into a page using `source` and trigger `sourceLoaded` event

    <div data-bind="page: {id: 'lorem', source: 'lorem.html .content', sourceLoaded: loremIsLoaded}"></div>

The source can contain a selector (see `.content` above) in order to extract a fragment on the site.
In the example above `loremIsLoaded` is a function that is triggered after `lorem.html` is loaded.

### Should lazy load an external content into a page if `sourceOnShow` is declared

    <div data-bind="page: {id: 'lazyLorem', sourceOnShow: 'lorem.html .content'}"></div>

`sourceOnShow` tells the page to load the content when the page is displayed.

### Should cache lazy loaded content when `sourceCache: true`

    <div data-bind="page: {id: 'lazyLoremCached', sourceOnShow: 'lorem.html .content', sourceCache: true}"></div>

### Should cache lazy loaded content the number of seconds specified by `sourceCache`

    <div data-bind="page: {id: 'lazyLoremCached5seconds', sourceOnShow: 'lorem.html .content', sourceCache: 5}"></div>

`sourceCache` can specify the amount of seconds the external content should be cached.

### Should specify relative page paths using `page-href`

    <div data-bind="page: {id: 'start'}">
      <!-- This will update href to #start/bender -->
      <a data-bind="page-href: 'bender'">Bender</a>

      <!-- This will update href to #admin/login -->
      <a data-bind="page-href: '../admin/login'">Admin Login</a>

      <div data-bind="page: {id: 'bender'}">Bender!</div>
    </div>
    <div data-bind="page: {id: 'admin'}">
      <div data-bind="page: {id: 'login'}">Login</div>
    </div>

Based on the total path of the page the binding calculates an absolute href.

### Should change binding context using `with`

    <div data-bind="page: {id: 'user', with: user}">
      <!-- Here name is user.name -->
      <div data-bind="text: name"></div>
    </div>

### `withOnShow` should lazy bind a new view model to the page

    <div data-bind="page: {id: 'user', withOnShow: someMethod('someMethod')}"></div>

`someMethod` must return a function that takes a callback that takes a view model.

E.g.

    function requireVM(module) {
      return function(callback) {
        require([module], function(mod) {
          callback(mod.getVM());
        });
      };
    }

### Should match wildcard IDs if no other ID can match exactly

    <div data-bind="page: {id: 'admin'}"></div>
    <!-- The page below match anything except 'admin' -->
    <div data-bind="page: {id: '?'}"></div>

### Should do deep navigation with wildcards

    <div data-bind="page: {id: 'start'}">
          <a href="#user/leela">Go to Leela</a>
    </div>

    <div data-bind="page: {id: '?'}">
        Misc:
        <div data-bind="page: {id: 'leela'}">
            Leela
        </div>
    </div>

### Should send wildcards to source

    <div data-bind="page: {id: 'start'}">
        <a href="#user/fry">Go to Fry</a>
    </div>

    <div data-bind="page: {id: 'user'}">
        User:
        <!-- {1} will be replaced with whatever matched the wildcard -->
        <div data-bind="page: {id: '?', sourceOnShow: 'user/{1}.html'}">
        </div>
    </div>

### Should be possible to load content into iframes

    <!-- An iframe will be created inside the div -->
    <div data-bind="page: {id: 'user', frame: 'iframe', source: 'user.html'}"></div>

    <!-- The iframe specified will be used -->
    <div data-bind="page: {id: 'fry', frame: 'iframe', source: 'fry.html'}">
        <iframe sandbox=""></iframe>
    </div>

### Should be possible to route to custom widgets (dialogs, carousels, accordions)

It is possible to create custom widgets that jack into the pager-system.
The `page`-binding (`pager.Page`-class) is possible to extend at multiple points.

### Should be possible to circumvent the routing

Since pager is not responsible for listening on the location it is possible to
circumvent the routing using the router used. Just do not use `pager.start`.

### Should be possible to navigate into a layer (modal dialog) without losing context

    <div data-bind="page: {id: 'start'}">
      <div data-bind="page: {id: 'admin'}>
        <a href="#start/admin/ok">Show OK</a>
      </div>
      <div data-bind="page: {id: 'ok', modal: true, title: 'OK?'}">
            <a href="#admin">OK?</a>
      </div>
    </div>

If a `page` is set to `modal` is can match IDs deeper down the hierarchy. In this case
start/ok also matches start/admin/ok making the page available as a modal dialog
in other contexts.

### Should be possible to navigate into a layer (modal dialog) and lose context

    <div data-bind="page: {id: 'start'}">
      <div data-bind="page: {id: 'admin'}>
        <a href="#start/ok">Show OK</a>
      </div>
      <div data-bind="page: {id: 'ok', modal: true}">
            <a href="#admin">OK?</a>
      </div>
    </div>

Losing the context is nothing special. Just navigate away form the current page.

### Should be possible to change the page title

    <div data-bind="page: {id: 'fry', title: 'Fry'}">
      Fry
    </div>

Setting the 'title' configuration property will update the document title when navigating to
the page.


### Should be possible to run custom JS on "before/after navigate from/to"

There are four alternatives:

* global registration using pager.childManager
* global data binding on body using `click`
* local data binding on anchor using `click`
* local data binding on page using `beforeHide`, `afterHide`, `beforeShow`, and `afterShow`


    // global registration using pager.childManager
    ko.computed(function() {
      var currentChild = pager.childManager.currentChildO();
      if(currentChild) {
        // do something
      }
    });

    <body data-bind="click: globalClick">

        // local data binding on page
        <div data-bind="page: {id: 'fry', beforeHide: beforeFryIsHidden}"></div>

        // local data binding on anchor using click
        <a data-bind="page-href: 'fry' click: anchorClicked}">Go to Fry</a>

    </body>

    var beforeFryIsHidden = function(page) {
        console.error(page);
    };

    var anchorClicked = function(page, e) {
        // otherwise the event will be stopped
        return true;
    };

    var globalClick = function() {
        // otherwise the event will be stopped
        return true;
    };

The click data-binding can be used to run validations before navigations. Just do not `return true`
to prevent the navigation from happening.


### Should be possible to supply custom showElement and hideElement-methods

    <div data-bind="page: {id: 'fry', showElement: showFry, hideElement: hideFry}">
      Fry
    </div>

    // new default hide
    pager.hideElement = function(page, callback) {
      $(page.element).slideUp(600);
      if(callback) {
        callback();
      }
    };

    // new default show
    pager.showElement = function(page, callback) {
      $(page.element).slideDown(600);
      if(callback) {
        callback();
      }
    };

    var showFry = function(page, callback) {
      $(page.element).fadeIn(500, callback);
    };
    var hideFry = function(page, callback) {
      $(page.element).fadeOut(500, callback);
    };

### Should be possible to specify loaders in pages

    <div data-bind="page: {id: 'zoidberg', title: 'Zoidberg', loader: loader, sourceOnShow: 'zoidberg.html'}" />

where

    textLoader: function(page, element) {
        var loader = {};
        var txt = $('<div></div>', {text: 'Loading ' + page.getValue().title});
        loader.load = function() {
            $(element).append(txt);
        };
        loader.unload = function() {
            txt.remove();
        };
        return loader;
    }

### Should be possible to specify global loaders

    // see textLoader above
    pager.loader = textLoader;

### Documented source code

The source code is documented using JsDoc.

### Tab panel custom widget

    <ul class="nav nav-tabs" data-bind="foreach: $page.children">
        <li data-bind="css: {active: isVisible}"><a data-bind="text: $data.getValue().title, page-href: getId()"></a></li>
    </ul>

    <div data-bind="page: {id: 'Slagsmålsklubben', title: 'Slagsmålsklubben', sourceOnShow: 'https://embed.spotify.com/?uri=spotify:album:66KBDVJnA6c0DjHeSZYaHb', frame: 'iframe'}" class="hero-unit">
        <iframe width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    </div>

    <div data-bind="page: {id: 'Binärpilot', title: 'Binärpilot', sourceOnShow: 'https://embed.spotify.com/?uri=spotify:album:67LKycg4jAoC06kZgjvbNd', frame: 'iframe'}" class="hero-unit">
        <iframe width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    </div>


### Should be possible to react to a failed navigation

Both Page-objects and pager should send events whenever a navigation failed (i.e. no matching page for the route).

    <a data-bind="click: function() { window.location.hash = 'failed_navigation/random/' + (Math.random()*1000).toFixed() }">
        Go to random sub-page
    </a>

    <div data-bind="page: {id: 'random', navigationFailed: randomFailed}">
        <ul class="nav nav-tabs" data-bind="foreach: $page.children">
            <li data-bind="css: {active: isVisible}"><a
                    data-bind="text: getId(), page-href: getId()"></a></li>
        </ul>

        <div data-bind="foreach: newChildren">
            <div data-bind="page: {id: childId}">
                <span data-bind="text: childId"></span>
            </div>
        </div>
    </div>

where

    randomFailed:function (page, route) {
        viewModel.newChildren.push({
            childId:route[0]
        });
        page.showPage(route);
    },
    newChildren:ko.observableArray([])


### Should be possible to load view content using a custom method

In order to facilitate programming in the large it is useful to be able to extract views as separate components.
These views should not be forced to be stored as html-fragments or be loaded with jQuery.

Thus a way to inject custom views should be possible. This is done using the `source`- or
`sourceOnShow`-properties. Just supply a method instead of a string!

These properties takes a method that should take a `pager.Page` as first argument, a callback, and return nothing.

    <div data-bind="page: {id: 'zoidberg', sourceOnShow: requireView('character/zoidberg')}" />

where

    window.requireView = function(viewModule) {
      return function(page, callback) {
        require([viewModule], function(viewString) {
          $(page.element).html(viewString);
          callback();
        });
      };
    };

if

    // file: character/zoidberg.js
    define(function() {
      return '<h1>Zoidberg</h1>';
    });


### Should be possible to send URI (fragment identifier) parameters to a page

A page should be able to access the information in the current route - changing a view-model.

Sending parts of the fragment identifier to variables in the view-model is possible using
`params`.

    <div data-bind="page: {id: 'search', params: {'name', 'fromdate'}}">
      <span data-bind="text: name"></span> (<span data-bind="text: fromdate"></span>)
    </div>

where `name` and `fromdate` with be bound by the parameters `name` and `fromdate`.

An example route for the example above could look like

    example.com/#search/tv?name=samsung&fromdate=20121010

or if HTML5 history is used

    example.com/search/tv?name=samsung&fromdate=20121010

### Should be possible to add guards

Guards are methods that are run before the page navigation takes place and
that can stop the navigation from displaying a certain page.

Use the property `guard: someMethod` do apply the guard. The method
takes three parameters: page, route and callback. If the callback is called
the navigation takes place - otherwise it is stopped.

    <div data-bind="page: {id: 'admin', guard: isLoggedIn}">
      This page is only accessible if the user is logged in.
    </div>

where

    isLoggedIn: function(toPage, route, callback, fromPage) {
        if(viewModel.loggedIn()) {
            callback();
        } else {
            window.location.href = "login";
        }
    }

Use cases are login, validating steps in state machines, etc.

The reason the guard takes a callback as third argument is simply because the guard might be async - accessing
a webserver for login details or asking if a valid shopping card exists etc.

## 0.6

### Should contain common effects

I need to add the css-classes automatically

### HTML5 History Boilerplate

An example application of using pager.js together with History.js can be found in `boilerplate`.

### page-hash, page-href5 and page-href

Two new bindings are created: `page-hash` and `page-href5`.


## In the pipeline

### Document architecture and guiding principles

The architecture - and guiding principles - should be documented.

## Backlog

There are a lot of features waiting to be implemented. Here are some of them.

### Wildcards should deep-load content if configured so

    <a href="some/other/url">Go to some/other/url.html</a>

    <div data-bind="page: {id: '?', deep: true, sourceOnShow: '{?}.html'}>
    </div>

### Scoped pure view observables using `vars`

    <!-- x and y are now available as observables, but only in the view (not the view-model) -->
    <div data-bind="page: {id: 'foo', vars: ['x','y']}">
      <span data-bind="text: x"></span>
      <span data-bind="text: x"></span>
    </div>

This is useful for effects that has nothing to do with the view-model.

### Named binding of child elements using `bind-child`

    <div data-bind="page: {id: 'foo'}">
      <div>
        <span data-bind="page-child: 'name'"/>
        <span data-bind="page-child: 'age'"/>
      </div>
    </div>

Now `name` and `age` are available in the `Page`-instance
under the `elementChildren`-observable, e.g. `this.elementChildren().name()`
and `this.elementChildren().age()`.
