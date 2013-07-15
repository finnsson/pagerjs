define(['knockout'], function (ko) {
    var vm = {
        bindToVM: ko.observable(),
        getText: function (p) {
            return $(p().element).html();
        }
    };

    return {
        getVM: function () {
            return vm;
        }
    };
});