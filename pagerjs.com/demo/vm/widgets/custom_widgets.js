define(['knockout', 'pager'], function (ko, pager) {


    var PageAccordionItem = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        pager.Page.apply(this, arguments);
    };
    PageAccordionItem.prototype = new pager.Page();

    // get second child
    PageAccordionItem.prototype.getAccordionBody = function () {
        return $(this.element).children()[1];
    };

    // hide second child
    PageAccordionItem.prototype.hideElement = function (callback) {
        // use hide if it is the first time the page is hidden
        if (!this.pageAccordionItemHidden) {
            this.pageAccordionItemHidden = true;
            $(this.getAccordionBody()).hide();
            if (callback) {
                callback();
            }
        } else { // else use a slideUp animation
            $(this.getAccordionBody()).slideUp();
            if (callback) {
                callback();
            }
        }
    };

    // show the second child using a slideDown animation
    PageAccordionItem.prototype.showElement = function (callback) {
        $(this.getAccordionBody()).slideDown();
        if (callback) {
            callback();
        }
    };

    ko.bindingHandlers['page-accordion-item'] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var pageAccordionItem = new PageAccordionItem(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            pageAccordionItem.init();
        },
        update: function () {
        }
    };

    var vm = {

    };

    return {
        getVM: function () {
            return vm;
        }
    };

});