# [pager.js](http://oscar.finnsson.nu/pagerjs/)

[![Build Status](https://travis-ci.org/finnsson/pagerjs.png)](https://travis-ci.org/finnsson/pagerjs)

    one having or covering a specified number or kind of pages
      - Merriam-Webster

See the [demo](http://pagerjs.com/demo/).

pager.js is a JavaScript library based on KnockoutJS and jQuery that provides the possibility of
creating single page applications in a declarative fashion - nesting subpages inside subpages where each subpage can be
developed standalone but still communicate between each other.

This makes it easier to design very large scale single page web sites.

This readme is for version 0.7 (development version towards 0.8 milestone). See the r0.6-branch for the latest
stable milestone.

## Getting Started

1. Download the [developer](https://raw.github.com/finnsson/pagerjs/master/pager.js) version
   or the [minified](https://raw.github.com/finnsson/pagerjs/master/dist/pager.min.js) version
   of pager.js
2. Include all dependencies (jQuery, KnockoutJS) as well as pager.js in your site
   using either AMD or non-AMD:

        // AMD
        requirejs.config({
            shim: {
                history: ['jquery'], // iff using History.js
                hashchange: ['jquery'] // iff using jquery hashchange
            },
            paths:{
                jquery:'jquery-1.8.2.min',
                knockout:'knockout-2.1.0',
                pager:'pager.amd.min',
                // iff using jquery hashchange
                hashchange:'jquery.ba-hashchange.min',
                // iff using History.js
                history: 'jquery.history'
            }
        });

        // non-AMD
        <script type="text/javascript" src="jquery-1.8.2.min.js"></script>
        <script type="text/javascript" src="knockout-2.1.0.js"></script>
        <script type="text/javascript" src="pager.js"></script>

        // iff using jQuery Hashchange
        <script type="text/javascript" src="jquery.ba-hashchange.min"></script>

        // iff using History.js
        <script type="text/javascript" src="jquery.history.js"></script>
        <base href="absolute-URI-to-index.html/"/>
        <!-- where absolute-URI-to-index.html can be e.g. www.examepl.com/foo/ -->


3. Insert the lines:

        // iff using History.js
        // tell page-href to use page-href5
        pager.useHTML5history = true;
         // tell page-href5 to use History.js instead of history
        pager.Href5.history = History;

        // always
        pager.extendWithPage(viewModel);
        ko.applyBindings(viewModel);

        // pick one of these three alternatives or develop your own start-method

        // 1. iff using naïve hashchange - wont work with IE7
        pager.start();

        // 2. iff using jQuery Hashchange
        pager.startHashChange();

        // 3. iff using History.js
        pager.startHistoryJs();

4. Start using the bindings `page` and `page-href`. Consult the
   [web page](http://oscar.finnsson.nu/pagerjs/),
   [demo](http://pagerjs.com/demo/)
   or [test cases](https://github.com/finnsson/pagerjs/tree/master/test) for how to use the bindings.
5. Rock 'n' Roll!

## Dependencies

- [KnockoutJS](http://knockoutjs.com/)
- [jQuery](http://jquery.com/)

You will usually use pager.js in combination with either
[jQuery hashchange](https://github.com/cowboy/jquery-hashchange)
or [History.js](https://github.com/balupton/History.js/).

pager.js is not depending on any CSS framework!

For developing pager.js you'll also need

- [Node.js](http://nodejs.org/)
- [Grunt](https://github.com/cowboy/grunt)
- [QUnit](http://qunitjs.com/)
- [PhantomJS](http://phantomjs.org/)
- [RequireJS](http://requirejs.org/)

## Philosophy

Developing a huge single page application should be like developing multiple small pages. That is the only way
you'll be able to scale up and out the development. In order to ease development in the large pager.js got

* views (pages) that can be loaded on-demand
* view-models that can be loaded on-demand

These MVVM-triads can be developed in isolation and later on connected.

## Reference Manual

pager.js got some static methods and
extends KnockoutJS with four custom bindings: `page`, `page-href`, `page-hash` and
`page-href5`.

### `pager.page : pager.Page`

A reference to the root page, of type `pager.Page`. This page instance is the same as
`$__page__` (or `$root.$__page__`) in your data binding.

### `pager.showChild(String[])`

Display the pages matching the route (String-array) without changing the location.

This method is called by `pager.start`, `pager.startHashChange` and `pager.startHistoryJS`. If you plan to implement
your own start-method you'll need to call this method with the calculated route.

### `pager.start([String])`

Used if you are using neither `jQuery hashchange` nor `History.js`. This method does not work for IE7 and
can give unexpected results for IE8!

* [Setup](http://pagerjs.com/demo/#!/setup)


### `pager.startHashChange([String])`

Used if you are using `jQuery hashchange`.

* [Setup](http://pagerjs.com/demo/#!/setup)


### `pager.startHistoryJs([String])`

Used if you are using `History.js`.

* [HTML5 History API](http://pagerjs.com/demo/#!/html5_history)
* [Setup](http://pagerjs.com/demo/#!/setup)

### `pager.extendWithPage(Object)`

Extends your root view model with a root page-instance.

* [Setup](http://pagerjs.com/demo/#!/setup)

### page-href

    <a data-bind="page-href: 'somePagePath'"></a>

    <a data-bind="page-href: '../some/relative/page/path'"></a>

    <a data-bind="page-href: somePageInstance"></a>

Calculates absolute href based on the location of the element.

If hashes are used it will be prefixed with `#` by default. You can change the default prefix
to e.g. `#!/` by setting `pager.Href.hash = '#!/';`

True URLs can use used by either using the `page-href5` binding or setting `pager.useHTML5history = true`.

History.js can be used by setting `pager.Href5.history = History` (default to the normal `history`).

It the page-href is supplied a Page-instance the absolute href to the Page-instance is calculated.

* [Relative path](http://pagerjs.com/demo/#!/relative_path)
* [Absolute Path](http://pagerjs.com/demo/#!/absolute_path)
* [HTML5 History](http://pagerjs.com/demo/#!/html5_history)

### page

    <div data-bind="page: {}">
    </div>

The page-binding. See configuration.

## Configurations

The configuration options for the page-binding.


### {String} id

ID of scoped page that a router should react to. E.g. `start` or `user/me`.
If the id is `?` (wildcard) it will match anything if no other page in the same parent match.

If you are using fragment idetifiers (`#`) you can control the prefix by setting `pager.Href.hash`. Setting
`pager.Href.hash = "#!/"` before calling `paget.start()` will tell `pager` to react to fragments starting with
`#!/` instead of simply `#`.

* [Setup](http://pagerjs.com/demo/#!/setup)
* [Deep Navigation](http://pagerjs.com/demo/#!/deep_navigation)
* [Matching Wildcards](http://pagerjs.com/demo/#!/matching_wildcards)
* [Deep Navigation with Wildcards](http://pagerjs.com/demo/#!/deep_navigation_with_wildcards)

### {Object} with

That can change the scope of elements descendants. The same behavior as the normal `with`-binding.

* [Change Binding Context](http://pagerjs.com/demo/#!/change_binding_context)

### {Function} withOnShow

Sets the view model of elements descendants async after the page is shown. This is useful
so you can extract sub pages view models to other `.js`-files.

* [Lazy-Bind View-Model](http://pagerjs.com/demo/#!/lazy_bind_view_model)

### {String/Function} source

Source to load into element using `jQuery#load`. The source will be loaded once the page is processed.
If it is a function it is invoked.

* [Load External Content](http://pagerjs.com/demo/#!/load_external_content)
* [Load View using Custom Method](http://pagerjs.com/demo/#!/custom_view_loader)

### {Function} sourceLoaded

Is a method/event/callback to run once the `source` (or `sourceOnShow`) is loaded.

* [Load External Content](http://pagerjs.com/demo/#!/load_external_content)

### {String/Function} sourceOnShow

Source to load into element using `jQuery#load` when the element is displayed. Thus sub pages
can be extracted and loaded on demand. If it is a function it is invoked.

* [Lazy-Load External Content](http://pagerjs.com/demo/#!/lazy_load_external_content)
* [Load View using Custom Method](http://pagerjs.com/demo/#!/custom_view_loader)

### {Boolean/Number} sourceCache

Can be set to true in order for sourceOnShow to only load the source once.
If a number is specified the cache is valid for that amount of time in seconds.

* [Cached Lazy-Loaded Content](http://pagerjs.com/demo/#!/cached_lazy)

### {String} frame

Can be set to `iframe` in order for the source to be loaded into an iframe. If the page contains
an iframe that element is used.

* [Load Content into iframe](http://pagerjs.com/demo/#!/load_into_iframe)
* [Configure an iframe](http://pagerjs.com/demo/#!/configure_iframe)

### {Boolean} modal

Can be set to `true` in order for the page to act as a modal. If a page is a modal it can be
found by child-pages to sibling-pages of the modal.

* [Modals](http://pagerjs.com/demo/#!/modals)

### {Function} beforeHide

Is called before the page is hidden.

* [Custom JS when Navigating](http://pagerjs.com/demo/#!/custom_js_when_navigating)

### {Function} beforeShow

Is called before the page is shown.

* [Custom JS when Navigating](http://pagerjs.com/demo/#!/custom_js_when_navigating)

### {Function} afterHide

Is called after the page is hidden.

* [Custom JS when Navigating](http://pagerjs.com/demo/#!/custom_js_when_navigating)

### {Function} afterShow

Is called after the page is shown.

* [Custom JS when Navigating](http://pagerjs.com/demo/#!/custom_js_when_navigating)

### {Function} hideElement

Custom hide-method instead of the default `$(element).hide()`;

* [Custom Hide- and Show-Methods](http://pagerjs.com/demo/#!/custom_hide_show)

### {Function} showElement

Custom show-method instead of the default `$(element).show()`;

* [Custom Hide- and Show-Methods](http://pagerjs.com/demo/#!/custom_hide_show)

### {Function} loader

Loader to call once the page is loaded. Can e.g. create a spinner inside the element.

* [Loader](http://pagerjs.com/demo/#!/loader)

### {Function} navigationFailed

Method to call if a navigation could not find any matching page.

* [Reacting to Failed Navigation](http://pagerjs.com/demo/#!/failed_navigation)

### {Object} params

Binds URL-parameters to local observables.

* [Binding URI parameters](http://pagerjs.com/demo/#!/params)

### {Function} guard

Validates a page transition before it is happening.

* [Guards](http://pagerjs.com/demo/#!/guards)

### {String} fx

* [FX](http://pagerjs.com/demo/#!/fx)

### {Object} vars

Created scoped observables for the view. Useful for when observables are needed purely for the view
and has no connection to the view-model.

* [Custom observables in the view](http://pagerjs.com/demo/#!/vars)

### {Boolean} deep

By setting `deep: true` a wildcard page will deep-load supplied sources.

* [Deep Load Content into Wildcard](http://pagerjs.com/demo/#!/deep_load_content_into_wildcard)

## Cookbook

The following behaviors specify and exemplify what pager.js is capable of.

### Display page with id start by default

    <div>
      <div data-bind="page: {id: 'bar'}">Bar</div>
      <!-- Foo is displayed -->
      <div data-bind="page: {id: 'start'}">Foo</div>
    </div>

### Navigate to page using scoped IDs.

    <div data-bind="page: {id:'start'}">
      <a href="#foo">Go to foo</a>
    </div>
    <div data-bind="page: {id: 'foo'}">
      Foo. Go to <a href="#start">start</a>
    </div>

### Deep navigation

    <div id="start" data-bind="page: {id: 'start'}">
        <a href="#user/fry">Go to Fry</a>
    </div>

    <div id="user" data-bind="page: {id: 'user'}">
        <div id="fry" data-bind="page: {id: 'fry'}">Fry</div>
    </div>

### Load external content into a page using `source` and trigger `sourceLoaded` event

    <div data-bind="page: {id: 'lorem', source: 'lorem.html .content', sourceLoaded: loremIsLoaded}"></div>

The source can contain a selector (see `.content` above) in order to extract a fragment on the site.
In the example above `loremIsLoaded` is a function that is triggered after `lorem.html` is loaded.

### Lazy load an external content into a page if `sourceOnShow` is declared

    <div data-bind="page: {id: 'lazyLorem', sourceOnShow: 'lorem.html .content'}"></div>

`sourceOnShow` tells the page to load the content when the page is displayed.

### Cache lazy loaded content when `sourceCache: true`

    <div data-bind="page: {id: 'lazyLoremCached', sourceOnShow: 'lorem.html .content', sourceCache: true}"></div>

### Cache lazy loaded content the number of seconds specified by `sourceCache`

    <div data-bind="page: {id: 'lazyLoremCached5seconds', sourceOnShow: 'lorem.html .content', sourceCache: 5}"></div>

`sourceCache` can specify the amount of seconds the external content should be cached.

### Specify relative page paths using `page-href`

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

### Change binding context using `with`

    <div data-bind="page: {id: 'user', with: user}">
      <!-- Here name is user.name -->
      <div data-bind="text: name"></div>
    </div>

### `withOnShow` will lazy bind a new view model to the page

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

### Match wildcard IDs if no other ID can match exactly

    <div data-bind="page: {id: 'admin'}"></div>
    <!-- The page below match anything except 'admin' -->
    <div data-bind="page: {id: '?'}"></div>

### Deep navigation with wildcards

    <div data-bind="page: {id: 'start'}">
          <a href="#user/leela">Go to Leela</a>
    </div>

    <div data-bind="page: {id: '?'}">
        Misc:
        <div data-bind="page: {id: 'leela'}">
            Leela
        </div>
    </div>

### Send wildcards as parameter to source-method

    <div data-bind="page: {id: 'start'}">
        <a href="#user/fry">Go to Fry</a>
    </div>

    <div data-bind="page: {id: 'user'}">
        User:
        <!-- {1} will be replaced with whatever matched the wildcard -->
        <div data-bind="page: {id: '?', sourceOnShow: 'user/{1}.html'}">
        </div>
    </div>

### Load content into iframes

    <!-- An iframe will be created inside the div -->
    <div data-bind="page: {id: 'user', frame: 'iframe', source: 'user.html'}"></div>

    <!-- The iframe specified will be used -->
    <div data-bind="page: {id: 'fry', frame: 'iframe', source: 'fry.html'}">
        <iframe sandbox=""></iframe>
    </div>

### Route to custom widgets (dialogs, carousels, accordions)

It is possible to create custom widgets that jack into the pager-system.
The `page`-binding (`pager.Page`-class) is possible to extend at multiple points.

### Circumvent the routing

Since pager is not responsible for listening on the location it is possible to
circumvent the routing using the router used. Just do not use `pager.start`.

### Navigate into a layer (modal dialog) without losing context

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

### Navigate into a layer (modal dialog) and lose context

    <div data-bind="page: {id: 'start'}">
      <div data-bind="page: {id: 'admin'}>
        <a href="#start/ok">Show OK</a>
      </div>
      <div data-bind="page: {id: 'ok', modal: true}">
            <a href="#admin">OK?</a>
      </div>
    </div>

Losing the context is nothing special. Just navigate away form the current page.

### Change the page title

    <div data-bind="page: {id: 'fry', title: 'Fry'}">
      Fry
    </div>

Setting the 'title' configuration property will update the document title when navigating to
the page.


### Run custom JS on "before/after navigate from/to"

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


### Supply custom showElement and hideElement-methods

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

### Specify loaders in pages

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

### Specify global loaders

    // see textLoader above
    pager.loader = textLoader;

### Tab panel custom widget

    <ul class="nav nav-tabs" data-bind="foreach: $page.children">
        <li data-bind="css: {active: isVisible}"><a data-bind="text: $data.getValue().title, page-href: getId()"></a></li>
    </ul>

    <div data-bind="page: {id: 'Slagsmålsklubben', title: 'Slagsmålsklubben',
      sourceOnShow: 'https://embed.spotify.com/?uri=spotify:album:66KBDVJnA6c0DjHeSZYaHb', frame: 'iframe'}" class="hero-unit">
        <iframe width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    </div>

    <div data-bind="page: {id: 'Binärpilot', title: 'Binärpilot',
      sourceOnShow: 'https://embed.spotify.com/?uri=spotify:album:67LKycg4jAoC06kZgjvbNd', frame: 'iframe'}" class="hero-unit">
        <iframe width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    </div>


### React to a failed navigation

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


### Load view content using a custom method

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


### Send URI (fragment identifier) parameters to a page

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

### Add guards

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

### Add observables without connection to the view model

Sometimes you need observables purely for the visual and they got no connection to the view-model.

Using the `vars` property new observables can be added to the page context.

    <div data-bind="page: {id: 'user', vars: {lorem: 'ipsum'}}">
      <input type="text" data-bind="value: lorem"/>
      <div data-bind="text: lorem"/>
    </div>

### Deep loading content into wildcards

Using a combination of wildcard pages and sourceOnShow it is possible to deep load content.

    <div data-bind="page: {id: '?', deep: true, sourceOnShow: '{1}.html'}></div>

    <a href="#!/some/cool/page">Load some cool page</a>

In the above example `some/cool/page` will match the wildcard (`?`) and since `deep: true` is specified
the entire route (`some/cool/page`) will be used when loading content into the page. If `deep` hadn't been
specified the source should have been `some.html` instead of `some/cool/page.html`.

### Specify a start page

There are two main alternatives to specify a start page, depending on the desired result.

Either you can pass an ID (e.g. `foo/bar`) to your start-method or you can call `pager.showChild` with a route (
array of strings).

    // send user to login-page and updating the location
    pager.start('login');

    // send user to login-page without updating the location
    paget.start();
    pager.showChild(['login']);


## FAQ

### Can I use it together with...

pager.js is not depending on anything but jQuery and KnockoutJS. You can use it together with
any CSS framework.

### Can I use true URLs instead?

Yes. Use `pager.min.history.js` if you want to use it together with History.js.

## Release Notes

### 0.2

- [Should be possible to circumvent the routing](https://github.com/finnsson/pagerjs/issues/17)
- [Should be possible to route to custom widgets (accordions)](https://github.com/finnsson/pagerjs/issues/16)
- [Should be possible to load content into iframes](https://github.com/finnsson/pagerjs/issues/15)
- [Should send wildcards to source](https://github.com/finnsson/pagerjs/issues/14)
- [Should do deep navigation with wildcards](https://github.com/finnsson/pagerjs/issues/13)
- [Should match wildcard IDs if no other ID can match exactly](https://github.com/finnsson/pagerjs/issues/12)
- [withOnShow should lazy bind a new view model to the page](https://github.com/finnsson/pagerjs/issues/11)
- [Should change binding context using with](https://github.com/finnsson/pagerjs/issues/10)
- [Should specify relative page paths using page-href](https://github.com/finnsson/pagerjs/issues/9)
- [Should cache lazy loaded content the number of seconds specified by sourceCache](https://github.com/finnsson/pagerjs/issues/8)
- [Should cache lazy loaded content when sourceCache: true](https://github.com/finnsson/pagerjs/issues/7)
- [Should lazy load an external content into a page if sourceOnShow is declared](https://github.com/finnsson/pagerjs/issues/6)
- [Should load external content into a page using source and trigger sourceLoaded event](https://github.com/finnsson/pagerjs/issues/5)
- [Should be possible to do deep navigation](https://github.com/finnsson/pagerjs/issues/4)
- [Should navigate to page using scoped IDs.](https://github.com/finnsson/pagerjs/issues/3)
- [Should display page with id start by default](https://github.com/finnsson/pagerjs/issues/2)

### 0.4

- [Should be possible to add guards](https://github.com/finnsson/pagerjs/issues/26)
- [Should be possible to send URI (fragment identifier) parameters to a page](https://github.com/finnsson/pagerjs/issues/25)
- [Should be possible to load view content using a custom method](https://github.com/finnsson/pagerjs/issues/24)
- [Should be possible to navigate into modals](https://github.com/finnsson/pagerjs/issues/23)
- [Should be possible to specify loaders on pages](https://github.com/finnsson/pagerjs/issues/22)
- [Should be possible to change the page title](https://github.com/finnsson/pagerjs/issues/21)
- [Should be possible to run custom JS on "navigate failed"](https://github.com/finnsson/pagerjs/issues/20)
- [Tab panel custom widget](https://github.com/finnsson/pagerjs/issues/19)
- [Should be possible to run custom JS on "navigate to"](https://github.com/finnsson/pagerjs/issues/18)

### 0.6

- [Should contain common effects](https://github.com/finnsson/pagerjs/issues/28)
- [HTML5 History Boilerplate](https://github.com/finnsson/pagerjs/issues/34)
- [page-hash and page-href5 bindings for hash or html5 history](https://github.com/finnsson/pagerjs/issues/29)
- [Access to Page in withOnShow handler](https://github.com/finnsson/pagerjs/issues/27)
- [Add BeforeNavigate Event handler to allow user to stop transition](https://github.com/finnsson/pagerjs/issues/1)
- [page-href should be possible to feed with a page-instance](https://github.com/finnsson/pagerjs/issues/39)
- [Should be possible to use hash bang #!/ instead of hash](https://github.com/finnsson/pagerjs/issues/38)
- [Scoped pure view observables using vars](https://github.com/finnsson/pagerjs/issues/32)
- [Wildcards should deep-load content if configured so](https://github.com/finnsson/pagerjs/issues/31)
- [Should be able to change initial page](https://github.com/finnsson/pagerjs/issues/44)
- [Demo as is does not work in IE7](https://github.com/finnsson/pagerjs/issues/43)

### 0.7 (Current Development Revision)

- [Remove underscorejs dependency](https://github.com/finnsson/pagerjs/issues/49)
- [pager.start id does not honor pager.Href.hash](https://github.com/finnsson/pagerjs/issues/51)


## Roadmap

Currently working on development version 0.7, towards stable version 0.8.

See [Milestones](https://github.com/finnsson/pagerjs/issues/milestones).

## How to Contribute

Fork this repo. Install all dependencies (node.js, grunt, phnatomjs). Run all tests
(`grunt qunit`). Run jslint (`grunt lint`). Make your changes. Run all tests and the linter again. Send a pull request.

## License

pager.js is under MIT license.

Copyright (c) 2012 Oscar Finnsson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.