angular.module('veganaut.app.search').factory('searchService', [
    '$rootScope', '$q', '$uibModal', 'angularPiwik', 'routeHelperService',
    'locationService', 'geocodeService',
    function($rootScope, $q, $uibModal, angularPiwik, routeHelperService,
        locationService, geocodeService)
    {
        'use strict';

        /**
         * Minimum characters required to start searching
         * @type {number}
         */
        var MIN_SEARCH_LENGTH = 1;

        /**
         * Default number of search results to show per type of result
         * @type {number}
         */
        var DEFAULT_NUM_RESULTS = 2;

        /**
         * Service that handles the global search. Can search for Locations,
         * geo places and others.
         * @constructor
         */
        var SearchService = function() {
            // TODO WIP: better docu
            this.locationResults = [];
            this.geoResults = [];
            this.hasMoreLocations = false;
            this.hasMoreGeo = false;
            this.noResultsFound = false;
            this.searchString = '';
            this.geoAction = 'map';

            this.GEO_ACTION_MARKERS = {
                map: 'map-marker',
                list: 'th-list'
            };

            this._modalInstance = undefined;

            // Listen to route changes ot set the geo action. We always want
            // the action corresponding to the page that was last visited to be active.
            var that = this;
            $rootScope.$on('$routeChangeSuccess', function() {
                // TODO WIP: do this differently? Like getCurrentPage?
                if (routeHelperService.isCurrentPage('map')) {
                    that.geoAction = 'map';
                }
                else if (routeHelperService.isCurrentPage('list')) {
                    that.geoAction = 'list';
                }
            });
        };

        /**
         * Whether the search can be started with the current string.
         * @returns {boolean}
         */
        SearchService.prototype.isSearchStringValid = function() {
            return (
                angular.isString(this.searchString) &&
                this.searchString.length >= MIN_SEARCH_LENGTH
            );
        };

        /**
         * Starts the search with the current searchString.
         */
        SearchService.prototype.startSearch = function() {
            var that = this;
            if (!that.isSearchStringValid()) {
                return;
            }

            // Reset results
            that.noResultsFound = false;
            that.locationResults = [];
            that.geoResults = [];
            that.hasMoreLocations = false;
            that.hasMoreGeo = false;

            // TODO: get rid of code duplication

            // Get location results (we ask for one more to know whether there are more results)
            var locationPromise = locationService.searchLocations(
                that.searchString,
                DEFAULT_NUM_RESULTS + 1
            );
            locationPromise.then(function(locations) {
                that.locationResults = locations;

                // Check if we got enough results to show a "more" button
                // but don't actually show the last item
                if (that.locationResults.length > DEFAULT_NUM_RESULTS) {
                    that.hasMoreLocations = true;
                    that.locationResults = _.dropRight(that.locationResults);
                }
            });

            // Get geo results (also asking for one more as above)
            var geoPromise = geocodeService.search(
                that.searchString,
                DEFAULT_NUM_RESULTS + 1
            );
            geoPromise.then(function(data) {
                that.geoResults = data;

                // Check if we got enough results to show a "more" button
                // but don't actually show the last item
                if (that.geoResults.length > DEFAULT_NUM_RESULTS) {
                    that.hasMoreGeo = true;
                    that.geoResults = _.dropRight(that.geoResults);
                }
            });

            // Check if no results were found after all calls returned
            $q.all([locationPromise, geoPromise]).finally(function() {
                if (that.geoResults.length === 0 &&
                    that.locationResults.length === 0)
                {
                    that.noResultsFound = true;
                }
            });
        };

        /**
         * Shows or hides the search modal depending on the current state.
         */
        SearchService.prototype.toggleSearchModal = function() {
            // Check the current state of the modal
            var wasShown = angular.isObject(this._modalInstance);

            if (wasShown) {
                // Dismiss the modal
                this._modalInstance.dismiss();
            }
            else {
                // Create the modal
                this._modalInstance = this._createModal();

                // Set instance to undefined and track when it's closed or dismissed
                this._modalInstance.result
                    .catch(function() {
                        // We only track dismissal, not normal closing here.
                        // When it's closing, a result was selected, so this will be tracked elsewhere.
                        angularPiwik.track('searchModal', 'searchModal.dismiss');
                    })
                    .finally(function() {
                        this._modalInstance = undefined;
                    }.bind(this))
                ;

                // Track showing of modal
                angularPiwik.track('searchModal', 'searchModal.open');
            }

        };

        /**
         * Creates and returns a bootstrap modal.
         * @returns {{}}
         * @private
         */
        SearchService.prototype._createModal = function() {
            return $uibModal.open({
                templateUrl: '/veganaut/search/searchModal.tpl.html',
                controller: 'vgSearchModalCtrl',
                controllerAs: 'searchModalVm',
                bindToController: true,
                backdropClass: 'modal-backdrop--search',
                windowTopClass: 'modal--search'
            });
        };

        return new SearchService();
    }
]);
