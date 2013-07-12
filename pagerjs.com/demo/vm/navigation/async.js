define(['knockout'], function (ko) {

    var vm = {
        test: "Pelle",
        // wait 2 secs before returning ok
        wait2: function () {
            var d = $.Deferred();
            setTimeout(function () {
                d.resolve();
            }, 2000);
            return d;
        },
        wait2Fail: function () {
            var d = $.Deferred();
            setTimeout(function () {
                d.reject();
            }, 2000);
            return d;
        },
        okIsLoading: ko.observable(),
        notOkIsLoading: ko.observable()
    };

    return {
        getVM: function () {
            return vm;
        }
    };
});