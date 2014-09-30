(function(module) {
    'use strict';

    // TODO: docu
    module.provider('tourService', function() {
        var TOUR_CONFIG = {
            introBeta: [
                {},
                {},
                {},
                {},
                {},
                {
                    element: '.navbar-header',
                    placement: 'bottom'
                },
                {
                    element: '.front-register-btn',
                    placement: 'bottom'
                }
            ],
            locationAnonymous: [
                {
                    element: '.menu-button',
                    placement: 'bottom'
                },
                {
                    element: '.menu-button',
                    placement: 'bottom'
                }
            ],
            mapUser: [
                {},
                {},
                {},
                {}
            ],
            locationUser: [
                {
                    element: '.location-missions',
                    placement: 'top'
                }
            ]
        };

        this.$get = ['Tour', 'translateService', function(Tour, t) {
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
})(window.veganaut.mainModule);
