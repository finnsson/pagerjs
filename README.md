# pager.js

pager.js provides the possibility of creating single page applications in a declarative fashion.

This makes it easier to design large scale single page web sites.

## Helpers

* `pager.route`
* `pager.start`
* `pager.extendWithPage`

### Example

    pager.extendWithPage(viewModel);
    ko.applyBindings(viewModel);
    pager.start(viewModel);


## Custom Bindings

pager.js extends KnockoutJS with two custom bindings: `page` and `page-href`.

### page

    <div data-bind="page: {}">
    </div>

Configurations:

* `{String} id` of scoped page that a router should react to. E.g. `start` or `user/me`.
  If the id is `?` (wildcard) it will match anything if no other page in the same parent match.
* `{Object} with` that can change the scope of elements descendants.
* `{String} source` to load into element using jQuery.load
* `{Function} sourceLoaded` is a method to run once the `source` (or `sourceOnShow`) is loaded.
* `{String} sourceOnShow` to load into element using jQuery.load when the element is displayed
* `{Boolean/Number} sourceCache` can be set to true in order for sourceOnShow to only load the source once.
  If a number is specified the cache is valid for that amount of time in seconds.
* `{String}` frame can be set to `iframe` in order for the source to be loaded into an iframe. If the page contains
  an iframe that element is used.

### page-href

    <a data-bind="page-href: 'somePagePath'"></a>

Calculates absolute href based on the location of the element.

## Dependencies

- [jQuery](http://jquery.com/)
- [KnockoutJS](http://knockoutjs.com/)
- [Underscore.js](http://underscorejs.org/)

For development you'll need

- [Node.js](http://nodejs.org/)
- [Grunt](https://github.com/cowboy/grunt)
- [QUnit](http://qunitjs.com/)
- [PhantomJS](http://phantomjs.org/)

## Behaviors

The following behaviors specify and exemplify what `pager.js` is capable of.

### Should display page with id start by default

    <div>
      <div data-bind="page: {id: 'bar'}">Bar</div>
      <!-- Foo is displayed -->
      <div data-bind="page: {id: 'start'}">Foo</div>
    </div>

### Should navigate to page using scoped IDs.

    <div data-bind="page: {id:'start'}"><a href="#foo">Go to foo</a></div>
    <div data-bind="page: {id: 'foo'}">Foo. Go to <a href="#start">start</a></div>

### Should be possible to do deep navigation

    <div id="start" data-bind="page: {id: 'start'}">
        <a href="#user/pelle">Go to Pelle</a>
    </div>

    <div id="user" data-bind="page: {id: 'user'}">
        <div id="pelle" data-bind="page: {id: 'pelle'}">Pelle</div>
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
      <!-- This will update href to #start/arne -->
      <a data-bind="page-href: 'arne'">Arne</a>

      <!-- This will update href to #admin/login -->
      <a data-bind="page-href: '../admin/login'">Admin Login</a>

      <div data-bind="page: {id: 'arne'}">Arne!</div>
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

### Should match wildcard IDs if no other ID can match exactly

    <div data-bind="page: {id: 'admin'}"></div>
    <!-- The page below match anything except 'admin' -->
    <div data-bind="page: {id: '?'}"></div>

### Should do deep navigation with wildcards

    <div data-bind="page: {id: 'start'}">
          <a href="#user/pelle">Go to Pelle</a>
    </div>

    <div data-bind="page: {id: '?'}">
        Misc:
        <div data-bind="page: {id: 'pelle'}">
            Pelle
        </div>
    </div>

### Should send wildcards to source

    <div data-bind="page: {id: 'start'}">
        <a href="#user/pelle">Go to Pelle</a>
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
    <div data-bind="page: {id: 'pelle', frame: 'iframe', source: 'pelle.html'}">
        <iframe sandbox=""></iframe>
    </div>

## In the pipeline

* Extract local functions to methods on `pager.Page`-prototype so they can be overwritten by sub classes.
* Write an extensive example.html and push it to gh-pages branch.

## Backlog

There are a lot of features waiting to be implemented. Here are some of them.

### `withOnShow` should bind a new view model to the page

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

### Should be possible to route to custom widgets (dialogs, carousels, accordions)

    <!-- since some.js.code is executed once the pager is navigating to the dialog
    it is possible for custom JS to inject custom behavior -->
    <div data-role="page" id="dialog" data-page-to-js="some.js.code">
      Here goes custom HTML.
    </div>

### Should be possible to specify page transitions between sub pages

    <div data-bind="page: {id: 'user', transition: 'fade'}">
      <div data-bind="page: {id: 'pelle'}">Pelle</div>
      <div data-bind="page: {id: 'arne'}">Arne</div>
    </div>

### Should be possible to specify loaders text on pages

    <div data-role="page" data-page-id="user" data-page-loader-text="Loading Page">
      User
    </div>

### Should be possible to run custom JS on "navigate to"

    <div data-role="page" data-page-to-js="someJS()" data-page-source="pelle.html" />

### Should be possible to run custom JS on "navigate from"

    <div data-role="page" data-page-from-js="someJS()" data-page-source="pelle.html" />

### Should be possible to run custom JS on "navigate failed"

    <div data-role="page" data-page-failed-js="someJS()" data-page-source="pelle.html" />

### Should be possible to change the page title

    <div data-role="page" data-page-title="Pelle" data-page-source="pelle.html" />

### Should be possible to circumvent the routing

Since pager is not responsible for listening on the location it is possible to
circumvent the routing using the router used.

### Should be possible to navigate into a layer without loosing context

    <div data-role="page" id="foo">
      <a href="#!/foo/ok">OK</a>
    </div>

    <!-- This page route matches against anything ending with /ok -->
    <!-- data-page-layout means the page is modal on top of the last page (*) -->
    <div data-role="page" data-page-id="*/ok" data-page-layout="modal">
      OK
    </div>

### Should be possible to navigate into a layer and loose context

    <div data-role="page" id="foo">
      <a href="#!/ok">OK</a>
    </div>

    <!-- data-page-layout means the page is modal on top of the parent page -->
    <div data-role="page" data-page-id="ok" data-page-layout="modal">
      OK
    </div>


## List of Configurations to Implement

17 custom attributes in total.

- source="{URL}/({SELECTOR})?"
  URL to fetch into page.
  Optionally with a selector (e.g. foo/#content).
  The URL and/or SELECTOR can be a route.
- title="{TITLE}"
  Updates the title in the browser to TITLE.
- frame="(div|iframe)"
  div by default. If iframe an iframe will be created inside the element that contains the external content.
  Can be useful for sandboxing. If an iframe is specified inside the element that
  iframe (will all its attributes) will be used.
- transition="{TEXT}"
  The transition to use when navigating.
  The attribute can be put either on the a-tag or the page-element.
  The transition must be registered in the pager-object.
- loader-text="{TEXT}"
  Loader text used when loading the page.
  The attribute can be put either on the a-tag or the page-element.
- to-js="javascript"
  JS to run when navigating to the page.
  Return false to stop the navigation.
- from-js="javascript"
  JS to run when navigating from the page.
  Return false to stop the navigation.
- failed-js="javascript"
  JS to run when navigating to the page failed.
- layout="block|modal"
  block by default. If modal then the page will be modal on top of the parent.