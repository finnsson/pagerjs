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

pager.js extends KnockoutJS with three custom bindings: `page`, `page-href` and `page-accordion-item`.

### page

    <div data-bind="page: {}">
    </div>

#### Configurations

* `{String} id` of scoped page that a router should react to. E.g. `start` or `user/me`.
  If the id is `?` (wildcard) it will match anything if no other page in the same parent match.
* `{Object} with` that can change the scope of elements descendants. The same behavior as the normal `with`-binding.
* `{Function} withOnShow` sets the view model of elements descendants async after the page is shown. This is useful
  so you can extract sub pages view models to other `.js`-files.
* `{String} source` to load into element using `jQuery#load`. The source will be loaded once the page is processed.
* `{Function} sourceLoaded` is a method/event/callback to run once the `source` (or `sourceOnShow`) is loaded.
* `{String} sourceOnShow` to load into element using `jQuery#load` when the element is displayed. Thus sub pages
  can be extracted and loaded on demand.
* `{Boolean/Number} sourceCache` can be set to true in order for sourceOnShow to only load the source once.
  If a number is specified the cache is valid for that amount of time in seconds.
* `{String} frame` can be set to `iframe` in order for the source to be loaded into an iframe. If the page contains
  an iframe that element is used.

### page-href

    <a data-bind="page-href: 'somePagePath'"></a>

Calculates absolute href based on the location of the element.

### page-accordion-item

    <!-- First item in accordion -->
    <div data-bind="page-accordion-item: {id: 'dog'}">
        <a href="#animals/dog">Dog</a>
        <div>Dog Information</div>
    </div>
    <!-- Second item in accordion -->
    <div data-bind="page-accordion-item: {id: 'cat'}">
        <a href="#animals/cat">Cat</a>
        <div>Cat Information</div>
    </div>

`page-accordion-item` is a subclass / subbinding of `page` enabling deep linking and navigation of accordions.


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

One custom widget (`page-accordion-item`) is already implemented.

    <div data-bind="page: {id: 'employee'}">
        <div data-bind="page-accordion-item: {id: 'zoidberg'}">
            <a href="#employee/zoidberg">Dog</a>
            <div>Zoidberg Information</div>
        </div>
        <div data-bind="page-accordion-item: {id: 'hermes'}">
            <a href="#employee/hermes">Cat</a>
            <div>Hermes Information</div>
        </div>
    </div>

### Should be possible to circumvent the routing

Since pager is not responsible for listening on the location it is possible to
circumvent the routing using the router used. Just do not use `pager.start`.

## In the pipeline

### Should be possible to run custom JS on "before/after navigate from/to"

There are four alternatives:

* global registration using `pager.route`
* global data binding on body using `click`
* local data binding on anchor using `click`
* local data binding on page using `beforeHide`, `afterHide`, `beforeShow`, and `afterShow`


    // global registration using pager.route
    var pager = viewModel.pager();
    ko.computed(function() {
      // this method is triggered every time route is changed
      console.error(pager.route());
    });

    <body data-bind="click: globalClick">

        // local data binding on page
        <div data-bind="page: {id: 'fry', beforeHide: beforeFryIsHidden}

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
    pager.hideElement = function(callback) {
      $(this.element).slideUp(600);
      if(callback) {
        callback();
      }
    };

    // new default show
    pager.showElement = function(callback) {
      $(this.element).slideDown(600);
      if(callback) {
        callback();
      }
    };

    var showFry = function(callback) {
      $(this.element).fadeIn(500, callback);
    };
    var hideFry = function(callback) {
      $(this.element).fadeOut(500, callback);
    };

### Should be possible to change the page title

    <div data-bind="page: {id: 'fry', title: 'Fry'}">
      Fry
    </div>

Setting the 'title' configuration property will update the document title when navigating to
the page.

### Should be possible to specify loaders in pages

### Should be possible to specify global loaders

### Tab panel custom widget

### Wildcards should deep-load content if configured so

    <a href="some/other/url">Go to some/other/url.html</a>

    <div data-bind="page: {id: '?', deep: true, sourceOnShow: '{?}.html'}>
    </div>


## Backlog

There are a lot of features waiting to be implemented. Here are some of them.

### Custom Widgets

#### Site map custom widget

### Should be possible to use a page as template for other pages

    <div id="sourceTpl" data-tpl="page: {sourceCache: true, sourceOnShow: '{?}.html'}">
      <div class="loader">
        The page is loading...
      </div>
    </div>

    <div data-bind="page: {id: 'fry', tpl: 'sourceTpl'}">
    </div>

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