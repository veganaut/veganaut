angular.module('veganaut.app.location').factory('locationFilterService', [
    function() {
        'use strict';
        /**
         * Service that keeps the global location filter state
         * and filters location sets.
         * @constructor
         */
        var LocationFilterService = function() {
            /**
             * List of active filters
             * @type {{}}
             */
            this.activeFilters = {
                recent: this.INACTIVE_FILTER_VALUE.recent,
                type: this.INACTIVE_FILTER_VALUE.type
            };
        };

        /**
         * Value of the filters for which they are considered inactive.
         * @type {{}}
         */
        LocationFilterService.prototype.INACTIVE_FILTER_VALUE = {
            recent: 'anytime',
            type: 'anytype'
        };

        /**
         * Possible filter options for all the available filters
         * @type {{recent: string[]}}
         */
        LocationFilterService.prototype.POSSIBLE_FILTERS = {
            recent: [
                LocationFilterService.prototype.INACTIVE_FILTER_VALUE.recent,
                'month',
                'week',
                'day'
            ],
            type: [
                LocationFilterService.prototype.INACTIVE_FILTER_VALUE.type,
                'gastronomy',
                'retail'
            ]
        };

        /**
         * Map of recent filter values to the period of
         * time for which to show the locations.
         * @type {{month: number, week: number, day: number}}
         */
        LocationFilterService.prototype.RECENT_FILTER_PERIOD = {
            month: 4 * 7 * 24 * 3600000,
            week: 7 * 24 * 3600000,
            day: 24 * 3600000
        };

        /**
         * Runs the locations through the given recent filter
         * @param locations
         * @private
         */
        LocationFilterService.prototype._applyRecentFilter = function(locations) {
            var showAll = (this.activeFilters.recent === this.INACTIVE_FILTER_VALUE.recent);
            var recentDate;
            if (!showAll) {
                recentDate = new Date(Date.now() - this.RECENT_FILTER_PERIOD[this.activeFilters.recent]);
            }

            // Go through all the locations and filter them
            angular.forEach(locations, function(location) {
                // Only apply the filter if the location is not already hidden
                if (!location.isDisabled()) {
                    var disableIt = (!showAll && location.updatedAt < recentDate);
                    location.setDisabled(disableIt);
                }
            });
        };

        /**
         * Runs the locations through the given type filter
         * @param locations
         * @private
         */
        LocationFilterService.prototype._applyTypeFilter = function(locations) {
            var showAll = (this.activeFilters.type === this.INACTIVE_FILTER_VALUE.type);
            // Go through all the locations and filter them
            angular.forEach(locations, function(location) {
                // Only apply the filter if the location is not already hidden
                if (!location.isDisabled()) {
                    var disableIt = (!showAll && location.type !== this.activeFilters.type);
                    location.setDisabled(disableIt);
                }
            }.bind(this));
        };

        /**
         * Runs the locations through all the filters
         * @param {LocationSet} locationSet
         */
        LocationFilterService.prototype.applyFilters = function(locationSet) {
            // First show all the locations
            // TODO: this is inefficient because the marker might update twice (show it, then hide it again)
            angular.forEach(locationSet.locations, function(location) {
                location.setDisabled(false);
            });

            // Then run the filters
            this._applyRecentFilter(locationSet.locations);
            this._applyTypeFilter(locationSet.locations);
        };

        /**
         * Returns the number of currently active filters
         * @returns {number}
         */
        LocationFilterService.prototype.getNumActiveFilters = function() {
            var active = 0;
            if (this.activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent) {
                active += 1;
            }
            if (this.activeFilters.type !== this.INACTIVE_FILTER_VALUE.type) {
                active += 1;
            }

            return active;
        };

        return new LocationFilterService();
    }
]);
