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
        '$scope', '$location', '$translate', 'backendService', 'angularPiwik',
        'mainMapService', 'geocodeService', 'alertService', 'localeService',
        function($scope, $location, $translate, backendService, angularPiwik,
            mainMapService, geocodeService, alertService, localeService)
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
             * The target place to show on the map when submitting the cta form.
             * @type {{}}
             */
            var targetPlace;

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
                return (angular.isObject(targetPlace) && targetPlace.displayName === vm.ctaFormInput);
            };

            /**
             * Handler for when the user selects a result from the auto-complete.
             * @param {GeocodeResult} selected
             */
            vm.onResultSelected = function(selected) {
                // Set the target place
                targetPlace = {
                    lat: selected.lat,
                    lng: selected.lng,
                    boundingBox: selected.bounds,
                    displayName: selected.getDisplayName()
                };

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
                // but we have a target place, set that place again
                if (!vm.canSubmitCta() && angular.isObject(targetPlace)) {
                    vm.ctaFormInput = targetPlace.displayName;
                }
            };

            /**
             * Handler for submission of the cta form.
             * Will go to the selected place on the map.
             */
            vm.onCtaSubmit = function() {
                mainMapService.setTargetPlace(targetPlace);
                $location.path('map');

                angularPiwik.track('home.cta', 'home.cta.submit');
            };

            /**
             * Gets the location from the browser's geolocation API
             * and sets the target place based on that.
             */
            vm.getUserLocation = function() {
                vm.geolocating = true;
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

                        // Set the target place
                        targetPlace = {
                            lat: lat,
                            lng: lng,
                            zoom: GEO_LOCATION_ZOOM,
                            displayName: vm.ctaFormInput
                        };

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
                if (_.isObject(data)) {
                    vm.ctaFormInput = data.countryName;

                    targetPlace = {
                        lat: data.lat,
                        lng: data.lng,
                        boundingBox: data.boundingBox,
                        displayName: vm.ctaFormInput
                    };
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
