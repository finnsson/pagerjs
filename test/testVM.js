define(['knockout'], function (ko) {
    return {
        getVM:function () {
            return {name:ko.observable("Karl V")};
        }
    };
});