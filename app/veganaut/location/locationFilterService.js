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
             * @type {{}}
             */
            this.activeFilters = {
                recent: this.INACTIVE_FILTER_VALUE.recent,
                type: this.INACTIVE_FILTER_VALUE.type
            };

            // Listen to route changes to clean up URL parameters
            $rootScope.$on('$routeChangeStart', function(event, newRoute, oldRoute) {
                // If the event is still ongoing and the new route does not have filters,
                // remove our params from the URL
                if (!event.defaultPrevented &&
                    angular.isObject(oldRoute) &&
                    oldRoute.vgHasFilters === true &&
                    newRoute.vgHasFilters !== true)
                {
                    $location.search('type', undefined);
                    $location.search('recent', undefined);
                }
            });
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

        /**
         * Returns whether there are currently any filters active.
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
                // By default set the inactive value (if invalid value was given)
                var typeFilter = this.INACTIVE_FILTER_VALUE.type;
                if (this.POSSIBLE_FILTERS.type.indexOf($routeParams.type) >= 0) {
                    // Found valid location type filter
                    typeFilter = $routeParams.type;
                }

                // Set the new value
                this.activeFilters.type = typeFilter;
            }

            if ($routeParams.recent) {
                // By default set the inactive value (if invalid value was given)
                var recentFilter = this.INACTIVE_FILTER_VALUE.recent;
                if (this.POSSIBLE_FILTERS.recent.indexOf($routeParams.recent) >= 0) {
                    // Found valid recent filter
                    recentFilter = $routeParams.recent;
                }

                // Set the new value
                this.activeFilters.recent = recentFilter;
            }

            // Update the URL to make sure it's always well-formed
            this.updateFiltersInUrl();
        };

        /**
         * Updates the URL params to correctly reflect the currently active filters.
         */
        LocationFilterService.prototype.updateFiltersInUrl = function() {
            // Only change the URL when we are on a route that has filters
            if ($route.current.vgHasFilters !== true) {
                return;
            }

            var typeFilter;
            if (this.activeFilters.type !== this.INACTIVE_FILTER_VALUE.type) {
                typeFilter = this.activeFilters.type;
            }

            var recentFilter;
            if (this.activeFilters.recent !== this.INACTIVE_FILTER_VALUE.recent) {
                recentFilter = this.activeFilters.recent;
            }

            // Replace the url hash (without adding a new history item)
            // Can't use $route.updateParams as this will set all params, not only the ones we want
            $location.replace();
            $location.search('type', typeFilter);
            $location.search('recent', recentFilter);
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
         */
        LocationFilterService.prototype.showFilterModal = function() {
            $uibModal.open({
                template: '<vg-dismiss-modal-button vg-on-dismiss="$ctrl.onDismiss()"></vg-dismiss-modal-button>' +
                '<vg-global-filters></vg-global-filters>',
                controller: 'vgSimpleModalCtrl',
                controllerAs: '$ctrl',
                bindToController: true,
                windowClass: 'modal--below-contextual-menu',
                backdropClass: 'modal-backdrop--light'
            }).result.finally(function() {
                // Track closing of filters
                angularPiwik.track('filters', 'filters.dismissModal');
            });

            // Track opening of filters
            angularPiwik.track('filters', 'filters.openModal', 'filters.openModal.' + $route.current.routeName);
        };

        return new LocationFilterService();
    }
]);
