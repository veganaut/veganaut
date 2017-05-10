angular.module('veganaut.app.search').factory('searchService', [
    '$rootScope', '$q', '$uibModal', '$route', 'angularPiwik', 'locationService', 'geocodeService',
    function($rootScope, $q, $uibModal, $route, angularPiwik, locationService, geocodeService) {
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
         * TODO: add tests for this service
         * @constructor
         */
        var SearchService = function() {
            /**
             * List of Location results
             * @type {Location[]}
             */
            this.locationResults = [];

            /**
             * List of GeocodeResults
             * @type {GeocodeResult[]}
             */
            this.geoResults = [];

            /**
             * Whether more Location results are available
             * @type {boolean}
             */
            this.hasMoreLocations = false;

            /**
             * Whether more GeocodeResults are available
             * @type {boolean}
             */
            this.hasMoreGeo = false;

            /**
             * Whether the search yielded no results
             * @type {boolean}
             */
            this.noResultsFound = false;

            /**
             * Current search string
             * @type {string}
             */
            this.searchString = '';

            /**
             * Current geo result action type (map or list)
             * @type {string}
             */
            this.geoAction = 'map';

            /**
             * Icons used for the geo result actions
             * @type {{map: string, list: string}}
             */
            this.GEO_ACTION_ICONS = {
                map: 'map-marker',
                locationList: 'th-list'
            };

            /**
             * Instance of the search modal (if it's opened)
             * @type {{}}
             * @private
             */
            this._modalInstance = undefined;

            // Listen to route changes ot set the geo action. We always want
            // the action corresponding to the page that was last visited to be active.
            var that = this;
            $rootScope.$on('$routeChangeSuccess', function() {
                if ($route.current.vgRouteName === 'map' || $route.current.vgRouteName === 'locationList') {
                    that.geoAction = $route.current.vgRouteName;
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

            // Whether we already tracked the use of the search
            var isTracked = false;

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

                // Track search with results if there are results and we haven't tracked yet
                if (!isTracked && that.locationResults.length > 0) {
                    angularPiwik.trackSiteSearch(that.searchString, false, 1);
                    isTracked = true;
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

                // Track search with results if there are results and we haven't tracked yet
                if (!isTracked && that.geoResults.length > 0) {
                    angularPiwik.trackSiteSearch(that.searchString, false, 1);
                    isTracked = true;
                }
            });

            // Check if no results were found after all calls returned
            $q.all([locationPromise, geoPromise]).finally(function() {
                if (that.geoResults.length === 0 &&
                    that.locationResults.length === 0)
                {
                    that.noResultsFound = true;
                }

                // If we haven't tracked the search yet, we should track it as no results
                // (otherwise it would have already been tracked before)
                if (!isTracked) {
                    angularPiwik.trackSiteSearch(that.searchString, false, 0);
                    isTracked = true;
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
                        angularPiwik.track('globalSearch', 'globalSearch.dismissModal');
                    })
                    .finally(function() {
                        this._modalInstance = undefined;
                    }.bind(this))
                ;

                // Track showing of modal
                angularPiwik.track('globalSearch', 'globalSearch.openModal', 'globalSearch.openModal.' + $route.current.vgRouteName);
            }

        };

        /**
         * Creates and returns a bootstrap modal.
         * @returns {{}}
         * @private
         */
        SearchService.prototype._createModal = function() {
            return $uibModal.open({
                template: '<vg-dismiss-modal-button vg-on-dismiss="$ctrl.onDismiss()"></vg-dismiss-modal-button>' +
                '<vg-global-search vg-on-select="$ctrl.onClose()"></vg-global-search>',
                controller: 'vgSimpleModalCtrl',
                controllerAs: '$ctrl',
                bindToController: true
            });
        };

        return new SearchService();
    }
]);
