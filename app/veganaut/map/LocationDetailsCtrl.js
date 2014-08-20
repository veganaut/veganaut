(function(module) {
    'use strict';

    var Mission = function(id, answer) {
        this.id = id;
        this.showing = false;
        this.completed = false;
        this.callToActionIcon = 'bullhorn';
        this.answer = answer;
    };

    Mission.prototype.isAvailable = function() {
        return true;
    };

    Mission.prototype.hasValidAnswer = function() {
        return true;
    };

    module.controller('LocationDetailsCtrl', ['$scope', '$routeParams', 'tileLayerUrl', 'locationService',
        function($scope, $routeParams, tileLayerUrl, locationService) {
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

            $scope.missions = [];


            var mission = new Mission('optionsAvailable', {
                hasVegan: undefined
            });
            $scope.missions.push(mission);


            mission = new Mission('whatOptions', [
                { id: lastOptionId, text: '' }
            ]);

            mission.isAvailable = function() {
                var optionsAvailable = $scope.missionById.optionsAvailable;
                return optionsAvailable.completed && optionsAvailable.answer.hasVegan;
            };
            $scope.missions.push(mission);


            mission = new Mission('buyOptions', {});

            mission.isAvailable = function() {
                return $scope.missionById.whatOptions.completed;
            };

            mission.hasValidAnswer = function() {
                return (this.getBoughtOptions().length > 0);
            };

            mission.getBoughtOptions = function() {
                var boughtOptions = [];
                var availableOptions = $scope.missionById.whatOptions.answer;
                for (var i = 0; i < availableOptions.length; i += 1) {
                    if (this.answer[availableOptions[i].id] === true) {
                        boughtOptions.push(availableOptions[i]);
                    }
                }
                return boughtOptions;
            };
            $scope.missions.push(mission);


            mission = new Mission('staffFeedback', {
                text: '',
                didNotDoIt: false
            });

            mission.isAvailable = function() {
                return $scope.missionById.optionsAvailable.completed;
            };
            $scope.missions.push(mission);


            mission = new Mission('rateLocation', {
                rating: undefined
            });

            mission.isAvailable = function() {
                return $scope.missionById.optionsAvailable.completed;
            };

            mission.hasValidAnswer = function() {
                return this.answer.rating > 0;
            };

            mission.callToActionIcon = 'star';
            mission.maxRating = 4;
            $scope.missions.push(mission);


            // Index missions by id
            $scope.missionById = {
                optionsAvailable: $scope.missions[0],
                whatOptions: $scope.missions[1],
                buyOptions: $scope.missions[2],
                staffFeedback: $scope.missions[3],
                rateLocation: $scope.missions[4]
            };

            $scope.submit = function(mission) {
                mission.completed = true;
                if (angular.isArray(mission.answer)) {
                    var validAnswers = [];
                    for (var i = 0; i < mission.answer.length; i += 1) {
                        var answer = mission.answer[i];
                        if (typeof answer.text !== 'undefined' && answer.text.length > 0) {
                            validAnswers.push(answer);
                        }
                    }
                    mission.answer = validAnswers;
                }
            };

            // TODO: make a directive for this
            // Watch the list of answers to add or remove new input fields
            $scope.$watch('missionById.whatOptions.answer', function(answers) {
                // Once completed, don't change anything
                if ($scope.missionById.whatOptions.completed) {
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
