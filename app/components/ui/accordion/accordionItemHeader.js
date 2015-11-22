(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * Header of an accordion item. The header acts as a button that opens the item.
     * See accordion directive for example usage.
     * @returns {directive}
     */
    var accordionItemHeaderDirective = function() {
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
            templateUrl: '/components/ui/accordion/accordionItemHeader.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgAccordionItemHeader', [accordionItemHeaderDirective]);
})();
