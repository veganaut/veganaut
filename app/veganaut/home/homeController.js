(function() {
    'use strict';

    var homeCtrl = [
        '$scope', '$translate', 'angularPiwik', 'Area', 'areaService', 'geocodeService', 'alertService',
        function($scope, $translate, angularPiwik, Area, areaService, geocodeService, alertService) {
            var vm = this;

            /**
             * Zoom on the map used when we show the place returned
             * by the browser's geo location API.
             * @type {number}
             */
            var GEO_LOCATION_ZOOM = 15;

            // Expose the global methods we still need
            // TODO: find a better way to do this
            vm.legacyGlobals = {
                goToView: $scope.$parent.goToView,
                isLoggedIn: $scope.$parent.isLoggedIn
            };

            /**
             * Cta form input model
             * @type {string}
             */
            vm.ctaFormInput = '';

            /**
             * Whether we are currently running geo locating
             * @type {boolean}
             */
            vm.geolocating = false;

            /**
             * The target area to show on the map when submitting the cta form.
             * @type {Area}
             */
            var targetArea = new Area({
                id: undefined,
                name: vm.ctaFormInput,
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
            vm.getSearchResults = function(searchInput) {
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
            vm.canSubmitCta = function() {
                // Can only submit when we have a target and it's currently shown in the input field
                return (angular.isObject(targetArea) && targetArea.name === vm.ctaFormInput);
            };

            /**
             * Handler for when the user selects a result from the auto-complete.
             * @param {GeocodeResult} geoResult
             */
            vm.onResultSelected = function(geoResult) {
                // Set the target area
                targetArea = geoResult.getArea();

                // We no longer want to clear the input field on focus
                clearCtaInputOnFocus = false;

                angularPiwik.track('home.cta', 'home.cta.selectResult');
            };

            /**
             * Handler for the focus event of the cta input.
             */
            vm.onCtaInputFocus = function() {
                if (clearCtaInputOnFocus) {
                    vm.ctaFormInput = '';
                }
            };

            /**
             * Handler for the blur event of the cta input.
             */
            vm.onCtaInputBlur = function() {
                // If the user leaves the input and we cannot submit the form
                // but we have a target area, set that area again
                if (!vm.canSubmitCta() && angular.isObject(targetArea)) {
                    vm.ctaFormInput = targetArea.name;
                }
            };

            /**
             * Handler for submission of the cta form.
             * Will show the area overview for the selected area.
             */
            vm.onCtaSubmit = function() {
                // Show the area on overview page
                areaService.setAreaAndShowOn(targetArea, 'areaOverview');

                // Track the submission
                angularPiwik.track('home.cta');
            };

            /**
             * Gets the location from the browser's geolocation API
             * and sets the target area based on that.
             */
            vm.getUserLocation = function() {
                vm.geolocating = true;
                // TODO: disable input while searching?
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.$apply(function() {
                        vm.geolocating = false;

                        // Extract the lat and lng
                        var lat = position.coords.latitude;
                        var lng = position.coords.longitude;

                        // Set the display name to some value that the user recognises it worked
                        vm.ctaFormInput = $translate.instant('home.callToAction.geolocate') +
                            ': ' + lat.toFixed(3) + ', ' + lng.toFixed(3)
                        ;

                        // Set the target area
                        // TODO WIP NOW: this needs to be another area type that has different titles on the list and overview
                        targetArea = new Area({
                            id: undefined,
                            name: vm.ctaFormInput,
                            lat: lat,
                            lng: lng,
                            zoom: GEO_LOCATION_ZOOM
                        });

                        // When the user focuses the input field, clear it
                        clearCtaInputOnFocus = true;

                        angularPiwik.track('home.geolocation', 'home.geolocation.found');
                    });
                }, function() {
                    $scope.$apply(function() {
                        vm.geolocating = false;
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

            // Wait for the area service to be initialised to set the first target area
            areaService.initialised().then(function() {
                // If there's an area with id (and therefore name), set that as the first target
                // TODO: When the app is first loaded and the area in the local storage has no id, the search field will stay empty. In that case might want to fall back to country?
                var area = areaService.getLastAreaWithId();
                if (angular.isDefined(area) && angular.isString(area.name)) {
                    targetArea = area;
                    vm.ctaFormInput = area.name;
                }
                // If there's no area with id, we just leave the form field empty
            });
        }
    ];

    angular.module('veganaut.app.home')
        .controller('vgHomeCtrl', homeCtrl);
})();
