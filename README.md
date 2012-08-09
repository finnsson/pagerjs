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
* `{Object} with` that can change the scope of elements descendants.
* `{String} source` to load into element using jQuery.load
* `{String} sourceOnShow` to load into element using jQuery.load when the element is displayed
* `{Boolean/Number} sourceCache` can be set to true in order for sourceOnShow to only load the source once.
  If a number is specified the cache is valid for that amount of time in seconds.

### page-href

    <a data-bind="page-href: 'somePagePath'"></a>

Calculates absolute href based on the location of the element.

## Dependencies

- jQuery
- Knockoutjs
- Underscore

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

    <div data-role="page">
      <a href="user/pelle">Go to Pelle</a>
    </div>

    <div data-role="page" data-page-id="user">
      <div data-role="page" data-page-id="pelle">Pelle</div>
    </div>

### Should load external content into a page using `source`

    <div data-bind="page: {id: 'lorem', source: 'lorem.html .content'}"></div>

The source can contain a selector (see `.content` above) in order to extract a fragment on the site.

### Should lazy load a external content into a page if `sourceOnShow` is declared

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
      <div data-bind="page: {id: 'login'}"></div>
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

## In the pipeline



## Backlog

There are a lot of features waiting to be implemented. Here are some of them.


### Should be possible to specify page routes in page-id and page-source

    <div data-role="page">
      <a href="user/pelle">To go Pelle</a>
      <a href="user/arne">To go Arne</a>
    </div>

    <!-- the :name-value is extracted in data-page-id and sent to data-page-source -->
    <div data-role="page" data-page-id="user/:name" data-page-source="user/:name" />


### Should be possible to do deep navigation with page routes

    <div data-role="page">
      <a href="user/pelle">Go to Pelle</a>
    </div>

    <div data-role="page" data-page-id="user">
      User:
      <div data-role="page" data-page-id=":name" data-page-source="user/:name" />
    </div>

### Should be possible to specify page transitions on links

    <div data-role="page">
      <a href="#!/user" data-page-transition="flip">Flipping transition</a>
    </div>

    <div data-role="page" data-page-id="user">
      User
    </div>

### Should be possible to specify page transitions on pages

    <div data-role="page">
      <a href="#!/user">Flipping transition</a>
    </div>

    <div data-role="page" data-page-transition="flip" data-page-id="user">
      User
    </div>

### Should be possible to specify inheritable page transitions on pages

    <div data-page-transition="flip">

      <div data-role="page">
        <a href="#!/user">Flipping transition</a>
      </div>

      <div data-role="page" data-page-id="user">
        User
      </div>

    </div>

### Should be possible to specify loaders text on pages

    <div data-role="page" data-page-id="user" data-page-loader-text="Loading Page">
      User
    </div>

### Should be possible to load content into iframes

    <!-- An iframe will be created inside the div -->
    <div data-role="page" data-page-frame="iframe" data-page-source="pelle.html" />

    <!-- The iframe specified will be used -->
    <div data-role="page" data-page-frame="iframe" data-page-source="pelle.html">
      <iframe sandbox=""/>
    </div>

### Should be possible to run custom JS on "navigate to"

    <div data-role="page" data-page-to-js="someJS()" data-page-source="pelle.html" />

### Should be possible to run custom JS on "navigate from"

    <div data-role="page" data-page-from-js="someJS()" data-page-source="pelle.html" />

### Should be possible to run custom JS on "navigate failed"

    <div data-role="page" data-page-failed-js="someJS()" data-page-source="pelle.html" />

### Should be possible to change the page title

    <div data-role="page" data-page-title="Pelle" data-page-source="pelle.html" />

### Should be possible to route to custom widgets (dialogs, carousels, accordions)

    <!-- since some.js.code is executed once the pager is navigating to the dialog
    it is possible for custom JS to inject custom behavior -->
    <div data-role="page" id="dialog" data-page-to-js="some.js.code">
      Here goes custom HTML.
    </div>

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

### Should prefetch pages if data-page-prefetch is true

    <!-- The content of the page will be prefetched and cached -->
    <div data-role="page" data-page-prefetch="true" id="foo" data-page-source="foo" />

### Should cache pages between navigations/paging if data-page-cache is true

    <div data-role="page" data-page-cache="true" id="foo" data-page-source="/foo" />

### Should cache pages the amount of seconds specified by data-page-cache

    <!-- The following page will only refresh every 60 seconds -->
    <div data-role="page" data-page-cache="60" id="foo" />

## List of Configurations to Implement

17 custom attributes in total.

- source="{URL}/({SELECTOR})?"
  URL to fetch into page.
  Optionally with a selector (e.g. foo/#content).
  The URL and/or SELECTOR can be a route.
- target="{ID}"
  If ID=="_" then the target is the current page.
  the data-page with the matching id or id is the target of the URL.
- title="{TITLE}"
  Updates the title in the browser to TITLE.
- role="(external|internal)"
  internal by default. external means the id or id corresponds to a relative URL.
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
- withOnShow=Function/Observable
  Function to run to get a viewModel once the page is displayed.