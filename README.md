# [pager.js](http://oscar.finnsson.nu/pagerjs/)

[![Build Status](https://travis-ci.org/finnsson/pagerjs.png)](https://travis-ci.org/finnsson/pagerjs)

![Logo](logo-512.png)

    one having or covering a specified number or kind of pages
      - Merriam-Webster

See the [demo](http://pagerjs.com/demo/).

pager.js is a JavaScript library based on KnockoutJS and jQuery that provides the possibility of
creating single page applications in a declarative fashion - nesting subpages inside subpages where each subpage can be
developed standalone but still communicate between each other.

This makes it easier to design very large scale single page web sites.

This readme is for version 1.0.

## Getting Started

See the [demo](http://pagerjs.com/demo/).

## Install

Download



Using npm

    npm install pagerjs

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

### 0.7

- [Remove underscorejs dependency](https://github.com/finnsson/pagerjs/issues/49)
- [pager.start id does not honor pager.Href.hash](https://github.com/finnsson/pagerjs/issues/51)
- [Sending wildcards to the viewmodel](https://github.com/finnsson/pagerjs/issues/52)
- [Should handle pages that does not react to URL changes](https://github.com/finnsson/pagerjs/issues/61)
- [Should handle pages that does not hide on URL changes](https://github.com/finnsson/pagerjs/issues/62)
- [Should handle exceptions in with/withOnShow](https://github.com/finnsson/pagerjs/issues/46)
- [Should handle exceptions on source/sourceOnShow](https://github.com/finnsson/pagerjs/issues/47)

### 1.0.0

- A lot of cleanup and some breaking changes!

### 1.0.1

-[Work with Knockout 2.3](https://github.com/finnsson/pagerjs/issues/127)
-[hash urls](https://github.com/finnsson/pagerjs/issues/123)
-[withOnShow is not updating route after source is loaded](https://github.com/finnsson/pagerjs/issues/121)
-[Show/Hide Events event don't occur](https://github.com/finnsson/pagerjs/issues/131)

## Roadmap

See [Milestones](https://github.com/finnsson/pagerjs/issues/milestones).

## How to Contribute

Fork this repo. Install all dependencies (node.js, grunt, phnatomjs). Run all tests
(`grunt qunit`). Run jslint (`grunt lint`). Make your changes. Run all tests and the linter again. Send a pull request.

### Contributors

[finnsson](https://github.com/finnsson)

[GilesBradshaw](https://github.com/GilesBradshaw)

[tedsteen](https://github.com/tedsteen)

[Shildrak](https://github.com/Shildrak)

[adimkov](https://github.com/adimkov)

[imrefazekas](https://github.com/imrefazekas)

## License

pager.js is under MIT license.

Copyright (c) 2013 Oscar Finnsson

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