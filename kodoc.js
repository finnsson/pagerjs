/**
 * @class ko
 *
 */
var ko = {};

/**
 * @method observable
 */
ko.observable = function() {};

/**
 * @method observableArray
 * @param {Array} array to initialize the observable array with
 * @return {ObservableArray}
 */
ko.observableArray = function(array) { return new ObservableArray();};


/**
 * @class ObservableArray
 */
var ObservableArray = null;