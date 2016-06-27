angular.module('veganaut.app.location').factory('locationFilterService', [
    function() {
        'use strict';
        /**
         * Service that keeps the global location filter state.
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
         * time in seconds for which to show the locations.
         * @type {{month: number, week: number, day: number}}
         */
        LocationFilterService.prototype.RECENT_FILTER_PERIOD = {
            month: 4 * 7 * 24 * 3600,
            week: 7 * 24 * 3600,
            day: 24 * 3600
        };

        /**
         * Returns the recent filter value (number of seconds within which to filter)
         * or undefined if that filter is not active.
         * @returns {number|undefined}
         */
        LocationFilterService.prototype.getRecentFilterValue = function() {
            if (this.activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent) {
                return this.RECENT_FILTER_PERIOD[this.activeFilters.recent];
            }
            return undefined;
        };

        /**
         * Returns the type filter value or undefined if that filter is not active.
         * @returns {string|undefined}
         */
        LocationFilterService.prototype.getTypeFilterValue = function() {
            if (this.activeFilters.type !== this.INACTIVE_FILTER_VALUE.type) {
                return this.activeFilters.type;
            }
            return undefined;
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
