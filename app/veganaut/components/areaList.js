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
        '$scope', 'constants', 'angularPiwik', 'geocodeService',
        'areaService', 'locationFilterService', 'locationService',
        function($scope, constants, angularPiwik, geocodeService,
            areaService, locationFilterService, locationService)
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
             * Type of area that is being shown.
             * One of 'world', 'areaWithId', 'areaWithoutId'
             * @type {string}
             */
            $ctrl.areaType = undefined;

            /**
             * Radius of this query formatted for display
             * @type {string}
             */
            $ctrl.displayRadius = undefined;

            /**
             * Name to be shown for this area
             * @type {string}
             */
            $ctrl.areaName = undefined;

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
                angularPiwik.track($ctrl.listType + 'List', $ctrl.listType + 'List.showMore');
            };

            $ctrl.showSortModal = function() {
                locationFilterService.showSortModal();
            };

            $ctrl.onItemClick = function(item) {
                if (locationFilterService.getGroupFilterValue() === 'location') {
                    // TODO: show the location preview
                    console.log(item);
                }
                else if (locationFilterService.getGroupFilterValue() === 'product') {
                    // TODO: show the product preview
                    console.log(item);
                }
            };

            $ctrl.isLocationGroup = function() {
                return locationFilterService.getGroupFilterValue() === 'location';
            };

            $ctrl.isProductGroup = function() {
                return locationFilterService.getGroupFilterValue() === 'product';
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
                // Make sure the list is reset
                resetList();

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

            // TODO: this should go in a service, so state can be kept better also when return to a list one has already interacted with
            // TODO: it should also get de-duplicated with the areaOverview component
            /**
             * Shows the list of the given area
             * @param {Area} area
             */
            var showArea = function(area) {
                // Get the radius params from the area
                lastParams = area.getRadiusParams();

                // Reset the area display variables and the list itself
                resetList();
                $ctrl.areaType = undefined;
                $ctrl.areaName = undefined;
                $ctrl.displayRadius = undefined;

                // Check whether to show the city or street part of the address
                $ctrl.addressType = (lastParams.radius > constants.ADDRESS_TYPE_BOUNDARY_RADIUS ? 'city' : 'street');

                // Check what type of overview we have
                if (lastParams.includesWholeWorld) {
                    // Showing the whole world
                    $ctrl.areaType = 'world';
                }
                else if (area.hasId()) {
                    // We have an area with id and therefore name that we can show prominently
                    $ctrl.areaType = 'areaWithId';
                    $ctrl.areaName = area.name;
                }
                else {
                    // Area without id, so coming from a map section
                    $ctrl.areaType = 'areaWithoutId';

                    // Retrieve a name for the center of the area
                    areaService.getNameForArea(area).then(function(name) {
                        $ctrl.areaName = name;
                    });
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
                areaService.writeAreaToUrl(); // TODO WIP NOW: when coming from search, it should replace the history entry
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
                    showArea(areaService.getCurrentArea());
                });

                // Reload items when filters change
                $scope.$on('veganaut.filters.changed', loadItems);
            };
        }
    ];

    // Expose as component
    angular.module('veganaut.app.main')
        .controller('vgAreaListCtrl', areaListCtrl)
        .component('vgAreaList', areaListComponent)
    ;
})();
