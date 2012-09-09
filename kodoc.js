(function () {
    "use strict";

    /**
     * @class ko
     *
     */
    var ko = {};
    window.ko = ko;

    /**
     * @class ObservableArray
     */
    var ObservableArray = null;

    /**
     * @class Observable
     */
    var Observable = null;


    /**
     * @method observable
     * @param {Object} [x]
     * @return {Observable}
     */
    ko.observable = function (x) {
        return x;
    };

    /**
     * @method observableArray
     * @param {Array} [array] to initialize the observable array with
     * @return {ObservableArray}
     */
    ko.observableArray = function (array) {
        return new ObservableArray(array);
    };

    /**
     *
     * @param {Function} callback
     * @param [scope]
     * @return {Observable}
     */
    ko.computed = function (callback, scope) {
        return new Observable();
    };

    /**
     * @param context
     * @param element
     */
    ko.applyBindingsToDescendants = function (context, element) {
    };

    ko.utils = {};

    /**
     *
     * @param first
     * @param second
     */
    ko.utils.extend = function (first, second) {
    };
}());