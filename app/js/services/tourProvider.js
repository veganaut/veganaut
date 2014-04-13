(function(servicesModule) {
    'use strict';

    // TODO: docu
    servicesModule.provider('tourProvider', function() {
        this.$get = ['Tour', function(Tour) {
            var tours = {};

            var introTourName = 'intro';
            // TODO: fill with actual content
            tours[introTourName] = new Tour({
                name: introTourName,
                steps: [
                    {
                        element: '.matchScoreDisplay',
                        placement: 'bottom',
                        title: 'Intro Tour Step 1',
                        content: 'Content of first step. Content of first step. Content of first step.'
                    },
                    {
                        element: '.matchScoreDisplay',
                        placement: 'bottom',
                        title: 'Intro Tour Step 2',
                        content: 'Content of second step. Content of second step. Content of second step.'
                    }
                ]
            });

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
