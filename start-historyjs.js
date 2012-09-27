// use page-href5 when specifying page-href
pager.useHTML5history = true;
// use History.js instead of normal history
pager.Href5.history = History;

pager.start = function () {

    var hashChange = function (hash) {
        // strip #
        if (hash[0] === '#') {
            hash = hash.slice(1);
        }
        // split on '/'
        var hashRoute = decodeURIComponent(hash).split('/');
        pager.showChild(hashRoute);
    };

    // Bind to StateChange Event
    History.Adapter.bind(window, 'statechange', function () {
        var baseUrl = $('base').attr('href');
        var relativeUrl = History.getState().url.replace(baseUrl, '');
        hashChange(relativeUrl);
    });
    History.Adapter.bind(window, 'anchorchange', function () {
        hashChange(location.hash);
    });

    hashChange(History.getState().url.replace(History.getRootUrl(), ''));

};