var until = function (testFn, thenFn) {
    var d = $.Deferred();
    var count = 0;
    var intervalID = setInterval(function () {
        if (testFn()) {
            clearInterval(intervalID);
            d.resolve();
            if (thenFn) {
                thenFn(true);
            }
        } else {
            count++;
            if (count === 20) {
                clearInterval(intervalID);
                d.reject();
                if (thenFn) {
                    thenFn(false);
                }
                throw new Error("timeout in until");
            }
        }
    }, 50);

    return d.promise();
};