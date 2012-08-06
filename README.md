# pager.js

pager.js provides the possibility of creating single page applications in a declarative fashion.

This makes it easier to design large scale single page web sites.

## Misc Notes

Use bindingContext + control descendant bindings (with a $page custom variable).

Check out `ko.applyBindingsToNode`.

## Helpers

* pager.route
  Used like

    $(window).bind('hashchange', function() {
      viewModel.$page(pager.route(window.location.hash));
    });

  and will hide and show pages according to their routes/IDs.

## Custom Bindings

pager.js extends KnockoutJS with one custom binding: `page`.

### page

    <div data-bind="page: {}">
    </div>

Configurations:
* {Function} init code to run once the page is processed
* {String} sourceUrl to fetch into page. Optionally with a selector (e.g. foo/#content).
* {String} id of scoped page that a router should react to.

## List of Custom Data Attributes

All micro-format is based on data-role="page", data-page-*="*" or data-page-*-js="*"

17 custom attributes in total.

- data-role="page"
- data-page-js="javascript"
  JS to run once the page is located and processed by pager.js
- data-page-source="{URL}/({SELECTOR})?"
  URL to fetch into page.
  Optionally with a selector (e.g. foo/#content).
  The URL and/or SELECTOR can be a route.
- data-page-id="{ID}"
  If ID=="start" then the page is displayed by default. Otherwise the first page is displayed
  The ID can be a route.
- data-page-href="{PATH}"
  relative path to a page.
  Valid syntax is:
    (../)* (\w )(/\w)* e.g. foo, foo/bar, ../foo/bar, ../../foo/bar
    **/ (\w )(/\w)* e.g. **/foo, **/foo/bar    
- data-page-target="{ID}"
  If ID=="_" then the target is the current page. 
  the data-page with the matching id or data-page-id is the target of the URL.
- data-page-title="{TITLE}"
  Updates the title in the browser to TITLE.
- data-page-role="(external|internal)"
  internal by default. external means the id or data-page-id corresponds to a relative URL.
- data-page-frame="(div|iframe)"
  div by default. If iframe an iframe will be created inside the element that contains the external content.
  Can be useful for sandboxing. If an iframe is specified inside the element that
  iframe (will all its attributes) will be used.
- data-page-*-js="javascript"
  Specifies JS to run instead of the corresponding attribute.
  E.g. data-page-title-js="someTitleMethod" specifies a function that will run
  that can set the title.
- data-page-transition="{TEXT}"
  The transition to use when navigating.
  The attribute can be put either on the a-tag or the page-element.
  The transition must be registered in the pager-object.
- data-page-loader-text="{TEXT}"
  Loader text used when loading the page.
  The attribute can be put either on the a-tag or the page-element.
- data-page-to-js="javascript"
  JS to run when navigating to the page.
  Return false to stop the navigation.
- data-page-from-js="javascript"
  JS to run when navigating from the page.
  Return false to stop the navigation.
- data-page-failed-js="javascript"
  JS to run when navigating to the page failed.
- data-page-prefetch="false|true"
  If true then the page will be prefetched.
- data-page-cache="false|true|{SECONDS}"
  If true then the page will be cached. If SECONDS is specified then the
  page will be cached for the specified amount of seconds.
- data-page-layout="block|modal"
  block by default. If modal then the page will be modal on top of the parent.

## Dependencies

- jQuery
- Knockoutjs
- Underscore

## General features

All values can be data bound using Knockoutjs.

## Questions and Answers

Q: How should custom JS be possible to inject in a regular fashion?
A: By appending "-js" after the attribute.
    E.g. data-page-cache="true" -> data-page-cache-js="someJsFunction()"

Q: How should extensions be possible?
A: JS-events.

Q: How should MVC/MVVM-triads be put together? How can the application be
   split into multiple MVVM-triads?
A: Sub-pages can be initialized with a viewmodel instance on demand.

## Architecture of an application using pager.js

- Build multiple small web applications as stand alone web pages.
- Keep reusable JS in separate files and JS specific to the web page in a separate file.
- Create a master page where sub pages are specified.

## Behaviors

29 behaviors are specified.

### Should display first page by default

    <div data-role="page"><a href="#!/foo">Go to foo</a></div>
    <div data-role="page" id="foo">Foo</div>

### Should display page with id="start" or data-page-id="start" by default

    <div>
      <div data-role="page">Bar</div>
      <!-- it is OK to have the page nested inside one or many layers div-elements -->
      <div data-role="page" data-page-id="start">Foo</div>
    </div>

### Should navigate to page using scoped IDs.

    <div data-role="page">
      <a href="#!/foo">Go to foo</a>
    </div>

    <!-- Here "foo" must be unique to the parent container -->
    <div data-role="page" data-role-page-id="foo">
      Foo
    </div>

### Should navigate using both a-tags and form-tags

    <div data-role="page">
      <a href="#!/foo">Go to foo</a>

      <form action="#!/foo"><input type="submit">Go to foo</input></form>

    </div>

    <div data-role="page" data-role-page-id="foo">
      Foo
    </div>


### Should find relative IDs using data-page-href

    <div data-role="page">
      <a href="#!/foo">Go to foo</a>
    </div>

    <div data-role="page" data-page-id="A">A1</div>
    <div data-role="page" data-page-id="B">B1</div>
    <div data-role="page" data-page-id="C">C1</div>

    <!-- Here "foo" must be unique to the parent container -->
    <div data-role="page" data-role-page-id="foo">
      Foo

      <!-- Go to A2 since relative to foo -->
      <a data-page-href="A"/>Go to A2</a>

      <!-- Go to B1 since relative to foo -->
      <a data-page-href="../B"/>Go to B1</a>

      <!-- Go to first C in foos parents -->
      <a data-page-href="**/C"/>Go to C</a>

      <div data-role="page" data-page-id="A">A2</div>
      <div data-role="page" data-page-id="B">B2</div>

    </div>


### Should be possible to navigate to external page into current page

    <div data-role="page">
      Start
      <a data-page-target="_" href="foo.html">Go to foo</a>
    </div>

### Should be possible to navigate to fragment of external page.

    <div data-role="page">
      Start
      <!-- Here only the content inside the selector "#content" is used -->
      <a data-page-target="_" data-page-source="#content" href="foo.html">Go to foo</a>
    </div>

### Should be possible to specify rendering location of external page

    <div data-role="page">
      <a data-page-target="foo" href="foo.html">Show foo.html inside foo-page</a>
      <a data-page-target="foo" href="bar.html">Show bar.html inside bar-page</a>
    </div>

    <div data-role="page" data-page-id="foo" />

### Should be possible specify external page as content

    <div data-role="page">
      <a href="#!/foo">Go to foo</a>
    </div>

    <!-- Will automatically load /foo when requested -->
    <div data-role="page" data-page-role="external" data-page-id="foo"/>

### Should be possible to specify external page separate from ID as content

    <div data-role="page">
      <!-- You can specify the href as "foo" or "#!/foo" if the router used is listening for both -->
      <a href="foo">Go to foo</a>
    </div>

    <!-- Will automatically load /bar.html when requested -->
    <div data-role="page" data-page-id="foo" data-page-source="bar.html"/>

### Should be possible to specify fragment of external page as content

    <div data-role="page">
      <a href="foo">Go to foo</a>
      <a href="bar">Go to bar</a>
    </div>

    <!-- Will automatically load /bar.html#content when requested -->
    <div data-role="page" data-role-page="external" data-role-id="foo" data-role-source="bar.html/#content"/>
    <!-- Will automatically load /bar#content when requested -->
    <div data-role="page" data-role-page="external" data-role-id="bar" data-role-source="/#content"/>

### Should be possible to specify page routes in page-id and page-source

    <div data-role="page">
      <a href="user/pelle">To go Pelle</a>
      <a href="user/arne">To go Arne</a>
    </div>

    <!-- the :name-value is extracted in data-page-id and sent to data-page-source -->
    <div data-role="page" data-page-id="user/:name" data-page-source="user/:name" />

### Should be possible to do deep navigation

    <div data-role="page">
      <a href="user/pelle">Go to Pelle</a>
    </div>

    <div data-role="page" data-page-id="user">
      <div data-role="page" data-page-id="pelle">Pelle</div>
    </div>

### Should be possible to do deep navigation with page routes

    <div data-role="page">
      <a href="user/pelle">Go to Pelle</a>
    </div>

    <div data-role="page" data-page-id="user">
      User:
      <div data-role="page" data-page-id=":name" data-page-source="user/:name" />
    </div>

## Should be possible to specify page transitions on links

    <div data-role="page">
      <a href="#!/user" data-page-transition="flip">Flipping transition</a>
    </div>

    <div data-role="page" data-page-id="user">
      User
    </div>

## Should be possible to specify page transitions on pages

    <div data-role="page">
      <a href="#!/user">Flipping transition</a>
    </div>

    <div data-role="page" data-page-transition="flip" data-page-id="user">
      User
    </div>

## Should be possible to specify inheritable page transitions on pages

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

## Should be possible to load content into iframes

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