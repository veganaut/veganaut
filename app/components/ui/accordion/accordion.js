(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * TODO: remove this component? Or use it again?
     * Accordion component with a header and a body.
     *
     * The optional onOpenToggle handler on the accordionItem will be called
     * with an "isOpen" argument informing whether the item is now opened or closed.
     *
     * The optional trackingCategory string will be used to track opening and closing
     * of the item. No tracking if not given.
     *
     * @returns {directive}
     *
     * @example
     * <vg-accordion>
     *   <vg-accordion-item
     *    vg-on-open-toggle="handler(isOpen)"
     *    vg-tracking-category="list"
     *   >
     *     <vg-accordion-item-header>
     *       Header
     *     </vg-accordion-item-header>
     *     <vg-accordion-item-body>
     *       Body
     *     </vg-accordion-item-body>
     *   </vg-accordion-item>
     * </vg-accordion>
     */
    var accordionDirective = function() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {},

            controller: [function() {
                var vm = this;

                /**
                 * List of accordion items
                 * @type {Array}
                 */
                vm.items = [];

                /**
                 * Close all items except the given one
                 * @param {AccordionItem} openItemVm
                 */
                vm.closeOthers = function(openItemVm) {
                    _.each(vm.items, function(item) {
                        if (item !== openItemVm) {
                            item.isOpen = false;
                        }
                    });
                };

                /**
                 * Add the given item to this accordion
                 * @param {AccordionItem} itemVm
                 */
                vm.addItem = function(itemVm) {
                    vm.items.push(itemVm);
                };

                /**
                 * Removes the given item to this accordion
                 * @param {AccordionItem} itemVm
                 */
                vm.removeItem = function(itemVm) {
                    var index = vm.items.indexOf(itemVm);
                    if (index !== -1) {
                        vm.items.splice(index, 1);
                    }
                };

            }],
            controllerAs: 'accordionVm',
            bindToController: true,
            template: '<div class="button-list button-list--accordion" ng-transclude></div>'
        };
    };

    // Expose as directive
    module.directive('vgAccordion', [accordionDirective]);
})();
