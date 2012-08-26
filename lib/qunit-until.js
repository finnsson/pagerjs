var until = function(testFn, thenFn) {
    var intervalID = setInterval(function() {
        if(testFn()) {
            clearInterval(intervalID);
            thenFn();
        }
    }, 200);
};