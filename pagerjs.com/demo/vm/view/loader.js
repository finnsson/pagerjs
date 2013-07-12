define(['knockout'], function (kn) {
    var vm = {
        spinnerLoader: function (page, element) {
            var loader = {};
            var txt = $('<img src="ajax-loader.gif"/>');
            loader.load = function () {
                $(element).empty();
                $(element).append(txt);
            };
            loader.unload = function () {
                txt.remove();
            };
            return loader;
        },
        eternalSource: function () {
            // do nothing :)
        }
    };

    return {
        getVM: function () {
            return vm;
        }
    };
});