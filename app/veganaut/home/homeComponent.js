(function() {
    'use strict';

    angular
        .module('veganaut.app.home')
        .component('vgHome', homeComponent());

    function homeComponent() {
        var component = {
            controller: HomeComponentController,
            templateUrl: '/veganaut/home/homeComponent.html'
        };

        return component;
    }

    HomeComponentController.$inject = [
        '$scope', '$translate', 'angularPiwik', 'Area',
        'areaService', 'geocodeService', 'alertService', 'mainMapService'
    ];
    function HomeComponentController($scope, $translate, angularPiwik, Area,
        areaService, geocodeService, alertService, mainMapService)
    {
        var $ctrl = this;

        /**
         * Zoom on the map used when we show the place returned
         * by the browser's geo location API.
         * @type {number}
         */
        var GEO_LOCATION_ZOOM = 15;

        // Expose the global methods we still need
        // TODO: find a better way to do this
        $ctrl.legacyGlobals = {
            goToView: $scope.$parent.goToView,
            isLoggedIn: $scope.$parent.isLoggedIn
        };

        /**
         * Cta form input model
         * @type {string}
         */
        $ctrl.ctaFormInput = '';

        /**
         * Whether we are currently running geo locating
         * @type {boolean}
         */
        $ctrl.geolocating = false;

        /**
         * The target area to show on the map when submitting the cta form.
         * @type {Area}
         */
        var targetArea = new Area({
            id: undefined,
            shortName: $ctrl.ctaFormInput,
            longName: $ctrl.ctaFormInput,
            lat: 0,
            lng: 0,
            zoom: 2
        });

        /**
         * Whether to clear the cta input field on the next focus event
         * @type {boolean}
         */
        var clearCtaInputOnFocus = true;

        /**
         * Uses the geocodeService to search for places with the given name
         * @param {string} searchInput
         * @returns {GeocodeResult[]}
         */
        $ctrl.getSearchResults = function(searchInput) {
            // TODO: should use piwik's search tracking
            angularPiwik.track('home.cta', 'home.cta.searchStart');

            return geocodeService.search(searchInput).then(function(response) {
                return response;
            });
        };

        /**
         * Whether the cta form can currently be submitted
         * @returns {boolean}
         */
        $ctrl.canSubmitCta = function() {
            // Can only submit when we have a target and it's currently shown in the input field
            return (angular.isObject(targetArea) && targetArea.longName === $ctrl.ctaFormInput);
        };

        /**
         * Handler for when the user selects a result from the auto-complete.
         * @param {GeocodeResult} geoResult
         */
        $ctrl.onResultSelected = function(geoResult) {
            // Set the target area
            targetArea = geoResult.getArea();

            // We no longer want to clear the input field on focus
            clearCtaInputOnFocus = false;

            angularPiwik.track('home.cta', 'home.cta.selectResult');
        };

        /**
         * Handler for the focus event of the cta input.
         */
        $ctrl.onCtaInputFocus = function() {
            if (clearCtaInputOnFocus) {
                $ctrl.ctaFormInput = '';
            }
        };

        /**
         * Handler for the blur event of the cta input.
         */
        $ctrl.onCtaInputBlur = function() {
            // If the user leaves the input and we cannot submit the form
            // but we have a target area, set that area again
            if (!$ctrl.canSubmitCta() && angular.isObject(targetArea)) {
                $ctrl.ctaFormInput = targetArea.longName;
            }
        };

        /**
         * Handler for submission of the cta form.
         * Will show the area overview for the selected area.
         */
        $ctrl.onCtaSubmit = function() {
            // Show the area on overview page
            areaService.setAreaAndShowOn(targetArea, 'areaOverview');

            // Track the submission
            angularPiwik.track('home.cta');
        };

        /**
         * Gets the location from the browser's geolocation API
         * and sets the target area based on that.
         */
        $ctrl.getUserLocation = function() {
            $ctrl.geolocating = true;
            // TODO: disable input while searching?
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$apply(function() {
                    // Extract the lat and lng and create an Area
                    var locatedArea = new Area({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        zoom: GEO_LOCATION_ZOOM
                    });

                    // Retrieve a name for it
                    areaService.retrieveNameForArea(locatedArea)
                        .then(function() {
                            // Set the target area and name in the input field
                            targetArea = locatedArea;
                            $ctrl.ctaFormInput = locatedArea.longName;

                            // When the user focuses the input field, clear it
                            clearCtaInputOnFocus = true;
                        })
                        .finally(function() {
                            $ctrl.geolocating = false;
                        })
                    ;

                    angularPiwik.track('home.geolocation', 'home.geolocation.found');
                });
            }, function() {
                $scope.$apply(function() {
                    $ctrl.geolocating = false;
                    alertService.addAlert($translate.instant('message.geolocate.error'), 'danger');

                    angularPiwik.track('home.geolocation', 'home.geolocation.error');
                });
            }, {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 0
            });

            angularPiwik.track('home.geolocation', 'home.geolocation.start');
        };

        /**
         * Go to the map to add a new location
         */
        $ctrl.addLocation = function() {
            mainMapService.goToMapAndAddLocation();
        };

        // Wait for the area service to be initialised to set the first target area
        areaService.initialised().then(function() {
            // If there's an area with id (and therefore name), set that as the first target
            // TODO: When the app is first loaded and the area in the local storage has no id, the search field will stay empty. In that case might want to fall back to country?
            var area = areaService.getLastAreaWithId();
            if (angular.isDefined(area) && angular.isString(area.longName)) {
                targetArea = area;
                $ctrl.ctaFormInput = area.longName;
            }
            // If there's no area with id, we just leave the form field empty
        });
    }
})();
