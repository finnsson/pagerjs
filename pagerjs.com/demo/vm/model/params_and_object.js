define(['knockout'], function (ko) {
    var vm = {
        question: ko.observable('How many roads must a man walk down before you can call him a man?')
    };

    return {
        getVM: function () {
            return vm;
        }
    };
});