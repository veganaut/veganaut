(function(module) {
    'use strict';

    module.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'tileLayerUrl', 'locationService', 'missionService',
        function($scope, $routeParams, tileLayerUrl, locationService, missionService) {
            var locationId = parseInt($routeParams.id);

            /**
             * Leaflet map settings
             * @type {{}}
             */
            $scope.mapSettings = {
                tileLayer: tileLayerUrl
            };

            /**
             * Current center of the map
             * @type {{lat: number, lng: number, zoom: number}}
             */
            $scope.center = {
                lat: 0,
                lng: 0,
                zoom: 16
            };

            /**
             * Id of the last vegan option that was added to the list
             * TODO: this should probably be given by the backend
             * @type {number}
             */
            var lastOptionId = 1;

            $scope.missionSet = missionService.getMissionSet();

            // TODO: make a directive for this
            // Watch the list of answers to add or remove new input fields
            $scope.$watch('missionSet.missionsById.whatOptions.answer', function(answers) {
                // Once completed, don't change anything
                if ($scope.missionSet.missionsById.whatOptions.completed) {
                    return;
                }

                // Check if the last answer is not empty
                var lastAnswer = answers[answers.length - 1];
                if (typeof lastAnswer.text !== 'undefined' && lastAnswer.text.length > 0) {
                    // Add a new answer possibility
                    lastOptionId += 1;
                    answers.push({
                        id: lastOptionId,
                        text: ''
                    });
                }
                else if (answers.length > 1) {
                    // If the last answer is not empty, check if the second last is not also empty
                    var secondLastAnswer = answers[answers.length - 2];
                    if (typeof secondLastAnswer.text === 'undefined' || secondLastAnswer.text.length === 0) {
                        // Two empty answers, remove one
                        answers.pop();
                    }
                }
            }, true);

            $scope.location = undefined;
            // TODO: should directly ask for the correct location from the locationService
            locationService.getLocations().then(function(locations) {
                for (var i = 0; i < locations.length; i += 1) {
                    if (locations[i].id === locationId) {
                        $scope.location = locations[i];
                        $scope.center.lat = $scope.location.lat;
                        $scope.center.lng = $scope.location.lng;
                        break;
                    }
                }
            });
        }
    ]);
})(window.veganaut.mapModule);
