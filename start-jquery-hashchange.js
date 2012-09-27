pager.start = function () {
    $(window).hashchange(function () {
        var hash = location.hash;
        // strip #
        if (hash[0] === '#') {
            hash = hash.slice(1);
        }
        // split on '/'
        var hashRoute = decodeURIComponent(hash).split('/');
        pager.showChild(hashRoute);
    });
    $(window).hashchange();

};