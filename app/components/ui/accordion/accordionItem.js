(function() {
    'use strict';

    // Part of the ui module
    var module = angular.module('veganaut.ui');

    /**
     * One item inside an accordion.
     * See accordion directive for example usage.
     * @returns {directive}
     */
    var accordionItemDirective = function() {
        return {
            restrict: 'E',
            // Require itself to have access to the ctrl and require
            // that it's a child of vgAccordion
            require: ['vgAccordionItem', '^vgAccordion'],
            transclude: true,
            scope: {
                onOpenToggle: '&?vgOnOpenToggle',
                trackingCategory: '@?vgTrackingCategory'
            },

            link: function(scope, el, attrs, ctrls) {
                var vm = ctrls[0];

                // Make the accordionVm accessible to our vm
                vm._accordionVm = ctrls[1];

                // Add to the accordion
                vm._accordionVm.addItem(vm);

                // Remove on $destroy
                scope.$on('$destroy', function() {
                    vm._accordionVm.removeItem(vm);
                });
            },
            controller: ['angularPiwik', function(angularPiwik) {
                var vm = this;

                /**
                 * Whether this item is open
                 * @type {boolean}
                 */
                vm.isOpen = false;

                /**
                 * Toggles the open state
                 */
                vm.toggleOpen = function() {
                    // Toggle state
                    vm.isOpen = !vm.isOpen;

                    // Close others if now open
                    if (vm.isOpen) {
                        vm._accordionVm.closeOthers(vm);
                    }

                    // Track the toggling
                    track(vm.isOpen);

                    // Tell handler that open state changed
                    if (angular.isDefined(vm.onOpenToggle)) {
                        vm.onOpenToggle({isOpen: vm.isOpen});
                    }
                };

                /**
                 * Tracks the opening or closing of this item if a trackingCategory
                 * was given to this directive.
                 * @param {boolean} isOpen
                 */
                var track = function(isOpen) {
                    // Only track when category defined
                    if (angular.isDefined(vm.trackingCategory)) {
                        angularPiwik.track(
                            vm.trackingCategory,
                            vm.trackingCategory + '.' + (isOpen ? 'open' : 'close')
                        );
                    }
                };
            }],
            controllerAs: 'accordionItemVm',
            bindToController: true,
            replace: true,
            templateUrl: '/components/ui/accordion/accordionItem.tpl.html'
        };
    };

    // Expose as directive
    module.directive('vgAccordionItem', [accordionItemDirective]);
})();
