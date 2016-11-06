(function() {
    'use strict';

    /**
     * Component for the home page.
     * @returns {directive}
     */
    var homeDirective = function() {
        return {
            restrict: 'E',
            scope: {},
            controller: 'vgHomeCtrl',
            controllerAs: 'homeVm',
            bindToController: true,
            templateUrl: '/veganaut/home/home.tpl.html'
        };
    };

    var homeCtrl = [
        '$scope', '$location', '$translate', 'backendService', 'angularPiwik', 'Area',
        'areaService', 'mainMapService', 'geocodeService', 'alertService', 'localeService',
        function($scope, $location, $translate, backendService, angularPiwik, Area,
            areaService, mainMapService, geocodeService, alertService, localeService)
        {
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
                lat: 0,
                lng: 0,
                zoom: 2,
                name: vm.ctaFormInput
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
                targetArea = geoResult.area;

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
             * Will go to the selected area on the map or list.
             * @param {string} targetPage 'list' or 'map'
             */
            vm.onCtaSubmit = function(targetPage) {
                // Show the area on the given page
                areaService.showAreaOn(targetArea, targetPage);

                // Track the submission
                angularPiwik.track(
                    'home.cta',
                    (targetPage === 'list' ? 'home.cta.submitToList' : 'home.cta.submitToMap')
                );
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
                        targetArea = new Area({
                            lat: lat,
                            lng: lng,
                            zoom: GEO_LOCATION_ZOOM,
                            name: vm.ctaFormInput
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

            // Get the location (country) from the backend
            // TODO: only do that if not already located (local storage?)
            backendService.getGeoIP(localeService.getLocale()).then(function(res) {
                var data = res.data;
                if (_.isObject(data) && Object.keys(data).length > 0) {
                    vm.ctaFormInput = data.countryName;

                    targetArea = new Area({
                        lat: data.lat,
                        lng: data.lng,
                        boundingBox: data.boundingBox,
                        name: vm.ctaFormInput
                    });
                }
                // If nothing valid found, we can't do anything
            });
        }
    ];

    // Expose as directive
    angular.module('veganaut.app.home')
        .controller('vgHomeCtrl', homeCtrl)
        .directive('vgHome', [homeDirective])
    ;
})();
