define('product', ['jquery', 'knockout'], function ($, ko) {
    var products = ko.observableArray([]);

    $.ajax({
        url: 'data/product.json',
        type: 'get',
        dataType: 'json',
        success: function (data) {
            products.push.apply(products, data.products);
        }
    });


    return {
        products: products
    };
});