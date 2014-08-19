(function(module) {
    'use strict';

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

            $scope.missions = [
                {
                    id: 'optionsAvailable',
                    isAvailable: function() {
                        return true;
                    },
                    hasValidAnswer: function() {
                        return true;
                    },
                    showing: false,
                    completed: false,
                    callToActionIcon: 'bullhorn',
                    answer: {
                        hasVegan: undefined
                    }
                },
                {
                    id: 'whatOptions',
                    isAvailable: function() {
                        var optionsAvailable = $scope.missionById.optionsAvailable;
                        return optionsAvailable.completed && optionsAvailable.answer.hasVegan;
                    },
                    hasValidAnswer: function() {
                        return true;
                    },
                    showing: false,
                    completed: false,
                    callToActionIcon: 'bullhorn',
                    answers: [
                        { id: lastOptionId, text: '' }
                    ]
                },
                {
                    id: 'buyOptions',
                    isAvailable: function() {
                        return $scope.missionById.whatOptions.completed;
                    },
                    hasValidAnswer: function() {
                        return (this.getBoughtOptions().length > 0);
                    },
                    showing: false,
                    completed: false,
                    callToActionIcon: 'bullhorn',
                    answers: {},

                    /**
                     * Returns the list of vegan options that the user bought
                     * @returns {Array}
                     */
                    getBoughtOptions: function() {
                        var boughtOptions = [];
                        var availableOptions = $scope.missionById.whatOptions.answers;
                        for (var i = 0; i < availableOptions.length; i += 1) {
                            if (this.answers[availableOptions[i].id] === true) {
                                boughtOptions.push(availableOptions[i]);
                            }
                        }
                        return boughtOptions;
                    }
                },
                {
                    id: 'staffFeedback',
                    isAvailable: function() {
                        return $scope.missionById.optionsAvailable.completed;
                    },
                    hasValidAnswer: function() {
                        return true;
                    },
                    showing: false,
                    completed: false,
                    callToActionIcon: 'bullhorn',
                    answer: {
                        text: '',
                        didNotDoIt: false
                    }
                },
                {
                    id: 'rateLocation',
                    isAvailable: function() {
                        return $scope.missionById.optionsAvailable.completed;
                    },
                    hasValidAnswer: function() {
                        return this.answer.rating > 0;
                    },
                    showing: false,
                    completed: false,
                    maxRating: 4,
                    callToActionIcon: 'star',
                    answer: {
                        rating: undefined
                    }
                }
            ];

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
                if (angular.isArray(mission.answers)) {
                    var validAnswers = [];
                    for (var i = 0; i < mission.answers.length; i += 1) {
                        var answer = mission.answers[i];
                        if (typeof answer.text !== 'undefined' && answer.text.length > 0) {
                            validAnswers.push(answer);
                        }
                    }
                    mission.answers = validAnswers;
                }
            };

            // TODO: make a directive for this
            // Watch the list of answers to add or remove new input fields
            $scope.$watch('missionById.whatOptions.answers', function(answers) {
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
