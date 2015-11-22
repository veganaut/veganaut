(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * Body of an accordion item. The body is hidden by default and shown
     * when this accordion item is opened.
     * See accordion directive for example usage.
     * @returns {directive}
     */
    var accordionItemBodyDirective = function() {
        return {
            restrict: 'E',
            require: '^vgAccordionItem',
            transclude: true,
            scope: {},
            link: function(scope, el, attrs, accordionItemVm) {
                // Make the parent vm available in the view
                scope.accordionItemVm = accordionItemVm;
            },
            replace: true,
            templateUrl: '/components/ui/accordion/accordionItemBody.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgAccordionItemBody', [accordionItemBodyDirective]);
})();
