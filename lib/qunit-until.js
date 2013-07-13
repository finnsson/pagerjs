var until = function(testFn, thenFn) {
    var count = 0;
    var intervalID = setInterval(function() {
        if(testFn()) {
            clearInterval(intervalID);
            thenFn(true);
        } else {
            count++;
            if(count === 20) {
                clearInterval(intervalID);
                thenFn(false);
                throw new Error("timeout in until");
            }
        }
    }, 50);
};