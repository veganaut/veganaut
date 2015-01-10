(function(module) {
    'use strict';

    // TODO: docu
    module.provider('tourService', function() {
        var TOUR_CONFIG = {
            introBeta: [
                {},
                {},
                {},
                {
                    element: '.front-register-btn',
                    placement: 'bottom'
                }
            ],
            mapUser: [
                {},
                {},
                {},
                {},
                {
                    element: '.menu-button',
                    placement: 'bottom'
                }
            ],
            locationUser: [
                {
                    element: '.location-missions',
                    placement: 'top'
                }
            ]
        };

        this.$get = ['$translate', 'Tour', function($translate, Tour) {
            var tours = {};

            // Create all the tours
            for (var tourName in TOUR_CONFIG) {
                if (TOUR_CONFIG.hasOwnProperty(tourName)) {
                    // Instantiate the tour
                    tours[tourName] = new Tour({
                        name: tourName,
                        orphan: true
                    });
                }
            }

            return {
                startTour: function(tourName) {
                    // Check if the tour exists and hasn't already been started
                    if (tours.hasOwnProperty(tourName) && angular.isUndefined(tours[tourName].getCurrentStep())) {
                        // Set up the steps
                        var steps = angular.copy(TOUR_CONFIG[tourName]);

                        // Prepare translation keys
                        var toTranslate = [];
                        for (var i = 0; i < steps.length; i++) {
                            toTranslate.push('tour.' + tourName + '.' + i + '.title');
                            toTranslate.push('tour.' + tourName + '.' + i + '.content');
                        }

                        // Wait for the translations
                        $translate(toTranslate).then(function(translations) {
                            // Add the title and content to the steps
                            for (var i = 0; i < steps.length; i++) {
                                steps[i].title = translations['tour.' + tourName + '.' + i + '.title'];
                                steps[i].content = translations['tour.' + tourName + '.' + i + '.content'];
                            }

                            // Add the steps
                            tours[tourName].addSteps(steps);

                            // Initialise and start the tour
                            tours[tourName].init();
                            tours[tourName].start();
                        });

                    }
                }
            };
        }];
    });
})(window.veganaut.mainModule);
