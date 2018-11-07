(function() {
    'use strict';

    angular
        .module('veganaut.ui')
        .component('vgQualityFilter', qualityFilterComponent());

    function qualityFilterComponent() {
        var component = {
            bindings: {
                hover: '<?vgHover'
            },
            controller: QualityFilterController,
            templateUrl: 'components/ui/qualityFilter/qualityFilterComponent.html'
        };

        return component;
    }

    QualityFilterController.$inject = ['$timeout', 'angularPiwik', 'locationFilterService'];

    function QualityFilterController($timeout, angularPiwik, locationFilterService) {
        var $ctrl = this;

        $ctrl.locationFilterService = locationFilterService;

        /**
         * Whether the user can currently set a range (a few seconds after
         * first clicking on one of the quality levels)
         * @type {boolean}
         */
        $ctrl.settingRange = false;

        /**
         * Timeout for setting the range (value returned by $timeout)
         */
        var settingRangeTimeout;

        /**
         * Resets variables to a state when we are not setting the range
         */
        var stopSettingRange = function() {
            $ctrl.settingRange = false;
            $timeout.cancel(settingRangeTimeout);
            settingRangeTimeout = undefined;
        };

        /**
         * Sets the quality filter and informs the service that the values changed
         * @param {number} min
         * @param {number} max
         */
        var setFilter = function(min, max) {
            $ctrl.locationFilterService.activeFilters.minQuality = min;
            $ctrl.locationFilterService.activeFilters.maxQuality = max;
            locationFilterService.onFiltersChanged();
        };

        /**
         * Handles clicks on the quality filter buttons
         * @param {number} clickedQuality
         */
        $ctrl.handleFilterClick = function(clickedQuality) {
            if ($ctrl.settingRange) {
                stopSettingRange();

                // Check if the second click was on a lower or higher quality, and set filters accordingly
                if (clickedQuality < $ctrl.locationFilterService.activeFilters.minQuality) {
                    setFilter(clickedQuality, $ctrl.locationFilterService.activeFilters.minQuality);
                }
                else {
                    setFilter($ctrl.locationFilterService.activeFilters.minQuality, clickedQuality);
                }

                var trackingString = $ctrl.locationFilterService.activeFilters.minQuality;
                if ($ctrl.locationFilterService.activeFilters.minQuality !== $ctrl.locationFilterService.activeFilters.maxQuality) {
                    trackingString += '-' + $ctrl.locationFilterService.activeFilters.maxQuality;
                }
                angularPiwik.track('switchQuality', 'switchQuality.' + trackingString);
            }
            else {
                // Set the min/max quality right away to the selected value
                setFilter(clickedQuality, clickedQuality);

                // After the first click, start setting the range
                $ctrl.settingRange = true;
                settingRangeTimeout = $timeout(stopSettingRange, 3000);

                angularPiwik.track('switchQuality', 'switchQuality.' + $ctrl.locationFilterService.activeFilters.minQuality);
            }
        };

        /**
         * Checks whether the given quality is part of the active filter range
         * @param {number} quality
         * @returns {boolean}
         */
        $ctrl.isQualityPartOfFilterInterval = function(quality) {
            return (quality >= $ctrl.locationFilterService.activeFilters.minQuality &&
                quality <= $ctrl.locationFilterService.activeFilters.maxQuality);
        };

        $ctrl.switchToTypeFilter = function() {
            locationFilterService.activeFilters.type = 'gastronomy';
            locationFilterService.activeFilters.granularity = 'location';
            locationFilterService.activeFilters.minQuality = undefined;
            locationFilterService.activeFilters.maxQuality = undefined;
            locationFilterService.onFiltersChanged();
        };
    }
})();
