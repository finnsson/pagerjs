/**
 *
 * @param {String} hash
 */
pager.routeFromHashToPage = function (hash) {
    // skip # (or #!/)
    if (hash[0] === pager.Href.hash) {
        hash = hash.slice(pager.Href.hash.length);
    }
    // split on '/'
    var hashRoute = decodeURIComponent(hash).split('/');
    pager.showChild(hashRoute);
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
pager.start = function () {

    var onHashChange = function () {
        pager.routeFromHashToPage(window.location.hash);
    };
    $(window).bind('hashchange', onHashChange);
    onHashChange();
};