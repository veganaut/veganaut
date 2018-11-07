angular.module('veganaut.app.location').factory('locationFilterService', [
    '$rootScope', '$routeParams', '$route', '$location', '$uibModal', 'angularPiwik',
    function($rootScope, $routeParams, $route, $location, $uibModal, angularPiwik) {
        'use strict';
        /**
         * Service that keeps the global location filter state.
         * TODO: add an integration test for the whole filtering feature
         * @constructor
         */
        var LocationFilterService = function() {
            /**
             * List of active filters
             * TODO: Remove sortBy from this service as it is not an actual filter
             * @type {{}}
             */
            this.activeFilters = {
                recent: this.DEFAULT_FILTER_VALUE.recent,
                type: this.DEFAULT_FILTER_VALUE.type,
                granularity: this.DEFAULT_FILTER_VALUE.granularity,
                sortBy: this.DEFAULT_FILTER_VALUE.sortBy,
                minQuality: this.DEFAULT_FILTER_VALUE.minQuality,
                maxQuality: this.DEFAULT_FILTER_VALUE.maxQuality
            };
        };

        /**
         * Value of the filters for which they are considered inactive.
         * @type {{}}
         */
        LocationFilterService.prototype.INACTIVE_FILTER_VALUE = {
            recent: 'anytime',
            sortBy: 'none',
            type: 'anytype',
            minQuality: undefined,
            maxQuality: undefined
            // granularity is never inactive
        };

        LocationFilterService.prototype.DEFAULT_FILTER_VALUE = {
            recent: LocationFilterService.prototype.INACTIVE_FILTER_VALUE.recent,
            type: LocationFilterService.prototype.INACTIVE_FILTER_VALUE.type,
            granularity: 'location',
            sortBy: LocationFilterService.prototype.INACTIVE_FILTER_VALUE.sortBy,
            minQuality: LocationFilterService.prototype.INACTIVE_FILTER_VALUE.minQuality,
            maxQuality: LocationFilterService.prototype.INACTIVE_FILTER_VALUE.maxQuality
        };

        /**
         * Categories based on type and granularity.
         * @type {{gastronomy: {location: string, product: string}, retail: {location: string, product: string}}}
         */
        LocationFilterService.prototype.CATEGORIES = {
            gastronomy: {
                location: 'gastronomyLocation',
                product: 'gastronomyProduct'
            },
            retail: {
                location: 'retailLocation',
                product: 'retailProduct'
            }
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
            ],
            granularity: [
                'location',
                'product'
            ],
            sortBy: [
                LocationFilterService.prototype.INACTIVE_FILTER_VALUE.sortBy,
                'quality',
                'distance',
                'lastUpdate'
            ]
        };

        /**
         * Lowest possible value for the quality filter
         * @type {number}
         */
        LocationFilterService.prototype.LOWEST_POSSIBLE_QUALITY = 0;

        /**
         * Highest possible value for the quality filter
         * @type {number}
         */
        LocationFilterService.prototype.HIGHEST_POSSIBLE_QUALITY = 5;


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
         * Returns the type filter value (type filter is always active).
         * @returns {string}
         */
        LocationFilterService.prototype.getTypeFilterValue = function() {
            // return this.activeFilters.type;
            if (this.activeFilters.type !== this.INACTIVE_FILTER_VALUE.type) {
                return this.activeFilters.type;
            }
            return undefined;
        };

        /**
         * Returns the granularity filter value (granularity filter is always active).
         * @returns {string}
         */
        LocationFilterService.prototype.getGranularityFilterValue = function() {
            return this.activeFilters.granularity;
        };

        /**
         * Returns the category based on the active type and granularity
         * If the type filter is not active, it returns only the granularity
         * @return {string|undefined}
         */
        LocationFilterService.prototype.getCategoryValue = function() {
            if (this.routeHasGranularityFilter() && this.routeHasTypeFilter()) {
                if (this.CATEGORIES[this.activeFilters.type]) {
                    return this.CATEGORIES[this.activeFilters.type][this.activeFilters.granularity];
                }
                else {
                    return this.activeFilters.granularity;
                }
            }
            return undefined;
        };

        /**
         * Returns the sort by value or undefined if that filter is not active.
         * @returns {string|undefined}
         */
        LocationFilterService.prototype.getSortByValue = function() {
            if (this.activeFilters.sortBy !== this.INACTIVE_FILTER_VALUE.sortBy) {
                return this.activeFilters.sortBy;
            }
            return undefined;
        };

        /**
         * Returns whether the current route uses the recent filter
         * @returns {boolean}
         */
        LocationFilterService.prototype.routeHasRecentFilter = function() {
            return (
                angular.isObject($route.current.vgFilters) &&
                $route.current.vgFilters.recent === true
            );
        };

        /**
         * Returns whether the current route uses the type filter
         * @returns {boolean}
         */
        LocationFilterService.prototype.routeHasTypeFilter = function() {
            return (
                angular.isObject($route.current.vgFilters) &&
                $route.current.vgFilters.type === true
            );
        };

        /**
         * Returns whether the current route uses the granularity filter
         * @returns {boolean}
         */
        LocationFilterService.prototype.routeHasGranularityFilter = function() {
            return (
                angular.isObject($route.current.vgFilters) &&
                $route.current.vgFilters.granularity === true
            );
        };

        /**
         * Returns whether the current route uses the sort by
         * @returns {boolean}
         */
        LocationFilterService.prototype.routeHasSortBy = function() {
            return (
                angular.isObject($route.current.vgFilters) &&
                $route.current.vgFilters.sortBy === true
            );
        };


        /**
         * Returns whether the current route uses the quality filter
         * @returns {boolean}
         */
        LocationFilterService.prototype.routeHasQualityFilter = function() {
            return (
                angular.isObject($route.current.vgFilters) &&
                $route.current.vgFilters.quality === true
            );
        };

        /**
         * Returns the number of active filters relevant to the current page
         * @returns {number}
         */
        LocationFilterService.prototype.getNumActiveFilters = function() {
            var active = 0;
            if (this.activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent &&
                this.routeHasRecentFilter())
            {
                active += 1;
            }

            if (this.routeHasQualityFilter() &&
                angular.isNumber(this.activeFilters.minQuality) &&
                angular.isNumber(this.activeFilters.maxQuality) &&
                this.activeFilters.maxQuality - this.activeFilters.minQuality < 5)
            {
                active += 1;
            }

            // We do not count `sortBy` as an active filter because it is not an actual filter.
            // Neither do we consider type & granularity a filter (otherwise there would always be an active filter)

            return active;
        };

        /**
         * Returns whether there are any filters active relevant to the current page.
         * @returns {boolean}
         */
        LocationFilterService.prototype.hasActiveFilters = function() {
            return (this.getNumActiveFilters() > 0);
        };

        /**
         * Reads and sets the filters from the current route params.
         * TODO: should we listen to route changes and call this ourselves instead of relying on external components?
         */
        LocationFilterService.prototype.setFiltersFromUrl = function() {
            // TODO: don't duplicate all filters, make generic
            if ($routeParams.type) {
                // Set the default value (if invalid value was given)
                var typeFilter = this.DEFAULT_FILTER_VALUE.type;
                if (this.POSSIBLE_FILTERS.type.indexOf($routeParams.type) >= 0) {
                    // Found valid location type filter
                    typeFilter = $routeParams.type;
                }

                // Set the new value
                this.activeFilters.type = typeFilter;
            }

            if ($routeParams.granularity) {
                // Set the default value (if invalid value was given)
                var granularityFilter = this.DEFAULT_FILTER_VALUE.granularity;
                if (this.POSSIBLE_FILTERS.granularity.indexOf($routeParams.granularity) >= 0) {
                    // Found valid location granularity filter
                    granularityFilter = $routeParams.granularity;
                }

                // Set the new value
                this.activeFilters.granularity = granularityFilter;
            }

            if ($routeParams.recent) {
                // Set the default value (if invalid value was given)
                var recentFilter = this.DEFAULT_FILTER_VALUE.recent;
                if (this.POSSIBLE_FILTERS.recent.indexOf($routeParams.recent) >= 0) {
                    // Found valid recent filter
                    recentFilter = $routeParams.recent;
                }

                // Set the new value
                this.activeFilters.recent = recentFilter;
            }

            if ($routeParams.sortBy) {
                // Set the default value (if invalid value was given)
                var sortBy = this.DEFAULT_FILTER_VALUE.sortBy;
                if (this.POSSIBLE_FILTERS.sortBy.indexOf($routeParams.sortBy) >= 0) {
                    // Found valid sortBy value
                    sortBy = $routeParams.sortBy;
                }

                // Set the new value
                this.activeFilters.sortBy = sortBy;
            }

            if ($routeParams.quality) {
                var qualityValues = $routeParams.quality.split('-');
                var min = parseInt(qualityValues[0], 10);
                var max = qualityValues.length > 1 ? parseInt(qualityValues[1], 10) : min;
                if (isNaN(min) || isNaN(max) || min > max ||
                    min < this.LOWEST_POSSIBLE_QUALITY || max > this.HIGHEST_POSSIBLE_QUALITY)
                {
                    // Set the default value (if invalid value was given)
                    min = this.DEFAULT_FILTER_VALUE.minQuality;
                    max = this.DEFAULT_FILTER_VALUE.maxQuality;
                }

                // Set the new value
                this.activeFilters.minQuality = min;
                this.activeFilters.maxQuality = max;
            }

            // If there should be a filter, but neither the type nor quality is set,
            // default to using the type filter
            if (this.routeHasTypeFilter() && this.routeHasQualityFilter() &&
                angular.isUndefined(this.getTypeFilterValue()) &&
                angular.isUndefined(this.activeFilters.minQuality))
            {
                this.activeFilters.type = 'gastronomy';
            }

            // Update the URL to make sure it's always well-formed
            this.updateFiltersInUrl();
        };

        /**
         * Updates the URL params to correctly reflect the currently active filters.
         */
        LocationFilterService.prototype.updateFiltersInUrl = function() {
            // Only change the URL when we are on a route that has filters
            if (!angular.isObject($route.current.vgFilters)) {
                return;
            }

            var recentFilter;
            if (this.activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent &&
                this.routeHasRecentFilter())
            {
                recentFilter = this.activeFilters.recent;
            }

            var typeFilter;
            if (this.activeFilters.type !== this.INACTIVE_FILTER_VALUE.type &&
                this.routeHasTypeFilter())
            {
                typeFilter = this.activeFilters.type;
            }

            var granularityFilter;
            if (this.routeHasGranularityFilter()) {
                granularityFilter = this.activeFilters.granularity;
            }

            var sortByValue;
            if (this.activeFilters.sortBy !== this.INACTIVE_FILTER_VALUE.sortBy &&
                this.routeHasSortBy())
            {
                sortByValue = this.activeFilters.sortBy;
            }

            var quality;
            if (this.activeFilters.minQuality !== this.INACTIVE_FILTER_VALUE.minQuality &&
                this.activeFilters.maxQuality !== this.INACTIVE_FILTER_VALUE.maxQuality &&
                this.routeHasQualityFilter())
            {
                quality = this.activeFilters.minQuality;
                if (this.activeFilters.minQuality !== this.activeFilters.maxQuality) {
                    quality += '-' + this.activeFilters.maxQuality;
                }
            }

            // Replace the url hash (without adding a new history item)
            // Can't use $route.updateParams as this will set all params, not only the ones we want
            $location.replace();
            $location.search('recent', recentFilter);
            $location.search('type', typeFilter);
            $location.search('granularity', granularityFilter);
            $location.search('sortBy', sortByValue);
            $location.search('quality', quality);
        };

        /**
         * Informs the service that the filters have changed. This should always be
         * called when modifying the activeFilters.
         * TODO: we should only allow changing the filters over a method here.
         */
        LocationFilterService.prototype.onFiltersChanged = function() {
            // Update the URL and broadcast the change
            this.updateFiltersInUrl();
            $rootScope.$broadcast('veganaut.filters.changed');
        };

        /**
         * Opens the modal containing the form for editing the filters.
         * TODO: This is currently unused, use again or remove
         */
        LocationFilterService.prototype.showFilterModal = function() {
            $uibModal.open({
                template: '<vg-global-filters></vg-global-filters>' +
                    '<vg-dismiss-modal-button vg-on-dismiss="$ctrl.onDismiss()"></vg-dismiss-modal-button>',
                controller: 'vgSimpleModalCtrl',
                controllerAs: '$ctrl',
                bindToController: true
            }).result.finally(function() {
                // Track closing of filters
                angularPiwik.track('filters', 'filters.dismissModal');
            });

            // Track opening of filters
            angularPiwik.track('filters', 'filters.openModal', 'filters.openModal.' + $route.current.vgRouteName);
        };

        LocationFilterService.prototype.showSortModal = function() {
            $uibModal.open({
                template: '<vg-global-sort vg-on-close="$ctrl.onClose()"></vg-global-sort>' +
                '<vg-dismiss-modal-button vg-on-dismiss="$ctrl.onDismiss()"></vg-dismiss-modal-button>',
                controller: 'vgSimpleModalCtrl',
                controllerAs: '$ctrl',
                bindToController: true
            }).result.finally(function() {
                // Track closing of sort modal
                angularPiwik.track('sort', 'sort.dismissModal');
            });

            // Track opening of list sort modal
            angularPiwik.track('sort', 'sort.openModal', 'sort.openModal.' + $route.current.vgRouteName);
        };

        return new LocationFilterService();
    }
]);
