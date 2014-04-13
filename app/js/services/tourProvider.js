(function(servicesModule) {
    'use strict';

    // TODO: docu
    servicesModule.provider('tourProvider', function() {
        var TOUR_CONFIG = {
            intro: [
                {},
                {
                    element: '.frontIllustration',
                    placement: 'top'
                },
                {
                    element: '.matchScoreDisplay',
                    placement: 'bottom'
                },
                {
                    element: '.matchScoreDisplay',
                    placement: 'bottom'
                },
                {
                    element: '.matchScoreDisplay',
                    placement: 'bottom'
                },
                {
                    element: '.frontRegisterBtn',
                    placement: 'bottom'
                }
            ]
        };

        this.$get = ['Tour', 'translate', function(Tour, t) {
            var tours = {};

            // Create all the tours
            for (var tourName in TOUR_CONFIG) {
                if (TOUR_CONFIG.hasOwnProperty(tourName)) {
                    var steps = angular.copy(TOUR_CONFIG[tourName]);

                    // Add the title and content to the steps
                    for (var i = 0; i < steps.length; i++) {
                        steps[i].title = t('tour.' + tourName + '.' + i + '.title');
                        steps[i].content = t('tour.' + tourName + '.' + i + '.content');
                    }

                    // Instantiate the tour
                    tours[tourName] = new Tour({
                        name: tourName,
                        orphan: true,
                        steps: steps
                    });
                }
            }

            return {
                startTour: function(tourName) {
                    if (tours.hasOwnProperty(tourName)) {
                        // Initialise and start the tour
                        tours[tourName].init();
                        tours[tourName].start();
                    }
                }
            };
        }];
    });
})(window.monkeyFace.servicesModule);
