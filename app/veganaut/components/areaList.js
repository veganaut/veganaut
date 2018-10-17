(function() {
    'use strict';

    /**
     * Component for showing a paginated list of items (products or locations)
     * within a given area.
     * Reads the area from the URL and listens to changes in area and filters.
     * @type {{}}
     */
    var areaListComponent = {
        controller: 'vgAreaListCtrl',
        bindings: {
            onLoadItems: '&vgOnLoadItems',
            onOpenToggle: '&?vgOnOpenToggle'
        },
        templateUrl: '/veganaut/components/areaList.tpl.html'
    };

    var areaListCtrl = [
        '$scope', 'constants', 'angularPiwik', 'Location', 'geocodeService',
        'areaService', 'locationFilterService', 'locationService', 'pageTitleService',
        function($scope, constants, angularPiwik, Location, geocodeService,
            areaService, locationFilterService, locationService, pageTitleService)
        {
            var $ctrl = this;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            $ctrl.legacyGlobals = {
                goToView: $scope.$root.goToView
            };

            /**
             * How many items to show by default and then show more
             * when the "Show more" button is clicked.
             * @type {number}
             */
            var NUM_ITEMS_SHOWN_STEP = 20;

            /**
             * List of items to show
             * @type {[]}
             */
            $ctrl.list = [];

            /**
             * Total number of items found
             * @type {number}
             */
            $ctrl.totalItems = 0;

            /**
             * Whether no results were found (either because of invalid query parameters
             * or because no items are found in the given area).
             * If not false, it's the translation key that should be used to show the
             * no results message (depends on the filters as well).
             * @type {boolean|string}
             */
            $ctrl.noResultsText = false;

            /**
             * Type of area that is being shown
             * @type {string}
             */
            $ctrl.areaType = undefined;

            /**
             * Radius of this query formatted for display
             * @type {string}
             */
            $ctrl.displayRadius = undefined;

            /**
             * Area showing a list for
             * @type {Area}
             */
            $ctrl.area = undefined;

            /**
             * Whether to show the 'city' or the 'street' part of the address.
             * Depends on the radius shown.
             * @type {string}
             */
            $ctrl.addressType = undefined;

            /**
             * Locations loaded from the backend
             * @type {LocationSet}
             */
            $ctrl.locationSet = locationService.getLocationSet();

            /**
             * Type of the list that we are showing
             * @type {string}
             */
            $ctrl.listType = undefined;

            /**
             * Shows the next batch of items
             */
            $ctrl.showMore = function() {
                $ctrl.onLoadItems({
                    lat: lastParams.lat,
                    lng: lastParams.lng,
                    radius: lastParams.radius,
                    limit: NUM_ITEMS_SHOWN_STEP,
                    skip: $ctrl.list.length,
                    addressType: $ctrl.addressType
                }).then(function(data) {
                    $ctrl.totalItems = data.totalItems;
                    $ctrl.list = $ctrl.list.concat(data.items);
                });

                // Track it
                angularPiwik.track('areaList', 'areaList.showMore', 'areaList.' + $ctrl.listType);
            };

            $ctrl.showSortModal = function() {
                locationFilterService.showSortModal();
            };

            $ctrl.onItemClick = function(item) {
                if (locationFilterService.getGranularityFilterValue() === 'location') {
                    $ctrl.locationSet.activate(item);
                }
                else if (locationFilterService.getGranularityFilterValue() === 'product') {
                    // Create an empty location that will then be loaded then it's activated
                    var loc = new Location({id: item.location});
                    loc.setShownProduct(item);
                    $ctrl.locationSet.activate(loc);
                }
            };

            $ctrl.isLocationGranularity = function() {
                return locationFilterService.getGranularityFilterValue() === 'location';
            };

            $ctrl.isProductGranularity = function() {
                return locationFilterService.getGranularityFilterValue() === 'product';
            };

            /**
             * Last parameters that were used to query the items.
             * @type {{}}
             */
            var lastParams = {};

            /**
             * Resets the list to empty.
             * Note: this doesn't reset the area of the list.
             */
            var resetList = function() {
                // Reset list and related variables
                $ctrl.list = [];
                $ctrl.totalItems = 0;
                $ctrl.noResultsText = false;
            };

            /**
             * Processes the response from the backend and checks if any
             * results were found.
             * @param {{}} data Object with totalItems and items property.
             */
            var compileList = function(data) {
                $ctrl.totalItems = data.totalItems;
                $ctrl.list = data.items;

                // Check if we found any results
                if ($ctrl.list.length === 0) {
                    if (locationFilterService.hasActiveFilters()) {
                        $ctrl.noResultsText = 'lists.' + $ctrl.listType + '.noResultsFiltered';
                    }
                    else {
                        $ctrl.noResultsText = 'lists.' + $ctrl.listType + '.noResults';
                    }
                }
            };

            /**
             * Loads the items with the currently set lastParams
             */
            var loadItems = function() {
                // Reset the list first
                resetList();

                // Update the list type
                $ctrl.listType = locationFilterService.getCategoryValue();

                // Note: we don't reset the list here, as it's nicer when the list stays
                // rendered when filters are applied.
                if ($ctrl.onLoadItems) {
                    $ctrl.onLoadItems({
                        lat: lastParams.lat,
                        lng: lastParams.lng,
                        radius: lastParams.radius,
                        limit: NUM_ITEMS_SHOWN_STEP,
                        skip: 0,
                        addressType: $ctrl.addressType
                    }).then(compileList);
                }
            };

            /**
             * Adds the name of the area to the page title
             */
            var setPageTitle = function() {
                pageTitleService.addCustomTitle($ctrl.area.longName);
            };


            // TODO: this should go in a service, so state can be kept better also when return to a list one has already interacted with
            // TODO: it should also get de-duplicated with the panorama component
            /**
             * Shows the list of the given area
             * @param {Area} area
             * @param {boolean} [addHistoryEntry] Whether showing this area should
             *      create a new history entry (or default to updating the current one)
             */
            var showArea = function(area, addHistoryEntry) {
                // Get the radius params from the area
                lastParams = area.getRadiusParams();

                // Reset the area display variables and the list itself
                resetList();
                $ctrl.areaType = area.getAreaType();
                $ctrl.area = area;
                $ctrl.displayRadius = undefined;

                // Check whether to show the city or street part of the address
                $ctrl.addressType = (lastParams.radius > constants.ADDRESS_TYPE_BOUNDARY_RADIUS ? 'city' : 'street');

                if ($ctrl.areaType === 'withoutId') {
                    // Area without id and therefore probably without name, ask the
                    // service to retrieve a name for the center of the area
                    areaService.retrieveNameForArea(area)
                        // Set the name int the page title when done
                        .then(setPageTitle)
                    ;
                }
                else {
                    // For other area types, we already have a name to set as title
                    setPageTitle();
                }

                // Round the radius to two significant digits and display it as meters or kms
                // TODO: this should be a filter
                var roundingHelper = Math.pow(10, ('' + lastParams.radius).length) / 100;
                var roundedRadius = Math.round(lastParams.radius / roundingHelper) * roundingHelper;
                if (roundedRadius < 1000) {
                    $ctrl.displayRadius = roundedRadius + 'm';
                }
                else {
                    $ctrl.displayRadius = (roundedRadius / 1000) + 'km';
                }

                // Load items with the newly set params
                loadItems();

                // Update the url
                areaService.writeAreaToUrl(addHistoryEntry);
            };

            $ctrl.$onInit = function() {
                // Set the filters from the URL
                locationFilterService.setFiltersFromUrl();

                // Try to set the area from the URL params
                areaService.setAreaFromUrl()
                    .finally(function() {
                        // Regardless if the area was set from the URL or not, show the current area
                        showArea(areaService.getCurrentArea());
                    })
                ;

                // Listen to area changes
                $scope.$on('veganaut.area.changed', function() {
                    // Explicit area change coming in, show area and add new history entry
                    showArea(areaService.getCurrentArea(), true);
                });

                // Reload items when filters change
                $scope.$on('veganaut.filters.changed', loadItems);


                // When the user clicks on back/forward in the browser, we don't get notified
                // by default that the URL changed (cause we have reloadOnSearch set to false).
                // To still provide the back/forward functionality, we have to listen to $routeUpdate
                // (this fires when the URL changes but we stay in this controller) and to the
                // browser onPopState event. Always when the latter event fired and we previously
                // had a $routeUpdate, this means that we stayed in this controller and that
                // back/forward was used, so we have to re-render.
                var routeUpdateFired = false;
                $scope.$on('$routeUpdate', function() {
                    routeUpdateFired = true;
                });

                $scope.$on('veganaut.history.onPopState', function() {
                    if (routeUpdateFired) {
                        // Read the URL and re-render the content
                        locationFilterService.setFiltersFromUrl();
                        areaService.setAreaFromUrl()
                            .finally(function() {
                                // Regardless if the area was set from the URL or not, show the current area
                                showArea(areaService.getCurrentArea());
                            })
                        ;
                    }

                    // Reset the flag
                    routeUpdateFired = false;
                });
            };
        }
    ];

    // Expose as component
    angular.module('veganaut.app.main')
        .controller('vgAreaListCtrl', areaListCtrl)
        .component('vgAreaList', areaListComponent)
    ;
})();
