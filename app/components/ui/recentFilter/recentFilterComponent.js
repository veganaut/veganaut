(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgRecentFilter', recentFilterComponent());

    function recentFilterComponent() {
        var component = {
            bindings: {
                hover: '<?vgHover',
                isInFilterModal: '<?vgIsInFilterModal'
            },
            controller: RecentFilterController,
            templateUrl: 'components/ui/recentFilter/recentFilterComponent.html'
        };

        return component;
    }

    RecentFilterController.$inject = ['angularPiwik', 'locationFilterService'];

    function RecentFilterController(angularPiwik, locationFilterService) {
        var $ctrl = this;

        $ctrl.locationFilterService = locationFilterService;

        /**
         * Handles clicks on the filter buttons
         * @param {string} clickedPeriod
         */
        $ctrl.handleFilterClick = function(clickedPeriod) {
            locationFilterService.setFilters({
                recent: clickedPeriod
            });

            angularPiwik.track('switchRecent', 'switchRecent.' + $ctrl.locationFilterService.getRecentFilterString());
        };
    }
})();
