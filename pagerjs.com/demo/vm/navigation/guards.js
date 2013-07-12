define(['knockout'], function (ko) {
    var vm = {
        loggedIn: ko.observable(false),
        isLoggedIn: function (page, route, callback) {
            if (vm.loggedIn()) {
                callback();
            } else {
                window.location.href = "#!/navigation/guards/login";
            }
        },
        logout: function () {
            vm.loggedIn(false);
            return true;
        }
    };

    return {
        getVM: function () {
            return vm;
        }
    };
});