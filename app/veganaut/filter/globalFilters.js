(function() {
    'use strict';

    /**
     * Component definition for the global filters. Shows a form to edit all
     * the filters.
     * @type {{}}
     */
    var globalFiltersComponent = {
        controller: 'vgGlobalFiltersCtrl',
        templateUrl: '/veganaut/filter/globalFilters.tpl.html'
    };

    var globalFiltersCtrl = [
        '$scope', 'angularPiwik', 'locationFilterService',
        function($scope, angularPiwik, locationFilterService) {
            var $ctrl = this;

            // Expose the filter service
            $ctrl.locationFilterService = locationFilterService;

            // Watch the active filters
            // TODO: do this without two-way binding (not really possible with the ui-bootstrap component)
            $scope.$watchCollection('$ctrl.locationFilterService.activeFilters',
                function(filters, filtersBefore) {
                    // Check what actually changed
                    if (angular.isDefined(filtersBefore)) {
                        // Track filter usage
                        var changed = false;
                        if (filters.recent !== filtersBefore.recent) {
                            changed = true;
                            angularPiwik.track('filters', 'filters.apply.recent', 'filters.apply.recent.' + filters.recent);
                        }
                        if (filters.type !== filtersBefore.type) {
                            changed = true;
                            angularPiwik.track('filters', 'filters.apply.type', 'filters.apply.type.' + filters.type);
                        }

                        // Inform the service
                        if (changed) {
                            locationFilterService.onFiltersChanged();
                        }
                    }
                }
            );
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.filter')
        .controller('vgGlobalFiltersCtrl', globalFiltersCtrl)
        .component('vgGlobalFilters', globalFiltersComponent)
    ;
})();
