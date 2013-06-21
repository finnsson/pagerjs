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
    var Observable = function(val) {

    };


    /**
     *
     * @param {Function} fn
     */
    Observable.prototype.subscribe = function(fn) {

    };

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

    ko.utils = {
        /**
         *
         * @param {Observable} val
         * @return {Object}
         */
        unwrapObservable: function(val) {
            //
            return {};
        }
    };

    /**
     *
     * @param {Object} obj1
     * @param {Object} obj2
     */
    ko.applyBindingsToNode = function(obj1, obj2) {

    };

    /**
     *
     * @param first
     * @param second
     */
    ko.utils.extend = function (first, second) {
    };
}());