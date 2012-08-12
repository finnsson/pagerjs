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
- [RequireJS](http://requirejs.org/)

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


### Should be possible to route to custom widgets (dialogs, carousels, accordions)

It is possible to create custom widgets that jack into the pager-system.
The `page`-binding (`pager.Page`-class) is possible to extend at multiple points.

One custom widget (`page-accordion-item`) is already implemented.

    <div data-bind="page-accordion-item: {id: 'dog'}">
        <a href="#animals/dog">Dog</a>

        <div>Dog Information</div>
    </div>
    <div data-bind="page-accordion-item: {id: 'cat'}">
        <a href="#animals/cat">Cat</a>

        <div>Cat Information</div>
    </div>

### Should be possible to circumvent the routing

Since pager is not responsible for listening on the location it is possible to
circumvent the routing using the router used. Just do not use `pager.start`.

## In the pipeline

* Write an extensive example and push it to gh-pages branch.

## Backlog

There are a lot of features waiting to be implemented. Here are some of them.

### Should be possible to specify page transitions between sub pages

### Should be possible to specify loaders text on pages

### Should be possible to run custom JS on "navigate to"

### Should be possible to run custom JS on "navigate from"

### Should be possible to run custom JS on "navigate failed"

### Should be possible to change the page title

### Should be possible to navigate into a layer without loosing context

### Should be possible to navigate into a layer and loose context
