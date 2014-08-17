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

            $scope.questions = {
                optionsAvailable: {
                    showing: false,
                    completed: false,
                    answer: {
                        hasVegan: undefined
                    }
                },
                whatOptions: {
                    showing: false,
                    completed: false,
                    answers: [
                        { id: lastOptionId, text: '' }
                    ]
                },
                buyOptions: {
                    showing: false,
                    completed: false,
                    answers: {}
                },
                staffFeedback: {
                    showing: false,
                    completed: false,
                    answer: {
                        text: '',
                        didNotDoIt: false
                    }
                },
                rateLocation: {
                    showing: false,
                    completed: false,
                    maxRating: 4,
                    answer: {
                        rating: undefined
                    }
                }
            };

            $scope.submit = function(question) {
                question.completed = true;
                if (angular.isArray(question.answers)) {
                    var validAnswers = [];
                    for (var i = 0; i < question.answers.length; i += 1) {
                        var answer = question.answers[i];
                        if (typeof answer.text !== 'undefined' && answer.text.length > 0) {
                            validAnswers.push(answer);
                        }
                    }
                    question.answers = validAnswers;
                }
            };

            /**
             * Returns the list of vegan options that the user bought
             * @returns {Array}
             */
            $scope.getBoughtOptions = function() {
                var boughtOptions = [];
                var availableOptions = $scope.questions.whatOptions.answers;
                for (var i = 0; i < availableOptions.length; i += 1) {
                    if ($scope.questions.buyOptions.answers[availableOptions[i].id] === true) {
                        boughtOptions.push(availableOptions[i]);
                    }
                }
                return boughtOptions;
            };

            // Watch the list of answers to add or remove new input fields
            $scope.$watch('questions.whatOptions.answers', function(answers) {
                // Once completed, don't change anything
                if ($scope.questions.whatOptions.completed) {
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
