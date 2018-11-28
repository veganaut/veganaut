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
             * @private
             */
            this._activeFilters = {
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
         * (without the inactive filter value).
         * @type {{recent: string[]}}
         */
        LocationFilterService.prototype.POSSIBLE_ACTIVE_FILTERS = {
            recent: [
                'day',
                'week',
                'month',
                'year'
            ],
            type: [
                'gastronomy',
                'retail'
            ],
            granularity: [
                'location',
                'product'
            ],
            sortBy: [
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
         * @type {{year: number, month: number, week: number, day: number}}
         */
        LocationFilterService.prototype.RECENT_FILTER_PERIOD = {
            year: 52 * 7 * 24 * 3600,
            month: 4 * 7 * 24 * 3600,
            week: 7 * 24 * 3600,
            day: 24 * 3600
        };

        /**
         * Returns the string representation of the currently set recent filter
         * @returns {string}
         */
        LocationFilterService.prototype.getRecentFilterString = function() {
            return this._activeFilters.recent;
        };

        /**
         * Returns the recent filter value (number of seconds within which to filter)
         * or undefined if that filter is not active.
         * @returns {number|undefined}
         */
        LocationFilterService.prototype.getRecentFilterValue = function() {
            if (this._activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent) {
                return this.RECENT_FILTER_PERIOD[this._activeFilters.recent];
            }
            return undefined;
        };

        /**
         * Returns the type filter value.
         * @returns {string|undefined}
         */
        LocationFilterService.prototype.getTypeFilterValue = function() {
            if (this._activeFilters.type !== this.INACTIVE_FILTER_VALUE.type) {
                return this._activeFilters.type;
            }
            return undefined;
        };

        /**
         * Returns the granularity filter value (granularity filter is always active).
         * @returns {string}
         */
        LocationFilterService.prototype.getGranularityFilterValue = function() {
            return this._activeFilters.granularity;
        };

        /**
         * Returns the category based on the active type and granularity
         * If the type filter is not active, it returns only the granularity
         * @return {string|undefined}
         */
        LocationFilterService.prototype.getCategoryValue = function() {
            if (this.routeHasGranularityFilter() && this.routeHasTypeFilter()) {
                if (this.CATEGORIES[this._activeFilters.type]) {
                    return this.CATEGORIES[this._activeFilters.type][this._activeFilters.granularity];
                }
                else {
                    return this._activeFilters.granularity;
                }
            }
            return undefined;
        };

        /**
         * Returns the sort by value or undefined if that filter is not active.
         * @returns {string|undefined}
         */
        LocationFilterService.prototype.getSortByValue = function() {
            if (this._activeFilters.sortBy !== this.INACTIVE_FILTER_VALUE.sortBy) {
                return this._activeFilters.sortBy;
            }
            return undefined;
        };

        /**
         * Returns the set quality filter value (min and max) or an empty object
         * if the filter is not active.
         * @returns {{min: number|undefined, max: number|undefined}}
         */
        LocationFilterService.prototype.getQualityFilterValue = function() {
            if (this.qualityFilterIsUsed()) {
                return {
                    min: this._activeFilters.minQuality,
                    max: this._activeFilters.maxQuality
                };
            }
            return {};
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
         * Whether the quality filter is currently used (so a min and max is set)
         * Note that even if it's used, it can be that it includes everything
         * (if min = 0 and max = 5).
         * @returns {boolean}
         */
        LocationFilterService.prototype.qualityFilterIsUsed = function() {
            return (angular.isNumber(this._activeFilters.minQuality) &&
                angular.isNumber(this._activeFilters.maxQuality));
        };

        /**
         * Returns the number of active filters relevant to the current page
         * @returns {number}
         */
        LocationFilterService.prototype.getNumActiveFilters = function() {
            var active = 0;
            if (this._activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent &&
                this.routeHasRecentFilter())
            {
                active += 1;
            }

            if (this.routeHasQualityFilter() &&
                this.qualityFilterIsUsed() &&
                // Only count as active, if not all qualities are included
                this._activeFilters.maxQuality - this._activeFilters.minQuality < 5)
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
         * Validates the given set of filters and sets the ones that are valid.
         * Will also perform some sanity checks on the combination of filters
         * and update the URL.
         * @param {{}} filtersToSet
         * @private
         */
        LocationFilterService.prototype._validateAndSetFilters = function(filtersToSet) {
            // Whether the type/recent/quality filters where set
            var hasSetFilter = {
                type: false,
                recent: false,
                quality: false
            };

            // TODO: don't duplicate all filters, make generic
            if (angular.isDefined(filtersToSet.type)) {
                // Set the default value (if invalid value was given)
                var typeFilter = this.DEFAULT_FILTER_VALUE.type;
                if (this.POSSIBLE_ACTIVE_FILTERS.type.indexOf(filtersToSet.type) >= 0) {
                    // Found valid location type filter
                    typeFilter = filtersToSet.type;
                    hasSetFilter.type = true;
                }

                // Set the new value
                this._activeFilters.type = typeFilter;
            }

            if (angular.isDefined(filtersToSet.granularity)) {
                // Set the default value (if invalid value was given)
                var granularityFilter = this.DEFAULT_FILTER_VALUE.granularity;
                if (this.POSSIBLE_ACTIVE_FILTERS.granularity.indexOf(filtersToSet.granularity) >= 0) {
                    // Found valid location granularity filter
                    granularityFilter = filtersToSet.granularity;
                }

                // Set the new value
                this._activeFilters.granularity = granularityFilter;
            }

            if (angular.isDefined(filtersToSet.recent)) {
                // Set the default value (if invalid value was given)
                var recentFilter = this.DEFAULT_FILTER_VALUE.recent;
                if (this.POSSIBLE_ACTIVE_FILTERS.recent.indexOf(filtersToSet.recent) >= 0) {
                    // Found valid recent filter
                    recentFilter = filtersToSet.recent;
                    hasSetFilter.recent = true;
                }

                // Set the new value
                this._activeFilters.recent = recentFilter;
            }

            if (angular.isDefined(filtersToSet.sortBy)) {
                // Set the default value (if invalid value was given)
                var sortBy = this.DEFAULT_FILTER_VALUE.sortBy;
                if (this.POSSIBLE_ACTIVE_FILTERS.sortBy.indexOf(filtersToSet.sortBy) >= 0) {
                    // Found valid sortBy value
                    sortBy = filtersToSet.sortBy;
                }

                // Set the new value
                this._activeFilters.sortBy = sortBy;
            }

            if (angular.isDefined(filtersToSet.minQuality) && angular.isDefined(filtersToSet.maxQuality)) {
                var min = filtersToSet.minQuality;
                var max = filtersToSet.maxQuality;
                if (!angular.isNumber(min) || !angular.isNumber(max) ||
                    isNaN(min) || isNaN(max) || min > max ||
                    min < this.LOWEST_POSSIBLE_QUALITY || max > this.HIGHEST_POSSIBLE_QUALITY)
                {
                    // Set the default value (if invalid value was given)
                    min = this.DEFAULT_FILTER_VALUE.minQuality;
                    max = this.DEFAULT_FILTER_VALUE.maxQuality;
                }
                else {
                    hasSetFilter.quality = true;
                }

                // Set the new value
                this._activeFilters.minQuality = min;
                this._activeFilters.maxQuality = max;
            }

            // Make some sanity checks for the combination of filters if we are on a page with many possible filters
            if (this.routeHasTypeFilter() && this.routeHasRecentFilter() && this.routeHasQualityFilter()) {
                // If neither of the possible filters is set, default to using the type filter
                if (angular.isUndefined(this.getTypeFilterValue()) &&
                    angular.isUndefined(this.getRecentFilterValue()) &&
                    !this.qualityFilterIsUsed())
                {
                    this._activeFilters.type = 'gastronomy';
                }

                // If exactly one of either quality, type or recent was set, make sure the others are inactive.
                // This is done to make sure that if one navigates e.g. from the panorama where only one of the
                // filters is set in the URL, the other ones are unset. And it still supports the hidden feature
                // that you can set multiple filters as active through the URL.
                var numSet = (hasSetFilter.type ? 1 : 0) + (hasSetFilter.recent ? 1 : 0) + (hasSetFilter.quality ? 1 : 0);
                if (numSet === 1) {
                    // Make sure the ones that weren't set are inactive
                    if (!hasSetFilter.type) {
                        this._activeFilters.type = this.INACTIVE_FILTER_VALUE.type;
                    }
                    if (!hasSetFilter.recent) {
                        this._activeFilters.recent = this.INACTIVE_FILTER_VALUE.recent;
                    }
                    if (!hasSetFilter.quality) {
                        this._activeFilters.minQuality = this.INACTIVE_FILTER_VALUE.minQuality;
                        this._activeFilters.maxQuality = this.INACTIVE_FILTER_VALUE.maxQuality;
                    }
                }

                // If the quality or recent filter is active, make sure the granularity is set to location
                if (this.qualityFilterIsUsed() || angular.isDefined(this.getRecentFilterValue())) {
                    this._activeFilters.granularity = 'location';
                }
            }

            // Update the URL to make sure it's always well-formed
            this.updateFiltersInUrl();
        };

        /**
         * Reads and sets the filters from the current route params.
         * TODO: should we listen to route changes and call this ourselves instead of relying on external components?
         */
        LocationFilterService.prototype.setFiltersFromUrl = function() {
            var filtersFromUrl = {
                type: $routeParams.type,
                granularity: $routeParams.granularity,
                recent: $routeParams.recent,
                sortBy: $routeParams.sortBy
            };

            if (angular.isString($routeParams.quality)) {
                var qualityValues = $routeParams.quality.split('-');
                filtersFromUrl.minQuality = parseInt(qualityValues[0], 10);
                filtersFromUrl.maxQuality = qualityValues.length > 1 ? parseInt(qualityValues[1], 10) : filtersFromUrl.minQuality;
            }

            this._validateAndSetFilters(filtersFromUrl);
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
            if (this._activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent &&
                this.routeHasRecentFilter())
            {
                recentFilter = this._activeFilters.recent;
            }

            var typeFilter;
            if (this._activeFilters.type !== this.INACTIVE_FILTER_VALUE.type &&
                this.routeHasTypeFilter())
            {
                typeFilter = this._activeFilters.type;
            }

            var granularityFilter;
            if (this.routeHasGranularityFilter()) {
                granularityFilter = this._activeFilters.granularity;
            }

            var sortByValue;
            if (this._activeFilters.sortBy !== this.INACTIVE_FILTER_VALUE.sortBy &&
                this.routeHasSortBy())
            {
                sortByValue = this._activeFilters.sortBy;
            }

            var quality;
            if (this._activeFilters.minQuality !== this.INACTIVE_FILTER_VALUE.minQuality &&
                this._activeFilters.maxQuality !== this.INACTIVE_FILTER_VALUE.maxQuality &&
                this.routeHasQualityFilter())
            {
                quality = this._activeFilters.minQuality;
                if (this._activeFilters.minQuality !== this._activeFilters.maxQuality) {
                    quality += '-' + this._activeFilters.maxQuality;
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
         * Sets the given filter values
         * @param {{}} filterValues
         */
        LocationFilterService.prototype.setFilters = function(filterValues) {
            this._validateAndSetFilters(filterValues);

            // Broadcast the change
            $rootScope.$broadcast('veganaut.filters.changed');
        };

        /**
         * Opens the modal containing the form for editing the filters.
         */
        LocationFilterService.prototype.showFilterModal = function() {
            $uibModal.open({
                template: '<vg-global-filters></vg-global-filters>' +
                    '<vg-dismiss-modal-button vg-on-dismiss="$ctrl.onDismiss()" vg-text="globalFilters.closeModal">' +
                    '</vg-dismiss-modal-button>',
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
